# PromptFu

Your prompts are often hurting your results. Each model has prompting habits of its own, and what works for one makes another worse. Numbered step lists keep Opus on track, and it will push back where a step does not serve the goal. Fable follows the same steps to the letter, wrong ones included, so for Fable those steps should become a goal and its constraints. GPT-6 Astra reads a step list as a script and asks before doing anything it was not told to do, so it wants a bias-toward-action line and a stop condition instead. Gemini over-analyzes scaffolding written for older models and wants a short, direct ask with the question last.

Crafting each prompt for the model you are on, and for what you are trying to do, is slow. That is where PromptFu steps in.

PromptFu rewrites long, subagent and workflow prompts to fit the model that will run them and the kind of task they describe. It fires on its own in those situations in Claude Code, Codex runs it from an `AGENTS.md` line, and you can invoke it by hand with `/promptfu`. You write the messy human version and PromptFu turns it into what the model responds best to, with fewer tokens spent across the run because the first attempt lands.

## What it does with your prompt

It keeps the meaning of what you wrote and fixes the parts that trip up the model you are on.

- **Detects the model in use.** In Claude Code it reads the session model and the `model` option of a subagent call. In Codex it reads the session's `model` and `model_reasoning_effort`, falling back to `~/.codex/config.toml` and saying so. A model or product you name in the request wins over both. The report's first line says what it targeted and how it knew.
- **Picks the playbook for the task.** A one-shot question, a long agentic run, a tool-calling agent, a deep research brief, an image or video prompt, a multimodal input, a JSON contract, an instruction file or a prompt that keeps failing each get a different block set. The playbook decides which blocks earn their tokens.
- **Adds the intent you left out**, because every current model uses your reason to make the small calls you never spelled out.
- **Protects your hard constraints.** Output formats, column names, rating scales, file paths and counts stay as you wrote them. It never swaps them for something it thinks is better. If one is unclear and you are at the keyboard, it asks. Running on its own, it keeps your version and flags the choice.
- **Tailors the form to the vendor.** Claude gets XML-tagged blocks. GPT gets ALL-CAPS sections and the exact autonomy, tool-policy and style lines OpenAI publishes. Gemini gets direct prose with the context first and the question last. The content is the same in all three.
- **Keeps you off safety tripwires.** Security, bio and competing-model work can be refused and bounced mid-run on Fable. PromptFu frames it as the defensive work it usually is and routes it to the sibling that answers.
- **Never quietly lowers your effort.** It can suggest a cheaper model or effort for simple work, and it will not drop below what you configured without telling you and leaving you the call.
- **Adjusts the dispatch.** It recommends which model, which effort, and when a second agent with fresh context should grade the work.

## Models

Auto mode picks within the vendor you are running on, says why, and names the runner-up before it writes the prompt. Effort names line up across vendors: Claude `effort` and OpenAI `reasoning.effort` both run `low` to `max`, Codex adds `ultra`, and Gemini `thinking_level` runs `minimal` to `high`.

| Vendor | Default | Step up | Step down | Notes |
| --- | --- | --- | --- | --- |
| Anthropic | Opus 5.5 | Fable 5.1 when Opus 5.5 at higher effort still falls short, for hours-long agentic runs, long-form legal analysis, or when asked by name | Sonnet 5 for well-specified building, Haiku 4.5 for mechanical work | Opus 5, Fable 5 and Opus 4.8 keep profiles for dispatches that pin them |
| OpenAI | GPT-5.6 Sol | GPT-6 Astra for the hardest end-to-end and agentic work | Terra for execution, Luna for mechanical work | GPT-5.6 Cyber for authorized security testing. GPT Image 2.5 Flare and Sunburst for images |
| Google | Gemini 3.8 Flash | 3.1 Pro preview for the hardest reasoning, Deep Think beyond that | 3.5 Flash-Lite for mechanical work | Gemini 3 Pro Image and 3.1 Flash Image for images, Veo 3.1 for video, Deep Research models |

Your configured model and effort are a floor. PromptFu can recommend going higher for a hard task and can suggest going lower to save tokens on simple work, and it never drops below your setting silently. Set the `PROMPTFU_NEVER_DOWNGRADE` environment variable and it holds your configured model and effort or goes higher. Keep declining downgrades and it offers to set that for you.

## Use cases

