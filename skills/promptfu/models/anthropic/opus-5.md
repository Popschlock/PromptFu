# Profile: Claude Opus 5

Last verified 2026-07-24 against the official "Prompting Claude Opus 5" guide, "What's new in Claude Opus 5" release notes, and the effort documentation. Re-verify on point releases.

## Where Opus 5 fits

- **The workhorse frontier tier: complex agentic coding and enterprise work at half Fable 5's cost** ($5/$25 per MTok, unchanged from Opus 4.8). Strongest on difficult coding: multi-file features, larger refactors, end-to-end feature work. It completes full tasks rather than leaving stubs, and performs best given the complete task specification up front and left to run.
- **Routing target for Fable's safety classifiers, same as Opus 4.8 was.** Security-flavored, bio/life-science, competing-AI-model, and reasoning-visibility tasks go here from the start. The release notes document no Fable-style dual-use classifiers on Opus 5; note Claude Code's automatic mid-run fallback (`switchModelsOnFlag`) was last verified as landing on Opus 4.8 — routing up front to Opus 5 avoids the question entirely.
- **Other headline strengths:** code review and bug-finding (high precision *and* recall, accuracy holds at lower effort), deep reasoning, test-time compute scaling up to `max`, vision (charts/documents/UI replication), 1M-token context (default and maximum) with consistent behavior throughout, office/document generation, and multi-agent coordination.
- Runs well out of the box on existing Opus 4.8 prompts; the deltas below are the tuning that pays.

## Core shift vs Opus 4.8

Opus 5 moved a long way toward Fable-style autonomy: it verifies its own work unprompted, self-corrects, delegates to subagents readily, narrates progress readily, and will expand task scope on its own judgment. The 4.8-era additive scaffolding (verification steps, re-check loops, parallelism nudges) now **over-fires** — the prompting job flips from adding structure to get behavior, to *constraining* behavior you don't want: length, narration, scope, delegation.

## Delete on sight (Opus 4.8-era habits)

- **Explicit verification instructions** ("include a final verification step", "use a subagent to verify") → causes over-verification; removing them saves tokens with no quality loss. Same for legacy harness verification scaffolding.
- **Re-check instructions** ("double-check your answer", "re-verify before responding") → compounds with built-in self-correction; cost without benefit.
- **Parallelism/subagent nudges** ("spawn a subagent per file") → it already delegates readily; the useful instruction now runs the other way (see Always add).
- **"Only report high-severity issues" / "be conservative" in review prompts** → followed literally; the model under-reports. Ask it to report everything and filter in a separate cheap pass.
- **Prompt-side vision workarounds tuned for prior models** → re-validate; likely unnecessary. Tools to iteratively analyze, crop, and verify beat thinking as the vision lever.
- **"Do not think" / "do not reason" rules** in thinking-disabled integrations → increases internal-tag leakage. Use the general form: "Do not include internal or system XML tags in your response" (naming thinking tags specifically is *less* effective).
- **Effort defaults carried from a prior model** → re-run an effort sweep; `low`/`medium` are much stronger on Opus 5.

## Always add (same content set as every target — only the form differs)

The model-agnostic content set still applies in full: intent framing, evidence-audit block, boundaries with explicit exclusions, hard constraints verbatim, maker-never-grader verification for dispatch. On top of that, Opus 5 specifically wants the *constraining* blocks:

- **Length contract.** Default responses and written files run longer than prior Opus models, and effort does not reliably shorten visible output — prompt for length explicitly. Conversational: "Keep responses focused, brief, and concise; spend most of the response on the main answer." In a long system prompt, repeat a one-line tone reminder near the end. Written deliverables: "Match document length to what the task needs; no filler sections, redundant summaries, or boilerplate."
- **Narration cadence.** It narrates agentic work readily; describe the cadence you want rather than saying "don't narrate": one sentence before the first tool call, brief updates only on important finds or direction changes, lead with the outcome when finishing. Positive examples of the style beat "don't" lists.
- **Scope constraint for narrow tasks.** It can widen scope on its own judgment: "Deliver what was asked, at the scope intended. If the request seems mistaken or a better approach exists, say so in a sentence and continue with the task as asked. Finish the whole task, and stop short of actions clearly beyond it."
- **Delegation guidance or caps.** "Delegate only for large, genuinely independent, parallelizable tracks. Don't delegate what you can finish in a handful of tool calls, and don't use subagents to verify your own work. Keep spawn counts low." Set deterministic agent caps for cost-sensitive workloads.
- **Correction-narration limiter (user-facing products).** It narrates self-corrections more than prior models: "Only correct an earlier statement when the error would change the user's code, conclusions, or decisions; fix silent slips and move on."
- **Complete spec up front** for coding/agentic work — it performs best when given the whole task and left to run, not drip-fed steps.

## Dispatch settings

- **Effort:** full ladder `low|medium|high|xhigh|max`, no beta header; API default `high`. Start `xhigh` for coding and agentic work; `high` minimum for other intelligence-sensitive work; `max` only for genuinely frontier problems. `low`/`medium` are the primary cost/latency control and outperform the same settings on prior Opus — use them liberally where evals show quality holds. Effort controls thinking volume, not visible response length.
- **Code review routing:** accuracy holds at lower effort — a fast `low`/`medium` pass at review time plus a thorough pass later is a supported pattern.
- **At `xhigh`/`max`, set a large `max_tokens`** (start 64k): it is a hard cap on thinking plus response text, across subagents and tool calls.
- **Multi-agent:** coordinates subagent teams well; writer-verifier patterns work with few overwrite collisions. Maker-never-grader separation still applies. Cap delegation for cost-sensitive workloads.
- **Long-horizon/long-context:** 1M context is both default and max, 128k max output; instruction following, tool calling, and reasoning stay consistent through the window.
- **Vision tasks:** provide tools to iteratively analyze, crop, and visually verify — more cost-effective than raising thinking.

## Refusal / safety hazards

No Fable-style dual-use classifiers are documented for Opus 5; it remains the destination for security/bio/competing-AI-model and reasoning-visibility routing out of Fable sessions. Server-side fallback gained a `"default"` mode (Anthropic-recommended fallback models per refusal category; beta header `server-side-fallback-2026-07-01`).

## API notes

- Model ID `claude-opus-5` (Bedrock: `anthropic.claude-opus-5`; Google Cloud: `claude-opus-5`). Pricing $5/$25 per MTok, unchanged from 4.8. Fast mode (research preview, Claude API only): $10/$50.
- **Thinking is ON by default** (adaptive; `thinking: {type: "adaptive"}` remains valid and equivalent). Breaking change from 4.8, where thinking was off unless set. Revisit `max_tokens` for workloads that ran thinking-off on 4.8.
- **`thinking: {type: "disabled"}` is accepted only at effort `high` or below** — with `xhigh`/`max` it returns a 400. Prefer keeping thinking on and lowering effort for cost.
- **Thinking-disabled artifacts:** occasional tool calls written as text instead of `tool_use` blocks (mitigation: "You may say a brief sentence before using a tool.") and internal XML tags leaking into visible output (mitigation: the general no-internal-tags instruction; never name thinking tags).
- Prompt cache minimum dropped to 512 tokens (from 1,024). Hold effort constant within cached conversations — changing it invalidates cached prefixes.
- Mid-conversation tool changes (add/remove tools between turns, cache-preserving): beta header `mid-conversation-tool-changes-2026-07-01`.
- `temperature`/`top_p`/`top_k`/`budget_tokens`/prefills: rejected on Opus 4.6+; not re-verified for Opus 5 specifically — assume rejected.
