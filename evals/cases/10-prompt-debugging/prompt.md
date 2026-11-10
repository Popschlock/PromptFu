---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

This prompt keeps failing. Debug it and give me the fixed prompt.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

This prompt keeps failing on GPT-6 Astra and I don't know why. About 1 in 4 runs it wraps the answer in ```json fences and adds a sentence before it, which breaks our parser. Sometimes it also asks me a clarifying question instead of answering. Here is the prompt:

"You are a helpful assistant. Extract the meeting details from the email below. Be careful and thorough. Return JSON with title, start (ISO 8601), end (ISO 8601), attendees (list of emails), location. If something is missing use your best judgment. Feel free to ask if anything is unclear. Email: {email_body}"

Fix it. Keep the five field names and the {email_body} placeholder exactly.
