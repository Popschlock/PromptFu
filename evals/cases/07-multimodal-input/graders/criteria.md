---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for Gemini 4 Argon. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

Attached are 3 supplier invoices (PDF, scans, some are crooked) and a screenshot of our purchase order from the ERP. Check whether the invoices match the PO. For each invoice give me invoice_number, supplier, total_incl_vat, currency, matches_po (yes/no/unclear) and if not why. Totals must be copied exactly as printed, don't round or convert currency. If you can't read something say UNREADABLE, don't guess. The PO screenshot is the source of truth for quantities, the invoices are the source of truth for prices. Think step by step and be extremely careful, this goes to finance.
