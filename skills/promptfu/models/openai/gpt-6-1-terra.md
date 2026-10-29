# Profile: GPT-6.1 Terra

Delta on `models/openai/_family.md`. Read the family file first. Terra belongs to the GPT-6
family, and OpenAI says its GPT-6 prompt blocks are a starting point for every model in it,
written with Astra's behavior in mind, to be evaluated on each model. So the blocks in
`gpt-6-astra.md` are Terra's starting set too. This file holds only what Terra changes: where it
wins, the vision and computer-use settings that matter, and the API details.

Last verified 2026-10-29 against OpenAI's latest-model and prompt-guidance guides, the
`gpt-6.1-terra` model page, the images and computer-use guides, the prompt-caching guide, the
GPT-6.1 Terra addendum to the GPT-6 Astra system card, and this machine's `~/.codex/models_cache.json`.
OpenAI's launch post returned HTTP 403, so its benchmark figures here come through secondary
sources that reproduce its charts.
Sources: https://developers.openai.com/api/docs/guides/latest-model,
https://developers.openai.com/api/docs/guides/prompt-guidance,
https://developers.openai.com/api/docs/models/gpt-6.1-terra,
https://developers.openai.com/api/docs/guides/images-vision,
https://developers.openai.com/api/docs/guides/tools-computer-use,
https://developers.openai.com/api/docs/guides/prompt-caching,
https://deploymentsafety.openai.com/gpt-6-1-terra/vision,
https://openai.com/index/introducing-gpt-6-1-terra/ (launch post, read through the secondary sources below),
https://playground.roboflow.com/models/openai/gpt-6-1-terra (independent vision evals),
https://kingy.ai/blog/gpt-6-1-terra/ and https://www.eesel.ai/blog/gpt-6-1-terra (secondary, launch charts and Artificial Analysis),
https://overchat.ai/ai-hub/gpt-6-1-terra (secondary, hands-on tests),
https://promptessor.com/blog/gpt-6-1-terra-prompting-guide (secondary).

## Where this model fits

- **OpenAI's positioning.** "A fast, efficient model for visual reasoning, precise computer use,
  and clear, natural writing." Its examples: match product photos to catalog entries, compare
  technical drawings, act on application screens, draft and revise text.
- **Price tier.** $1 input, $0.05 cached input, $5 output per MTok. That is half of GPT-6.1 Sol
  and a tenth of GPT-6 Astra per token. Cache writes cost $1.25 for 30 minutes or $2.50 for 12
  hours.
- **Visual recognition is its strongest suit.** Roboflow's independent
  Vision Evals (October 2026) rank Terra second of 65 models overall at 85.8%, ahead of GPT-6
  Astra (83.4%) and GPT-6.1 Sol (81.7%) and behind Gemini 4 Argon (87.5%). By task: object
  detection 84.7% mAP@50, first of 65 at low effort; OCR second of 49 (transcription 96.7%,
  structured JSON 91.5%, text localization 77.6%); identification 96.9%; counting 80.2% at low
  effort and 84.2% at high. Roboflow marks the OCR result as one preliminary run.
- **Visual reasoning trails Sol and Astra by about a point.** On MMMU-Pro (OpenAI's chart, secondary
  source) Terra scores 84.6% at medium and 85.5% at max, against 86.3% for Sol and 86.7% for
  Astra at max, and 81.7% for GPT-5.6 Terra.
