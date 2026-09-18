# OpenAI family: what every GPT profile shares

Every profile in `models/openai/` is a delta on this file. Read this file first, then the model
file (`gpt-6-astra.md`, `gpt-5-6.md`, `gpt-image-2-5.md`). This file holds the API conventions,
the effort ladder, the structure dialect, the refusal behaviour, the routing table and the Codex
harness facts. A model file holds only what that model changes.

Last verified 2026-09-18 against OpenAI's latest-model, reasoning, prompt-engineering, prompt-caching
and structured-outputs guides, the model pages for `gpt-6-astra` and the four `gpt-5.6-*` tiers, the
Codex AGENTS.md and subagents docs, and this machine's `~/.codex/models_cache.json`.
Sources: https://developers.openai.com/api/docs/guides/latest-model, .../guides/reasoning,
.../guides/prompt-engineering, .../guides/prompt-caching, .../guides/structured-outputs,
https://developers.openai.com/api/docs/models, https://learn.chatgpt.com/docs/agent-configuration/agents-md,
.../agent-configuration/subagents, https://prompt-architects.com/blog/551-how-to-prompt-gpt-5-6-sol-terra-and-luna-compared
(secondary), https://codex.danielvaughan.com/2026/09/04/gpt-6-astra-codex-cli-integration-guide-critical-cyber-threshold/ (secondary).

## Where the family fits: the OpenAI routing table

Route inside the vendor. A Codex session cannot hand work to Claude or Gemini, and the effort
floor in SKILL.md applies to the configured Codex level.

| Tier | ID | Price in / cached / out per MTok | Pick it for | Effort |
|---|---|---|---|---|
| Flagship | `gpt-6-astra` | $10 / $1 / $50 | The hardest end-to-end work: long agentic coding, computer use, browsing, research and document creation | `high` to start, `xhigh` or `max` for hard architecture and debugging loops |
| Default for substantive work | `gpt-5.6-sol` (alias `gpt-5.6`) | $4 / $0.40 / $20 | Planning, review, multi-file features, professional writing where quality outweighs cost | `medium` default, `high` for planning and review, `reasoning.mode: "pro"` when latency permits |
| Execution | `gpt-5.6-terra` | $2 / $0.20 / $12 | Implement to a spec, exploration, scans, document review at half Sol's price | `medium`, `high` for harder specs |
| Mechanical | `gpt-5.6-luna` | $0.20 / $0.02 / $1.20 | Classification, routing, extraction, repeatable narrow tasks | `none` or `low` |
| Authorized security | `gpt-5.6-cyber` | $12.50 / $1.25 / $75 | Vulnerability research, exploit validation and security testing by approved defenders only | Responses API only, 400k context |

Stage routing for multi-step work: plan and review on Sol or Astra, execute on Terra, grade on
Luna with fresh context and the artifact plus rubric only. Requests over 272K input tokens cost
2x input and 1.5x output on every tier, so compact before that boundary on long runs.

## Core shift vs the GPT-5 generation

Every current model is a reasoning model. OpenAI's reasoning guide says to give the model the
task, the constraints and the desired output format, and to treat `reasoning.effort` as a tuning
knob rather than the main way to recover quality. It also says to define what counts as done and
how the model should verify its work, and to avoid prescribing every intermediate step. Depth is
an API parameter, so the prompt carries clarity and the parameter carries effort.

## Delete on sight (family-wide)

- Prose that simulates configuration, such as "think extremely hard" or "use maximum
  intelligence". Set `reasoning.effort` and leave the prompt for the task.
- Step-by-step reasoning scripts and "think step by step". The model reasons before answering.
- Instructions repeated across the system prompt, `AGENTS.md` and skills. OpenAI reported that
  leaner system prompts improved evaluation scores by roughly 10 to 15% while cutting total
  tokens by 41 to 66% (secondary source attributing the figure to OpenAI).
- `temperature`, `top_p`, `top_logprobs` and `logprobs`. Removed on GPT-6 Astra and rejected
  or ignored depending on SDK version (secondary source for the SDK detail).
