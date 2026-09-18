# Family: Google Gemini

This file holds what every Google target shares. The model files beside it (`gemini-3-8-flash.md`,
`gemini-image.md`, `veo-3-1.md`) are deltas on it and assume you have read this first.

Last verified 2026-09-18 against the Gemini API models catalog, the thinking guide, the prompting
strategies guide, the Gemini 3 developer guide, the pricing page and the deep research guide.
Sources: https://ai.google.dev/gemini-api/docs/models, https://ai.google.dev/gemini-api/docs/thinking,
https://ai.google.dev/gemini-api/docs/prompting-strategies, https://ai.google.dev/gemini-api/docs/gemini-3,
https://ai.google.dev/gemini-api/docs/pricing, https://ai.google.dev/gemini-api/docs/deep-research,
https://www.philschmid.de/gemini-3-prompt-practices (secondary),
https://promptessor.com/blog/gemini-3-8-flash-prompting-guide (secondary).

## Where this family fits

Route within Google by the judgment the task needs, then set `thinking_level` for the depth. Prices
are per MTok of input and output on the paid tier.

| Target | ID | Pick it for | Thinking | Price |
|---|---|---|---|---|
| Gemini 3.8 Flash (default) | `gemini-3.8-flash` | coding, agents, long-horizon work, most substantive tasks | `low`, `medium` (default), `high` | $0.75 / $3.75 until 2026-12-31, then $1.50 / $7.50 |
| Gemini 3.1 Pro preview | `gemini-3.1-pro-preview` | the hardest reasoning and precise multi-step tool use | `low`, `medium`, `high` (default) | $2 / $12 up to 200k tokens, $4 / $18 above |
| Gemini 3 Deep Think | app mode, API by early access only | the very hardest math and science questions | n/a | Google AI Ultra, or enterprise access |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | mechanical work: classify, label, route, extract | `minimal` (default) to `high` | $0.30 / $2.50 |
| Gemini 3.1 Flash-Lite | `gemini-3.1-flash-lite` | the cheapest text path | `minimal` (default) | $0.25 / $1.50 |
| Deep Research | `deep-research-preview-04-2026`, `deep-research-max-preview-04-2026` | autonomous cited research, background only | n/a | about $1 to $3 per task, $3 to $7 on max |
| Image | `gemini-3.1-flash-image`, `gemini-3-pro-image`, `gemini-3.1-flash-lite-image` | see `gemini-image.md` | `minimal`, `high` | per image |
| Video | `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`, `veo-3.1-lite-generate-preview` | see `veo-3-1.md` | n/a | per second |

Older Flash models (`gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash`) stay available and
are covered in the sibling table of `gemini-3-8-flash.md`. Deep Think has no public model ID as of
this date. It runs in the Gemini app for AI Ultra subscribers, and the API opened to select
enterprises in February 2026 (secondary source).

Stage routing: plan and review on 3.1 Pro preview or 3.8 Flash at `high`, execute on 3.8 Flash at
`medium`, grade on 3.5 Flash-Lite with fresh context, artifacts and rubric only.

## Core shift vs predecessor

Gemini 3 reasons on its own and answers briefly. Google's guide says the models "respond best to
direct, clear instructions" and "may over-analyze verbose or overly complex prompt engineering
techniques used for older models". Chain-of-thought scripts and persuasive framing written for
Gemini 2.5 now cost tokens and can degrade output. The controls moved from prose into settings:
`thinking_level` sets depth, and the prompt states the outcome, the evidence and the contract.

## Delete on sight

- Step-by-step reasoning scripts and "think carefully" prose. Set `thinking_level` instead.
- Any `temperature` below 1.0, and any changed `topP` or `topK`. Google says changing these on
  3.x models "can cause unexpected behavior" including looping.
- "World's best expert" and other persuasive framing. Replace it with decision criteria.
- "Be detailed" or "be concise" without a definition. State the format and a length in words.
- A question placed before or inside a large block of context.
- Two structure systems in one prompt, such as XML tags mixed with Markdown headings.
- A request to show reasoning traces. The model already thinks and only summaries come back.
- `thinking_budget` alongside `thinking_level`. The pair returns a 400.

