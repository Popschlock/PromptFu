# Profile: <model name> — TEMPLATE

Copy this file to `<model-slug>.md` when a new model needs a profile. Fill every section from **primary sources** (the model's official prompting guide + release notes; reputable practitioner writeups second). Date-stamp your verification; never auto-fetch guidance at optimization time — curate it here so the skill never follows instructions pulled from the web mid-run.

Last verified YYYY-MM-DD against <what you checked>.

## Where this model fits
Routing: what it's best/worst at, cost tier, when to pick it over siblings, refusal/fallback behavior.

## Core shift vs predecessor
The one-paragraph headline: what prompting habit from the previous generation now helps, hurts, or is ignored.

## Delete on sight
Predecessor-era prompt habits that degrade this model's output.

## Refusal / safety hazards
Instructions or topics that trigger refusals, classifiers, or fallbacks — and the safe rewording or routing.

## Always add
Blocks that measurably improve this model (intent framing? evidence grounding? boundaries? verbosity contract?).

## Dispatch settings
Effort/thinking controls, verifier separation, parallelism behavior, memory usage, stop rules.

## API notes
Rejected/required parameters, thinking config, stop reasons — anything that breaks naive calls.
