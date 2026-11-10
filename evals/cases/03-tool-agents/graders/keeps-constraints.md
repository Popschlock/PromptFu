---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:lookup_order))(?=.*(?:issue_refund))(?=.*(?:send_email))(?=.*(?:escalate_to_human))(?=.*(?:5000 cents))(?=.*(?:(3|three) tool calls))(?=.*(?:language))'
---
