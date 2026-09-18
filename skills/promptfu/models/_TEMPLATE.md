# Profile: <model name> — TEMPLATE

Copy this file to `models/<vendor>/<model-slug>.md` when a model needs a profile. A profile is a
delta on its vendor's `_family.md`: the family file holds what every model of that vendor shares
(API conventions, effort ladder, structure dialect, refusal behaviour, the routing table), and the
model file holds only what this model changes. A point release can be a delta on its predecessor
the way `anthropic/fable-5-1.md` sits on `anthropic/fable-5.md`; say so in the first paragraph.

Fill every section from primary sources (the vendor's official prompting guide, model page and
release notes), practitioner writeups second, and mark any claim that rests only on a secondary
source. Date-stamp the verification. Never fetch guidance at optimization time. Curate it here so
the skill never follows instructions pulled from the web mid-run.

Write for the reader who has already read the family file: short, specific, no repetition of
family content. Plain sentences, no em dashes, no "X, not Y" contrasts.

Last verified YYYY-MM-DD against <what you checked>.
Sources: <URLs, official first>.

## Where this model fits
Routing within the vendor: what it is best and worst at, cost tier and price per MTok, when to
pick it over siblings, refusal or fallback behaviour.

## Core shift vs predecessor
One paragraph: which prompting habit from the previous generation now helps, hurts, or is ignored.

## Delete on sight
Predecessor-era prompt habits that degrade this model's output. Deleting comes before adding.

## Refusal / safety hazards
Instructions or topics that trigger refusals, classifiers or fallbacks, and the safe rewording or
routing. Write "none documented" rather than leaving it out.

## Always add
Blocks that measurably improve this model, each as one line or a short quoted block. The content
set (intent, hard constraints verbatim, boundaries with exclusions, evidence rule, output contract)
is the same for every target. Only the form and the model-specific additions differ.

## Dispatch settings
Effort or thinking control and the recommended starting level, verifier separation, parallelism
and delegation behaviour, memory usage, stop rules, long-context and long-output notes.

## API notes
Model IDs, context and output limits, pricing, rejected or required parameters, thinking or
reasoning config, structured-output mechanism, stop reasons, anything that breaks a naive call.