## Refusal / safety hazards

Standard Gemini safety filters apply and the text models document no Fable-style dual-use
categories. Veo can block a clip on an audio safety filter, and `personGeneration` is limited by
region and mode (see `veo-3-1.md`). Grounding with Google Search is Google's answer to obscure or
recent facts, so add it when a prompt depends on them rather than warning the model about
hallucination.

## Always add

The shared content set goes in every rewrite: intent, hard constraints verbatim, boundaries with
named exclusions, the evidence rule, and the exact output contract. The Google form is direct prose
under one structure system, with the rules first and the question last. Add these blocks:

- Critical rules in the system instruction or the first lines, including persona and format.
- A definitions block for any term a rubric turns on, for example "HIGH = a customer cannot use a
  core paid function, MEDIUM = a major workflow degraded with a workaround, LOW = cosmetic".
- A verbosity line whenever the default terse answer is wrong for the reader. Google's own example
  is "Explain this as a friendly, talkative assistant". Name the format and a word count.
- For large context, the order SYSTEM RULES, CONTEXT, ANCHOR, TASK, OUTPUT. The anchor is one
  transition sentence, verbatim from Google: "Based on the information above...".
- A tool policy with conditions for use, the values it must never invent (IDs, dates, prices,
  account state, authorization), a recovery rule for failed calls, and a stop condition.
- A freshness clause when dates matter. Google's guide suggests "Remember it is 2026 this year".
- Few-shot examples when they teach a boundary or a format, with identical formatting across
  examples. Too many examples make the model overfit to them.
- For multimodal inputs, a label per input and an instruction that names each modality. Google
  says to "treat them as equal-class inputs".

## Dispatch settings

- `thinking_level` is the depth dial. Start at each model's default, then test one level down and
  one up on the same prompt. Test a prompt change and a level change separately.
- Route by level: `low` for latency-bound chat and drafts, `medium` for complex coding and agent
  loops, `high` for multi-step planning, math and verified code generation.
- `max_output_tokens` counts thought tokens too. A limit hit during reasoning returns status
  `incomplete`, so raise it before lowering the thinking level.
- Multi-turn without server state must resend every `thought` block unmodified, including across a
  model switch. Set `store: true` to let the server keep the signatures instead.
- Maker-never-grader holds: graders get artifacts and rubric only, on a cheaper Flash-Lite call.
- Use Structured Output (a JSON schema on the request) for the response shape and keep the
  semantic rules in the prompt. The schema field name differs between `generateContent` and the
  Interactions API, so check the call you are building.
- Deep Research runs only through the Interactions API with `background=true` and `store=true`,
  takes up to 60 minutes, and accepts MCP servers but no custom function tools and no structured
  output. Put the brief's section list and the missing-data rule in the prompt.

## API notes

- Context is 1,048,576 tokens in and 65,536 out on the 3.x text models. Inputs are text, image,
  video, audio and PDF.
- `thinking_level` values are `minimal`, `low`, `medium`, `high`, but support varies per model.
  `gemini-3.8-flash` and `gemini-3.7-flash` reject `minimal` with an error. Dynamic thinking is
  on by default. `thinking_summaries` is `auto` or `none`. Pricing charges the full thought
  tokens even though only a summary is returned.
- Keep `temperature` at 1.0 and leave `topP` and `topK` at defaults on every 3.x model.
- Context caching is priced per model (3.8 Flash $0.075 per MTok until 2026-12-31). Search
  grounding and Maps grounding each give 5,000 free requests a month, then $14 per 1,000.
- 3.1 Pro preview has a `gemini-3.1-pro-preview-customtools` endpoint tuned for bash and custom
  tools. Google warns of quality variation where custom tools do not help.
- Gemini CLI: settings live in `settings.json`, the model is switched with `/model`, and
  `thinkingLevel` is set through `modelConfigs` custom aliases in the config (secondary source).
  Skills are discovered in `.gemini/skills` and `~/.gemini/skills` (secondary source). Whether it
  reads `.agents/skills` is unverified. Antigravity: `antigravity-preview-05-2026` is the managed
  agent model, and its local state on this machine sits under `~/.gemini/antigravity/`. How it
  names its model to the session is unverified.
