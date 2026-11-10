# Anthropic legacy models

Verified 2026-11-10 against the five legacy prompting guides, the Haiku 5.5 guide, each model's overview page, and the fallback-credit and migration pages.
Sources: pages under https://platform.claude.com/docs/en/: build-with-claude/prompt-engineering/prompting-claude-fable-5-1 (and -fable-5, -opus-5, -opus-4-8, -sonnet-5, -haiku-5-5), build-with-claude/fallback-credit, models/<model>/overview, models/opus-5-5/migration-guide (and fable-5-2, haiku-5-5)
Unverified: which refusal categories Opus 4.8 and Sonnet 5 run (no page lists them), any prompting advice for Haiku 4.5 (it has no guide), and whether a current card's additions help on a legacy model.

All six are still served. For a pinned one, read the current card of its tier, then change what its entry lists.

## Fable 5.1 (`claude-fable-5-1`)

Legacy, retires no sooner than 2027-09-01.

- Think-less lines usually work here.
- At `low` it searches less and answers from memory. At `xhigh` and `max` it can draft a long deliverable twice, so write those at `high`.
- Its guide deletes anti-formatting rules, because it under-formats in chat.
- Its guide adds a nudge to batch independent tool calls in coding loops, "Please remove all mannered prose." for dense writing, and targeted edits over whole-file rewrites.
- Refusals: same categories as Fable 5.2. False positives rise with compile-check phrasing (ask about bugs instead), lesser-known languages with no context, and base64 in tool output.

## Fable 5 (`claude-fable-5`)

Legacy, retires no sooner than 2027-06-09.

- Effort: `high` for most tasks and `xhigh` for the most capability-sensitive.
- Its guide says to use subagents often and keep working while they run. The Fable 5.2 card deletes such lines.
- Delete a remaining-token countdown, which makes it offer to stop or hand off. For long autonomous runs, add a check of each progress claim against a tool result.
- Refusals: classifiers for offensive cybersecurity, biology and life sciences, and reasoning extraction. Its guide names Opus 4.8 as the fallback.

## Opus 5 (`claude-opus-5`)

Legacy, retires no sooner than 2027-07-24.

- Start at `high`, its API default. Use `low` and `medium` freely where quality holds, `xhigh` for demanding coding and agentic work.
- Thinking is on by default and can be turned off at `high` or below. Off, it can write a tool call as text or leak internal tags, so prefer thinking on at `low`.
- Notes between tool calls arrive as ordinary text, and it narrates readily.
- The Opus 5.5 card's "Opus 5 guide" items were written for it. Its other Add items are for Opus 5.5 only.
- Refusals: `cyber` and `reasoning_extraction`, with biology safeguards new on Opus 5.5. A permitted fallback target for the Fable models and Opus 5.5. Its own is Opus 4.8.

## Opus 4.8 (`claude-opus-4-8`)

Legacy, retires no sooner than 2027-05-28.

- Start at `xhigh` for coding and agentic work, and at least `high` for other intelligence-sensitive work.
- Thinking is off unless the request sets `thinking: {type: "adaptive"}`.
- It follows effort and instructions literally. If it under-thinks at `low` or `medium`, raise effort, or at `low` add "This task involves multistep reasoning. Think carefully through the problem before responding." State the scope of a broad rule.
- It favors reasoning over tool calls and spawns fewer subagents: say when to use tools and when to fan out.
- Refusals: real-time cybersecurity safeguards date from Opus 4.7. A permitted fallback target for the Fable models, Opus 5.5 and Opus 5.

## Sonnet 5 (`claude-sonnet-5`)

Legacy, retires no sooner than 2027-06-30.

- Start at `high`, the default, for agentic coding too, and use `xhigh` for the hardest tasks.
- Thinking is on by default and can be turned off at any effort. Off, it reaches for tools less.
- Its guide gives a line that steers thinking down, so think-less lines can stay. At `low` it also gives the Opus 4.8 think-first line.
- Literal like Opus 4.8: state the scope of a broad rule.
- Refusals: it is the permitted fallback target for Sonnet 5.5.

## Haiku 4.5 (`claude-haiku-4-5-20251001`, alias `claude-haiku-4-5`)

Legacy. Its retirement floor, 2026-10-15, has passed.

- No effort parameter, so set none. Thinking is manual, with a token budget.
- 200K context and 64K output.
- It accepts a prefilled assistant turn when thinking is off.
- Refusals: none documented. The Haiku 5.5 guide calls classifier refusals new for anyone coming from this model.
