# Family: Anthropic Claude

What every current Claude model shares. A model file in this directory is a delta on this one, and a point release is a further delta on its predecessor: `fable-5-1.md` on `fable-5.md`, `opus-5-5.md` on `opus-5.md`. Read this file first, then the model file.

Last verified 2026-09-22 against the official Claude prompting guides for Opus 5.5, Opus 5 and Fable 5.1, the effort documentation, and the model profiles in this directory.
Sources: https://docs.anthropic.com (prompt engineering, effort, adaptive thinking, structured outputs), the release notes cited in each model file.

## Conventions

- **Model IDs** match `claude-*` (`claude-fable-5-1`, `claude-opus-5-5`, `claude-opus-5`, `claude-sonnet-5`, `claude-haiku-4-5-20251001`). Bedrock prefixes `anthropic.`.
- **Effort** is the depth dial: `low | medium | high | xhigh | max`, API default `high` on every model except Opus 5.5, whose default is `medium`. It controls thinking volume, and on Opus 5.5, Opus 5 and Fable it does not reliably shorten visible output, so length is asked for in the prompt. Level names do not mean the same amount of thinking across generations. Re-sweep on each release.
- **Adaptive thinking is on by default** on Opus 5.5, Opus 5, Sonnet 5 and Fable, and always on for Opus 5.5 and Fable. `budget_tokens`, `temperature`, `top_p`, `top_k` and prefills return a 400 on 4.6 and later. Fable and Opus 5.5 reject `thinking: {type: "disabled"}` outright, and Opus 5 accepts it only at effort `high` or below.
- **Dialect.** XML-style tags for mixed content (`<context>`, `<constraints>`, `<examples>`, `<documents>`), long reference material at the top and the question at the end, three to five varied examples where format or tone matters, instructions phrased as what to do. Bracket labels are an equal alternative. Never mix in ALL-CAPS headers from the OpenAI dialect.
- **Reasoning echo is a refusal hazard.** "Show your reasoning" trips the `reasoning_extraction` classifier on Fable and on Opus 5.5. Preserve auditability with citations or a send-to-user tool instead, on every Claude target, and say in the report that you removed it.
- **Structured output.** Keep `tool_choice: auto` and use `strict: true` tool schemas or structured outputs for schema-valid JSON. Forced tool choice is a 400 on Fable 5.1 and Opus 5.5. Name the tool in the prompt to make the model call it.
- **Prompt caching** needs a 512-token minimum prefix. Hold effort constant inside a cached conversation, because changing it invalidates the prefix. Fable 5.1 cache reads cost a quarter of Fable 5's, and Opus 5.5 reads at $0.20 per MTok, so compact later.
- **Refusals** arrive as HTTP 200 with `stop_reason: "refusal"` and a `stop_details` category. Never read `content[0]` unconditionally. Fable's four categories, the defensive reframe and the fallback targets are in `fable-5.md`, Safeguards; Opus 5.5 runs the bio, cyber and reasoning-extraction classifiers too (`opus-5-5.md`).

## Routing within Anthropic

| Target | Profile | One-line delta |
|---|---|---|
| Opus 5.5 **(default)** | `opus-5-5.md` on `opus-5.md` | Everything Opus 5 wants, plus: start at `medium` (its API default) and re-sweep effort rather than carry `xhigh` over; thinking cannot be disabled; bio, cyber and reasoning-extraction classifiers; the unattended finish-the-task addition, the silent-turn reminder and the multi-agent time budget |
| Opus 5 (legacy) | `opus-5.md` | Fable-like autonomy at half Fable's cost. Delete verification and re-check scaffolding, constrain length, scope and delegation. Target only when a dispatch pins it or an Opus 5.5 classifier declined the task |
| Fable 5.1 / Mythos 5.1 **(current Fable)** | `fable-5-1.md` on `fable-5.md` | Everything Fable 5 wants, plus: delete narration suppressors and anti-formatting rules, add the batching nudge, the finish-the-task pair and the scope-and-tests limiter. Re-sweep effort, `low` is a real tier |
| Fable 5 / Mythos 5 (legacy) | `fable-5.md` | Intent plus constraints, delete procedural scaffolding, never request reasoning echo. Target only when a dispatch pins Fable 5 by name |
| Opus 4.8 (and 4.x) | `opus-4-8.md` | Legacy target and Fable's fallback. Explicit structure and checklists help |
| Sonnet 5 | `sonnet-5.md` | Execution tier: complete spec, tight output contract, ambiguity stops instead of guesses |
| Haiku 4.5 | `haiku-4-5.md` | Mechanical tier: one bounded decision, examples over prose, explicit unsure escape hatch |

## Auto mode: pick model and effort first

Classify the task by the judgment it actually requires, not by how important it feels. If you cannot name the specific judgment call, do not pay frontier prices.

**Opus 5.5 is the default for substantive work.** It is cheaper and faster than Opus 5, and at its default `medium` effort it matched or beat Opus 5 at `high` on coding and knowledge work in Anthropic's testing, so the old "judgment-dense means Fable" split mostly buys a session handoff at more than twice the cost. Anthropic's routing note for Fable 5.1 still reads the same way with 5.5 in the Opus seat: start on Opus 5.5, reach for Fable 5.1 for demanding reasoning and long-horizon agentic work or when Opus 5.5 at higher effort still falls short on your evals. Route down from Opus 5.5 for cost, and sideways to Fable 5.1 only on the named exceptions. Whenever Fable is the pick, the target is Fable 5.1. Opus 5 is a pinned-only target.

