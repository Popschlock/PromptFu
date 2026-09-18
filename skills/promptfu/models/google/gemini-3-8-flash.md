# Profile: Gemini 3.8 Flash (and the Gemini 3.x text siblings)

Delta on `_family.md`. Read that file first. This profile covers `gemini-3.8-flash`, the default
Google target, and carries a sibling table so one file routes the whole 3.x text line.

Last verified 2026-09-18 against the `gemini-3.8-flash` and `gemini-3.1-pro-preview` model pages,
the thinking guide and the pricing page.
Sources: https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash,
https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview,
https://ai.google.dev/gemini-api/docs/thinking, https://ai.google.dev/gemini-api/docs/pricing,
https://promptessor.com/blog/gemini-3-8-flash-prompting-guide (secondary),
https://9to5google.com/2026/02/12/gemini-3-deep-think-upgrade/ (secondary, Deep Think access).

## Where this model fits

- The Google workhorse. Google describes it as "our most intelligent Flash model, engineered for
  long-horizon software engineering, autonomous agents, and complex enterprise workflows". It is
  the right first pick for coding, agent loops, document work and most substantive prompts.
- Released September 2026 at $0.75 in and $3.75 out per MTok until 2026-12-31, then $1.50 and
  $7.50. That is a fifth of 3.1 Pro preview's output price, so route up only on observed need.
- Route up to `gemini-3.1-pro-preview` when a task needs the deepest reasoning or exact tool
  sequencing and 3.8 Flash at `high` still misses. Route down to `gemini-3.5-flash-lite` for
  single-decision mechanical work.

| Sibling | ID | Thinking (default first) | Price in / out | Use |
|---|---|---|---|---|
| Gemini 3.1 Pro preview | `gemini-3.1-pro-preview` | `high`, `low`, `medium` | $2 / $12 (≤200k), $4 / $18 (>200k) | hardest reasoning, precise multi-step tools, Maps grounding, URL context |
| Gemini 3.1 Pro custom tools | `gemini-3.1-pro-preview-customtools` | as above | as above | bash-heavy and custom-tool agents only |
| Gemini 3 Deep Think | no public ID | n/a | AI Ultra app, enterprise API early access | the very hardest math and science (secondary source) |
| Gemini 3.7 Flash | `gemini-3.7-flash` | `medium`, `low`, `high` | same as 3.8 Flash | prior Flash, no reason to pick over 3.8 |
| Gemini 3.6 Flash | `gemini-3.6-flash` | `medium`, `minimal`, `low`, `high` | same as 3.8 Flash | when `minimal` thinking is needed on a Flash |
| Gemini 3.5 Flash | `gemini-3.5-flash` | `medium`, `minimal`, `low`, `high` | $1.50 / $9 | legacy pipelines only |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | `minimal`, `low`, `medium`, `high` | $0.30 / $2.50 | classify, label, route, extract, cheap grading |
| Gemini 3.1 Flash-Lite | `gemini-3.1-flash-lite` | `minimal`, `low`, `medium`, `high` (per the Gemini 3 dev guide) | $0.25 / $1.50 (audio in $0.50) | the cheapest text path |

## Core shift vs predecessor

3.8 Flash is built for runs that last, so it takes smaller reasoning steps, calls tools
iteratively and verifies its own work. It spends more tokens on a hard task than 3.5 Flash did,
and that is the design (secondary source). The prompting job moves from pushing the model to keep
going toward telling it when to stop, what it may write, and which values it must never invent.

## Delete on sight

Everything in `_family.md`, plus:

- `thinking_level: "minimal"`. It "is not supported and returns an error" on this model.
- "Keep going until done" without a completion test. The model keeps going.
- Prompts that ask it to run the full test suite for a small change. Name the smallest check.
- Long reasoning traces in the output contract. Ask for conclusions and evidence.

## Refusal / safety hazards

None documented beyond the family's standard filters.

## Always add

The family blocks, plus these for agentic and coding work:

- A tool policy in the family's form. Secondary source example, quoted: "Use read-only tools to
  gather missing evidence when required. Never invent IDs, dates, prices, account state. Treat
  writes/purchases/sends as high-risk. Classify failures before retrying. Stop when goal
  satisfied or authorization needed."
- A recovery rule that classifies a failure as transient, invalid input or permission before any
  retry, verifies state before repeating a write, and never claims success on an unknown result.
- A stop condition: the user's goal is met, or the next step needs information or authorization
  the model cannot safely infer.
- A verification block sized to the change. Name the tests or checks that count as evidence.
- For long context, the family order with the anchor sentence and the task last.

## Dispatch settings

- `thinking_level` default `medium` is Google's recommended level for complex coding and agent
  workflows. Use `low` for latency-bound chat, drafts and fast analysis, `high` for deep
  multi-step reasoning, math and verified code generation.
- Test `PROMPT v3 + low`, `PROMPT v3 + medium` and `PROMPT v3 + high` as separate runs.
- Output is capped at 65,536 tokens including thought tokens. Raise `max_output_tokens` before
  a long deliverable at `high`.
- Supports function calling, Structured Outputs, code execution, Search grounding, file search,
  computer use (preview), caching, batch, flex and priority inference. No audio or image output
  and no Live API on this model.
- Verifier separation and one bounded unit of work per dispatch hold as in the family file.

## API notes

- ID `gemini-3.8-flash`. Input 1,048,576 tokens, output 65,536. Inputs text, image, video, audio,
  PDF. Output text only.
- `thinking_level` accepts `low`, `medium`, `high`. Default `medium`. `minimal` errors.
- Context caching $0.075 per MTok and storage $0.50 per MTok per hour until 2026-12-31, then
  $0.15 and $1.00.
- Keep `temperature` at 1.0.
- 3.1 Pro preview: same token limits, thinking `high` by default, adds Maps grounding and URL
  context. No audio or image output and no Live API.
