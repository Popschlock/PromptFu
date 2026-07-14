# PromptFu

Your prompts are often hurting your results. Each model has prompting nuances, and what works for one model will make the results worse in another. As an example, multi-step numbered instructions keep Opus on track and the model will deviate and push back where it needs to meet your goal. Fable will follow those same instructions to the letter, even if those steps are not optimized and could be improved on, so for Fable those steps should be replaced by a goal and the constraints.

Crafting each prompt to work best with the model you are using is time consuming and difficult. That's where PromptFu steps in.

PromptFu will auto-evaluate and rewrite long, subagent, and workflow prompts to be optimized for the model you are prompting. It will invoke automatically in those situations, or you can invoke the skill manually with /promptfu. You write the messy human version, and PromptFu turns it into what the model responds best to.

## What it does with your prompt

It keeps the meaning of what you wrote and fixes the parts that trip up the model you're on.

- **Adds the intent you left out**, because the model uses your reasons to make the small calls you never spelled out.
- **Protects your hard constraints:** output formats, column names, rating scales, file paths, counts. It never swaps them for something it thinks is better. If one is unclear and you're at the keyboard, it asks. If it's running on its own, it keeps your version and flags the choice.
- **Tailors the prompt to each model's best practices.** The same phrase can help one model and hurt another. "think step by step" gives Opus useful structure, but it pushes Fable to follow fixed steps instead of your goal, so PromptFu keeps it for one and drops it for the other. It tells you what it changed and why.
- **Keeps you off Fable's safety tripwires.** Security, bio, and competing-model work can get refused and bounced to Opus mid-run. PromptFu spots that kind of task, frames it as the defensive work it usually is, and routes it to a model that will just answer.
- **Never quietly lowers your effort.** It can suggest a cheaper model or effort for simple work, but it won't drop below what you've configured without telling you and leaving you the call.
- **Adjusts the dispatch:** which model, which effort level, and when to have a second agent double-check the work.

## Models and effort

| Model | Best for | Effort |
| --- | --- | --- |
| Fable 5 | Ambiguous, judgment heavy work: planning, design review, audits | `high`, or `xhigh` when a wrong call is expensive |
| Opus 4.8 | Security, bio, or competing-model work, or anything where you need to read the reasoning | Adaptive thinking, `xhigh` for coding and agentic work |
| Sonnet 5 | Well specified building: implement to a spec, refactor against tests, transform data | `high`, lower for cost or latency |
| Haiku 4.5 | Mechanical work: classify, label, route, format checks, high volume grading | Cheapest tier |

Ask for `auto` and PromptFu picks the model and effort for you, says why, and names the runner up before it writes the prompt.

Your configured model and effort are a floor. PromptFu can recommend going higher for a hard task, and it can suggest going lower to save tokens on simple work, but it never drops below your setting silently. Every downgrade is surfaced so you can keep the higher level. If you would rather it never suggest a downgrade at all, set the `PROMPTFU_NEVER_DOWNGRADE` environment variable and it holds your configured model and effort or goes higher, never lower. Keep declining downgrades and it will offer to set that for you.

Adding a model is one file. Each model lives in `skills/promptfu/models/`, and there's a `_TEMPLATE.md` to copy. Nothing else changes, so the plugin keeps working as new Claude models ship.

## Install

In a Claude Code session:

```
/plugin marketplace add Popschlock/PromptFu
/plugin install promptfu@promptfu
```

Run `/reload-plugins` or restart the session so the hooks register. Update later with `/plugin marketplace update promptfu`.

## Using it

Most of the time you do nothing. It fires on its own before subagent and workflow dispatches, and when you submit a long prompt. To run it by hand, type `/promptfu` and paste your draft. You get back the rewritten prompt, a short list of what changed and why, any assumptions it made, and any refusal risks it caught.

## How it's built

```
PromptFu/
  .claude-plugin/    plugin manifest and marketplace file
  hooks/             the two auto-invoke hooks, and their scripts
  skills/promptfu/   the workflow (SKILL.md) and one file per model
```

PromptFu uses standardized Claude hooks to work on all platforms. The long prompt threshold defaults to fifty words and you can change it with the `PROMPTFU_WORD_THRESHOLD` environment variable.

The model files are curated by hand from published prompting guidance. PromptFu never pulls prompting instructions off the web while it runs, so a web page can't change how it rewrites your prompts.

## License

MIT. See [LICENSE](LICENSE).
