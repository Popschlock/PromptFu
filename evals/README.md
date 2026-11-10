# PromptFu evals

What it costs to use PromptFu, and whether its rewrites are any good. Run the first command before every commit and the rest before a release.

```
python evals/measure.py budget
python evals/measure.py quotes --docs <folder of saved vendor pages>
claude plugin eval . --allow-tools Write --runs 1
```

## What is here

| Path | What it is |
|---|---|
| `measure.py` | The measuring script. Standard library only |
| `budget.json` | Ceilings the `budget` command enforces: bytes per rewrite path, `SKILL.md` size, text each hook may add |
| `cases.json`, `drafts/` | The fixed draft set: 13 messy drafts, one per task type plus a dispatch, an auto-mode pick and a second video target. Each has a list of what a rewrite must keep and what it must drop |
| `cases/` | The same drafts as `claude plugin eval` cases, written by `measure.py gen`, plus three hand-written trigger cases |
| `rubric.md` | What a grader scores when two rewrites of one draft are compared blind |
| `baseline/` | Recorded numbers per release, starting with 2.3.0 |

## The checks

**`budget`** is free and takes a few seconds. It fails when:

- a rewrite path (`SKILL.md`, a family file, one card, one playbook) reads more bytes or more files than the ceiling,
- a hook adds more text than its ceiling, speaks when it should be silent, or exits non-zero on bad input,
- a playbook or `SKILL.md` names a model, so that a model release would have to edit it,
- a card has no date, no sources or no "Unverified" line, or the family table does not name it,
- shipped prose holds an em dash, an en dash or a curly quote,
- the case folders under `cases/` are out of step with `cases.json`.

**`quotes`** checks that every fenced block in a model card is the vendor's own text. Save the pages on the cards' `Sources:` lines into a folder first. Anthropic and Google serve Markdown when `.md` is added to a docs URL:

```
curl -sSL https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2.md -o docs/fable-5-2.md
python evals/measure.py quotes --docs docs
```

**`claude plugin eval`** makes real model calls on your account, about two runs per case with `--runs 1`. Each rewrite case asks for the prompt in a file named `rewrite.txt`, which is why the Write grant is needed. Its graders check the kept constraints and dropped cues by regex, whether the skill fired, and a short rubric by a judge model. The report also shows each score without the plugin, so the difference is what PromptFu adds over the bare model.

The three `trigger-` cases cover when the skill should fire at all: before a subagent dispatch that carries real work, and not on a lookup, however long the question runs. Run them alone with `--tag trigger`.

## Comparing two versions

`claude plugin eval` compares the plugin with no plugin. To compare two versions of the plugin:

1. For each draft, have a fresh session rewrite it with each version and save the prompt as `<case id>.prompt.txt` in one folder per version.
2. `python evals/measure.py rewrites --dir <folder>` checks each folder against the keep and drop lists and counts words.
3. Give a fresh-context grader the draft, the two rewrites under neutral names and `rubric.md`, and nothing else. Use at least two graders per draft and swap the order between them.

The 3.0.0 release was checked this way against 2.3.0, and the result is in `baseline/`.

## When a model ships

1. Read the vendor's prompting guide, its what's-new or migration notes and the model page. Save them.
2. Copy `skills/promptfu/models/_TEMPLATE.md` to a card named after the model ID, and write it from the saved pages.
3. Add the model's row to the vendor's `_family.md`, and move the model it replaces to a few lines in `legacy.md`.
4. Add a draft that targets the new model to `cases.json` and `drafts/` when it brings a new kind of prompt, then run `python evals/measure.py gen`.
5. Run the three commands at the top. Record the numbers in `baseline/` with the release.

`SKILL.md`, `harnesses.md` and the playbooks hold no model names, so a model release does not touch them.
