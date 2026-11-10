---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:title))(?=.*(?:start))(?=.*(?:end))(?=.*(?:attendees))(?=.*(?:location))(?=.*(?:\{email_body\}))(?=.*(?:ISO 8601))'
---
