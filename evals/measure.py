#!/usr/bin/env python3
"""PromptFu cost, lint and rewrite checks. Standard library only.

  python evals/measure.py budget                      everything below, against budget.json
  python evals/measure.py cost     [--skill DIR] [--layout FILE]
  python evals/measure.py hooks    [--plugin DIR]
  python evals/measure.py lint     [--plugin DIR]
  python evals/measure.py quotes   --docs DIR         fenced snippets against saved vendor pages
  python evals/measure.py rewrites --dir DIR          <id>.prompt.txt files against cases.json
  python evals/measure.py gen                         write evals/cases/ from cases.json and drafts/

cost      Bytes, tokens and file reads for each rewrite path: SKILL.md, the family file, one
          model card and one playbook. Paths come from the files on disk, so a new card needs
          no change here. --layout measures an older file layout from an explicit list.
hooks     Runs every hook in hooks/hooks.json through a scripted session: what each one adds
          to the model's context and when it stays silent.
lint      Model names outside models/, dashes and curly quotes in shipped prose, cards without
          a date and sources, cards the family table does not name, files over their size.
quotes    Every fenced block in a model card is meant to be vendor text. This checks each one
          against a folder of saved vendor pages. Fetch the pages on the cards' Sources lines.
rewrites  Checks a folder of rewrites against the keep and drop lists and counts words.
gen       Regenerates the `claude plugin eval` case folders. budget fails when they are stale.

How tokens are counted. Claude tokens are estimated as characters / 2.5, the ratio Anthropic's
models overview gives for its current tokenizer ("1M tokens is roughly 555k words or 2.5M Unicode
characters"). With tiktoken installed the o200k_base count is shown beside it as the GPT-side
figure. Neither is a billing number. They move together, which is what a comparison needs.
"""
import argparse
import json
import math
import os
import re
import statistics
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PLUGIN = HERE.parent
CLAUDE_CHARS_PER_TOKEN = 2.5
REPRESENTATIVE = "tasks/long-run-agentic.md"

try:
    import tiktoken

    _ENC = tiktoken.get_encoding("o200k_base")
except Exception:  # tiktoken is optional
    _ENC = None


def read(path):
    return Path(path).read_text(encoding="utf-8")


def size(text):
    return {
        "bytes": len(text.encode("utf-8")),
        "claude_tokens": math.ceil(len(text) / CLAUDE_CHARS_PER_TOKEN),
        "o200k_tokens": len(_ENC.encode(text)) if _ENC else None,
    }


def add(a, b):
    both = a["o200k_tokens"] is not None and b["o200k_tokens"] is not None
    return {
        "bytes": a["bytes"] + b["bytes"],
        "claude_tokens": a["claude_tokens"] + b["claude_tokens"],
        "o200k_tokens": a["o200k_tokens"] + b["o200k_tokens"] if both else None,
    }


def fmt(s):
    gpt = "" if s["o200k_tokens"] is None else f" / {s['o200k_tokens']:>6,}"
    return f"{s['bytes']:>7,} B  {s['claude_tokens']:>6,}{gpt} tok"


# ---------------------------------------------------------------- cost


def derive_layout(skill):
    """Rewrite paths for the current layout: one per model card, plus each family alone."""
    targets = {}
    for vendor in sorted(p for p in (skill / "models").iterdir() if p.is_dir()):
        family = f"models/{vendor.name}/_family.md"
        targets[f"{vendor.name}: family file alone"] = [family]
        for card in sorted(vendor.glob("*.md")):
            if card.name != "_family.md":
                targets[f"{vendor.name}: {card.stem}"] = [family, f"models/{vendor.name}/{card.name}"]
    return {"entry": ["SKILL.md"], "session_extra": [], "playbooks": "tasks", "targets": targets}


