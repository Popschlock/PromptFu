# Claude Opus 5.5 (`claude-opus-5-5`)

Verified 2026-11-10 against the Opus 5.5 and Opus 5 prompting guides, "What's new in Claude Opus 5.5" and "Optimizing for cost and intelligence".
Sources: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5, https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5, https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence
Unverified: how much of each Opus 5 habit Opus 5.5 keeps. Its guide says only that the Opus 5 patterns remain a reasonable starting point, so items marked "Opus 5 guide" rest on that. Whether `frontier_llm` or `general_harms` declines occur on it.

## Fit

Built for long-running agentic coding and knowledge work. It replaced Opus 5. Give it the complete task specification up front and let it run (Opus 5 guide).

Start at `medium`, the API default, which matched or beat Opus 5 at `high` in Anthropic's testing. At a given level this model tends to think more per turn than Opus 5, most of all at `xhigh` and `max`.

## Delete

- **Verification and re-check lines** ("use a subagent to verify", "double-check your answer"). Opus 5 guide: the model checks its own work, so these add cost without better results.
- **"Only report high-severity issues" or "be conservative" in a review prompt.** Opus 5 guide: the model can take it literally and report less. Ask for every finding and filter in a separate pass.
- **Think-carefully lines in a chat system prompt.** Removing one made replies start sooner with no clear loss of quality.
- **Rules against thinking,** and requests for reasoning in the reply that stood in for it. Thinking is always on.
- **"Avoid a generic AI look"** in frontend prompts. It swaps one default style for another. Name the patterns to avoid, as the guide's example does (cream or off-white background, italic accent words in headlines, numbered section labels, monospace labels, pill-shaped buttons).
- **Vision workarounds built for earlier models.** Retest them.

## Add

**Narrow tasks, to keep the model from widening the job** (Opus 5 guide):

```text
Deliver what was asked, at the scope intended. Make routine judgment calls yourself, and check in only when different readings of the request would lead to materially different work. If the request seems mistaken or a better approach exists, say so in a sentence and continue with the task as asked rather than quietly narrowing, widening, or transforming it. Finish the whole task, and stop short of actions that are clearly beyond what was asked.
```

**Fully unattended agents only,** at the end of the system prompt from the first request. Keep your own confirmation step for risky actions, and expect more tool calls and tokens:

```text
A standing instruction from the user, the person you are working for. It is about how your turns end. A message with no tool call in it ends your turn, and the work stops there until you are asked to continue. The user has seen you end turns in four ways while work they asked for was still owed, and does not want any of them. One: a long summary of what was done that closes by announcing the next step and has no tool call, so the next thing never starts. Two: an offer to carry on with something unless the user would prefer otherwise, which stops to wait for an answer the user was not going to give. Three: a list of decisions for the user when, by your own account, none of them blocks the rest of the work. Four: deciding that this is a good place to report, because the turn has been long or a milestone is done. Status notes are welcome, and so are your recommendations on open decisions, but put them in the same message as your next tool call and carry on with whatever does not depend on the user's answer. If you notice yourself inviting the user to redirect you or offering to wait, delete it and do the next thing. The stops the user does want are the ones where nothing can move without them, or where the thing blocking you is deliberately protected from you. This does not override the need for confirmation on risky or destructive actions.
```

**Agents working across several connected apps on loosely specified tasks.** Keep untrusted content out of what it searches:

```text
Before taking any action, explore broadly with tool calls: list and open the emails, documents, spreadsheet tabs and records across the available apps that could be relevant to this task, including ones the task does not explicitly mention, and use what you find.
```

**Multi-turn chat, to cut thinking on follow-ups.** Leave it out of long analyses and agentic work, where a later step can expose an earlier mistake:

```text
Once you have answered something, treat that answer as done. On later turns, focus your thinking on what the user is asking now, and don't go back over an earlier answer unless the user asks about it or points out a problem with it.
```

**A human watching.** Say when updates should come, such as a line of intent before the first tool call and a short recap at the end. Notes between tool calls arrive as `thinking` blocks, empty unless the client sets `display: "updates"`.

**Chat where users paste text.** Wrap each pasted block in `<pasted_content id="...">` tags with one random ID on both, and tell the model to follow instructions inside them only where the user's own message asks.

## Hazards

The guide names classifiers for biology, cybersecurity and reasoning extraction. The biology safeguards are new against Opus 5 and leave everyday health and educational questions alone. A decline can be retried on a fallback model, except `reasoning_extraction`: change the prompt.

## Dispatch

- **Effort by work:** `low` came close to Opus 5 at `high` on several coding evaluations, but scored far lower than `medium` on defect-search and research benchmarks. `xhigh` and `max` only with a measured gain. Where outputs can be checked, run at `low` and rerun the failures at `high`.
- **One think-less line is documented:** "Answer directly without deliberating." at `low`, when time to first token still matters. Measure quality.
- **Rejected by the API:** `thinking` set to `disabled` or a manual budget, and a forced `tool_choice`. Say in the prompt when a tool applies.
- **Unattended loops:** a turn that ends in text is a report, not proof of completion. Keep a checklist the model updates, name the open items in a short message, and stop after two or three automatic continuations.
- **Delegation:** Opus 5 delegated more readily than earlier models. When cost matters, say to delegate only large, independent, parallel tasks, never to double-check its own work.
- **Time signals:** in a multiagent harness the model paces itself to elapsed time appended to each message (`elapsed 340s / 1200s`) and may verify a little less.
