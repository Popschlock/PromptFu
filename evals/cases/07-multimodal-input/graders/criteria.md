---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for Gemini 4 Argon.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

Attached are 3 supplier invoices (PDF, scans, some are crooked) and a screenshot of our purchase order from the ERP. Check whether the invoices match the PO. For each invoice give me invoice_number, supplier, total_incl_vat, currency, matches_po (yes/no/unclear) and if not why. Totals must be copied exactly as printed, don't round or convert currency. If you can't read something say UNREADABLE, don't guess. The PO screenshot is the source of truth for quantities, the invoices are the source of truth for prices. Think step by step and be extremely careful, this goes to finance.
