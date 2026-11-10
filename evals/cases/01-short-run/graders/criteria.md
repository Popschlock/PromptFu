---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for Claude Opus 5.5. It is a rewrite of the draft below. 

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

You are a world-class senior technical writer with 20 years of experience. I need you to think really carefully step by step about this. Take the changelog entry below and rewrite it so that normal users can understand it, right now it's way too technical. Be concise. Be very concise, don't be verbose. It needs to be 2 sentences max and it must keep the version number v3.4.1 exactly and must not mention the internal ticket ID. Don't hallucinate anything that isn't in the entry. Please show your reasoning before the final answer.

Entry: "v3.4.1: fix race in SyncQueue.flush() where concurrent enqueue during drain dropped the tail batch (PLAT-2291); bump retry backoff ceiling 30s -> 120s"
