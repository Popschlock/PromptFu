---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for auto (Claude Code session).

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

Refactor the payment retry module (payments/retry/) so the backoff policy is injectable. There are 14 call sites. All existing tests in tests/payments/ must pass unchanged and public function signatures in payments/retry/__init__.py must not change. Add tests for the new injection point. Run it overnight, I will review the PR in the morning.
