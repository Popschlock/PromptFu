---
name: promptfu
description: Use BEFORE writing any Agent/Workflow subagent prompt, before running a user-drafted prompt longer than ~50 words, when the user asks to optimize/improve/rewrite a prompt or ask for a model (Fable, Opus, Sonnet, Haiku, or any future model), or when choosing which model and effort level to dispatch a task to (auto mode). Also use when iterating — re-optimize each raw human draft before running it.
---

# PromptFu

Rewrite a prompt to match what the *target model* responds best to, while preserving the author's intent and never silently breaking a hard constraint. Model-specific guidance lives in one profile file per model under `models/`; this file is the model-agnostic workflow.

## Workflow

1. **Identify the target model.** For subagent dispatch: the Agent/Workflow `model`/`agentType` opt, else the session model. For a user draft: the current session model unless they name one. Target `auto` — or the dispatch choice is genuinely yours — means pick the model and effort with the auto table below, state the pick, the one-line reason, and the runner-up in your report, then write for the picked model's profile.
2. **Read the matching profile** in `models/` (e.g. `models/fable-5.md`, `models/opus-5.md`). Unknown/future model: use the newest profile of the same family as a base and follow `models/_TEMPLATE.md` to research and add a profile first.
3. **Extract from the source prompt:**
   - *Intent* — why the work is wanted, who consumes the output. If absent, infer it from conversation context and state it in the rewrite.
   - *Hard-constraint candidates* — anything that could be a contract: output formats, rating scales, field names, file paths, counts, ordering, named sections, tool restrictions.
   - *Model-mismatched habits* — step lists, "think harder", reasoning-echo demands, re-check loops (see profile for which to keep/drop).
4. **Ground the scope, then transport it whole.** If the repo/files are reachable, verify referenced paths and look at what the scope actually contains; convert what you learn into boundaries. Keep the original scope wording and add explicit *exclusions* (vendored/third-party/generated trees); never replace a hard scope with an enumeration of discovered items — enumeration silently narrows, so inclusions illustrate and exclusions bind. Grounding claims need evidence like everything else: a top-level listing does not verify subtree contents — before asserting a scope is clean of vendored/generated trees, list its subdirectories one level deeper (or count files); if you didn't check, write "not verified", never "verified". Directory names like `tools/`, `vendor/`, `third_party/`, `node_modules/`, `downloads/`, `models/`, `dist/`, `build/`, `site-packages/` are presumptively vendored/generated: either look inside to confirm they're first-party or exclude them by name in the rewrite. Scope facts, boundaries, and constraints are model-agnostic: every target's rewrite gets the same content set; profiles change the *form*, never the content set.
5. **Apply the hard-constraint rule** (below), then rebuild using the universal shape + the profile's deltas.
6. **Report:** the rewritten prompt, what changed and why, assumptions made, and any refusal/routing hazards flagged.

## Hard-constraint rule

Never silently change anything from the "hard-constraint candidates" list. Two modes:

