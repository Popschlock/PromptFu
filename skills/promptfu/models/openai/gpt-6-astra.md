# GPT-6 Astra (`gpt-6-astra`)

Verified 2026-11-10 against the pages under Sources.
Sources: https://developers.openai.com/api/docs/ (guides/latest-model/gpt-6-astra, models/gpt-6-astra, guides/model-selection, guides/reasoning, guides/tools-computer-use, guides/safety-checks/misalignment-monitoring), https://learn.chatgpt.com/docs/models, https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra
Unverified: a default `reasoning.effort` (the model page states none).

## Fit

OpenAI's most capable model, for complex reasoning, coding, computer use, research and document creation. The API docs start here when unsure, and the Codex docs keep it for the hardest end-to-end work.

Start low: the Codex docs say Light (`low`), and the model selection guide pairs Astra with Low for concise writing, Medium for ambitious projects and Extra high for demanding analysis. None of the pages read says to start at `high`.

## Delete

- **Strong ask-first language from earlier models.** Astra can take it too seriously and stop where you wanted it to go on.
- **Orders to run tests or check its work.** Astra does that unprompted, so they cause extra testing.
- **"Read these files before every edit."** It burns context. Point to each doc for the case it serves.
- **Step-by-step recipes.** Overly specific guidance now hinders results.
- **A stop for review after the first implementation,** unless needed. It pulls the model toward stopping early.
- **Unclear or conflicting guidance in skills and `AGENTS.md`.** Astra may pause on it.

## Add

**Unattended work,** when the model asks where it should assume and continue:

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

**Approval after the work.** A further block says to treat "can you..." and "help me..." as instructions to act, not to stop at a plan or a partial result:

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

**Skills in context.** To trace a pause, also ask it to name the skill file it read and quote the instruction:

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

**Prose output,** since Astra leans on lists, tables and Markdown. The guide adds a plain-language block and a blocklist of stock phrases:

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

**A multi-agent harness,** since Astra may delegate too little. Add that messages between agents must be legible to a person:

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

**Coding,** since Astra can test more than a small change needs:

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

**Long tasks.** Define done before starting. If it includes running the result and fixing what fails, say so, and say what to explore and where to stop.

## Hazards

Astra agent workflows are monitored for misalignment in consequential contexts. A stopped request returns HTTP 403 with code `misalignment_policy_violation`, cannot be resumed and does not undo earlier actions, so keep human approval for consequential actions. Reduced refusals for security work need Daybreak Red access.

## Dispatch

- **Effort.** `low` to `max`. `none` returns HTTP 400, so use `low`.
- **API calls.** Tool calling needs the Responses API. Remove `temperature`, `top_p` and `top_logprobs`.
- **Delegation.** Say how and when to delegate. In Codex, `ultra`, where offered, adds proactive subagents.
- **Computer use.** OpenAI recommends code execution for Astra (the model writes code that drives the interface) over the `computer` tool.
