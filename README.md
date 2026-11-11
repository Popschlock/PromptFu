# PromptFu

Every model has its own best practices for prompting. Opus, Fable, Astra, and even same-model iterations like Fable 5.1 and Fable 5.2 each have different prompting guidance for optimal results.

PromptFu learns each model's prompting best practices from the vendor's official documentation so you don't need to. You keep writing the way you always have. PromptFu uses hooks to detect multi-step and long-running prompts, then automatically optimizes them for the model you are working with. This reduces your overall token spend while improving your results.

PromptFu works in Claude Code and Codex. It supports the current Claude, GPT and Gemini models, along with image, video and deep research tools. To install it in Claude Code, run:

```
/plugin marketplace add Popschlock/PromptFu
/plugin install promptfu@promptfu
```

## Why prompts need to match the model

The same instruction can help one model and hurt another. The examples below come from the vendors' own documentation.

| Instruction | Where it helps | Where it hurts or does nothing |
| --- | --- | --- |
| A detailed step-by-step procedure | Earlier models, which needed the path spelled out | Newer models, which do better when they choose the method. OpenAI says overly specific guidance "can now hinder results where it previously helped", and Anthropic says a general instruction "often produces better reasoning than a hand-written step-by-step plan" |
| "Run the tests and check your work" | Claude Haiku 5.5 at low and medium effort and Sonnet 5.5 at low effort, which sometimes report a change as done without running a check | GPT-6 Astra and Claude Opus 5, which already check their own work. OpenAI says the instruction "can lead to unnecessary testing", and Anthropic says it causes "over-verification". For these models it works better to describe the goal and define what done means |
| Examples of the output you want | Gemini and Claude. Google recommends that you "always include few-shot examples", and Anthropic recommends three to five | GPT reasoning models. OpenAI's advice is "Try zero shot first, then few shot if needed" |
| "Think step by step" | Sonnet 5.5 on JSON tasks that need a few steps of reasoning, where "Think the problem through before you answer" brings accuracy close to the next effort level up | GPT reasoning models, where OpenAI says it "may not enhance performance (and can sometimes hinder it)" |
| "Answer directly without deliberating" | Claude Fable 5.1, which usually follows it | Claude Fable 5.2, which keeps thinking at medium effort and above |
| Boundaries written to stop an agent from going too far | GPT-6.1 Sol and GPT-6 Luna | GPT-6 Astra, which "could take it too seriously and may stop work where you'd actually be happy for it to continue" |
| Saying what to leave out of an image or video | Midjourney and Veo, which each have a place for it: `--no` and a negative prompt | Runway, where negative phrasing "may produce unpredictable or even opposite results" |

The first two rows show the main change in the newer guides, which ask for a prompt that describes the goal and the constraints and leaves the method to the model. OpenAI's wording is "Describe the destination rather than prescribing every step", and Anthropic's is "Prefer general instructions over prescriptive steps", because the model's reasoning "frequently exceeds what a human would prescribe". A prompt that dictates every step can hold the model to your approach even when it could have found a better one. Requirements such as a specific architecture still belong in the prompt when they are necessary, and added context is most useful when it covers something the model could not know on its own. PromptFu rewrites a step-by-step procedure as a goal with constraints when the target model's guide calls for it. The requirements you set stay in the prompt as you wrote them.

Wording that a vendor recommends for one model does not always carry over to the next one. For Opus 5.5 chat prompts, Anthropic suggests two sentences that tell the model to treat an earlier answer as done, and reports that they reduce thinking on follow-up turns without affecting quality. In the Fable 5.2 guide, Anthropic reports that the same two sentences made that model far less likely to point out mistakes in its earlier answers.

The vendor guides also contain wording that measurably improves results. Anthropic reports that one paragraph in its Sonnet 5.5 guide cut session cost by about a third at max effort with no change in quality, and that one paragraph in its Fable 5.2 guide halved the number of sessions that ended with doable work left. One sentence about who owns the code changed how often Fable 5.2 merged repeated code, from under a tenth of attempts to about half.

Keeping up with this guidance for every model takes a lot of reading, and it changes with each model release. PromptFu stores it as one card per model, written from the vendor's documentation with the date it was checked, and applies the relevant parts when it optimizes a prompt.

## Example

The diff below shows a real draft from PromptFu's eval set and the prompt PromptFu produced from it for Claude Opus 5.5.

```diff
- You are a world-class senior technical writer with 20 years of experience.
- I need you to think really carefully step by step about this.
  Take the changelog entry below and rewrite it so that normal users can understand it,
  right now it's way too technical.
- Be concise. Be very concise, don't be verbose.
+ Be concise.
  It needs to be 2 sentences max and it must keep the version number v3.4.1 exactly
  and must not mention the internal ticket ID.
- Don't hallucinate anything that isn't in the entry.
+ Include only facts that are in the entry.
- Please show your reasoning before the final answer.
+ Reply with the rewritten entry alone.

- Entry: "v3.4.1: fix race in SyncQueue.flush() where concurrent enqueue during drain
- dropped the tail batch (PLAT-2291); bump retry backoff ceiling 30s -> 120s"
+ <entry>
+ v3.4.1: fix race in SyncQueue.flush() where concurrent enqueue during drain
+ dropped the tail batch (PLAT-2291); bump retry backoff ceiling 30s -> 120s
+ </entry>
```

