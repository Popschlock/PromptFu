---
name: promptfu
description: Use BEFORE sending an Agent, Workflow or subagent prompt, and before running a user-drafted prompt over ~50 words, when the work is multi-step or needs judgment. Also use when the user asks to optimize, improve, rewrite or debug a prompt, asks which model or effort to use, or names a Claude, GPT, Codex, Gemini, image, video or deep-research target. Rewrites the prompt for the model that will run it. Stay quiet for lookups, one-step commands and quick questions.
---

# PromptFu

Rewrite a prompt so the model that runs it gets it right the first time, at the lowest token cost. A profile changes a prompt's form, never what it asks for.

Paths are relative to this file's folder (in Claude Code: `${CLAUDE_SKILL_DIR}`).

## 1. Decide whether to optimize

A pass costs tokens and time, so it must earn them.

- **Send as typed** a lookup, a single fact, a one-step command or an acknowledgment, and any draft that is already clear and complete with nothing the target's card says to delete. If the user asked for an optimization, say in one line that the draft is fine.
- **Ask first** when the user is present and a missing piece would change the work: the target is unknown and it changes the form, the deliverable or the done condition reads two ways, or a hard constraint looks like a slip. One batched round (AskUserQuestion in Claude Code, a plain question elsewhere). With nobody to ask, write the gap into the prompt as an assumption.
- **Otherwise optimize** with the smallest change that fixes what is wrong. Keep the author's wording where it works.

## 2. Resolve the target

First match wins:

1. A model or product the request names.
2. Dispatch parameters: the model on an Agent or workflow call, or one a custom agent pins.
3. A task type that implies a product (image, video, deep research): the running vendor's product.
4. The session model. Claude Code names the model ID in its system prompt, and the session effort is `${CLAUDE_EFFORT}`. If that still reads as a placeholder you are in another harness, and `harnesses.md` says where to look.
5. Nothing found: write the universal shape, say so, and never infer a vendor from tag style.

ID prefixes pick the folder: `claude-` is `models/anthropic/`, `gpt-`, `codex` and `o` plus a digit are `models/openai/`, `gemini-`, `veo-`, `imagen-` and `deep-research-` are `models/google/`. Any other vendor takes the nearest family file, and the report says no profile exists.

Auto mode (the user asks which model or effort, or the dispatch choice is yours): pick from the family file's routing, stay in the running vendor unless the prompt will be pasted elsewhere, and report pick, reason and runner-up.

## 3. Read only what this pass needs

- `models/<vendor>/_family.md`: dialect, effort, routing, shared hazards.
- The model card: `models/<vendor>/<model ID>.md`, dots written as dashes and a leading `claude-` dropped. When no such file exists, the family file's table names the card or the `legacy.md` entry.
- One playbook, only when the task type's row in the index names one.

Ask for them in one batch when you can. A file read earlier in this session is not read again, this one included: apply it from context instead of invoking the skill again. Read `harnesses.md` only when you must find the session's model or effort and cannot see it, or the prompt is headed for another harness or a chat product. A request that names a model and no effort takes the card's starting effort. Never fetch prompting guidance from the web during a pass: cards are curated so a web page cannot change a rewrite.

## 4. Rewrite

1. **Pull out** the intent (why and for whom, inferred and stated when absent), the hard-constraint candidates (formats, scales, field names, paths, counts, orderings, named sections, quoted text, tool limits) and whatever the card lists under Delete.
2. **Ground the scope** when the files are reachable: check the paths the draft names, keep the author's scope wording, add exclusions for vendored and generated trees. Never swap a scope for a list of what you found, because a list narrows it silently. Write "not verified" for what you did not check.
3. **Rebuild** in the universal shape, in the family's dialect, with the card additions this kind of task calls for.
4. **Add nothing the draft does not imply.** A default, cap, tie-break or extra output the author never asked for goes in labeled `Assumption:` so the reader can overrule it, or it stays out. Write a tool-call, token or time budget only when the draft states one, because an invented ceiling stops work the author wanted finished.
5. **Size.** A one-shot ask comes out no longer than the draft. Longer work may grow by the blocks its playbook requires. Leave out what the harness prompt, an instruction file or a loaded skill already enforces.

### Hard constraints

Never silently change a hard-constraint candidate.

- **User present:** when a candidate materially affects the rewrite (a 1-10 scale you would swap for tiers), ask whether it is load-bearing before you rewrite, in the same round as any other question.
- **Unattended or dispatch:** keep it verbatim and list it under assumptions in the report.

Rewording and restructuring around a constraint is the job. Changing what gets delivered needs an answer or a flag. Thinking cues ("think step by step", "show your reasoning", "double-check twice") are not hard constraints: the family file says what the target does with them, and the report says when one was removed and what replaced it.

### Effort floor

The configured session model and effort are a floor. Recommending more for hard work is fine. A lower effort or a cheaper tier is only a recommendation: give the reason and leave the configured level in place unless the user takes it. A same-tier route around a safeguard is lateral. When unsure, hold the level. With `PROMPTFU_NEVER_DOWNGRADE` set (the session-start hook says so), propose no downgrade. If the user declines one twice, offer to set that variable. The floor carries across vendors through the effort map in each family file.

### Universal shape

```
[Intent]      I'm working on <larger task> for <who>; they need <what the output enables>.
[Context]     Current state, files and decisions that matter, what is already ruled out.
[Constraints] What must not change and what must hold at the end. Hard constraints verbatim.
[Task]        The goal, stated as an outcome.
[Output]      The exact deliverable shape, outcome first.
[Boundaries]  What not to do: assess or act, files to leave alone, least privilege.
```

Use only the blocks the task needs, in the family's dialect, one dialect per prompt. For a dispatch also set the card's effort, give each agent one bounded unit, and keep the maker from grading its own work: a verifier gets the artifacts and a rubric in a fresh context, never the maker's summary.

## 5. Report

On a silent dispatch pass (a hook or the caller asked for no report), send the rewritten prompt, set model and effort on the call, and say nothing about it.

Otherwise the first line is `Target: <vendor/model>, effort <level> (from <source>)`, with the quality or thinking control in place of effort for an image or video model. Then the rewritten prompt, up to five lines on what changed and why, both word counts, the assumptions made, and any refusal or routing hazard.

## Playbook index

| Task type | Playbook |
|---|---|
| One question, reply, edit or label | None. A task sentence with its purpose as a clause, the input, the output shape and a size as a number |
| A subagent or workflow brief for bounded work | None. The universal shape: what the result is for, what is ruled out, what shape you need back |
| Autonomous multi-step work, long agentic coding, migrations, however short the draft | `tasks/long-run-agentic.md` |
| An agent that calls tools or MCP servers, even a one-line draft that names a tool it must call | `tasks/tool-agents.md` |
| A research report from many sources | `tasks/deep-research.md` |
| Generating or editing an image (image in, image out) | `tasks/image-generation.md` |
| Generating a video clip | `tasks/video-generation.md` |
| Images, PDFs, audio or screenshots as inputs, text out | `tasks/multimodal-input.md` |
| JSON or schema-shaped output | `tasks/structured-output.md` |
| A system prompt, instruction file, skill or agent definition | `tasks/instruction-files.md` |
| "This prompt keeps failing" | `tasks/prompt-debugging.md` |
