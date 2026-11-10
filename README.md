# PromptFu

Your prompts are often hurting your results. Each model has prompting habits of its own, and what helps one costs another. Tell Claude Fable 5.2 how many tokens a task may use, and the size of that number changes how much it spends. Ask Claude Sonnet 5.5 to "show your reasoning" and the request can be declined. Give Claude Haiku 5.5 a blanket "always search" rule and it searches on half the prompts that needed none. Repeat "ask first" to a GPT model and it starts asking permission for safe steps. Send Gemini 4 the temperature you tuned and it is ignored. Every one of those comes from the vendor's own prompting guide.

Writing each prompt for the model you are on, and for what you are trying to do, is slow, so PromptFu does it for you.

PromptFu rewrites subagent, workflow and long prompts to fit the model that will run them and the kind of task they describe. It has three aims: a prompt that works on the first try, fewer tokens across the run, and no time spent on prompts that would not benefit. In Claude Code it comes up on its own when a prompt carries real work, Codex runs it from an `AGENTS.md` line, and you can call it by hand with `/promptfu`.

## What it does with your prompt

- **Decides whether to touch it.** A lookup, a one-step command or a draft that is already clear goes out as typed. When a missing piece would change the work and you are at the keyboard, it asks once. Everything else gets the smallest change that fixes what is wrong.
- **Detects the model in use.** In Claude Code it reads the session model and the model on a subagent call. In Codex it reads the session's `model` and `model_reasoning_effort`. A model or product you name wins over both. The report's first line says what it targeted and how it knew.
- **Picks the playbook for the task.** A long agentic run, a tool-calling agent, a research brief, an image or video prompt, a multimodal input, a JSON contract, an instruction file and a prompt that keeps failing each get a different block set. A one-shot question and a short subagent brief need no playbook at all.
- **Protects your hard constraints.** Output formats, column names, rating scales, file paths and counts stay as you wrote them. If one is unclear and you are present, it asks. Running on its own, it keeps your version and flags the choice.
- **Adds nothing you did not ask for.** Anything the rewrite adds beyond what your draft implies is labeled as an assumption you can overrule, or left out. It never writes in a tool-call, token or time budget you did not state.
- **Tailors the form to the vendor.** Claude gets XML-tagged blocks, GPT gets labeled sections with the autonomy and stop rules OpenAI publishes, and Gemini gets a direct prompt with the context first and the question last. The content is the same in all three.
- **Uses the vendor's own wording.** Where a vendor's guide gives prompt text it measured, the model card carries that text verbatim.
- **Keeps you off safety tripwires.** It removes requests for the model to write out its reasoning, which several current models can decline, and it says so.
- **Never silently lowers your effort.** It can suggest a cheaper model or effort for simple work, and it will not go below what you configured without telling you and leaving you the call.

## Models

Every model fact comes from the vendor's official documentation, with the date and the pages on each card. A claim with no official source is marked unverified or left out.

| Vendor | The docs start you on | Step up | Step down | Also covered |
| --- | --- | --- | --- | --- |
| Anthropic | Opus 5.5 | Fable 5.2 when Opus 5.5 at higher effort still falls short, for hours-long agent sessions and multistep research | Sonnet 5.5 for everyday building, Haiku 5.5 for high-volume work and subagents | Fable 5.1, Fable 5, Opus 5, Opus 4.8, Sonnet 5 and Haiku 4.5 as short legacy entries |
| OpenAI | GPT-6 Astra in the API docs, GPT-6.1 Sol in the Codex docs | Higher effort before a bigger model | GPT-6.1 Terra for visual work, computer use and writing, GPT-6 Luna for focused high-volume tasks | GPT-6-Cyber for authorized security work, GPT Image 2.6 and 2.5, GPT-6 Sol and GPT-5.6 as legacy entries |
| Google | Gemini 3.8 Flash | Gemini 4 Argon for complex reasoning | Gemini 3.5 Flash-Lite | Nano Banana image models, Gemini Omni Flash for video, Deep Research, Veo 3.1 and older models as legacy entries |

Midjourney and Runway each have a family file as well, for prompts you paste into those products.

Auto mode picks within the vendor you are running on, says why, and names the runner-up. Claude and OpenAI share five effort names from `low` to `max`, Codex adds `ultra`, and Gemini's `thinking_level` runs from `minimal` to `high`.

Your configured model and effort are a floor. PromptFu can recommend going higher for a hard task and can suggest going lower to save tokens on simple work, and it never goes below your setting silently. Set `PROMPTFU_NEVER_DOWNGRADE` and it holds your configured model and effort or goes higher. Keep declining downgrades and it offers to set that for you.

## Use cases

