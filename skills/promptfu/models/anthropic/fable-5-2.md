# Claude Fable 5.2 (`claude-fable-5-2`)

Verified 2026-11-12 against "Prompting Claude Fable 5.2", "Choosing a model" and the Fable 5.2 model page.
Sources: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2, https://platform.claude.com/docs/en/about-claude/models/choosing-a-model, https://platform.claude.com/docs/en/models/fable-5-2/overview
Unverified: whether the Fable 5.1 habits this guide does not repeat (the batching nudge, the search nudge at `low`, the formatting rule) still apply, so they are left out.

## Fit

Anthropic's highest-capability model open to all customers. The docs start most workloads on Opus 5.5 and name Fable 5.2 for agent sessions that run for hours, multistep deep research, and analysis carried through to a finished document, spreadsheet or deck. Mythos 5.2 is the same model for organizations verified through Anthropic's programs.

Start at `high`, the API default, and rerun the effort sweep instead of carrying a level over from Fable 5.1 or Opus 5.5.

## Delete

- **Requests to write reasoning into the reply** ("show your reasoning", "explain your chain of thought"). They draw `reasoning_extraction` declines. Read summarized thinking, or ask for evidence in the output.
- **Think-less lines** ("answer directly without deliberating"). They do not stop thinking at `medium` and above. Lower the effort.
- **Standing instructions to delegate**, when the model starts more subagents than the task needs.
- **A token budget written into the prompt** (how many tokens the task may use, how many are left). Its size changes how much the model spends, and removing a large one lowered cost at the same performance.
- **The "treat that answer as done" pair** from Opus 5.5 chat prompts, wherever the model should keep catching its own earlier mistakes.
- **Hard style limits** ("one instruction per sentence, in 20 words or fewer"). The model obeys them and the prose turns choppy.
- **Cautions that have piled up** in memory, notes, instruction files and messages between agents. Drop the ones whose reason is gone, and rewrite an absolute rule so it states its scope and reason.
- **A bare "continue" or "go" as an approval.** Say what is approved: "Yes, run the migration on the staging database."

## Add

**Long or unattended runs, most of all at `low` and `medium`,** where turns end early with a list of what remains or an offer to continue. This cut such endings by about half in Anthropic's replay and raised output tokens by about 30 percent. Keep your own confirmation step for risky actions:

```text
# Finishing work
Please avoid stopping while you still owe work the user asked for. Be persistent and do not stop unless needed.

While status notes are welcome, as is clarifying with the user on open decisions, carry on with work that does not depend on the user's answer without unnecessary stops.

If you notice yourself inviting the user to redirect you or offering to wait, instead proceed on the next part of the task. You may meet ordinary obstacles like errors, timeouts, locked files, empty results or failing tools. Diagnose them first, and when they are not real blockers, work through them with the access you have (wait and retry, fix the request, use another tool or source) rather than stopping unnecessarily.

If someone clearly decided something is a hard blocker, such as a file marked not to be touched, access that was intentionally withheld, or a safety guardrail, leave it alone, say plainly what you found, and look for another safe way to finish the task. Stopping before the task is complete is very rarely merited, as in when the task can't move forward without user input, or where the blocker is deliberate and should not be worked past. This does not override the need for confirmation on risky or destructive actions.
```

**Approval rules.** Name the exact actions a rule covers, because the model follows it closely. It treats "never" as absolute, so where the model should still be able to act, write "ask for approval before deleting files", not "never delete files". List the routine steps that need no approval, since "act more freely" is too vague.

**Coding where the model should improve structure as it works.** Without this it adds to the existing structure and reports problems instead of fixing them. With it, expect about 70 to 80 percent more output tokens and changes nobody asked for, so review the diff. Leave it out when the user owns the code and wants it changed as little as possible:

```text
You are the owner and long-term maintainer of this codebase, and its design is up to you.
```

**A human watching the work:**

```text
Before you start, say in a line what you're about to do; brief updates while you work help the user follow along. Close with a short recap that stands on its own (what you found, what you did, and what's next), so a reader who only sees the last message has the full picture.
```

When the harness cannot send reminders:

```text
Every few tool calls, give the user a one-line update on where things stand.
```

**Final reports and handoffs after long work:**

```text
# Communicating clearly
Write for an intelligent but low-context reader. The person reading has not seen your tool calls, your reasoning or the files you opened, and may be switching in from other work. Messages should generally be self-contained: the reader should understand what you mean without having to dig for other context. Put the key points in the first few sentences. Practice progressive disclosure in your sentence order, and do not use undefined references and ideas in line 1 that won't make sense until the reader reaches line 12.

Use plain words, and write in clear, understandable full sentences. Do not use a term or abbreviation that you made up during the work. Say what the thing is in a way any reader would understand. Write mostly in the style of ASD-STE100 Simplified Technical English: short sentences, one idea per sentence, active voice, and consistently using the same word for the same thing. Use a paragraph of flowing prose where ideas connect, and keep bullets for lists of separate items. Leave out unnecessary details unless the reader asks and practice concision, but do ensure that your messages have the key context. Aim to make your user-facing text as human-readable and clear as possible.
```

## Hazards

Declines arrive as `stop_reason: "refusal"` with a category: `cyber`, `bio`, `frontier_llm`, `reasoning_extraction` or `general_harms`. Benign security and life-science work can trip `cyber` and `bio`. An organization blocked on legitimate work can apply to Anthropic's verification programs.

## Dispatch

- **Effort by work:** `low` for quick back-and-forth, well-specified tasks and fast subagents. `medium` for interactive coding, chat and everyday knowledge work. `high` for hard coding, research, agentic work and long unattended runs. `xhigh` only with a measured gain. `max` for the rare task where time and tokens do not matter.
- **Length is a prompt matter.** Effort barely changes how long replies are, and at `high` and above the model thinks before almost every reply. Use a lower effort for easy turns.
- **Delegation follows the harness.** Where prompts invite it the model delegates readily, and at `xhigh` and `max` it may start subagents to review its own work. Subagents can be a large share of a session's cost, so check which model they run on.
- **Change instructions in new conversations only.** Editing a system prompt or an earlier turn mid-conversation can fail the next request. Put a new instruction in the newest turn.
