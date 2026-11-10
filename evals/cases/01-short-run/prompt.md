---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Optimize this prompt for Claude Opus 5.5.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

You are a world-class senior technical writer with 20 years of experience. I need you to think really carefully step by step about this. Take the changelog entry below and rewrite it so that normal users can understand it, right now it's way too technical. Be concise. Be very concise, don't be verbose. It needs to be 2 sentences max and it must keep the version number v3.4.1 exactly and must not mention the internal ticket ID. Don't hallucinate anything that isn't in the entry. Please show your reasoning before the final answer.

Entry: "v3.4.1: fix race in SyncQueue.flush() where concurrent enqueue during drain dropped the tail batch (PLAT-2291); bump retry backoff ceiling 30s -> 120s"
