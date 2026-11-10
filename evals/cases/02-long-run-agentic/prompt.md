---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Optimize this prompt for Claude Fable 5.2. It will run unattended in Claude Code.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

ok so I need you to migrate our test suite from unittest to pytest. the repo is at services/billing. Follow these steps exactly: 1. read every test file 2. think hard about the best approach 3. convert one file 4. run the tests 5. show me your full reasoning and wait for me to approve 6. go to the next file. IMPORTANT!!! NEVER touch anything under services/billing/legacy/ because it is frozen for the audit. coverage must stay at or above 85% (we check with `make cov`). don't change any test names because the CI dashboard keys on them. I'll be away so just keep going until you're done, don't stop. also if you see other stuff that's broken feel free to fix it I guess. when you're done give me a table with columns file | status | notes and nothing else. Double check everything twice before you say it's done.