def cmd_cost(args, quiet=False):
    skill = Path(args.skill)
    layout = json.loads(read(args.layout)) if args.layout else derive_layout(skill)
    layout = layout.get("layout", layout)  # a baseline file carries its layout under this key
    rep = layout.get("representative_playbook", REPRESENTATIVE)
    cache = {}

    def one(rel):
        if rel not in cache:
            cache[rel] = size(read(skill / rel))
        return cache[rel]

    def total(rels):
        acc = {"bytes": 0, "claude_tokens": 0, "o200k_tokens": 0 if _ENC else None}
        for rel in rels:
            acc = add(acc, one(rel))
        return acc

    out = print if not quiet else (lambda *a, **k: None)
    playbooks = sorted(
        p.relative_to(skill).as_posix()
        for p in (skill / layout["playbooks"]).glob("*.md")
        if not p.name.startswith("_") and p.name != "SOURCES.md"
    )
    result = {"tokenizer": "chars/2.5" + (" and o200k_base" if _ENC else ""), "paths": {}}
    desc = re.search(r"^description:\s*(.+)$", read(skill / "SKILL.md"), re.M)
    result["description"] = size(desc.group(1).strip()) if desc else size("")
    result["skill_md"] = one("SKILL.md")
    out(f"skill description, in every session's skill list   {fmt(result['description'])}")
    out(f"SKILL.md, in context once the skill has loaded      {fmt(result['skill_md'])}")
    out(f"\nrewrite path = SKILL.md + model files + one playbook ({rep}); range over all playbooks")
    extras = layout.get("session_extra", [])
    for name, rels in layout["targets"].items():
        base = total(layout["entry"] + rels)
        sized = sorted((add(base, one(pb)) for pb in playbooks), key=lambda s: s["bytes"])
        with_rep = add(base, one(rep))
        reads = len(layout["entry"]) + len(rels) + 1
        result["paths"][name] = {
            "files": layout["entry"] + rels,
            "reads": reads,
            "no_playbook": base,
            "min": sized[0],
            "max": sized[-1],
            "representative": with_rep,
        }
        line = f"  {name:<58} {reads} reads  {fmt(with_rep)}  ({sized[0]['bytes']:,} to {sized[-1]['bytes']:,} B)"
        if extras:
            line += f"  +{total(extras)['bytes']:,} B with {', '.join(extras)}"
        out(line)
    reps = [p["representative"]["bytes"] for p in result["paths"].values()]
    result["median_path_bytes"] = statistics.median(reps)
    result["largest_path_bytes"] = max(p["max"]["bytes"] for p in result["paths"].values())
    files = list(skill.rglob("*.md"))
    result["skill_folder"] = {"files": len(files), "bytes": sum(p.stat().st_size for p in files)}
    out(f"\nmedian path {result['median_path_bytes']:,.0f} B, largest {result['largest_path_bytes']:,} B")
    out(f"skill folder: {len(files)} markdown files, {result['skill_folder']['bytes']:,} B")
    return result


# ---------------------------------------------------------------- hooks

LONG = " ".join(["Please look at the retry logic in the sync worker and tell me why it stalls"] * 5)
BRIEF = "Find every caller of parse_config and list them."
LONG_BRIEF = " ".join(["Go through the billing service and work out which handlers still call the old client"] * 5)
STRUCTURED = "<intent>Listing callers before a rename.</intent>\n<task>" + LONG_BRIEF + "</task>"


def agent(prompt, **extra):
    return {"tool_name": "Agent", "tool_input": dict({"prompt": prompt}, **extra)}


