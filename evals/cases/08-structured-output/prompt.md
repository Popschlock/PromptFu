---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Optimize this for GPT-6.1 Terra through the API.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

You are an expert sentiment analysis AI. Analyze the customer review I give you and output JSON. I want sentiment on a 1-5 scale (1 is furious, 5 is delighted), up to 3 topics from this list only: shipping, price, quality, support, app, other. And a boolean escalate which is true if they mention a chargeback, a lawyer, or a safety issue. Also a short summary max 20 words. Field names: sentiment, topics, escalate, summary. ONLY output the JSON, no markdown fences, no explanation!!! If the review is empty or not in a language you understand set sentiment to null. Make sure the JSON is valid, double check it.
