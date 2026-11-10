---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for GPT-6.1 Sol.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

Write me a system prompt for our support bot. It has these tools: lookup_order(order_id), issue_refund(order_id, amount_cents), send_email(to, subject, body), escalate_to_human(reason). It should help customers with order problems. Refunds over 5000 cents need a human, anything under that it can just do. It must never email anyone except the address on the order. If it doesn't know the order id it should ask, not guess. Be helpful and friendly!! Think step by step before every tool call and explain your chain of thought to the customer so they trust us. Reply in the customer's language. Max 3 tool calls per turn.
