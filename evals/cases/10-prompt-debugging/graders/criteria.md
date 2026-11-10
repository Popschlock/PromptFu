---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for GPT-6 Astra. It is a rewrite of the draft below. The draft is a report about a failing prompt, quoted inside it, and the text you are judging is the fixed version of that quoted prompt.

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

This prompt keeps failing on GPT-6 Astra and I don't know why. About 1 in 4 runs it wraps the answer in ```json fences and adds a sentence before it, which breaks our parser. Sometimes it also asks me a clarifying question instead of answering. Here is the prompt:

"You are a helpful assistant. Extract the meeting details from the email below. Be careful and thorough. Return JSON with title, start (ISO 8601), end (ISO 8601), attendees (list of emails), location. If something is missing use your best judgment. Feel free to ask if anything is unclear. Email: {email_body}"

Fix it. Keep the five field names and the {email_body} placeholder exactly.