# (label, event, session, payload, env, switch file, expectation, budget key)
STEPS = [
    ("session start", "SessionStart", "A", {"source": "startup"}, {}, None, "speaks", "session_start"),
    ("session start, PROMPTFU_NEVER_DOWNGRADE", "SessionStart", "N", {"source": "startup"}, {"PROMPTFU_NEVER_DOWNGRADE": "1"}, None, "speaks", "session_start_never_downgrade"),
    ("session start, PROMPTFU_DISABLE", "SessionStart", "B", {"source": "startup"}, {"PROMPTFU_DISABLE": "1"}, None, "silent", None),
    ("session start, .promptfu off", "SessionStart", "C", {"source": "startup"}, {}, "off", "silent", None),
    ("after compaction", "SessionStart", "A", {"source": "compact"}, {}, None, "speaks", "session_start"),
    ("resume", "SessionStart", "A", {"source": "resume"}, {}, None, "silent", None),
    ("short prompt", "UserPromptSubmit", "A", {"prompt": "fix the typo in the README"}, {}, None, "silent", "per_prompt"),
    ("long prompt", "UserPromptSubmit", "A", {"prompt": LONG}, {}, None, "speaks", "long_prompt"),
    ("long prompt, PROMPTFU_DISABLE", "UserPromptSubmit", "B", {"prompt": LONG}, {"PROMPTFU_DISABLE": "1"}, None, "silent", None),
    ("long prompt, .promptfu off from the start", "UserPromptSubmit", "C", {"prompt": LONG}, {}, "off", "silent", None),
    ("slash command", "UserPromptSubmit", "A", {"prompt": "/help"}, {}, None, "silent", None),
    ("prompt naming promptfu", "UserPromptSubmit", "A", {"prompt": "run promptfu on this " + LONG}, {}, None, "silent", None),
    ("switch turned off mid-session", "UserPromptSubmit", "A", {"prompt": "ok"}, {}, "off", "speaks", "switch_note"),
    ("next prompt, still off", "UserPromptSubmit", "A", {"prompt": LONG}, {}, "off", "silent", None),
    ("switch turned back on", "UserPromptSubmit", "A", {"prompt": "ok"}, {}, None, "speaks", "session_start"),
    ("next prompt, still on", "UserPromptSubmit", "A", {"prompt": "ok"}, {}, None, "silent", None),
    ("first prompt of a session that got no start hook", "UserPromptSubmit", "E", {"prompt": "ok"}, {}, None, "speaks", "session_start"),
    ("unstructured dispatch over the threshold", "PreToolUse", "A", agent(LONG_BRIEF, model="haiku"), {}, None, "speaks", "dispatch_note"),
    ("second one in the same session", "PreToolUse", "A", agent(LONG_BRIEF + " again"), {}, None, "silent", None),
    ("short brief", "PreToolUse", "F", agent(BRIEF), {}, None, "silent", None),
    ("structured dispatch", "PreToolUse", "F", agent(STRUCTURED), {}, None, "silent", None),
    ("workflow run by name", "PreToolUse", "F", {"tool_name": "Workflow", "tool_input": {"name": "review"}}, {}, None, "silent", None),
    ("dispatch, PROMPTFU_DISPATCH_MODE=off", "PreToolUse", "F", agent(LONG_BRIEF), {"PROMPTFU_DISPATCH_MODE": "off"}, None, "silent", None),
    ("dispatch, PROMPTFU_DISABLE", "PreToolUse", "F", agent(LONG_BRIEF), {"PROMPTFU_DISABLE": "1"}, None, "silent", None),
    ("dispatch, .promptfu off", "PreToolUse", "F", agent(LONG_BRIEF), {}, "off", "silent", None),
    ("gate mode, first attempt", "PreToolUse", "G", agent(LONG_BRIEF + " gate"), {"PROMPTFU_DISPATCH_MODE": "gate"}, None, "denies", "gate_reason"),
    ("gate mode, second attempt", "PreToolUse", "G", agent(LONG_BRIEF + " gate"), {"PROMPTFU_DISPATCH_MODE": "gate"}, None, "silent", None),
    ("gate mode, short brief", "PreToolUse", "G", agent(BRIEF), {"PROMPTFU_DISPATCH_MODE": "gate"}, None, "silent", None),
]


def hook_commands(plugin):
    config = json.loads(read(plugin / "hooks" / "hooks.json"))["hooks"]
    commands = {}
    for event, groups in config.items():
        for group in groups:
            for hook in group.get("hooks", []):
                if hook.get("type") == "command":
                    cmd = [hook["command"]] + hook.get("args", [])
                    commands.setdefault(event, []).append([c.replace("${CLAUDE_PLUGIN_ROOT}", str(plugin)) for c in cmd])
    return commands


def run_hook(command, raw, env_extra, project):
    env = {k: v for k, v in os.environ.items() if not k.startswith("PROMPTFU_")}
    env.update({"CLAUDE_PROJECT_DIR": str(project), "TMP": str(project), "TEMP": str(project), "TMPDIR": str(project)})
    env.update(env_extra)
    proc = subprocess.run(command, input=raw, capture_output=True, text=True, env=env, timeout=30)
    return proc.returncode, proc.stdout.strip()


