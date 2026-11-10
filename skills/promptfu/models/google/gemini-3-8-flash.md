# Gemini 3.8 Flash (`gemini-3.8-flash`)

Verified 2026-11-10 against "What's new in Gemini 3.8 Flash", the Gemini 3.8 Flash model page, "Prompt design strategies", the computer use page and the archived Gemini 3.5 Flash guide.
Sources: https://aistudio.google.com/docs/whats-new-gemini-3.8, https://aistudio.google.com/docs/models/gemini-3.8-flash, https://aistudio.google.com/docs/prompting-strategies
Unverified: this model's knowledge cutoff. The guide's Flash clause says January 2025 and no 3.8 Flash page confirms it, so the clause is left out.

## Fit

Google's recommended default and its most intelligent Flash model: everyday apps, long-horizon software engineering, autonomous coding agents, multimodal enterprise workflows. Start at `medium`, the default. It replaced Gemini 3.7 Flash, whose ID now routes here, and `gemini-2.5-pro` requests route here from 2026-12-01.

## Delete

- **`thinking_level: "minimal"`.** Not supported here, and it returns an error. Use `low`.
- **`thinking_budget`.** Replace it with `thinking_level`.
- **`temperature`, `top_p`, `top_k`, `candidate_count` and prefilled model turns.** The family file's hazards say why.

## Add

**Search tools and time-sensitive questions.** In the system instruction, with the year kept current:

```text
For time-sensitive user queries that require up-to-date information, you
MUST follow the provided current time (date and year) when formulating
search queries in tool calls. Remember it is 2026 this year.
```

**Answers that must come only from supplied context.** In the system instruction, edited to fit the task:

```text
You are a strictly grounded assistant limited to the information provided in
the User Context. In your answers, rely **only** on the facts that are
directly mentioned in that context. You must **not** access or utilize your
own knowledge or common sense to answer. Do not assume or infer from the
provided facts; simply report them exactly as they appear. Your answer must
be factual and fully truthful to the provided text, leaving absolutely no
room for speculation or interpretation. Treat the provided context as the
absolute limit of truth; any facts or details that are not directly
mentioned in the context must be considered **completely untruthful** and
**completely unsupported**. If the exact answer is not explicitly written in
the context, you must state that the information is not available.
```

**Agents that retry failed tool calls.** A rule from the agent system instruction in the same guide:

```text
On *transient* errors (e.g. please try again), you *must* retry **unless an explicit retry limit (e.g., max x tries) has been reached**. If such a limit is hit, you *must* stop. On *other* errors, you must change your strategy or arguments, not repeat the same failed call.
```

**Too many tool calls.** Lower the thinking level first. If that is not enough and the author gives a number:

```text
You have a limited action budget of <n> tool calls. Use them efficiently.
```

## Hazards

None documented for this model beyond the family file's.

## Dispatch

- **Level by work:** `low` for latency-critical work such as real-time chat, drafts, fast data analysis and incident response. `medium` for most tasks, and Google's pick for complex code and agents. `high` for deep reasoning, math and difficult multi-step tasks.
- **It spends more tokens on long, complex tasks by design:** smaller reasoning steps, iterative tool calls, checks along the way. For everyday tasks lower the level. Gemini 3.6 Flash is the documented alternative.
- **Limits.** 1,048,576 tokens in and 65,536 out, thinking included.
- **Tools.** Google's recommended model for computer use, and the Antigravity agent's default. Function calling, structured outputs, code execution, file search, URL context, and Search and Maps grounding work. Text out only.
