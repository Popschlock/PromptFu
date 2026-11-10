---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Optimize this. The agent definition it produces will run on Claude Sonnet 5.5 in Claude Code.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

Write an agent definition (the markdown file that goes in .claude/agents/) for a "migration-reviewer" subagent that will run on Sonnet 5.5. It reviews SQL migration files in db/migrations/ before merge. It MUST flag: any DROP COLUMN or DROP TABLE without a matching backfill note, any migration missing a down() function, any ALTER on the orders table that isn't wrapped in the online-schema-change helper. It must NEVER edit files, it only reports. ALWAYS be extremely thorough and ALWAYS check everything. Output is a list where each item is severity (BLOCKER / WARN / NIT), file, line, finding. It should have read only tools. Also remind it of our coding standards which are in CLAUDE.md already. Tell it to think step by step and explain its reasoning for each finding.