PromptFu removed the request to show reasoning because Anthropic's guide says Opus 5.5 can decline a prompt that asks it to write its reasoning into the response. It told the model what to return instead. It removed "think really carefully step by step" because the effort setting controls how much current Claude models think. The length limit, the version number and the ticket ID rule are unchanged. The changelog entry is wrapped in tags, which Anthropic's guide says helps Claude parse prompts that mix instructions with input.

Prompts for larger tasks change more. For an overnight refactor or a subagent brief, PromptFu adds the completion and autonomy wording that the model's vendor publishes. All of the eval drafts are in `evals/drafts/`, and their rewrites are in `evals/baseline/rewrites/`.

## How it works

In Claude Code, PromptFu runs from three hooks, so there is nothing to do after you install it.

- When the model is about to hand multi-step work to a subagent or workflow, PromptFu optimizes the brief for the model that will run it and adds no commentary to the conversation.
- When you type a prompt longer than 50 words that asks for multi-step work or judgment, PromptFu optimizes it before it runs. Only the text you typed counts toward the 50 words.
- Lookups, quick questions and one-step commands are sent as typed. Optimizing a prompt costs tokens, so PromptFu skips prompts that would not benefit.

The hooks add very little to your context. They add one short reminder at the start of a session and again after a compaction, one line on a prompt over 50 words, and at most one note per session when a subagent brief goes out unstructured.

In Codex, a line in `AGENTS.md` tells the model when to apply the skill. You can also run PromptFu yourself by typing `/promptfu` and pasting a draft, or by naming the target, for example "optimize this for GPT-6 Astra" or "this is for Midjourney". PromptFu returns the rewritten prompt, an explanation of what it changed, and any refusal risk it found.

## Safeguards

PromptFu is meant to be left on, so it follows a few rules when it rewrites a prompt.

- Your hard constraints stay exactly as written. Output formats, field names, rating scales, file paths, counts and quoted text are not changed. If a constraint looks like a mistake and you are present, PromptFu asks you about it once.
- Anything PromptFu adds beyond what your draft implies is labeled `Assumption:` so you can remove it. It does not add tool-call, token or time budgets that you did not set.
- Your configured model and effort are treated as a minimum. PromptFu can suggest a cheaper model or lower effort for simple work, but it will not apply one without telling you.
- PromptFu does not fetch prompting advice from the web while it works. The model cards are written ahead of time from vendor documentation, so a web page cannot change how your prompt is rewritten.
- You can turn the automatic behavior off with an environment variable or a one-line file, and `/promptfu` still works when you call it by name.

## Choosing a model and effort

If you ask PromptFu which model and effort to use for a task, it picks both using the vendor's own routing guidance, explains the choice and names the runner-up. It stays within the vendor you are running on unless the prompt is going to be used somewhere else.

## Supported models

| Vendor | Starting model in the vendor's docs | For harder work | For lighter work | Also covered |
| --- | --- | --- | --- | --- |
| Anthropic | Opus 5.5 | Fable 5.2 when Opus 5.5 at higher effort still falls short, for hours-long agent sessions and multistep research | Sonnet 5.5 for everyday building, Haiku 5.5 for high-volume work and subagents | Fable 5.1, Fable 5, Opus 5, Opus 4.8, Sonnet 5 and Haiku 4.5 as short legacy entries |
| OpenAI | GPT-6 Astra in the API docs, GPT-6.1 Sol in the Codex docs | Higher effort before a bigger model | GPT-6.1 Terra for visual work, computer use and writing, GPT-6 Luna for focused high-volume tasks | GPT-6-Cyber for authorized security work, GPT Image 2.6 and 2.5, GPT-6 Sol and GPT-5.6 as legacy entries |
| Google | Gemini 3.8 Flash | Gemini 4 Argon for complex reasoning | Gemini 3.5 Flash-Lite | Nano Banana image models, Gemini Omni Flash for video, Deep Research, Veo 3.1 and older models as legacy entries |

You can also use PromptFu for prompts that you paste into Midjourney or Runway.

## Supported task types

PromptFu also adjusts the prompt for the type of task.

