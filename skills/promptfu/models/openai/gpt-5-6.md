# Profile: GPT-5.6 Sol, Terra and Luna

Delta on `models/openai/_family.md`. Read the family file first. One profile covers the three
tiers because OpenAI's guidance is that they share one prompt skeleton and differ in cost,
latency and reasoning depth. `gpt-5.6-cyber` appears here only as a routing note.

Last verified 2026-09-18 against the model pages for `gpt-5.6-sol`, `gpt-5.6-terra`,
`gpt-5.6-luna` and `gpt-5.6-cyber`, the reasoning guide, the prompt-caching guide, the Codex
subagents doc, and a practitioner comparison for the parts of OpenAI's announcement that could
not be fetched directly (marked secondary).
Sources: https://developers.openai.com/api/docs/models/gpt-5.6-sol,
https://developers.openai.com/api/docs/models/gpt-5.6-terra,
https://developers.openai.com/api/docs/models/gpt-5.6-luna,
https://developers.openai.com/api/docs/models/gpt-5.6-cyber,
https://developers.openai.com/api/docs/guides/reasoning,
https://developers.openai.com/api/docs/guides/prompt-caching,
https://learn.chatgpt.com/docs/agent-configuration/subagents,
https://prompt-architects.com/blog/551-how-to-prompt-gpt-5-6-sol-terra-and-luna-compared (secondary).

## Where this model fits

| Tier | ID | In / cached / out per MTok | When |
|---|---|---|---|
| Sol | `gpt-5.6-sol`, alias `gpt-5.6` | $4 / $0.40 / $20 | The default for substantive work: planning, design review, multi-file features, audits. Add `reasoning.mode: "pro"` when latency permits and a miss is expensive |
| Terra | `gpt-5.6-terra` | $2 / $0.20 / $12 | Everyday work that needs most of Sol's intelligence at half the price: implement to a spec, exploration, scans, document review |
| Luna | `gpt-5.6-luna` | $0.20 / $0.02 / $1.20 | High-volume, cost- and latency-sensitive work: classification, routing, extraction, repeatable narrow tasks |
| Cyber | `gpt-5.6-cyber` | $12.50 / $1.25 / $75 | Approved defenders only, via the Daybreak program: vulnerability research, exploit validation, security testing |

All three main tiers share a 1,050,000-token context, 922,000 max input, 128,000 max output
and a 2026-02-16 knowledge cutoff. Cyber has a 400,000-token context, 272,000 max input and
runs on the Responses API only. OpenAI's own subagent guidance maps the same way: `gpt-5.6`
for demanding multi-step work, `gpt-5.6-terra` for speed-favoured exploration and review,
`gpt-5.6-luna` for fast narrow repeatable work.

Pick GPT-6 Astra over Sol when the run is long-horizon agentic work, computer use, or when Sol
at `high` or `pro` still falls short on your evals. Pick Sol over Astra for most professional
work, since it costs 40% of Astra per token.

## Core shift vs GPT-5.5

GPT-5.6 is more concise by default than GPT-5.5, so "be brief" rules carried from older prompts
now cut too much and should be tested before they stay (secondary source attributing the
statement to OpenAI). The family gained a sixth effort level (`none`), a second control
(`reasoning.mode` with `standard` and `pro`), a request-level verbosity setting and explicit
cache breakpoints. OpenAI's internal testing found that stripping repeated instructions out of a
system prompt raised evaluation scores by roughly 10 to 15% while cutting total tokens by 41 to
66% and cost by 33 to 67%, with the caveat that the figure is directional (secondary source).
The lesson for the rewrite: fewer, non-duplicated instructions beat longer prompts.

## Delete on sight

