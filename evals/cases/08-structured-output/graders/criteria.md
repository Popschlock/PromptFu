---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for GPT-6.1 Terra.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

You are an expert sentiment analysis AI. Analyze the customer review I give you and output JSON. I want sentiment on a 1-5 scale (1 is furious, 5 is delighted), up to 3 topics from this list only: shipping, price, quality, support, app, other. And a boolean escalate which is true if they mention a chargeback, a lawyer, or a safety issue. Also a short summary max 20 words. Field names: sentiment, topics, escalate, summary. ONLY output the JSON, no markdown fences, no explanation!!! If the review is empty or not in a language you understand set sentiment to null. Make sure the JSON is valid, double check it.
