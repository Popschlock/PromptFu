# Profile: Claude Sonnet 5

Last verified 2026-07-13 against official model guidance. Re-verify on Sonnet point releases.

## Where this model fits

- **The execution tier.** Well-specified implementation, refactors backed by tests, data extraction/transformation, structured pipelines, and mechanical verification that still needs some judgment — at roughly a third of frontier cost.
- Route judgment-dense planning and final review *up* to Fable 5 (or Opus 5 for security/bio/competing-AI-model/reasoning-visibility); route pure-mechanical single-decision work *down* to Haiku 4.5.
- Canonical stage routing: plan on Fable → implement on Sonnet → review on Fable, with Sonnet also a cheap fresh-context grader for well-specified rubrics.

## Prompting posture

Strong instruction follower, and **literal**: Sonnet 5 does not silently generalize an instruction from one item to another and does not infer requests you didn't make (especially at lower effort). This is precision, not a weakness — but it means you make the spec complete:

- State inputs, outputs, acceptance criteria, and the edge cases you care about. If something should apply broadly, say so ("apply to every section, not just the first").
- Point at an existing pattern to imitate ("do it the way `--csv` was added"); imitation of a named example is more reliable than description. Positive examples beat "don't" lists.
- Give complete context up front (exact files, exact commands); it won't hunt for missing context as tenaciously as Fable.
- **Ambiguity stops, not guesses:** add "If the spec is ambiguous or two constraints conflict, stop and list the ambiguity instead of picking an interpretation."

## Effort and thinking

- **Effort defaults to `high`.** Raise to `xhigh` for the hardest coding/agentic work; drop to `medium` for cost-sensitive work, `low` only for short, scoped, latency-sensitive tasks. Sonnet respects effort strictly at the low end and can under-think on moderately complex work at `low`/`medium` — the first fix is to raise effort, not to prompt around it.
- **Adaptive thinking is on by default** (a change from Sonnet 4.6), and steerable if a large system prompt makes it think too often. `budget_tokens` and `temperature`/`top_p`/`top_k` return a 400. The new tokenizer emits roughly 30% more tokens for the same text, so revisit `max_tokens` limits carried over from 4.6.
- More agentic than 4.6: reaches for tools and self-verification readily. Calibrates verbosity to task complexity, so forced interim-status scaffolding ("summarize every 3 tool calls") is usually removable.

## Delete on sight

- "Use your judgment" where a decision rule could be stated — state the rule.
- "Think step by step" filler — effort covers depth.
- Open-ended scope ("improve the module") — bound it to the named change.

## Always add (shared content set — same as every target)

- Intent framing, hard constraints verbatim, exact output contract, boundaries with explicit exclusions, and the evidence-audit block: "Before reporting, check each claim against something you actually read or ran this session; mark anything unverified as unverified."
- Sonnet-specific: acceptance evidence — "done" means the named tests/commands pass, and the output includes their real output, not a claim.
- For a finding or review stage, remember Sonnet takes "only report high-severity" literally and will suppress lower findings. For a coverage pass, tell it to report everything with a confidence/severity tag and let a later step filter.

## Dispatch settings

- One bounded unit of work per dispatch; return evidence (test output, diffs), not summaries.
- Effort `high` default (see above). No Fable-style refusal categories to route around; standard Claude safety applies.
