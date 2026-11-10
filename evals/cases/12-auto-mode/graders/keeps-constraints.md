---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:payments/retry/))(?=.*(?:tests/payments/))(?=.*(?:payments/retry/__init__\.py))(?=.*(?:14 call sites))(?=.*(?:backoff))'
---
