---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:sentiment))(?=.*(?:topics))(?=.*(?:escalate))(?=.*(?:summary))(?=.*(?:1-5|1 to 5))(?=.*(?:shipping))(?=.*(?:price))(?=.*(?:quality))(?=.*(?:support))(?=.*(?:app))(?=.*(?:other))(?=.*(?:20 words))(?=.*(?:null))(?=.*(?:chargeback))(?=.*(?:lawyer))(?=.*(?:safety))'
---