- Brevity rules written for GPT-5.5 or earlier ("keep answers short", "no more than three
  sentences") unless a measured need remains. Set `text.verbosity` instead where the API allows.
- The same rule stated in the developer message and again in `AGENTS.md` or a skill. Keep one
  copy in the highest-authority place.
- Reasoning scripts and "think step by step". The family's reasoning-model rule applies in full.
- `reasoning.effort: "none"` on judgment work. It exists for latency-critical tasks that gain
  nothing from reasoning, such as templated extraction, and it degrades anything else.

## Refusal / safety hazards

None documented for the three main tiers beyond the family-wide Structured Outputs `refusal`
item. Offensive-security validation belongs on `gpt-5.6-cyber` for approved accounts, so frame
security work on Sol, Terra and Luna as review, hardening and authorized testing of systems the
user owns.

## Always add

- **The shared skeleton.** OpenAI's recommended structure for the family is Role, Personality,
  Goal, Success criteria, Constraints, Tools, Output, Stop rules, with each section kept short
  and detail added only where behaviour changes (secondary source attributing the skeleton to
  OpenAI). It maps onto the universal shape: Role and Personality are the developer identity,
  Goal and Success criteria are the intent and output contract, Stop rules are the boundaries.
- **The three reasoning-guide lines, verbatim.** "Give the model the task, constraints, and
  desired output format." "Treat `reasoning.effort` as a tuning knob, not the primary way to
  recover quality." "Define what counts as done and how the model should verify its work."
- **Style block and slop blocklist** from the family file when the deliverable is prose. OpenAI
  published them for GPT-6 Astra, and the 5.6 default is already leaner, so apply them and then
  check the output is not clipped.
- **Tier-appropriate specificity.** Sol fills gaps from intent the way a senior colleague does.
  Terra and Luna want the spec complete: inputs, outputs, acceptance criteria, edge cases, the
  named pattern to imitate, and an unsure escape hatch on Luna ("label it UNKNOWN when the
  rubric does not decide").
- **Verifier separation** for any pipeline: Luna grades from the artifact and rubric in a fresh
  context.

## Dispatch settings

- **Effort.** `reasoning.effort` defaults to `medium` in both modes. Ladder
  `none | low | medium | high | xhigh | max`. Sol: `high` for planning and review, `xhigh` for
  the hardest reasoning. Terra: `medium`, `high` for harder specs. Luna: `none` or `low`,
  `medium` when a bit more judgment is needed. Codex adds `ultra` on Sol and Terra, which is
  `max` plus automatic delegation.
- **Pro mode.** `reasoning.mode: "pro"` runs extra computation before a single final answer and
  stacks on any effort level at the calling model's standard token rates. Use it on Sol for the
  highest-stakes single answers when latency is acceptable (mode names from the reasoning
  guide, billing detail secondary).
- **Verbosity.** Set `text.verbosity` once instead of repeating length rules in prose. Changing
  it breaks the cache prefix, so fix it per workload.
- **Reasoning across turns.** `reasoning.context` of `all_turns` is the GPT-5.6 default and
  renders earlier reasoning when the model family is compatible. `current_turn` keeps only the
  current turn. Stateless calls carry `encrypted_content`.
- **Stage routing.** Plan and review on Sol, execute on Terra, grade on Luna. Compact before
  272K input tokens on any tier to avoid the long-context premium.

## API notes

- IDs `gpt-5.6-sol` (alias `gpt-5.6`), `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.6-cyber`.
- Endpoints: Chat Completions, Responses, Batch. Cyber is Responses only. Live, Realtime,
  Assistants, fine-tuning, embeddings and media endpoints are unsupported on all four.
- Tools: web search, file search, image generation, code interpreter, hosted shell, apply
  patch, skills, computer use, MCP, tool search. Cyber's page names `hosted_shell`,
  `apply_patch` and `computer_use`.
- Features: streaming, structured outputs, function calling, image input, web search, prompt
  caching.
- Caching: 1,024 visible-token minimum, `prompt_cache_options.ttl: "30m"`, reads 0.1x and
  writes 1.25x, explicit cache breakpoints new in this family.
- Long-context premium: requests over 272K input tokens are priced at 2x input and 1.5x output.
- `reasoning.summary` accepts `auto`, `concise` or `detailed`.
