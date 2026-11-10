# OpenAI family

Verified 2026-11-10 against the pages under Sources.
Sources: https://developers.openai.com/api/docs/ (models, guides/latest-model/gpt-6-astra, guides/latest-model/gpt-5.6, guides/prompt-guidance-gpt-5p6, guides/model-selection, guides/reasoning, guides/reasoning-best-practices, guides/deployment-checklist, guides/daybreak, guides/video-generation) and https://learn.chatgpt.com/docs/ (models, cyber-safety, agent-configuration/subagents)
Unverified: which Codex models offer `ultra`, default efforts inside Codex, GPT-6-Cyber's effort values, that "Extra high" is `xhigh`, and whether the Structure guidance was retested on GPT-6.

## Models

| Model | ID | Card | The docs start it on |
|---|---|---|---|
| GPT-6 Astra | `gpt-6-astra` | `gpt-6-astra.md` | The most demanding reasoning, coding and research |
| GPT-6.1 Sol | `gpt-6.1-sol` | family file alone | Complex coding and professional work at lower cost |
| GPT-6.1 Terra | `gpt-6.1-terra` | `gpt-6-1-terra.md` | Visual reasoning, computer use, clear writing |
| GPT-6 Luna | `gpt-6-luna` | family file alone | Focused, high-volume tasks |
| GPT-6-Cyber | `gpt-6-cyber` | family file alone | Authorized vulnerability work (Daybreak Red) |
| GPT Image 2.6, 2.5 | `gpt-image-2.6-*`, `gpt-image-2.5-*` | `gpt-image.md` | Image generation and editing |
| Video | none | none | Sora 2 and the Videos API shut down 2026-09-24, no replacement API |
| ChatGPT apps, Deep Research included | none | the picker model's card, else family file alone | A prompt pasted into the app |
| GPT-6 Sol, GPT-5.6, older | their own IDs | `legacy.md` | Only when pinned |

By default the API docs start at GPT-6 Astra and the Codex docs at GPT-6.1 Sol. OpenAI's GPT-6 prompt blocks are in `gpt-6-astra.md`, written from Astra's behavior as a starting point for the family, so take one for Sol, Terra or Luna only when a prompt shows the behavior it fixes.

## Dialect

Markdown headers and lists mark a prompt's sections, XML tags where content such as a reference document begins and ends. A developer message runs identity, instructions, examples, context, and outranks user messages.

## Structure

From "Prompting guidance for GPT-5.6 Sol", OpenAI's latest guide on building a prompt (the GPT-6 guide covers behavior only). Its skeleton for a complex prompt:

```text
Role: [the model's function and context]

Personality: [tone and collaboration style]

Goal: [user-visible outcome]

Success criteria: [what must be true before the final answer]

Constraints: [policy, safety, business, evidence, and side-effect limits]

Tools: [which tools to use, when, and what not to use]

Output: [sections, length, format, and tone]

Stop rules: [when to retry, fallback, abstain, ask, or stop]
```

**Outcome first.** State the destination and what success means, and leave the path to the model. Keep ALWAYS, NEVER and "must" for true invariants.

**Autonomy and approval,** stated once. Repeating "ask first" can cause approval requests for safe actions:

```text
For requests to answer, explain, review, diagnose, or plan, inspect the
relevant materials and report the result. Do not implement changes unless
the request also asks for them.

For requests to change, build, or fix, make the requested in-scope local
changes and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases,
or a material expansion of scope.
```

**Stop conditions.** Ask for the fewest useful tool loops, never at the cost of correctness or required evidence. When evidence is missing, the model names the missing fact and takes the smallest fallback.

**Preambles,** when a person watches multi-step work: one or two sentences before the first tool call, then updates only at a major phase change, never for routine calls.

**Verbosity.** `text.verbosity` sets default detail. A broad "be concise" can cut too much, so say what a short answer keeps and drops.

## Effort

- `reasoning.effort` runs `low`, `medium`, `high`, `xhigh`, `max`. Terra and Luna also take `none`. Astra and GPT-6.1 Sol reject it, so use `low`. The API default is `medium` (Astra's page states none).
- `low` for extraction, routing, classification and routine rewrites, `medium` or `high` to diagnose, compare, plan or reason through code, `xhigh` or `max` only when tests show a gain worth the cost.
- Before raising effort, check the prompt for a missing success criterion or verification loop. Levels do not map exactly between model generations.
- Across vendors: `low` through `max` are the names Anthropic uses. `none` maps to a vendor's lowest level and Codex's `ultra` to `max`. Where a vendor has fewer levels, `xhigh` and `max` map to its top level.

## Thinking cues

OpenAI calls "think step by step" and "explain your reasoning" unnecessary for reasoning models. Turn a wish for depth into the effort recommendation and delete the words. The API returns no raw reasoning, so ask for evidence in the output.

## Hazards

The GPT-5.6 guide names cyber and biology classifiers that can block or refuse a request, even legitimate dual-use work. On GPT-6, reduced refusals for security work need approval under OpenAI's Daybreak programs, so never word around a refusal. OpenAI's example prompts for approved work name the lab, the testing window and a stop line.

## Routing

OpenAI's model and effort pairs. Keep the lightest that meets the quality bar.

- **Luna.** Low: fine-grained edits, simple extraction. Extra high: finding context across apps, problems with clear constraints.
- **GPT-6.1 Sol.** Medium: complex technical work, deliverables you expect to revise. Extra high: polished deliverables, decisions from conflicting evidence.
- **Astra.** Low: concise writing that keeps facts and nuance. Medium: ambitious projects that need broad context. Extra high: demanding analysis with exacting requirements.
- **GPT-6.1 Terra.** Concise writing from supplied material, computer use with a defined outcome, scoped code fixes, images and screens.

## Dispatch in Codex

- **Levels.** `model_reasoning_effort` takes `low` (Light in the apps), `medium`, `high`, `xhigh`, `max` or `ultra`, by model and client. `ultra` lets Codex start subagents on its own, and GPT-6 Luna lacks it. The docs start Luna at `high` and Astra at `low`.
- **Subagents** start when asked directly or when `AGENTS.md` or a skill asks. A brief says how to divide the work, whether to wait for all agents, and what to return. The docs name `gpt-6.1-sol` for demanding agents and `gpt-6-luna` for fast, narrow or high-volume ones.
- **Model and effort.** With nothing set, a subagent inherits both from the parent. Otherwise each resolves from the spawn request, then `[agents]` (`default_subagent_model`, `default_subagent_reasoning_effort`), then the parent. A custom agent file (`.codex/agents/*.toml`) that sets either one wins.
- **The trap.** A spawn request or `[agents]` default that names a model and no effort runs at that model's default effort, not the parent's. A custom agent file that sets only `model` keeps the resolved effort, which that model may not support. Name both.
