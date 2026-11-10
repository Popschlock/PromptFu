---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:Brand, Kit type, Motor power \(W\), Price \(EUR\), Legal in EU \(Y/N\), Source))(?=.*(?:2024))(?=.*(?:250\s?W))(?=.*(?:25 km/h))(?=.*(?:Netherlands))(?=.*(?:(1|one)[- ]page))'
---
