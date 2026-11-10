---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:v3\.4\.1))(?=.*(?:SyncQueue\.flush\(\)))(?=.*(?:PLAT-2291))(?=.*(?:(2|two) sentences))(?=.*(?:ticket))'
---
