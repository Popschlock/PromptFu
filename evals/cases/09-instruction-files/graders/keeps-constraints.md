---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:migration-reviewer))(?=.*(?:db/migrations/))(?=.*(?:BLOCKER))(?=.*(?:WARN))(?=.*(?:NIT))(?=.*(?:DROP COLUMN))(?=.*(?:DROP TABLE))(?=.*(?:down\(\)))(?=.*(?:orders))(?=.*(?:online-schema-change))(?=.*(?:severity))(?=.*(?:file))(?=.*(?:line))(?=.*(?:finding))'
---
