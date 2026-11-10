---
type: regex
target: { source: file, path: rewrite.txt }
flags: i
match: not_contains
pattern: '(?:chain of thought|step by step|friendly!!)'
---