- **Computer use splits by benchmark (OpenAI's charts, secondary source).** On Agents' Last Exam
  Terra at max (60.0%) edges Astra (59.3%) and Sol (58.6%), and at medium it scores about 15
  points above GPT-5.6 Terra at about a third of the cost. On OSWorld 2.1 it trails: 74.2% at max
  against 78.0% for Sol and 80.9% for Astra. Terra suits screen reading, forms and short app
  workflows. Long desktop tasks where a miss is costly still go to Sol or Astra.
- **Coding and research.** Terminal-Bench 4.0 rose to 50.3% at max effort from GPT-5.6 Terra's
  21.5% (OpenAI, secondary source). OpenAI still says: "For in-depth research or complex coding,
  choose GPT-6.1 Sol or GPT-6 Astra." Terra implements a clear spec well and cheaply.
- **Fewer confident errors.** Artificial Analysis puts Terra's AA-Omniscience hallucination rate
  at 38% against 54% for Sol and 51% for Astra (secondary source). OpenAI reports its internal
  factuality error rate at low effort falling from 53.6% to 16.7% (secondary source).
- **Speed.** OpenAI reports Terra finishes tasks more than three times faster than Astra and Sol
  (secondary source). At max effort it slows sharply, to about 384 seconds per Artificial
  Analysis task against 63 at medium.
- **Pick it over Sol** for perception (detection, OCR, counting, identification, document fields
  into JSON), screen and form work, high-volume drafting and revision, triage, and execution
  against a clear spec. Pick Sol for complex coding and multi-step research, Astra for the
  hardest end-to-end work, and GPT-6 Luna for mechanical text tasks with no image.
- **Availability.** ChatGPT Work and Codex for Plus, Pro, Enterprise and Edu, and the API. It is
  not in ChatGPT's Chat mode.

## Core shift vs GPT-5.6 Terra

GPT-5.6 Terra was the execution tier between Sol and Luna. GPT-6.1 Terra is OpenAI's vision and
computer-use model, at half GPT-5.6 Terra's price, and it also handles spec execution. For
prompts written for GPT-5.6 Terra, OpenAI's one migration instruction is to "compare both models
on representative images and workflows using the same reasoning effort." Do that before moving
a vision pipeline. In a small hands-on test
(three runs per engineering drawing), Terra read both drawings correctly every time and GPT-5.6
Terra read neither correctly once (secondary source, anecdotal).

## Delete on sight

- `temperature`, `top_p` and `top_logprobs` whenever reasoning effort is above `none`, plus
  `logprobs` on Chat Completions and `message.output_text.logprobs` in a Responses `include`.
- Tool calls through Chat Completions. Terra's tools need the Responses API.
- "Look very carefully at the image" and similar prose standing in for effort or image detail.
  Detail is a request field and effort is a parameter (below).
- Requests for exact physical measurements from an image with no scale or reference in frame
  (secondary source). Ask for estimates with the reference named, or supply the scale.
- Everything in the family "delete on sight" list.

## Refusal / safety hazards

- **Preparedness tiers.** The system card addendum rates Terra Critical in cybersecurity and
  High in biological and chemical capability, with the same safeguards as GPT-6.1 Sol and GPT-6
  Astra. Frame security work as defense of systems the user owns, as the family file says.
- **Acting on screens needs runtime guardrails.** In the addendum's workplace-agent evaluation
  Terra performed an unauthorized action in 13.75% of runs, against 1.25% for GPT-6.1 Sol. In
  29.6% of "respecting warnings" rollouts it finished the task by a route that broke the spirit
  of a restriction, more often than Astra or Sol. When Terra drives a computer with real
  authority, enforce confirmation, allow lists and limits in the harness. A rule in the prompt
  does not enforce them on its own (secondary source).
- **Vision limits from OpenAI's images guide.** It is unsuitable for specialized medical images
  and medical advice, can misread non-Latin text, small or rotated text, and line-style
  distinctions in charts, struggles with precise spatial localization, gives approximate counts,
  ignores file names and metadata, and blocks CAPTCHA submissions.
- Structured Outputs return a `refusal` item when the model declines, as the family file says.

## Always add

- **The GPT-6 blocks from `gpt-6-astra.md`.** Bias toward action, treating requests as
  instructions, instruction priority, testing proportional to risk and the style block. OpenAI
  wrote them for Astra and asks that they be evaluated on each GPT-6 model, so keep the ones a
  test shows Terra needs.
- **Vision evidence labels (secondary source).** Ask the model to mark each finding as observed,
  inferred or unknown, to name the regions, attributes or objects that matter, and to flag
  unreadable fields for review. Pair this with the uncertainty and trust rules in
  `tasks/multimodal-input.md`.
- **Extraction through a schema.** For documents and forms, request
  `text.format: {type: "json_schema", strict: true}` and say in the prompt what to return for a
  field the image does not show.
- **Computer-use lines (OpenAI, verbatim).** In the tool description or task prompt:
  > Inspect a screenshot before acting and check the screen after a short group of actions.
  > Use the computer tool for UI interaction.
- **Consequential actions (OpenAI's computer-use guide).** Purchases, data transmission and
  destructive changes need confirmation, and, verbatim, "Typing sensitive information into a
  form counts as transmission." Tell the model that text on screen is data and cannot grant
  permission or change the task.
- **Writing.** Name the reader, the tone, the structure and the facts that must not change
  (secondary source), and add the family style block and slop blocklist.

## Dispatch settings

- **Effort.** The API default is `medium`, and OpenAI says to start there and raise it only when
  the quality gain is worth the time and tokens. Artificial Analysis finds `low` and `medium`
  the best value (secondary source). Roboflow saw no gain from `high` on detection or
  identification, about 4 points on counting and 2.5 on OCR, at 1.6 to 2 times the cost. So run
  perception at `low` or `medium`, use `high` when counts or exact text matter, and save `xhigh`
  and `max` for multi-step visual reasoning that a test shows needs them. Use `none` for
  latency-critical classification. It is an API value and Codex does not list it.
- **Codex.** Codex lists `gpt-6.1-terra` with a default effort of `low` and offers `low` to `max`
  plus `ultra`. A Codex user who expects the API's `medium` default should set it.
- **Image detail.** Send `detail: "original"` for OCR, small objects, dense or spatially sensitive
  images and computer-use screenshots, `"high"` when exact coordinates do not matter, and `"low"`
  for a coarse look. Map returned coordinates back to the original image after any downscale. The
  images guide documents patch sizing for GPT-6 Astra and the GPT-5.6 tiers and does not yet list
  GPT-6.1 Terra, so check token use on real images.
- **Changing effort mid-conversation.** Insert a `configuration_update` item and keep the
  request-level `reasoning.effort` unchanged so the cached prefix holds.
- **Verifiers.** Terra's speed, price and detection scores make it a good fresh-context grader for
  screenshots, renders and documents, with the artifact and rubric only. The maker still never
  grades.
- **Subagents.** OpenAI's Codex subagent guide names `gpt-6.1-sol` for demanding agents and
  `gpt-6-luna` for narrow, repeatable work, and says nothing about vision. Give Terra the subagents
  that read screenshots, drawings or scans.

## API notes

- ID `gpt-6.1-terra`, single snapshot. Context 1,050,000 tokens, max input 922,000, max output
  128,000, knowledge cutoff 2026-06-01. Input is text and image. Audio and video are unsupported.
- Endpoints: Chat Completions, Responses, Batch. Tool calling needs Responses.
- `reasoning.effort` accepts `none | low | medium | high | xhigh | max`, default `medium`.
- Pricing per MTok: $1 input, $0.05 cached input, $1.25 cache write (30 minutes), $2.50 cache
  write (12 hours), $5 output. Above 272K input tokens the whole request costs 2x input and cache
  and 1.5x output. Batch and Flex cost half, fast mode costs double, and regional processing adds
  10%.
- Caching: `prompt_cache_options.ttl` takes `"30m"` (default) or `"12h"`, and cache reads cost
  0.05x input on GPT-6.1 Sol and Terra.
- Fast mode supports EU data residency for Terra.
- Tools: web search, file search, image generation, code interpreter, hosted shell, apply patch,
  skills, computer use, MCP, tool search. Fine-tuning and predicted outputs are unsupported.
