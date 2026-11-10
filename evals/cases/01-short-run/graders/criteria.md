---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for Claude Opus 5.5.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

You are a world-class senior technical writer with 20 years of experience. I need you to think really carefully step by step about this. Take the changelog entry below and rewrite it so that normal users can understand it, right now it's way too technical. Be concise. Be very concise, don't be verbose. It needs to be 2 sentences max and it must keep the version number v3.4.1 exactly and must not mention the internal ticket ID. Don't hallucinate anything that isn't in the entry. Please show your reasoning before the final answer.

Entry: "v3.4.1: fix race in SyncQueue.flush() where concurrent enqueue during drain dropped the tail batch (PLAT-2291); bump retry backoff ceiling 30s -> 120s"
