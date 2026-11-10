---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for Claude Fable 5.2. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

ok so I need you to migrate our test suite from unittest to pytest. the repo is at services/billing. Follow these steps exactly: 1. read every test file 2. think hard about the best approach 3. convert one file 4. run the tests 5. show me your full reasoning and wait for me to approve 6. go to the next file. IMPORTANT!!! NEVER touch anything under services/billing/legacy/ because it is frozen for the audit. coverage must stay at or above 85% (we check with `make cov`). don't change any test names because the CI dashboard keys on them. I'll be away so just keep going until you're done, don't stop. also if you see other stuff that's broken feel free to fix it I guess. when you're done give me a table with columns file | status | notes and nothing else. Double check everything twice before you say it's done.