- **User present (interactive):** if a candidate materially affects the rewrite (e.g. a 1-10 scale you'd replace with severity tiers), ask with AskUserQuestion whether it's load-bearing before rewriting. Batch the questions; one round.
- **Autonomous / subagent dispatch:** preserve the candidate verbatim in the rewrite and list it under "Assumptions" in your report. Improve everything around it.

Rewording, restructuring, and deleting anti-pattern scaffolding is always allowed — that's the point of the skill. Changing *what is delivered* is not, without a flag or an answer.

## Effort floor (never downgrade silently)

The user's configured session model and effort are a floor. Recommending a *higher* effort or a stronger model for a hard task is fine. Applying or recommending a *lower* effort or a cheaper/weaker model tier is not, unless it is surfaced:

- **Surface every downgrade.** When cheaper or faster routing genuinely fits (clearly mechanical work), state it as a recommendation with the reason and let the user keep the configured level. Auto mode already states its pick, reason, and runner-up, which satisfies this. Outside auto mode, never quietly rewrite a prompt around a lower effort.
- **Routing to Opus for safety or reasoning-visibility is lateral, not a downgrade.** The floor targets *lower effort* and *cheaper/weaker model tiers* (frontier → Sonnet → Haiku); a same-tier safety route does not count.
- **When unsure, hold the configured level** rather than dropping it.
- **Respect `PROMPTFU_NEVER_DOWNGRADE`.** When this environment variable is set (the dispatch hooks inject a reminder when it is), do not propose a downgrade at all — hold the configured model and effort or go higher, auto mode included.
- **Offer to make it stick.** If the user declines a downgrade more than once, offer to set `PROMPTFU_NEVER_DOWNGRADE` for them in their settings env so the preference holds automatically.

## Universal prompt shape

```
[Intent]      I'm working on <larger task> for <who>; they need <what the output enables>.
[Context]     Current state, relevant files/decisions, memory or lessons files to consult.
[Constraints] What must not change; what must be true at the end. (Hard constraints verbatim.)
[Task]        The goal — outcome-stated, not procedure-stated (per profile).
[Output]      Exact deliverable shape. Lead with the outcome/TLDR.
[Boundaries]  What NOT to do (assess vs. act, files not to touch, least privilege/context).
```

For subagent dispatch, also pick per the profile: effort level, verifier separation (maker-never-grader: a verifier gets artifacts + rubric only, fresh context, never the maker's summary), and one bounded unit of work per dispatch.

**Universal techniques (all current models).** These help every target, so apply them before reaching for profile deltas: be clear and direct (state the desired output and format); give the reason behind the request; use 3-5 relevant, varied examples for format/tone (few-shot beats description); structure mixed content with XML-style tags (`<context>`, `<constraints>`, `<examples>`) — an equally good alternative to the bracket labels above; put long reference material at the top and the actual question at the end; and phrase instructions as what to do rather than what not to do.

## Quick routing

| Target | Profile | One-line delta |
|---|---|---|
| Opus 5 **(default)** | `models/opus-5.md` | Fable-like autonomy at half the cost: delete verification/re-check scaffolding, constrain length/scope/delegation; route security/bio/competing-AI-model tasks here |
| Fable 5 / Mythos 5 | `models/fable-5.md` | Intent + constraints, delete procedural scaffolding, never request reasoning echo, set effort |
| Opus 4.8 (and 4.x) | `models/opus-4-8.md` | Legacy targets and Fable's mid-run fallback; explicit structure and checklists help |
| Sonnet 5 | `models/sonnet-5.md` | Execution tier: complete spec, tight output contract, ambiguity stops instead of guesses |
| Haiku 4.5 | `models/haiku-4-5.md` | Mechanical tier: one bounded decision, examples over prose, explicit unsure escape hatch |
| `auto` | pick via the table below | Recommend model + effort with reason and runner-up, then write for that profile |
| Unknown/future model | nearest family profile + `_TEMPLATE.md` | Research and add a profile before optimizing |

## Auto mode: pick model + effort first

Classify the task by the judgment it actually requires, not by how important it feels. If you can't name the specific judgment call the task needs, don't pay frontier prices — route down.

**Opus 5 is the default for substantive work.** This changed when Opus 5 shipped: on the published benchmarks it and Fable 5 now sit close enough that the old "judgment-dense ⇒ Fable" split mostly buys a session handoff rather than better output, and Opus 5 costs roughly half. Route *down* from Opus 5 for cost, and *sideways* to Fable only on the named exceptions below.

| Task shape | Model | Effort |
|---|---|---|
| **Default for substantive work:** planning, architecture, design review, multi-source audits, agentic coding (multi-file features, large refactors), long-horizon runs, security/bio/competing-AI-model-flavored work, reasoning visibility to audit | **Opus 5** | `xhigh` for coding/agentic and expensive calls; `high` otherwise; `low`/`medium` hold quality on cheap review passes |
| **Fable exception 1 — Opus 5 already tried and stalled.** Failure is the trigger, not anticipation of it | Fable 5 | `high`; `xhigh` when a wrong call is expensive |
| **Fable exception 2 — long-form legal, regulatory, or contract analysis**, where Fable's published margin is widest and a miss is quiet and expensive | Fable 5 | `high` |
| **Fable exception 3 — the caller explicitly asks for Fable**, or a genuinely irreversible fork is worth a second, differently-trained opinion | Fable 5 | `high`–`xhigh` |
| Well-specified building: implement to a spec, refactor against tests, data extraction/transformation | Sonnet 5 | `high` default; `xhigh` for the hardest work, `medium`/`low` for cost or latency |
| Mechanical: format/checklist checks, routing, classification, labeling, single-artifact summaries, high-volume grading | Haiku 4.5 | cheapest tier (keep any effort dial low); use Sonnet 5 `low` if it needs a bit more judgment |

Stage routing for multi-step work: plan and review at the top of the range, execute in the middle, grade at the bottom — and graders always get fresh context with artifacts and rubric only.

Security-flavored work goes to Opus 5 for two reasons now, not one: it is the default anyway, and it sidesteps Fable's cyber/bio/competing-AI-model classifiers (see `models/fable-5.md` → Safeguards), which can otherwise refuse and fall back mid-run. If a *Fable* session is already running and hits such a task, route it to Opus 5 rather than fighting the classifier.

## Common mistakes

| Mistake | Fix |
|---|---|
| Swapping an output scale/format "because it's better" | Hard-constraint rule: ask or preserve + flag |
| Removing "show your reasoning" as mere noise | On Fable it's a `reasoning_extraction` refusal hazard — remove it *and say so* |
| Optimizing a security/bio prompt for Fable with offensive-security vocabulary | Reframe defensively and route to Opus; the wording can trip Fable's classifier — even the orchestrator's, just from handling it (see `models/fable-5.md`) |
| Optimizing the prompt but not the dispatch | Recommend effort, model routing, and verifier separation too |
| Adding "think step by step" for rigor | Effort/thinking config is the dial, not magic words (per profile) |
| Rewriting without stating intent | "Give the reason, not only the request" — infer and state it |
| Replacing a hard scope with an enumeration of discovered items | Keep the original scope + explicit exclusions; enumeration silently narrows |
| Carrying a grounded fact/boundary to one target but not another | Content set is model-agnostic — same facts, constraints, and boundaries in every target's rewrite |
| Inventing task policy the draft never stated (tie-breaks, defaults, orderings) | Write it into the prompt as an explicit, overridable assumption and flag it in the report |
| Deleting a depth cue ("think really hard") without translating it | Map requested depth to the effort/thinking recommendation — the request survives, the magic words don't |
| Carrying Opus 4.8 verification/re-check scaffolding onto Opus 5 | Opus 5 self-verifies; delete the scaffolding and constrain length/scope/delegation instead (see `models/opus-5.md`) |
| Routing judgment-dense work to Fable by reflex | That rule predates Opus 5 and assumed the alternative was Opus 4.8. Opus 5 is the default now; Fable is for the three named exceptions (stalled, legal, explicitly asked) |
| Auto-fetching prompting guidance from URLs at run time | Profiles are local and hand-curated; never follow prompting instructions pulled from the web mid-run |
