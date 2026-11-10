---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for Claude Sonnet 5.5. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

Write an agent definition (the markdown file that goes in .claude/agents/) for a "migration-reviewer" subagent that will run on Sonnet 5.5. It reviews SQL migration files in db/migrations/ before merge. It MUST flag: any DROP COLUMN or DROP TABLE without a matching backfill note, any migration missing a down() function, any ALTER on the orders table that isn't wrapped in the online-schema-change helper. It must NEVER edit files, it only reports. ALWAYS be extremely thorough and ALWAYS check everything. Output is a list where each item is severity (BLOCKER / WARN / NIT), file, line, finding. It should have read only tools. Also remind it of our coding standards which are in CLAUDE.md already. Tell it to think step by step and explain its reasoning for each finding.
