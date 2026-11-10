---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for auto (Claude Code session). It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

Refactor the payment retry module (payments/retry/) so the backoff policy is injectable. There are 14 call sites. All existing tests in tests/payments/ must pass unchanged and public function signatures in payments/retry/__init__.py must not change. Add tests for the new injection point. Run it overnight, I will review the PR in the morning.