def cmd_hooks(args, quiet=False):
    plugin = Path(args.plugin)
    commands = hook_commands(plugin)
    out = print if not quiet else (lambda *a, **k: None)
    rows, misses = [], []
    with tempfile.TemporaryDirectory() as tmp:
        project = Path(tmp)
        switch = project / ".promptfu"
        for label, event, session, payload, env, switch_state, expect, key in STEPS:
            if switch_state:
                switch.write_text(switch_state + "\n", encoding="utf-8")
            elif switch.exists():
                switch.unlink()
            body = dict(payload, hook_event_name=event, cwd=str(project), session_id="measure-" + session)
            if event not in commands:
                misses.append(f"no {event} hook registered, wanted for [{label}]")
                continue
            for command in commands[event]:
                code, stdout = run_hook(command, json.dumps(body), env, project)
                text, deny = "", False
                if stdout:
                    try:
                        hso = json.loads(stdout).get("hookSpecificOutput") or {}
                        if hso.get("hookEventName") != event:
                            misses.append(f"[{label}] hookEventName is {hso.get('hookEventName')!r}")
                        deny = hso.get("permissionDecision") == "deny"
                        text = hso.get("additionalContext") or hso.get("permissionDecisionReason") or ""
                        if "suppressOutput" in stdout:
                            misses.append(f"[{label}] sends suppressOutput, which Codex rejects on PreToolUse")
                    except ValueError:
                        misses.append(f"[{label}] output is not JSON")
                got = "denies" if deny else "speaks" if text else "silent"
                if code != 0:
                    misses.append(f"[{label}] exit {code}")
                if got != expect:
                    misses.append(f"[{label}] expected {expect}, got {got}")
                rows.append({"case": label, "event": event, "result": got, "chars": len(text), "tokens": size(text), "budget": key})
                out(f"  {event:<17} {label:<52} {got:<7} {len(text):>4} chars {size(text)['claude_tokens']:>4} tok")
        if switch.exists():
            switch.unlink()
        for event, cmds in commands.items():
            for command in cmds:
                for name, raw in (("empty object", "{}"), ("garbage", "garbage"), ("no input", ""), ("a JSON array", "[1]")):
                    code, stdout = run_hook(command, raw, {}, project)
                    if code != 0 or stdout:
                        misses.append(f"{event} on {name}: exit {code}, {len(stdout)} chars")
        out(f"  bad input (empty object, garbage, nothing, an array) on {sum(len(c) for c in commands.values())} hooks: exit 0 and silent"
            if not any(" on " in m and "exit" in m for m in misses) else "  bad input: see misses")
    out("hook misses: " + ("none" if not misses else "; ".join(misses)))
    return {"rows": rows, "misses": misses}


# ---------------------------------------------------------------- lint

MODEL_NAMES = re.compile(
    r"\b(Fable|Mythos|Opus|Sonnet|Haiku|Astra|Terra|Luna|Argon|Nano Banana|Veo|Omni Flash|Flash-Lite|"
    r"GPT-\d|GPT Image|Gemini \d|Deep Think|Anthropic|OpenAI|Google)\b"
)
TYPOGRAPHY = re.compile("[—–“”‘’]")
LIMITS = {"card": 8192, "family": 7168, "legacy": 4608, "playbook": 4608, "harnesses": 6144}


