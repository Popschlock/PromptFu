---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for GPT-6.1 Terra. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

You are an expert sentiment analysis AI. Analyze the customer review I give you and output JSON. I want sentiment on a 1-5 scale (1 is furious, 5 is delighted), up to 3 topics from this list only: shipping, price, quality, support, app, other. And a boolean escalate which is true if they mention a chargeback, a lawyer, or a safety issue. Also a short summary max 20 words. Field names: sentiment, topics, escalate, summary. ONLY output the JSON, no markdown fences, no explanation!!! If the review is empty or not in a language you understand set sentiment to null. Make sure the JSON is valid, double check it.
