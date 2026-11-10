---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Agent, Read, Glob, Grep, Skill]
tags: [trigger]
---

Hand the review below to a subagent and give me its findings. I want a second pair of eyes on this plan before Thursday.

Review this rollout plan for our payments service and list what could go wrong, most serious first. For each risk give the step it comes from, what would fail, how we would notice, and a mitigation. Do not rewrite the plan and do not list anything that is merely style. Keep it to the ten most serious risks.

Plan:
1. Friday 17:00: freeze deploys to the payments service.
2. Friday 18:00: run the schema migration that splits the ledger table, on the primary, with no dry run on staging because staging data is stale.
3. Friday 18:30: deploy the new service version to all regions at once.
4. Friday 19:00: turn off the old reconciliation job.
5. Monday 09:00: check the dashboards and unfreeze.
Rollback: restore from the nightly backup taken Thursday at 02:00.
