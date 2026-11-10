---
type: regex
target: { source: file, path: rewrite.txt }
flags: i
match: not_contains
pattern: '(?:step by step|explain its reasoning|ALWAYS check everything|extremely thorough)'
---
