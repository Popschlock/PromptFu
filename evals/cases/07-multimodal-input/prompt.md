---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Optimize this for Gemini 4 Argon through the API.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

Attached are 3 supplier invoices (PDF, scans, some are crooked) and a screenshot of our purchase order from the ERP. Check whether the invoices match the PO. For each invoice give me invoice_number, supplier, total_incl_vat, currency, matches_po (yes/no/unclear) and if not why. Totals must be copied exactly as printed, don't round or convert currency. If you can't read something say UNREADABLE, don't guess. The PO screenshot is the source of truth for quantities, the invoices are the source of truth for prices. Think step by step and be extremely careful, this goes to finance.