def cmd_lint(args, quiet=False):
    plugin = Path(args.plugin)
    skill = plugin / "skills" / "promptfu"
    misses = []
    shipped = [plugin / "README.md"] + sorted(skill.rglob("*.md"))
    for path in shipped:
        rel = path.relative_to(plugin).as_posix()
        for n, line in enumerate(read(path).splitlines(), 1):
            if TYPOGRAPHY.search(line):
                misses.append(f"{rel}:{n} has a dash or curly quote")
    # Model and vendor names stay in models/ and the README, so a release never edits these files.
    for path in [skill / "harnesses.md"] + sorted((skill / "tasks").glob("*.md")):
        if path.name == "SOURCES.md" or not path.exists():
            continue
        for n, line in enumerate(read(path).splitlines(), 1):
            hit = MODEL_NAMES.search(line)
            if hit and path.name != "harnesses.md":
                misses.append(f"{path.relative_to(plugin).as_posix()}:{n} names {hit.group(0)}")
            elif hit and hit.group(0) not in ("Anthropic", "OpenAI", "Google"):
                misses.append(f"{path.relative_to(plugin).as_posix()}:{n} names {hit.group(0)}")
    body = read(skill / "SKILL.md").split("---", 2)[2]
    for n, line in enumerate(body.splitlines(), 1):
        hit = MODEL_NAMES.search(line)
        if hit:
            misses.append(f"skills/promptfu/SKILL.md body line {n} names {hit.group(0)}")
    for rel in sorted(set(re.findall(r"`((?:models|tasks)/[\w./-]+\.md|harnesses\.md)`", body))):
        if "<" not in rel and not (skill / rel).exists():
            misses.append(f"SKILL.md points at {rel}, which does not exist")
    # Cards: dated, sourced, named by their family table, inside their size.
    for vendor in sorted(p for p in (skill / "models").iterdir() if p.is_dir()):
        family_path = vendor / "_family.md"
        if not family_path.exists():
            misses.append(f"models/{vendor.name} has no _family.md")
            continue
        family = read(family_path)
        for card in sorted(vendor.glob("*.md")):
            rel = card.relative_to(plugin).as_posix()
            text = read(card)
            kind = "family" if card.name == "_family.md" else "legacy" if card.name == "legacy.md" else "card"
            if not re.search(r"^Verified \d{4}-\d{2}-\d{2}", text, re.M):
                misses.append(f"{rel} has no 'Verified YYYY-MM-DD' line")
            if not re.search(r"^Sources: .*https://", text, re.M):
                misses.append(f"{rel} has no 'Sources:' line with a URL")
            if not re.search(r"^Unverified: ", text, re.M):
                misses.append(f"{rel} has no 'Unverified:' line")
            if card.stat().st_size > LIMITS[kind]:
                misses.append(f"{rel} is {card.stat().st_size:,} B, limit {LIMITS[kind]:,}")
            if kind != "family" and f"`{card.name}`" not in family:
                misses.append(f"{rel} is not named in {vendor.name}/_family.md")
        for named in sorted(set(re.findall(r"`([a-z0-9][a-z0-9.-]*\.md)`", family))):
            if not (vendor / named).exists() and not (skill / named).exists():
                misses.append(f"models/{vendor.name}/_family.md names {named}, which does not exist")
    for path in sorted((skill / "tasks").glob("*.md")):
        if path.name not in ("_TEMPLATE.md", "SOURCES.md") and path.stat().st_size > LIMITS["playbook"]:
            misses.append(f"tasks/{path.name} is {path.stat().st_size:,} B, limit {LIMITS['playbook']:,}")
    if (skill / "harnesses.md").stat().st_size > LIMITS["harnesses"]:
        misses.append(f"harnesses.md is {(skill / 'harnesses.md').stat().st_size:,} B, limit {LIMITS['harnesses']:,}")
    if not quiet:
        print(f"lint: {len(shipped)} shipped markdown files, " + ("clean" if not misses else f"{len(misses)} misses"))
        for miss in misses:
            print("  " + miss)
    return {"misses": misses}


# ---------------------------------------------------------------- quotes