| You are writing | What the rewrite gets |
| --- | --- |
| A quick question or one-line edit | Usually nothing. A clear draft is sent as typed |
| A brief for a subagent or workflow | What the result is for, what is already ruled out, the shape you need back |
| A long autonomous task or migration | An autonomy rule, a test for done, verification sized to the risk |
| An agent that calls tools or MCP servers | Tool policy, which source wins a conflict, a never-invent list, rules for risky actions |
| A research brief | Scope, source tiers, evidence labels |
| An image or an edit | Subject, composition, exact text, what must not change, parameters kept out of the prompt |
| A video clip | Shot, action, camera, audio, duration, continuity |
| Images, PDFs, audio or screenshots as input | A role for each input, which one wins a conflict, what to do when something is unreadable |
| A JSON contract | Meaning in the prompt, shape in the schema, a value for unknown |
| A system prompt, `AGENTS.md`, `CLAUDE.md` or `SKILL.md` | Short triggers, detail loaded on demand, no duplicated rules |
| A prompt that keeps failing | A layered diagnosis and one change at a time |

## Evaluation

PromptFu includes an eval suite of 13 deliberately messy drafts that cover the task types above. The suite runs through `claude plugin eval`, which scores each rewrite with the plugin loaded and again without it.

In the 3.0.0 run, rewrites scored 0.97 with PromptFu and 0.74 without it on the 12 drafts where both runs finished. The graders check that every hard constraint is still present, that known anti-patterns have been removed, that the rewrite still asks for the same deliverable, and that facts from the model card are included. Each draft was run once, so individual scores are noisy.

The suite also checks when PromptFu activates. It ran before a subagent dispatch in 3 of 3 runs and stayed inactive on simple lookups in 6 of 6 runs.

These scores measure the rewritten prompt and not the results of your own tasks. `evals/README.md` explains how to run the suite, and you can add your own drafts to `evals/cases.json`. The recorded numbers and all of the rewrites are in `evals/baseline/`.

## Keeping model guidance current

Model guidance goes out of date within months, so each card records the date it was checked and the vendor pages it was written from. A test confirms that text quoted from a vendor's guide matches the source word for word, and claims without an official source are marked unverified or left out. Adding a new model takes one card and one table row. The checks in `evals/` are run before each release.

## Install

The commands at the top of this page install PromptFu in Claude Code. After installing, run `/reload-plugins` or restart the session so the hooks are registered. The hooks require `node` on your PATH. If `node` is missing, the hooks fail without blocking anything and `/promptfu` still works when you call it by name.

To update, run these commands in a shell and then restart the session:

```
claude plugin marketplace update promptfu
claude plugin update promptfu@promptfu
```

For Codex, copy `skills/promptfu/` to `~/.agents/skills/promptfu/` and add one line to `~/.codex/AGENTS.md`: "apply the `promptfu` skill to a prompt over ~50 words that asks for multi-step or judgment work, before running it." Gemini CLI reads the same `~/.agents/skills/` folder.

## Settings

PromptFu reads these environment variables.

| Variable | Default | What it does |
| --- | --- | --- |
| `PROMPTFU_WORD_THRESHOLD` | 50 | The number of words a typed prompt or a subagent brief must exceed before a hook acts on it |
| `PROMPTFU_DISPATCH_MODE` | `lint` | `lint` adds a note after the first unstructured subagent brief of a session. `gate` holds each unstructured brief once: the call is denied, passes on its second attempt, and shows as a hook error in the transcript. `off` skips the check |
| `PROMPTFU_NEVER_DOWNGRADE` | unset | When set to `1`, PromptFu does not suggest a model or effort below what you configured |
| `PROMPTFU_DISABLE` | unset | When set to `1`, no hook runs anywhere on the machine |

## Turning it off

Sometimes the optimization pass is not worth the delay, for example in a live demo. You can turn off the automatic behavior in two ways.

- Set the `PROMPTFU_DISABLE` environment variable to `1`, `true`, `yes` or `on`, and no hook runs anywhere on the machine.
- Put a `.promptfu` file at a project's root with `off` as its first line, and the hooks stay quiet for that project. The file is read on every prompt, so a script or a skill can create and delete it to toggle PromptFu during a session. A hook tells the model once when the switch changes.

In both cases `/promptfu` still works when you call it by name, because the switches only stop the automatic behavior.

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

A rewrite reads `SKILL.md`, one family file, one model card and at most one playbook, which comes to between 13 and 27 KB. PromptFu does not read a file twice in one session, so a second rewrite costs much less than the first.

To add a model, copy `models/_TEMPLATE.md`, write the card from the vendor's prompting guide, add its row to the vendor's `_family.md`, and shrink the model it replaces to a few lines in `legacy.md`. `SKILL.md`, the playbooks and `harnesses.md` do not name any model, so a model release does not change them. `evals/README.md` has the release checklist and describes the three checks behind each release: a size and hygiene budget, a check that quoted vendor text is verbatim, and the eval suite for `claude plugin eval`.

`PLAYBOOK-SOURCES.md` lists where each playbook's technique came from.

## License

MIT. See [LICENSE](LICENSE).
