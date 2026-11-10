---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Which model and effort should I use for this in Claude Code, and optimize the prompt for that pick.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

Refactor the payment retry module (payments/retry/) so the backoff policy is injectable. There are 14 call sites. All existing tests in tests/payments/ must pass unchanged and public function signatures in payments/retry/__init__.py must not change. Add tests for the new injection point. Run it overnight, I will review the PR in the morning.
