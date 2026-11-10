# Google family

Verified 2026-11-10 against Google's latest models page, prompt design guide, thinking guide, What's new guides for Gemini 3.6, 3.8 and 4 Argon, and function calling, safety settings, Deep Research and deprecations pages.
Sources: https://aistudio.google.com/docs/latest-model, https://aistudio.google.com/docs/prompting-strategies, https://aistudio.google.com/docs/deep-research
Unverified: Deep Think. The API docs give it no model page, ID or thinking level, so it is not routed here.

## Models

| Model | ID | Card | Use it for | Thinking levels |
|---|---|---|---|---|
| Gemini 4 Argon | `gemini-4-argon` | `gemini-4-argon.md` | Complex reasoning, hard coding, math and science | `low`, `medium` (default), `high` |
| Gemini 3.8 Flash | `gemini-3.8-flash` | `gemini-3-8-flash.md` | The default: everyday apps and agents | `low`, `medium` (default), `high` |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | family file alone | Subagents, routing, extraction, document parsing | `minimal` (default), `low`, `medium`, `high` |
| Gemini 3.1 Pro preview | `gemini-3.1-pro-preview`, `gemini-3.1-pro-preview-customtools` | family file alone | Only when pinned | `low`, `medium`, `high` (default) |
| Nano Banana 2.1, Pro, 2 Lite, 2 | `gemini-nano-banana-2.1`, `gemini-3-pro-image`, `gemini-3.1-flash-lite-image`, `gemini-3.1-flash-image` | `gemini-image.md` | Images | see the card |
| Gemini Omni Flash | `gemini-omni-1.2-flash`, `gemini-omni-1.1-flash` | `gemini-omni-flash.md` | Video | none documented |
| Deep Research, Deep Research Max | `deep-research-preview-04-2026`, `deep-research-max-preview-04-2026` | family file alone | Cited reports | none documented |
| Antigravity agent | `antigravity-preview-09-2026` | its model's card, `gemini-3.8-flash` by default | Managed coding agent | that card's |
| Older | `gemini-3.7-flash` and older Flash IDs, `gemini-3.1-flash-lite`, `gemini-2.5-*`, `veo-*`, `imagen-*` | `legacy.md` | Only when pinned | see the entry |

Live, speech, embedding, music and robotics IDs have no card.

## Dialect

Direct, well-structured prompts. Separate the parts with XML-style tags (`<role>`, `<constraints>`, `<context>`, `<task>`, `<output_format>`) or Markdown headings, one style per prompt. Role, behavioral constraints and output format go in the system instruction or the first lines. Large context goes first and the question at the very end, joined by a phrase like "Based on the information above...". Define ambiguous terms and name each image, audio or video input. Answers are brief by default, so ask in words for a conversational or detailed one. Leave out persuasive language. Add a few identically formatted examples. Too many cause overfitting. For an agent, state the risk rule (reads low, writes high), when to ask instead of assume, how hard to retry, and how much to narrate.

## Effort

- `thinking_level` is the control: `minimal`, `low`, `medium`, `high`. `minimal` errors on 3.8 Flash and never guarantees thinking is off.
- To spend less, lower the level. `max_output_tokens` counts thinking, and a reply that hits it ends `incomplete`, cut short or empty. On Gemini 3 models higher levels also call more tools.
- Replace `thinking_budget` with `thinking_level`. Sending both returns a 400.
- Across vendors: `low`, `medium` and `high` map by name, `xhigh` and `max` map to `high`, and `minimal` sits below `low`.

## Thinking cues

- **"Show your reasoning", "outline your plan".** Generally unnecessary, the guide says. Delete the request unless the reader needs the steps.
- **"Think step by step", "think very hard".** Turn the wish for depth into the level. One short cue may stay on a heavy-reasoning problem, where the guide says it can help.

## Hazards

- **Sampling parameters.** Remove `temperature`, `top_p` and `top_k`: Gemini 4 and 3.6 and later ignore them, and earlier Gemini 3 models want the defaults. `candidate_count` is unsupported. For determinism, put explicit rules in the system instruction.
- **Prefilled model turns.** A request that ends on a model turn returns a 400 on 3.6 Flash, 3.5 Flash-Lite and everything newer. Use the system instruction or structured outputs.
- **Structured text required right before a tool call** (an `<UPDATE>` block, YAML, JSON) can fail the call with `Malformed_Function_Call`. Ask for Markdown headers, or for no text before tool calls.
- **Safety filters.** A block is an HTTP 400 with the code `safety`, `jailbreak`, `prohibited_content` or `blocklist`.

## Routing

- **3.8 Flash at `medium`** first. The docs suggest a lower level for everyday tasks. Argon for complex reasoning.
- **3.5 Flash-Lite** at `minimal` for extraction, routing and classification, and at `medium` or `high` as a subagent with tool calls, code execution or multi-step reasoning, where a low level can end tool use early.
- **The `-customtools` ID** favors your own tools in agents that mix them with bash. Quality can vary elsewhere.
- **Tools.** Search grounding for recent or obscure facts, code execution for any arithmetic, counting or calculation. At most 10 to 20 active tools.

Any pick below the configured session model or level is a recommendation under the effort floor in `SKILL.md`.

## Deep Research

Deep Research is the faster agent, Max the comprehensive one.

- Interactions API only, with `background=true` and `store=true`, for up to 60 minutes.
- No structured outputs and no custom function tools (remote MCP servers work). Drop any schema and write the format into the prompt: sections, required tables, tone.
- Give background and constraints. Ask for charts in words: it draws them only on request.
- Say what to do about missing data. Google's example:

```text
If specific figures for 2025 are not available, explicitly state they are projections or unavailable rather than estimating
```

- `collaborative_planning` returns a plan to review before a complex run.
- What it reads can carry injected instructions. Give it trusted files only.
