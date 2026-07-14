# Profile: Claude Haiku 4.5

Last verified 2026-07-13 against official model guidance. Re-verify on Haiku releases.

## Where this model fits

- **The mechanical tier.** Classification, routing, labeling, format and checklist checks, single-artifact summaries, high-volume cheap grading. Fastest and cheapest.
- Depth comes mostly from how tightly you specify the task rather than from an effort setting; if your harness exposes an effort dial for Haiku, keep it low. Haiku also has context awareness (it tracks its remaining token budget), which helps on longer mechanical passes.
- If the task needs even light judgment beyond a stated rubric, route up to Sonnet 5 at `low` instead.

## Prompting posture

Maximal explicitness — Haiku fills no gaps:

- **State the rule for every decision it must make.** A rubric with concrete criteria beats any appeal to judgment.
- **Examples over prose.** One or two input→output examples steer better than paragraphs of description; include a boundary case if the categories have fuzzy edges.
- **Strict output contract.** Exact JSON shape or exact line format, nothing else. Say explicitly: "Output only the JSON, no explanation."
- **Unsure escape hatch.** Tell it what to do when the rubric doesn't decide: "If an entry doesn't clearly fit a category, label it UNSURE" — this prevents invented answers, the tier's main failure mode.
- **One bounded decision per call.** One artifact, one classification pass. Scale by making many calls, not by stuffing one context.

## Delete on sight

- Open-ended judgment asks ("assess the quality") without a rubric.
- Multi-step autonomy, planning, or anything requiring it to decide what to do next.
- Long background context it doesn't need for the single decision — least context, not most.

## Always add (shared content set, compressed)

One-line intent, hard constraints verbatim, the exact output shape, the unsure escape hatch. The evidence-audit block compresses to: "Only label what appears in the artifact; never infer missing content."

## Dispatch settings

- Ideal as the high-volume grader in maker-never-grader setups: artifacts + rubric only, fresh context, many cheap calls.
- Standard Claude safety; no special refusal routing.
