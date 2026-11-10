---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for Claude Fable 5.2.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

ok so I need you to migrate our test suite from unittest to pytest. the repo is at services/billing. Follow these steps exactly: 1. read every test file 2. think hard about the best approach 3. convert one file 4. run the tests 5. show me your full reasoning and wait for me to approve 6. go to the next file. IMPORTANT!!! NEVER touch anything under services/billing/legacy/ because it is frozen for the audit. coverage must stay at or above 85% (we check with `make cov`). don't change any test names because the CI dashboard keys on them. I'll be away so just keep going until you're done, don't stop. also if you see other stuff that's broken feel free to fix it I guess. when you're done give me a table with columns file | status | notes and nothing else. Double check everything twice before you say it's done.
