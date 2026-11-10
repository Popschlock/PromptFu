---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:log\.write))(?=.*(?:Logger\.legacy))(?=.*(?:logger\.info))(?=.*(?:logger\.warn))(?=.*(?:logger\.error))(?=.*(?:src/vendor/))(?=.*(?:__generated__))(?=.*(?:file \| line \| old call \| new call))(?=.*(?:UNSURE))(?=.*(?:src/))'
---