| Task shape | Model | Effort |
|---|---|---|
| **Default for substantive work:** planning, architecture, design review, code review, multi-source audits, agentic coding, long-horizon runs, multi-agent leads, vision and computer use, reasoning visibility to audit | **Opus 5.5** | `medium` (the default) as the baseline, `high` for the most demanding coding and agentic work, `xhigh`/`max` only with a measured gain, `low` for subagents and cheap review passes |
| **Fable exception 1:** Opus 5.5 at higher effort still falls short on your evals, or the run is genuinely long-horizon (hours-long agentic coding, multistep deep research). Observed shortfall or a long horizon is the trigger | Fable 5.1 | `high`, `xhigh` when a wrong call is expensive. Never `xhigh`/`max` for long deliverables, which draft twice |
| **Fable exception 2:** long-form legal, regulatory or contract analysis, where Fable's published margin is widest and a miss is quiet and expensive | Fable 5.1 | `high` |
| **Fable exception 3:** the caller asks for Fable, or a genuinely irreversible fork is worth a second, differently trained opinion | Fable 5.1 | `high` to `xhigh` |
| **Fable cost route:** work you would otherwise run on Sonnet 5 `xhigh` or Opus 5.5 `high`. Fable 5.1 `low` is often competitive on cost per task while scoring higher, `medium` matches Fable 5 for less. Evals decide, and the effort floor applies | Fable 5.1 | `low` to `medium` |
| Well-specified building: implement to a spec, refactor against tests, data extraction or transformation | Sonnet 5 | `high` default, `xhigh` for the hardest, `medium`/`low` for cost or latency |
| Mechanical: format and checklist checks, routing, classification, labeling, single-artifact summaries, high-volume grading | Haiku 4.5 | cheapest tier. Sonnet 5 `low` if it needs a little judgment |

Stage routing: plan and review at the top of the range, execute in the middle, grade at the bottom, and graders get fresh context with artifacts and rubric only.

Security, bio and reasoning-visibility work stays on Opus 5.5 by default: finding vulnerabilities in source code is permitted, and the classifier categories (cyber, bio, reasoning extraction) are the same ones Fable runs, so there is no longer a classifier-free Opus to hide in. Write the prompt defensively as `fable-5.md` describes, never ask for reasoning echo, and let API code set `fallbacks: "default"`. If an Opus 5.5 classifier declines, rerun that task on Opus 5, which runs fewer categories, accepting that the conversation loses its Opus 5.5 thinking blocks. If a Fable session hits such a task, route it to Opus 5.5 rather than fighting the classifier; Fable-produced thinking does not carry over, so send the full spec.

## Claude Code dispatch facts

The `Agent` tool's `model` option takes `sonnet`, `opus`, `haiku` or `fable`. The `opus` alias resolves to whichever Opus the running Claude Code build treats as current; check `/model` before assuming it is 5.5, because an alias cannot pin a point release. A `fork` inherits the session model and ignores `model`. Agent definitions under `.claude/agents/` can pin a model and effort. `Workflow` scripts pass `{model}` per `agent()` call. Verifier separation and one bounded unit per dispatch apply to all of them. `harnesses.md` has the rest.

## Common mistakes specific to Claude targets

| Mistake | Fix |
|---|---|
| Carrying Opus 4.8 verification and re-check scaffolding onto Opus 5 or 5.5 | They self-verify. Delete the scaffolding and constrain length, scope and delegation instead (`opus-5.md`) |
| Carrying an Opus 5 effort setting onto Opus 5.5, especially `xhigh` for coding | 5.5 thinks more per level and defaults to `medium`, which already matches Opus 5 `high`. Re-sweep from `medium`; reserve `xhigh`/`max` for a measured gain (`opus-5-5.md`) |
| Keeping thinking-disabled patterns or "think carefully" chat lines on Opus 5.5 | Thinking cannot be disabled; effort is the only dial. Delete no-think rules and the chat line, lower effort instead |
| Treating Opus 5.5 as a classifier-free route for security or bio work | It runs the same bio, cyber and reasoning-extraction classifiers as Fable. Prompt defensively, use `fallbacks: "default"`, and fall back to Opus 5 only after a decline |
| Routing judgment-dense work to Fable by reflex | That rule predates Opus 5. Opus 5.5 is the default, Fable is for the three named exceptions and the cost route |
| Carrying narration suppressors or anti-formatting rules onto Fable 5.1 | It is already quiet and already under-formats. Delete them and add a rule that says when to narrate or format (`fable-5-1.md`) |
| Reusing Fable 5 effort levels on Fable 5.1 | The names do not map to the same thinking. Re-sweep, and note `low`/`medium` are real tiers on 5.1 |
| Treating Fable 5 and Fable 5.1 as one profile | `fable-5-1.md` is a delta layer. Read `fable-5.md` first, target Fable 5 alone only when a dispatch pins it |
| Asking "Does this compile without errors?" on Fable 5.1 | A known safeguard false positive. Ask "Are there any bugs in this program?" |
