---
type: regex
target: { source: file, path: rewrite.txt }
flags: is
pattern: '^(?=.*(?:invoice_number))(?=.*(?:supplier))(?=.*(?:total_incl_vat))(?=.*(?:currency))(?=.*(?:matches_po))(?=.*(?:yes/no/unclear|yes, no,? or unclear|`yes`.{0,12}`no`.{0,12}`unclear`))(?=.*(?:UNREADABLE))(?=.*(?:quantit))(?=.*(?:price))'
---
