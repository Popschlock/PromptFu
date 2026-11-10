---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for Claude Sonnet 5.5.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

Write an agent definition (the markdown file that goes in .claude/agents/) for a "migration-reviewer" subagent that will run on Sonnet 5.5. It reviews SQL migration files in db/migrations/ before merge. It MUST flag: any DROP COLUMN or DROP TABLE without a matching backfill note, any migration missing a down() function, any ALTER on the orders table that isn't wrapped in the online-schema-change helper. It must NEVER edit files, it only reports. ALWAYS be extremely thorough and ALWAYS check everything. Output is a list where each item is severity (BLOCKER / WARN / NIT), file, line, finding. It should have read only tools. Also remind it of our coding standards which are in CLAUDE.md already. Tell it to think step by step and explain its reasoning for each finding.