| You are writing | PromptFu applies | What changes |
| --- | --- | --- |
| A quick question or one-line edit | `tasks/short-run.md` | Three blocks, a stated length, and the rewrite comes out shorter |
| A long autonomous task or migration | `tasks/long-run-agentic.md` | Autonomy policy, a completion test, batching, a scope limiter, a compaction list |
| An agent that calls tools or MCP servers | `tasks/tool-agents.md` | Tool policy, authority map, a never-invent list, action classes, recovery rules |
| A research brief | `tasks/deep-research.md` | The seven-layer brief, source tiers, evidence labels, the product's plan controls |
| An image or an edit | `tasks/image-generation.md` | Deliverable, subject, composition, lighting, text, a preserve list, params outside the prompt |
| A video clip | `tasks/video-generation.md` | Shot, action, camera, audio, duration, continuity |
| A prompt with images, PDFs, audio or screenshots attached | `tasks/multimodal-input.md` | An input map with one role per input, an authority map, an unreadable rule |
| A JSON contract | `tasks/structured-output.md` | Meaning in the prompt, shape in the schema, an unknown value |
| A system prompt, `AGENTS.md`, `CLAUDE.md` or `SKILL.md` | `tasks/instruction-files.md` | Short triggers, progressive disclosure, permission statements, no duplicated rules |
| A prompt that keeps failing | `tasks/prompt-debugging.md` | Nine-layer diagnosis and a one-variable loop |

## Install

In a Claude Code session:

```
/plugin marketplace add Popschlock/PromptFu
/plugin install promptfu@promptfu
```

Run `/reload-plugins` or restart the session so the hooks register. Update later with `/plugin marketplace update promptfu`.

For Codex, copy `skills/promptfu/` to `~/.agents/skills/promptfu/` and add one line to `~/.codex/AGENTS.md`: "apply the `promptfu` skill to any prompt over ~50 words before running it." The HIYA umbrella's `scripts/sync_agents.py` does both.

## Using it

Most of the time you do nothing and see nothing. In Claude Code every prompt you submit carries a quiet instruction to apply PromptFu to any subagent or workflow prompt the model writes that turn, before the call and without narrating the rewrite; a prompt over the word threshold (only the text you typed counts, not the notifications Claude Code attaches) also gets the ask itself restructured. A dispatch that still goes out unstructured gets a note on its tool result so the next one is written properly. `PROMPTFU_DISPATCH_MODE=gate` makes that a hard hold instead (the call is denied once and always passes on the second attempt; the hold shows as a hook error in the transcript), and `off` skips dispatch checks while keeping the prompt hooks. To run it by hand, type `/promptfu` and paste your draft, or say which model or product the prompt is for ("optimize this for GPT-6 Astra", "this is for Gemini Deep Research"). You get back the target it resolved, the rewritten prompt, what changed and why, the draft and rewrite word counts, any assumptions it made, and any refusal risks it caught.

## Turning it off

Sometimes the rewrite pass is the wrong trade: a live tabletop session, a demo, any moment where latency matters more than a tuned prompt. Two switches, checked on every auto-invoke:

- Set the `PROMPTFU_DISABLE` environment variable (`1`, `true`, `yes`, or `on`) and neither hook fires anywhere on the machine.
- Put a `.promptfu` file at a project's root with `off` as its first line and the hooks stay quiet for that project. Same idea as wlah's `.wlah` file. The file is read on every check, so a script or a skill can create and delete it to toggle PromptFu mid-session.

Either way `/promptfu` still works when you call it by name. The switch only stops the automatic firing.

## How it's built

```
PromptFu/
  .claude-plugin/          plugin manifest and marketplace file
  hooks/                   the two auto-invoke hooks and their scripts
  skills/promptfu/
    SKILL.md               the workflow, target resolution, token budget, playbook index
    harnesses.md           how Claude Code, Codex and Gemini CLI name their model and effort
    models/<vendor>/       one _family.md per vendor plus one file per model
    tasks/                 one playbook per task type
```

The hooks are standard Claude Code hooks. The long-prompt threshold defaults to fifty words and `PROMPTFU_WORD_THRESHOLD` changes it.

Adding a model is one file. Copy `models/_TEMPLATE.md` into the vendor's directory and write only what the model changes from its family file. A point release can be a delta on its predecessor the way `anthropic/fable-5-1.md` sits on `fable-5.md`. Adding a task type is one file too, from `tasks/_TEMPLATE.md`, plus a row in the playbook index.

The model files are curated by hand from official prompting guides first and practitioner writeups second, each dated and sourced. PromptFu never pulls prompting instructions off the web while it runs, so a web page cannot change how it rewrites your prompts.

## License

MIT. See [LICENSE](LICENSE).