- `prompt_cache_retention`. Replaced by `prompt_cache_options.ttl: "30m"`.
- Chat Completions for tool calling. Tool calling on GPT-6 Astra needs the Responses API.

## Refusal / safety hazards

GPT-6 Astra was assessed at the Critical tier for cybersecurity under OpenAI's Preparedness
Framework, so restricted variants decline advanced offensive security tasks for standard users
while defensive workflows stay supported (secondary source citing OpenAI's safety overview).
Frame security work as review, hardening and authorized testing of systems the user owns, and
route exploit validation to `gpt-5.6-cyber` when the account has Daybreak approval. Structured
Outputs return a `refusal` item instead of the schema when the model declines, so never read
the schema field unconditionally. Image models return `moderation_blocked` with a
`moderation_details` object, and a retry without changing the prompt or images will fail again.

## Always add (family-wide form)

- **Role hierarchy.** `developer` messages are prioritized ahead of `user` messages. The
  `instructions` parameter is equivalent to a developer message for the current request only.
  Put standing rules in the developer message and the task in the user message.
- **Section order.** OpenAI's guide orders a developer message as identity, instructions,
  examples, then context, with proprietary data near the end. Markdown headers and lists mark
  sections. XML tags delimit where a piece of content begins and ends. ALL-CAPS section labels
  (GOAL, CONTEXT, CONSTRAINTS, OUTPUT) are a cheap Markdown-compatible dialect that PrompTessor's
  guides use (secondary source). Pick one system per prompt.
- **Prose style block.** OpenAI publishes one for GPT-6 Astra and it applies to the whole family
  when the output is prose. Verbatim:
  > Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements. Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
- **Slop blocklist.** Also from OpenAI's Astra guide, verbatim:
  > Avoid using slop words or phrases like 'Bottom Line:', 'delve,' 'foster,' 'leverage,' 'it's worth noting,' 'importantly,' 'Question? Answer.' or 'This isn't about X. It's about Y.', 'genuinely' or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as 'In short:..', 'The simplest mental model is:...'. State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as 'X, not Y' or 'X—not Y' that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like 'exact-head checks' and 'editorial-row layouts', vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
- **Shape in the schema, meaning in the prompt.** Request JSON with
  `text.format: {type: "json_schema", strict: true, schema}` and mark function tools
  `strict: true`. The prompt defines the decision rules and what to do when the input cannot
  produce a valid response.
- **Few-shot only when evaluation shows a gain.** A handful of diverse input and output pairs in
  the developer message. Zero-shot first on reasoning models.
- **Cache-stable prefix.** Reused content goes at the start of the prompt and among the first
  parameters in the request body. Changing the model, tool definitions or order,
  `parallel_tool_calls`, `text.format`, `text.verbosity`, `reasoning.effort` or
  `context_management` breaks the prefix, and so does editing an earlier message instead of
  appending.

## Dispatch settings

- **Effort ladder.** `reasoning.effort` takes `none | low | medium | high | xhigh | max` on the
  GPT-5.6 family (default `medium`). GPT-6 Astra takes `low` through `max` and returns HTTP 400
  on `none`. OpenAI's semantics: `none` for latency-critical tasks that gain nothing from
  reasoning, `low` for speed and cost, `medium` for most workloads, `high` for complex debugging
  and deep planning, `xhigh` for deep research and asynchronous workflows, `max` for the hardest
  problems. Reasoning tokens bill as output tokens and count against `max_output_tokens`, so
  reserve at least 25,000 tokens for reasoning plus output and watch for `incomplete` status.
- **Pro mode.** `reasoning.mode: "pro"` on the GPT-5.6 family spends more compute before one
  final answer and stacks on any effort level at standard token rates (reasoning guide names the
  modes, the effort-stacking detail is a secondary source).
- **Change effort per phase.** On GPT-6 Astra insert a `configuration_update` item with a new
  `reasoning.effort` between responses. It keeps the cached prefix, cannot sit next to another
  update, and is incompatible with automatic compaction and truncation.
- **Reasoning items.** Stateless calls carry `encrypted_content` to pass back. `reasoning.summary`
  of `auto`, `concise` or `detailed` returns a readable summary. Never ask for a reasoning transcript.
- **Verifiers.** Maker never grades. A fresh Luna or Terra context with the artifact and rubric
  only is the cheap grader.

### Codex

- Codex's base instructions say "You are Codex, an agent based on GPT-6" and nothing more specific.
  The variant and effort are session settings that default from `~/.codex/config.toml` (`model`,
  `model_reasoning_effort`), layered with a project `.codex/config.toml`, and overridden by `-m`,
  `--reasoning-effort` or `/model`. If the session settings are not visible, read the config file
  and state that as an assumption.
- Models on this account per `~/.codex/models_cache.json`: `gpt-6-astra`, `gpt-reserve`,
  `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5`, `codex-auto-review`. Astra, Sol
  and Terra expose an extra `ultra` effort described as "Maximum reasoning with automatic task
  delegation". `ultra` is Codex-only and is not an API value.
- Subagents inherit the parent's model and reasoning effort. Resolution order: the explicit
  spawn request, then `[agents]` defaults (`default_subagent_model`,
  `default_subagent_reasoning_effort`, `max_concurrent_threads_per_session`), then the parent's
  values, then the model's default effort. Set `model` or `reasoning_effort` on a spawn only
  when the user, `AGENTS.md` or a skill asks. PromptFu is a skill, so it may recommend a level.
- Custom agents live in `.codex/agents/*.toml` (project) or `~/.codex/agents/` with `name`,
  `description`, `developer_instructions` and optional keys such as `model`, `model_reasoning_effort`
  and `sandbox_mode`. Built-ins: `default`, `worker`, `explorer`. OpenAI's subagent guidance:
  `gpt-5.6` for demanding multi-step work, `gpt-5.6-terra` for exploration and review,
  `gpt-5.6-luna` for narrow repeatable work.
- Subagents share the parent's sandbox, permission mode and workspace. Give each bounded
  ownership and acceptance criteria, tell it to preserve other agents' edits, and keep parallel
  write-heavy work rare. Read-heavy fan-out (exploration, triage, summarization) is the sweet
  spot.
- `AGENTS.md` loads from `~/.codex/AGENTS.override.md`, then `~/.codex/AGENTS.md`, then each
  directory from the git root down to the working directory with closer files overriding, up to
  `project_doc_max_bytes` (32 KiB). Rules read as a condition plus a safe path. Leave out what
  CI and linters already enforce.
- Claude vocabulary does not transfer. No Claude tool names, no `context: fork`, no request for
  private reasoning, and no routing to a Claude model because a global default names one.

## API notes

- Endpoints on every text tier: Chat Completions, Responses and Batch. Realtime, Live, Assistants,
  fine-tuning, embeddings and media endpoints are unsupported. `gpt-5.6-cyber` is Responses only.
- Context is 1,050,000 tokens and max output 128,000 on every tier, with 922,000 max input on the
  GPT-5.6 tiers. Knowledge cutoff 2026-02-16 for GPT-5.6 and 2026-04-30 for GPT-6 Astra.
- Tools on every text tier: web search, file search, image generation, code interpreter, hosted
  shell, apply patch, skills, computer use, MCP, tool search. Features: streaming, structured
  outputs, function calling, image input, prompt caching.
- Caching on GPT-5.6 and later: minimum 1,024 visible input tokens, `prompt_cache_options.ttl`
  accepts only `"30m"`, reads cost 0.1x and writes 1.25x, and `prompt_cache_key` only separates
  accounting. GPT-5.6 adds explicit cache breakpoints.
- `text.verbosity` exists as a request setting (it appears in the cache-invalidation list). Its
  documented values are `low | medium | high` from the GPT-5 generation and were not re-verified
  for GPT-5.6.
