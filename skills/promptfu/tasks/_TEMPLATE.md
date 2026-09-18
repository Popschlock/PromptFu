# Playbook: <task type> — TEMPLATE

Copy this file to `tasks/<slug>.md` for a task type the skill should recognise. A playbook is
model-agnostic. It decides which blocks a prompt of this type gets and which it must not get. The
model profile under `models/` then decides the form of each block. The skill reads one playbook,
one family file and one model file per optimization, so a playbook must stand alone and stay
short: 60 to 120 lines.

Plain sentences, no em dashes, no "X, not Y" contrasts. Quote a block verbatim where the wording
carries the effect and say so.

Last verified YYYY-MM-DD against <what you checked>.
Sources: <URLs, official first>.

## When this playbook applies
Trigger words and the shape of the request. Name the nearest neighbour playbook and the rule that
separates them.

## Required blocks
The subset of the universal shape (Intent, Context, Constraints, Task, Output, Boundaries) this
type needs, plus its own blocks, each with one line on what it holds and why it earns its tokens.
Mark blocks as required or conditional.

## Delete
What a draft of this type usually carries that costs tokens or hurts the result.

## Token rule
What "not longer than it needs to be" means for this type: the target size relative to the draft,
and the one case that justifies growth.

## Template
The compact block skeleton, in the vendor-neutral ALL-CAPS dialect. The profile may rewrite it as
XML tags or plain prose.

## Per-vendor notes
Where the product or API differs: one line per vendor pointing at the family or model file, and
the product-level controls (a Deep Research plan review, an image quality parameter) that live
outside the prompt.

## Check before sending
Three to six yes/no questions the rewrite must pass.
