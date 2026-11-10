# Playbook: deep research

A brief for an agent that searches and reads for minutes to hours and hands back a cited report.
The rewrite adds the decision the report serves, the sources that count and how evidence is
labeled.

## Applies when

Deep research, research report, market research, literature review, competitive analysis, due
diligence, "find out everything about", or a request that names a research product. Nearest
neighbor: `tasks/long-run-agentic.md`, for an agent whose work ends in a changed state.

## Blocks

Fill each line from the draft, ask when the user is present, or label it `Assumption:`. A line
with no material stays out.

- **Research question**, required: the question in one sentence.
- **Decision / outcome**, required: who will use the report and for which decision. It replaces
  Intent. Infer it when the draft is silent, and label it.
- **Scope**, the lines the draft supplies: include, exclude, timeframe, geography, population.
  Never invent a date range or a region.
- **Source strategy**, required: which tier answers which question. Tier 1: government,
  regulators, official company documentation, primary research. Tier 2: independent industry
  analysis, academic reviews, established journalism. Tier 3: community discussion, as
  qualitative evidence only. Tier 4: directories and aggregators. Named sites, files and source
  types to avoid come only from the draft. When the draft brings private files, name them as
  the source of truth and public sources as verification, and say which internal figures are
  forecasts.
- **Evidence rules**, required: the template's seven lines as they stand, so a vendor claim
  never reads as a verified fact.
- **Research tasks**, one line for each of discover, verify, compare, analyze and challenge that
  the question calls for.
- **Analysis framework**, when the report compares options or ends in a recommendation: the
  comparison dimensions, stated before the recommendation is asked for.
- **Output**, required: the author's section list when the draft has one. Otherwise summary, key
  findings, unknowns and source list, plus a comparison table, disagreements, risks and next
  steps where the question calls for them.
- **Stop condition**, when nobody reviews the plan before the run: stop when the questions are
  answered well enough to support the decision. "Do not continue researching merely to increase
  source count."

Plan review, site restrictions and attached sources are set outside the prompt, and the model
card names the control. Tell the user to check citations by hand before a consequential
decision.

## Delete

- A topic with no decision behind it. "Research X" becomes "research X so that Y can decide Z".
- "Use reliable sources" with no role assigned to any source.
- Dozens of exact search queries. Name evidence targets and let the agent search.
- "Be thorough" and "be comprehensive". The stop condition does that work.

## Template

Keep the label words in every dialect. A research product's plan review echoes them back.

```
[Research question] <what to investigate>
[Decision / outcome] This research will be used to: <decision, audience, final purpose>
[Scope]
Include: <topics>. Exclude: <topics>. Timeframe: <date range>. Geography: <region>.
Population/customer/domain: <target>
[Source strategy]
Prioritize: <the tiers that apply, in order>
Use these specific sources: <sites or files>
Avoid: <source types>
[Evidence rules]
- Cite important factual claims
- Prefer primary sources for direct facts
- Date time-sensitive claims
- Separate verified facts, vendor claims, estimates, forecasts, user reports, inference
- When credible sources disagree, show disagreement and explain scope/methodology
- Do not invent missing information
- Mark unresolved questions explicitly
[Research tasks]
Discover: <what to identify>. Verify: <what to check from authoritative sources>.
Compare: <what to compare>. Analyze: <patterns, relationships, tradeoffs>.
Challenge: <contrary evidence to seek>.
[Analysis framework] Compare findings on: <dimensions/criteria>
[Output] Return: <sections, in order>
```

## Check before sending

- Does the brief say who decides what with the report?
- Does every question have a source tier, and are the six evidence labels named?
- Are the comparison dimensions stated before any recommendation is requested?
- Is every scope line, named source and section from the draft or labeled an assumption?
