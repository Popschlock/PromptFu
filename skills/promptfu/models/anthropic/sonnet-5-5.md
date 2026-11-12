# Claude Sonnet 5.5 (`claude-sonnet-5-5`)

Verified 2026-11-12 against "Prompting Claude Sonnet 5.5", "Choosing a model" and the Sonnet 5.5 model page.
Sources: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5, https://platform.claude.com/docs/en/about-claude/models/choosing-a-model, https://platform.claude.com/docs/en/models/sonnet-5-5/overview
Unverified: none.

## Fit

The everyday tier: code generation, data analysis, content, agentic tool use. Sonnet 5 prompts should work unchanged. For the hardest long-horizon work the guide points at an Opus model.

The API default effort is `high`. For agentic coding and multistep tool use, start at `medium` on well-specified tasks and `high` on harder or longer ones. For chat and latency-sensitive work, start at `medium` or `low`. Rerun the sweep, because a level does not mean what it did on Sonnet 5.

## Delete

- **Requests to put reasoning in the reply.** They invite `reasoning_extraction` declines. A short explanation of the answer or a summary of the actions taken is still fine to ask for.
- **Lines that tell the model to think less or not to think.** They do not reliably reduce thinking, and with thinking set to `between_tools` they make the model write internal tags into its visible output. Lower the effort.
- **"Hold all findings for the final response"** and similar narration suppressors. The model reports progress on its own, and you can ask for a set point for updates instead.
- **Language that discourages tools** ("only use tools when strictly necessary", "minimize tool calls"). The model then answers from training knowledge where a search would catch what changed.
- **A token or budget countdown after every tool result,** in sessions where users type mid-turn. Text that keeps arriving after tool results can be taken for a prompt injection.

## Add

**Agentic coding at `low` or `medium`, when the model checks in before the work is done.** Sessions then run longer and cost more. To stop unrequested tests, docs and files only, add just the second paragraph:

```text
Keep working until everything the user asked for is done, and only stop to ask when you can't go on without the user or before a risky step.

When the work the user asked for is done and checked, stop and report. Don't add features, tests, files, docs, or refactors that weren't asked for. If you think one would help, mention it at the end instead of doing it.
```

**Work at `xhigh` or `max`,** where the model starts its own review rounds and reviewer subagents. In testing at `max` this cut session cost by about a third with no change in quality:

```text
When the work the user asked for is done and its checks pass, stop and report. Don't start extra rounds of review or hardening on your own, and don't launch reviewer subagents unless the user asked for a review. If you think a deeper review is worth doing, say so at the end.
```

**Open-ended requests where ideas should come before building:**

```text
When the user asks for ideas, options, or a plan, give them that and stop. Don't start building or changing anything until they say to go ahead.
```

**A JSON answer that needs a few steps of working out** (totaling figures, applying a rule, ranking), with structured outputs and adaptive thinking. Put this at the end of the system prompt, or run the request at `xhigh`:

```text
Think the problem through before you answer.
```

**A product that gives the model a search tool:**

```text
Use the search tool to check specifics that may have changed since your training, such as what is allowed, required, or charged, even when you feel confident. For researched work such as a report or a comparison, gather current sources rather than writing from your training knowledge.
```

**Coding at `low`, when changes are reported done with no test or build output:**

```text
When you change code that can be run, built, or type-checked, run a real check that exercises the change before reporting it done: the project's tests, type-checker, or build, or the changed command itself. A syntax-only check, or a check command that failed to start, does not count; if all that is missing is the project's declared dependencies, install them with its own package manager and lockfile (for example, npm install or pip install -r requirements.txt), never through sudo or the system package manager, unless told not to. Only if no real check can run here, say which one you did not run and why instead of reporting the change as done.
```

**Dense charts and technical drawings.** Give the model a way to crop, zoom or run code on the image. On charts that helps more than raising effort.

## Hazards

Declines arrive as `stop_reason: "refusal"` with a category: `cyber`, `bio`, `frontier_llm`, `reasoning_extraction` or `general_harms`. Finding vulnerabilities in source code is allowed, and high-risk dual-use security work is not. Benign work can trip `general_harms`. Server-side fallback, when turned on, retries `cyber` and `frontier_llm` declines on Sonnet 5 and nothing else.

## Dispatch

- **Thinking counts toward `max_tokens`** even when it is not returned, so a limit sized for a no-thinking request cuts replies short. The guide uses 128,000 for agentic coding.
- **`thinking: disabled` is rejected.** The lowest setting is `between_tools`, accepted at `high` or below, and under it a request with no tools gets no thinking at all. Use adaptive thinking for reasoning tasks.
- **Lower effort changes the work.** At `low` the model can skip verifying a change, and at `low` and `medium` it stops to check in more on long tasks. At `xhigh` and `max` it is thorough to the point of self-started review.
- **Mid-turn user input goes in a user turn,** after the last tool result, never inside a tool result. Harness notices go in a separate system message.