| You are writing | PromptFu reads | What the rewrite holds |
| --- | --- | --- |
| A quick question or one-line edit | no playbook | A task sentence, the input, the output shape and a size. Often nothing changes |
| A brief for a subagent or workflow | no playbook | What the result is for, what is ruled out, the shape you need back |
| A long autonomous task or migration | `tasks/long-run-agentic.md` | Autonomy, a completion test, verification |
| An agent that calls tools or MCP servers | `tasks/tool-agents.md` | Tool policy, authority map, a never-invent list, action classes |
| A research brief | `tasks/deep-research.md` | The research brief, source tiers, evidence labels |
| An image or an edit | `tasks/image-generation.md` | Subject, composition, text, a preserve list, parameters outside the prompt |
| A video clip | `tasks/video-generation.md` | Shot, action, camera, audio, duration, continuity |
| A prompt with images, PDFs, audio or screenshots attached | `tasks/multimodal-input.md` | An input map with one role per input, an authority map, an unreadable rule |
| A JSON contract | `tasks/structured-output.md` | Meaning in the prompt, shape in the schema, an unknown value |
| A system prompt, `AGENTS.md`, `CLAUDE.md` or `SKILL.md` | `tasks/instruction-files.md` | Short triggers, progressive disclosure, no duplicated rules |
| A prompt that keeps failing | `tasks/prompt-debugging.md` | Layered diagnosis, one variable per change |

## Install

In a Claude Code session:

```
/plugin marketplace add Popschlock/PromptFu
/plugin install promptfu@promptfu
```

Run `/reload-plugins` or restart the session so the hooks register. Update later with `/plugin marketplace update promptfu`. The hooks need `node` on your PATH. Without it they fail but block nothing, and `/promptfu` still works by name.

For Codex, copy `skills/promptfu/` to `~/.agents/skills/promptfu/` and add one line to `~/.codex/AGENTS.md`: "apply the `promptfu` skill to a prompt over ~50 words that asks for multi-step or judgment work, before running it." Gemini CLI reads the same `~/.agents/skills/` folder.

## Using it

Most of the time you do nothing and see nothing. In Claude Code three hooks do the prompting:

- **Once per session,** and again after a compaction, a hook tells the model to apply PromptFu to any subagent or workflow prompt that asks for multi-step or judgment work, without narrating the rewrite, and to skip it for lookups. Nothing is added to your later prompts.
- **A typed prompt over the word threshold** (50 words by default, counting only what you typed) gets one line asking the model to judge the work: optimize first when it is multi-step or needs judgment, run it as typed when it is a lookup, a simple edit or already clear.
- **The first unstructured dispatch of a session** over the same threshold gets a short note on its tool result, so the next one is written properly. `PROMPTFU_DISPATCH_MODE=gate` makes that a hard hold instead: the call is denied once and always passes on its second attempt, and the hold shows as a hook error in the transcript. `off` skips dispatch checks.

Files the skill has already read in a session are not read again, so a second rewrite costs far less than the first.

To run it by hand, type `/promptfu` and paste your draft, or say which model or product the prompt is for ("optimize this for GPT-6 Astra", "this is for Gemini Deep Research"). You get back the target it resolved, the rewritten prompt, what changed and why, the draft and rewrite word counts, any assumptions it made, and any refusal risk it caught.

## Settings

| Variable | Default | What it does |
| --- | --- | --- |
| `PROMPTFU_WORD_THRESHOLD` | 50 | Words a typed prompt or a dispatch brief must exceed before a hook speaks |
| `PROMPTFU_DISPATCH_MODE` | `lint` | `lint` notes the first unstructured dispatch, `gate` holds each one once, `off` skips the check |
| `PROMPTFU_NEVER_DOWNGRADE` | unset | Set to `1` and PromptFu proposes no model or effort below what you configured |
| `PROMPTFU_DISABLE` | unset | Set to `1` and no hook fires anywhere on the machine |

## Turning it off

Sometimes the rewrite pass is the wrong trade: a live tabletop session, a demo, any moment where latency matters more than a tuned prompt. Two switches:

- Set the `PROMPTFU_DISABLE` environment variable (`1`, `true`, `yes` or `on`) and no hook fires anywhere on the machine.
- Put a `.promptfu` file at a project's root with `off` as its first line and the hooks stay quiet for that project. The file is read on every prompt, so a script or a skill can create and delete it to toggle PromptFu mid-session. A hook tells the model once when the switch changes.

Either way `/promptfu` still works when you call it by name. The switch only stops the automatic firing.

## How it's built

```
PromptFu/
  .claude-plugin/          plugin manifest and marketplace file
  hooks/                   the three hooks and their shared helpers
  skills/promptfu/
    SKILL.md               when to optimize, target resolution, the rewrite rules, the playbook index
    harnesses.md           where Claude Code, Codex and Gemini CLI keep their model and effort
    models/<vendor>/       one _family.md, one card per current model, one legacy.md
    tasks/                 one playbook per task type
  evals/                   the draft set, the measuring script, recorded numbers
```

A rewrite reads `SKILL.md`, one family file, one model card and at most one playbook: about 19 to 27 KB, against 34 to 59 KB in 2.3.0.

Adding a model is one card and one table row. Copy `models/_TEMPLATE.md`, write the card from the vendor's prompting guide, add its row to the vendor's `_family.md`, and shrink the model it replaces to a few lines in `legacy.md`. `SKILL.md`, the playbooks and `harnesses.md` name no model, so a release does not touch them. `evals/README.md` has the checklist and the three checks that stand behind a release: a size and hygiene budget, a check that quoted vendor text is verbatim, and an eval suite for `claude plugin eval`.

PromptFu never pulls prompting instructions off the web while it runs, so a web page cannot change how it rewrites your prompts. Where each playbook's technique came from is in `PLAYBOOK-SOURCES.md`.

## License

MIT. See [LICENSE](LICENSE).