def plain(text):
    """Fold typography and whitespace so a card's ASCII copy matches the vendor page."""
    for a, b in (("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'), ("—", "-"), ("–", "-"), ("\\", "")):
        text = text.replace(a, b)
    return re.sub(r"\s+", " ", text).strip()


def cmd_quotes(args):
    skill = Path(args.plugin) / "skills" / "promptfu"
    corpus = plain("\n".join(read(p) for p in sorted(Path(args.docs).rglob("*")) if p.is_file() and p.suffix in (".md", ".txt")))
    checked, misses = 0, []
    for card in sorted((skill / "models").rglob("*.md")):
        if card.name == "_TEMPLATE.md":
            continue
        for block in re.findall(r"^```[\w]*\n(.*?)^```", read(card), re.M | re.S):
            checked += 1
            # Compare paragraph by paragraph, so a page that wraps or indents differently still matches.
            for para in [p for p in re.split(r"\n\s*\n", block) if p.strip()]:
                if plain(para) in corpus:
                    continue
                # A fenced list is often separate bullets on the page, so fall back to its lines.
                for line in [l for l in para.splitlines() if l.strip()]:
                    if plain(line) not in corpus:
                        misses.append(f"{card.relative_to(skill).as_posix()}: not found in the saved pages: {plain(line)[:90]}")
    print(f"quotes: {checked} fenced blocks checked, " + ("all found" if not misses else f"{len(misses)} passages not found"))
    for miss in misses:
        print("  " + miss)
    return 1 if misses else 0


# ---------------------------------------------------------------- rewrites and eval cases


def words(text):
    return len(text.split())


def cmd_rewrites(args):
    cases = json.loads(read(HERE / "cases.json"))["cases"]
    run = Path(args.dir)
    rows = []
    for case in cases:
        draft = read(HERE / "drafts" / f"{case['id']}.md")
        path = run / f"{case['id']}.prompt.txt"
        if not path.exists():
            rows.append({"id": case["id"], "missing": True})
            print(f"{case['id']:<24} MISSING")
            continue
        text = read(path)
        lost = [k for k in case["keep"] if not re.search(k, text, re.I | re.S)]
        carried = [d for d in case["drop"] if re.search(d, text, re.I | re.S)]
        rows.append({"id": case["id"], "draft_words": words(draft), "rewrite_words": words(text), "lost": lost, "carried": carried})
        print(f"{case['id']:<24} {'ok' if not (lost or carried) else 'MISS':<5} {words(draft):>4} -> {words(text):>4} words"
              + (f"  lost: {lost}" if lost else "") + (f"  carried: {carried}" if carried else ""))
    done = [r for r in rows if not r.get("missing")]
    if done:
        ratio = sum(r["rewrite_words"] for r in done) / sum(r["draft_words"] for r in done)
        clean = sum(1 for r in done if not (r["lost"] or r["carried"]))
        print(f"\n{clean} of {len(done)} clean, rewrite/draft words {ratio:.2f}")
    if args.json:
        Path(args.json).write_text(json.dumps({"rows": rows}, indent=2), encoding="utf-8")
    return rows


def yaml_quote(text):
    return "'" + text.replace("'", "''") + "'"


def case_files(case):
    """The `claude plugin eval` files for one case, as {relative path: content}."""
    draft = read(HERE / "drafts" / f"{case['id']}.md").strip()
    target = "target: { source: file, path: rewrite.txt }"
    keep = "^" + "".join(f"(?=.*(?:{k}))" for k in case["keep"])
    files = {
        "prompt.md": (
            "---\nmax_turns: 25\ntimeout_seconds: 900\nallowed_tools: [Read, Glob, Grep, Skill]\n"
            f"tags: [rewrite]\n---\n\n{case['request']}\n\n"
            "Save the prompt you would send, and nothing else, to a file named rewrite.txt in the "
            "current directory. Nobody is here to answer questions, and the files the draft names "
            f"do not exist on this machine.\n\nThe draft:\n\n{draft}\n"
        ),
        "graders/keeps-constraints.md": (
            f"---\ntype: regex\n{target}\nflags: is\npattern: {yaml_quote(keep)}\n---\n"
        ),
        "graders/skill-fired.md": (
            "---\ntype: tool_used\ntool: Skill\ninput_match: " + yaml_quote(r'"skill"\s*:\s*"(?:[\w-]+:)?promptfu"') + "\n---\n"
        ),
        "graders/criteria.md": (
            "---\ntype: llm\nfocus: { source: file, path: rewrite.txt }\n---\n\n"
            f"The text you are judging is a prompt meant for {case['target']}. It is a rewrite of the draft below. "
            f"{case.get('judge_note', '')}\n\n"
            "PASS if it asks for the same deliverable as the draft and someone could act on it without seeing "
            "the draft.\n\n"
            "FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not "
            "itself a usable prompt, or if it tells the model to think step by step, think harder or show its "
            "reasoning.\n\n"
            "Added structure, added detail and lines labeled as assumptions are not reasons to fail.\n\n"
            f"The draft:\n\n{draft}\n"
        ),
    }
    if case.get("reply"):
        # Facts the model card supplies, looked for in the final reply. A run without the plugin rarely has them.
        files["graders/reply-facts.md"] = (
            "---\ntype: regex\nflags: is\npattern: "
            + yaml_quote("^" + "".join(f"(?=.*(?:{r}))" for r in case["reply"])) + "\n---\n"
        )
    if case["drop"]:
        files["graders/drops-cues.md"] = (
            f"---\ntype: regex\n{target}\nflags: i\nmatch: not_contains\n"
            f"pattern: {yaml_quote('(?:' + '|'.join(case['drop']) + ')')}\n---\n"
        )
    return files


def cmd_gen(check=False):
    cases = json.loads(read(HERE / "cases.json"))["cases"]
    stale = []
    for case in cases:
        for rel, content in case_files(case).items():
            path = HERE / "cases" / case["id"] / rel
            if check:
                if not path.exists() or read(path) != content:
                    stale.append(path.relative_to(PLUGIN).as_posix())
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8", newline="\n")
    if not check:
        print(f"wrote {len(cases)} case folders under evals/cases/")
    return stale


# ---------------------------------------------------------------- budget


def cmd_budget(args):
    plugin = Path(args.plugin)
    budget = json.loads(read(HERE / "budget.json"))
    misses = []
    cost = cmd_cost(argparse.Namespace(skill=str(plugin / "skills" / "promptfu"), layout=None))
    print()
    hooks = cmd_hooks(argparse.Namespace(plugin=str(plugin)))
    print()
    lint = cmd_lint(argparse.Namespace(plugin=str(plugin)))
    if cost["skill_md"]["bytes"] > budget["skill_md_bytes"]:
        misses.append(f"SKILL.md is {cost['skill_md']['bytes']:,} B, budget {budget['skill_md_bytes']:,}")
    if cost["description"]["bytes"] > budget["description_bytes"]:
        misses.append(f"description is {cost['description']['bytes']} B, budget {budget['description_bytes']}")
    if cost["largest_path_bytes"] > budget["largest_path_bytes"]:
        misses.append(f"largest path is {cost['largest_path_bytes']:,} B, budget {budget['largest_path_bytes']:,}")
    if cost["median_path_bytes"] > budget["median_path_bytes"]:
        misses.append(f"median path is {cost['median_path_bytes']:,.0f} B, budget {budget['median_path_bytes']:,}")
    if cost["skill_folder"]["bytes"] > budget["skill_folder_bytes"]:
        misses.append(f"skill folder is {cost['skill_folder']['bytes']:,} B, budget {budget['skill_folder_bytes']:,}")
    for name, path in cost["paths"].items():
        if path["reads"] > budget["path_reads"]:
            misses.append(f"path '{name}' takes {path['reads']} reads, budget {budget['path_reads']}")
    for row in hooks["rows"]:
        limit = budget["hook_chars"].get(row["budget"]) if row["budget"] else None
        if limit is not None and row["chars"] > limit:
            misses.append(f"hook [{row['case']}] adds {row['chars']} chars, budget {limit}")
    misses += hooks["misses"] + lint["misses"]
    misses += [f"{p} is stale: run `python evals/measure.py gen`" for p in cmd_gen(check=True)]
    print("\nbudget: " + ("PASS" if not misses else f"MISSES: {len(misses)}"))
    for miss in misses:
        print("  " + miss)
    return 1 if misses else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("budget", "hooks", "lint", "quotes"):
        p = sub.add_parser(name)
        p.add_argument("--plugin", default=str(PLUGIN))
        if name == "quotes":
            p.add_argument("--docs", required=True)
    c = sub.add_parser("cost")
    c.add_argument("--skill", default=str(PLUGIN / "skills" / "promptfu"))
    c.add_argument("--layout")
    c.add_argument("--json")
    r = sub.add_parser("rewrites")
    r.add_argument("--dir", required=True)
    r.add_argument("--json")
    sub.add_parser("gen")
    args = parser.parse_args()
    if args.cmd == "cost":
        result = cmd_cost(args)
        if args.json:
            Path(args.json).write_text(json.dumps(result, indent=2), encoding="utf-8")
    elif args.cmd == "hooks":
        sys.exit(1 if cmd_hooks(args)["misses"] else 0)
    elif args.cmd == "lint":
        sys.exit(1 if cmd_lint(args)["misses"] else 0)
    elif args.cmd == "quotes":
        sys.exit(cmd_quotes(args))
    elif args.cmd == "rewrites":
        cmd_rewrites(args)
    elif args.cmd == "gen":
        cmd_gen()
    else:
        sys.exit(cmd_budget(args))


if __name__ == "__main__":
    main()
