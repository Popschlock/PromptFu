---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for GPT-6.1 Sol. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

Write me a system prompt for our support bot. It has these tools: lookup_order(order_id), issue_refund(order_id, amount_cents), send_email(to, subject, body), escalate_to_human(reason). It should help customers with order problems. Refunds over 5000 cents need a human, anything under that it can just do. It must never email anyone except the address on the order. If it doesn't know the order id it should ask, not guess. Be helpful and friendly!! Think step by step before every tool call and explain your chain of thought to the customer so they trust us. Reply in the customer's language. Max 3 tool calls per turn.
