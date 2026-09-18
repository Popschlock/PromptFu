# Playbook: short-run prompts

One question, one reply, one edit, one label on one artifact. The model answers in a single turn
with no tools or one read. This playbook exists because the biggest token waste in the wild is a
sixty-word question wrapped in two hundred words of role play, reasoning cues and verbosity rules.
The rewrite of a short-run prompt should be smaller than the draft.

Last verified 2026-09-18 against the PrompTessor reasoning-model, prompt-debugging and GPT-6 Astra
guides, the Gemini 3 developer guide and OpenAI's prompt-engineering guide.
Sources: https://developers.openai.com/api/docs/guides/prompt-engineering,
https://ai.google.dev/gemini-api/docs/gemini-3,
https://promptessor.com/blog/reasoning-model-prompting-guide,
https://promptessor.com/blog/prompt-debugging-guide,
https://promptessor.com/blog/gpt-6-astra-prompting-guide

## When this playbook applies

Trigger shapes: "what is", "explain", "rewrite this paragraph", "translate", "summarize this one
file", "classify this ticket", "fix this regex", "draft a two-line reply". The request has one
deliverable, the model already holds or is handed everything it needs, and nobody expects it to
run commands, verify results or come back later.

Nearest neighbour: `tasks/long-run-agentic.md`. The separating rule: if finishing needs more than
a handful of tool calls, a verification step, a stop condition or a decision about what to do
next, it is a long-run task in a short draft and gets that playbook. If the answer feeds a program
rather than a person, use `tasks/structured-output.md` instead.

## Required blocks

- TASK, required. One sentence naming the outcome, with the audience or purpose as a clause when
  it changes the answer ("for a first-time user", "for the changelog"). Intent lives here as a
  clause. It never gets its own block on a short-run prompt.
- CONTEXT, conditional. Only facts the answer depends on that the model cannot see: the paragraph
  to edit, the ticket text, the version in use. Leave it out when the task carries the input.
- OUTPUT, required. The shape and the size as a number: words, sentences, items, rows. Add what to
  return when the answer is not knowable ("say so in one line") so the model does not invent one.

Hard constraints (a format, a scale, a field name, a count) stay verbatim inside TASK or OUTPUT.
Universal techniques still apply in miniature: say what to do rather than what to avoid, and give
one example only when the format cannot be described in a sentence.

## Delete

- Role preambles ("You are a world-class editor") and flattery. They buy nothing on current
  models and cost twenty tokens each.
- "Think step by step", "think carefully", "take a deep breath". Depth is the effort setting.
  Translate a real depth request into the effort recommendation and drop the words.
- Stacked verbosity rules ("be concise, be very concise, do not be verbose"). Replace with a
  number. The debugging guide's fix is the model: "Return 180 to 220 words. Use exactly 3 short
  paragraphs. Do not include a separate conclusion."
- Autonomy, verification, stop-condition and progress-update scaffolding. Those belong to
  long-run prompts and make a short one slower.
- Rules the harness already enforces (the system prompt's tone, the project's `AGENTS.md`).
  Repeating them adds tokens and, on GPT-6 Astra, creates instruction conflicts.
- "Do not hallucinate" as a standalone line. If freshness or grounding matters, say which source
  to use or what to return when the fact is unknown.
- Examples of the obvious. Keep an example only for a format the model would otherwise guess.

## Token rule

The rewrite comes out shorter than the draft. The one justified growth is a missing hard
constraint the draft implied and never stated: a length, an audience, a format, a language. Add
that as one line. Never add a block so the prompt looks complete.

Effort: recommend `low` for retrieval, reformatting and single labels and `medium` for a short
answer that needs a judgment call. Surface it as a recommendation. The skill's effort floor
applies, so the configured level stays unless the user takes the lower one.

## Template

```
TASK
<one sentence: the outcome, with the audience or purpose as a clause>

CONTEXT
<only the input the model cannot see, delimited if it is prose>

OUTPUT
<shape>, <size as a number>, <what to return if the answer is unknown>
```

Two blocks are enough when the input is in the task sentence. Never more than three.

## Per-vendor notes

- Anthropic: see `models/anthropic/_family.md`. At `low` effort Fable 5.1 answers from memory
  and searches less, so add its one-line search nudge when the question turns on a current name or
  version, per `models/anthropic/fable-5-1.md`.
- OpenAI: see `models/openai/_family.md`. Set `reasoning.effort` to `low` for the mechanical
  case. GPT-6 Astra has no `none`. Astra defaults to formatted, detailed replies, so the OUTPUT
  size number is the block that does the work.
- Google: see `models/google/_family.md`. Gemini 3 answers efficiently by default and
  over-analyzes old-style verbose scaffolding, so the short form suits it. Use `thinking_level`
  `low`, or `minimal` on Flash-Lite. Ask explicitly when you want a longer or chattier answer.
- Chat apps (ChatGPT, claude.ai, the Gemini app): no effort parameter exists, so the size number
  in OUTPUT is the only length control. Put it last.

## Check before sending

- Is TASK one sentence that names the outcome?
- Is the size in OUTPUT a number, or an exact shape?
- Did the rewrite come out shorter than the draft, or is the one added line a missing constraint?
- Does every hard constraint from the draft appear verbatim?
- Would finishing this need tools, verification or a next-step decision? If yes, switch to
  `tasks/long-run-agentic.md`.
