# Gemini 4 Argon (`gemini-4-argon`)

Verified 2026-11-10 against "What's new in Gemini 4 Argon", the Gemini 4 Argon model page, the long decode guide, the thinking guide, the context caching page and the Gemini CLI README.
Sources: https://aistudio.google.com/docs/whats-new-gemini-4-argon, https://aistudio.google.com/docs/models/gemini-4-argon, https://aistudio.google.com/docs/long-decode, https://aistudio.google.com/docs/caching, https://raw.githubusercontent.com/google-gemini/gemini-cli/main/README.md
Unverified: the knowledge cutoff, what the API does with `thinking_level: "minimal"`, and whether the prompting guide's Gemini 3 section holds unchanged. The guide has no Gemini 4 section, and this card assumes the family file's dialect applies.

## Fit

Google's flagship reasoning model and its most capable: complex software engineering, hard math and science, autonomous multi-step agents, and single replies of up to 1M tokens. The docs start everyday apps and agents on Gemini 3.8 Flash and name Argon for complex reasoning. Start at `medium`, the default. The docs name no model it replaced, and Gemini 3.1 Pro preview stays listed as a preview.

## Delete

- **`temperature`, `top_p`, `top_k`.** Ignored. Remove them.
- **A word-count or token-length target on a long output** ("write a 700,000-word book"). The model does not follow length targets and decides how much to write.
- **A small `max_output_tokens` set to save tokens.** It cuts the reply off without shortening the thinking. Google says to raise any value under 32,768, because Argon can spend more of the limit on thinking than earlier models. Lower the thinking level instead.
- **Explicit cache calls** (`caches.create`, `cached_content`). Not supported. Implicit caching is automatic for prompts of 4,096 tokens or more.
- **A short client timeout.** Hard prompts can take several minutes. Run in the background or allow at least 15 minutes.

## Add

**Hard math, science, formal proofs and the hardest coding tasks, when one reply needs more than 64K tokens of thinking and output.** Use long decode: `background: true`, `thinking_level` at `high`, and `max_output_tokens` at 131,072 or 262,144 (at most 1,048,576 minus the input). State the outcome wanted and no length.

**Large or repeated context.** Put the large shared content at the start of the prompt, so implicit caching can hit, and the changing question at the end.

**Multi-turn and tool-calling work.** Keep the conversation state on the server with `previous_interaction_id`.

**Agents that retry failed tool calls.** A rule from the agent system instruction in Google's prompting guide:

```text
On *transient* errors (e.g. please try again), you *must* retry **unless an explicit retry limit (e.g., max x tries) has been reached**. If such a limit is hit, you *must* stop. On *other* errors, you must change your strategy or arguments, not repeat the same failed call.
```

Google publishes no prompt guidance written for Argon. That rule and the family file's dialect come from the general prompting guide.

## Hazards

None documented for this model beyond the family file's.

## Dispatch

- **Level by work:** `low` for simpler and cost-sensitive tasks, and for analysis and writing that need light thinking. Quality can drop on hard tasks. `medium` for most tasks, including complex code and agent work. `high` for complex reasoning, hard math and science, and the most difficult code or agent tasks.
- **Pick the level by test.** Google's advice is to run the evaluation at all three levels and keep the lowest one that meets the quality bar.
- **One shared window.** Input, thinking and output share 1,048,576 tokens. A reply stops at 65,536 unless long decode is on, and when input plus `max_output_tokens` exceeds the window the API caps the output to what is left.
- **Long decode is the wrong tool** for chat, Q&A, summarization, classification and extraction, for agents that call tools in many short turns, for prompts near the input limit, and for latency-sensitive requests.
- **Not available on the free tier.**
- **Text out only.** It reads text, images, video, audio and PDFs, and supports function calling, structured outputs, code execution, computer use, file search, URL context, and Search and Maps grounding. No image or audio generation and no Live API.
- **Managed agents.** The Antigravity agent runs it when `agent_config.model` is `gemini-4-argon`.
- **Gemini CLI is not tuned for the Gemini 4 series,** its README says, and it points Argon users at the Antigravity CLI.
