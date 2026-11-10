# Playbook: <task type> TEMPLATE

Copy this file to `tasks/<slug>.md` for a task type the skill should recognize, and add its row
to the playbook index in `SKILL.md`. A playbook is model-agnostic. It says which blocks a prompt
of this type gets and which it must not get. The model card then decides the form of each block.

Rules for every playbook:

- Name no model and no vendor. Model facts live in `models/`, so a model release never touches
  this file.
- A block is required only when the draft's task needs it. A block the draft gives no material
  for is left out, never filled with an invented default.
- Stay under 4.5 KB. Plain sentences, no em dashes, American spelling.

## Applies when

The shape of the request, and the rule that separates this type from its nearest neighbor.

## Blocks

The blocks this type adds to the universal shape, each with one line on what it holds and the
failure it prevents. Mark each one required or conditional, and say what the condition is.

## Delete

What a draft of this type usually carries that costs tokens or hurts the result.

## Template

The compact block skeleton in neutral labels. The family file's dialect rewrites the labels.

## Check before sending

Three to five yes or no questions the rewrite must pass.
