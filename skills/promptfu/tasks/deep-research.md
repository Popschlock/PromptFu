# Playbook: deep research

A deep research prompt briefs an agent that will search, read and synthesize for minutes to
hours and then hand back a report. The draft usually names a topic and nothing else, so the
rewrite adds the decision the report serves, the sources that count and how evidence is labelled.

Last verified 2026-09-18 against the PrompTessor deep research guide and the Google model catalog.
Sources: https://promptessor.com/blog/deep-research-prompting-guide, https://ai.google.dev/gemini-api/docs/models, https://en.wikipedia.org/wiki/ChatGPT_Deep_Research (secondary, for the ChatGPT model)

## When this playbook applies

Trigger words: deep research, research report, market research, literature review, competitive
analysis, due diligence, "find out everything about", or a request that names ChatGPT Deep
Research, Gemini Deep Research or Claude Research. The deliverable is a document with citations.

Nearest neighbour: `tasks/long-run-agentic.md`, for an agent whose work ends in a changed state.

## Required blocks

The guide's seven layers are all required, since a missing layer is why reports answer the wrong question.

- RESEARCH QUESTION (required): the question in one sentence.
- DECISION / OUTCOME (required): who will use the report and for which decision. This block replaces Intent from the universal shape.
- SCOPE (required): include, exclude, timeframe, geography, population. Hard constraints go here verbatim.
- SOURCE STRATEGY (required): which source tier answers which question, named sites or files to use, source types to avoid. Tiers from the guide: 1 government, regulators, official company documentation, primary research. 2 independent industry analysis, academic reviews, established journalism. 3 community discussion, as qualitative evidence only. 4 directories and aggregators.
- EVIDENCE RULES (required): citation, dating, conflict handling, unknowns, and six labels kept apart: verified facts, vendor claims, estimates, forecasts, user reports, inference.
- RESEARCH TASKS (required): discover, verify, compare, analyze, challenge.
- ANALYSIS FRAMEWORK (required): the comparison dimensions, stated before any recommendation is requested.
- OUTPUT (required): section list, tables, risks, unknowns, next steps, source list.
- STOP CONDITION (conditional, for unattended products): when the questions are answered well enough to support the decision. "Do not continue researching merely to increase source count."

## Delete

- A topic with no decision behind it. "Research X" becomes "research X so that Y can decide Z".
- "Use reliable sources" with no role assigned to any source.
- Dozens of exact search queries. Name evidence targets and let the agent search.
- Requests for background history while a decision is waiting.
- "Be thorough" and "be comprehensive". The stop condition does that work with fewer words.

## Token rule

A research brief is one of the few prompt types that should grow. The draft is usually one or
two sentences, and the rewrite is the template filled in, typically 150 to 350 words, where
every line names something the agent would otherwise guess. The report will run to thousands of
words, so a tight brief saves far more than it costs. Do not pad the source strategy.

## Template

Verbatim from the guide. Its labels are the ones the products' own plan reviews echo back.

```
DEEP RESEARCH BRIEF

RESEARCH QUESTION
[what you want investigated]

DECISION / OUTCOME
This research will be used to:
[decision, audience, final purpose]

SCOPE
Include: [included topics]
Exclude: [excluded topics]
Timeframe: [date range]
Geography: [region/jurisdiction]
Population/customer/domain: [target]

SOURCE STRATEGY
Prioritize:
1. [primary/official sources]
2. [independent sources]
3. [industry sources]
4. [community sources]
Use these specific sources: [sites/files]
Avoid: [source types]

EVIDENCE RULES
- Cite important factual claims
- Prefer primary sources for direct facts
- Date time-sensitive claims
- Separate verified facts, vendor claims, estimates, forecasts, user reports, inference
- When credible sources disagree, show disagreement and explain scope/methodology
- Do not invent missing information
- Mark unresolved questions explicitly

RESEARCH TASKS
1. Discover: [what to identify]
2. Verify: [what to check from authoritative sources]
3. Compare: [what should be compared]
4. Analyze: [patterns, relationships, tradeoffs]
5. Challenge: [contrary evidence to seek]

ANALYSIS FRAMEWORK
Compare findings on: [dimensions/criteria]

OUTPUT
Return:
1. Executive summary
2. Key findings
3. Evidence/comparison table
4. Contradictions or disagreements
5. Risks and limitations
6. Unknowns
7. Recommended next steps
8. Source list
```

## Per-vendor notes

- ChatGPT Deep Research runs on a GPT-5.2-based model since February 2026 (secondary source). Controls outside the prompt: restrict or prioritize specific websites, attach uploaded files and connected sources, review the research plan before it runs, interrupt mid-run to redirect, export to Markdown, Word or PDF. Agent mode adds a visual browser. Family conventions in `models/openai/_family.md`.
- Gemini Deep Research: add Gmail, Drive, uploaded files and NotebookLM notebooks. Name private sources as the source of truth and public sources as verification, and say which internal figures are forecasts. Edit the plan before generation begins. API models are `deep-research-preview-04-2026` and `deep-research-max-preview-04-2026`, both preview. Family conventions in `models/google/_family.md`.
- Claude Research: the research mode in claude.ai searches the web and connected sources. Plan review and source restriction controls were not verified this session. Family conventions in `models/anthropic/_family.md`.
- All three: verify the citations by hand before a consequential decision. The guide's checklist covers scope coverage, source quality, recency, traceability, conflict handling, uncertainty labelling, comparison quality, decision usefulness and actionability.

## Check before sending

- Does the brief say who decides what with the report?
- Does every question have a source tier assigned?
- Are the six evidence labels named?
- Are the comparison dimensions stated before the recommendation is requested?
- Is there a stop condition, or a plan review step in the product?
- Are the exclusions and the timeframe explicit?
