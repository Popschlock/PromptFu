---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:services/billing/legacy/))(?=.*(?:85\s?%))(?=.*(?:make cov))(?=.*(?:file \| status \| notes))(?=.*(?:test names))(?=.*(?:unittest))(?=.*(?:pytest))'
---
