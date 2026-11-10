# Anthropic family

Verified 2026-11-10 against Anthropic's models overview, "Choosing a model", "Optimizing for cost and intelligence", the effort page, "Prompting best practices", the four current prompting guides, and Claude Code's model configuration and subagent pages.
Sources: https://platform.claude.com/docs/en/models/overview, https://platform.claude.com/docs/en/about-claude/models/choosing-a-model, https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence, https://platform.claude.com/docs/en/build-with-claude/effort, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices, https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback, https://code.claude.com/docs/en/model-config, https://code.claude.com/docs/en/sub-agents
Unverified: which version each Claude Code alias resolves to (the docs do not say, `/model` shows it), and any wording advice for security or life-science prompts beyond the verification programs.

## Models

| Model | ID, Claude Code alias | Card | The docs start it on | API default effort |
|---|---|---|---|---|
| Fable 5.2 | `claude-fable-5-2`, `fable` | `fable-5-2.md` | The highest capability: agent sessions that run for hours, multistep deep research, analysis carried to a finished document | `high` |
| Opus 5.5 | `claude-opus-5-5`, `opus` | `opus-5-5.md` | Most workloads. Complex agentic coding, large refactors, vision-heavy work, computer use | `medium` |
| Sonnet 5.5 | `claude-sonnet-5-5`, `sonnet` | `sonnet-5-5.md` | Everyday coding, agent and enterprise work | `high` |
| Haiku 5.5 | `claude-haiku-5-5`, `haiku` | `haiku-5-5.md` | The lowest latency and price: high-volume processing, subagent tasks | `medium` |
| Fable 5.1, Fable 5, Opus 5, Opus 4.8, Sonnet 5, Haiku 4.5 | their own IDs | `legacy.md` | Only when a dispatch or a request pins one | see the entry |

An alias names a tier. Use the card for the tier's current model unless the request or `/model` says another version is running.

## Dialect

XML-style tags where a prompt mixes instructions, context, examples and inputs (`<context>`, `<constraints>`, `<examples>`). Long documents go near the top and the question at the end. Three to five varied examples where format or tone matters. Say what to do, and never mix in ALL-CAPS section headers.

## Effort

- Every current model takes `low`, `medium`, `high`, `xhigh` and `max`. The table gives each API default. In Claude Code all four current models default to `medium`.
- A level name does not mean the same amount of thinking on two models, so a level tuned on one is not carried to another.
- Lower the effort to get less thinking. A prompt line asking the model to think less does not work on Fable 5.2, Sonnet 5.5 or Haiku 5.5, and the Opus card names the one case where it does.
- Effort does not reliably change reply length. Ask for the length in the prompt.
- Across vendors: OpenAI's reasoning effort uses the same five names. Where a vendor has fewer levels, `xhigh` and `max` map to its top level.

## Thinking cues

- **"Show your reasoning", "explain your chain of thought".** Fable 5.2, Opus 5.5 and Sonnet 5.5 can decline them as `reasoning_extraction`. Remove the request and say so in the report. For an audit trail ask for evidence in the output (the quoted line, the file and line), a short explanation of the answer, or a summary of the actions taken.
- **"Think step by step", "think harder", "double-check twice".** Turn the wish for depth into the effort recommendation and delete the words. A card names the one case where a think-first line helps.

## Hazards

All four current models run safety classifiers. A decline is a normal response with `stop_reason: "refusal"` and a category, and each card lists the categories its model runs. Finding vulnerabilities in source code is allowed, and high-risk dual-use security work is not. Benign security and life-science work can still trip a classifier. Sending a declined request to the same model again usually earns another refusal, so the docs retry it on a fallback model, which the refusals page names per model. A `reasoning_extraction` decline comes from a prompt that asks for reasoning in the output, and the fix is to take that request out. An organization blocked on legitimate work can apply to Anthropic's verification programs.

## Routing

- **Tune effort before switching models.** The docs call effort often a better lever than a model change.
- **Opus 5.5 at its default effort** is where most workloads and most agent work start.
- **Fable 5.2** when Opus 5.5 at `xhigh` or `max` still falls short on demanding reasoning or long-horizon agentic work, or the work is an hours-long session, multistep research, or analysis carried to a finished deliverable.
- **Sonnet 5.5** for well-specified everyday building. For the hardest long-horizon work the Sonnet guide itself points at an Opus model.
- **Haiku 5.5** for high-volume and latency-sensitive work with checkable outputs, and for subagent tasks.
- **Subagents one tier down** pay off on work larger than one context window: Opus 5.5 with Sonnet 5.5 subagents cost about a third less than Opus 5.5 alone at about the same score. On one dependent chain, or work that fits one context, the orchestrator's model alone at lower effort came out ahead.

Any pick below the configured session model or effort is a recommendation under the effort floor in `SKILL.md`.

## Dispatch in Claude Code

- The Agent tool's `model` takes `sonnet`, `opus`, `haiku` or `fable`, never a full ID. A call that sets none resolves through the agent definition, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the session model. A fork inherits everything.
- The Agent tool also takes `effort` on a non-fork call (Claude Code 2.1.292 or later). A subagent on a different model than the session runs at that model's own default when no effort is passed, so set it on the call whenever the tier changes.
