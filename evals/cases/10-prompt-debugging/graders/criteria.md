---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for GPT-6 Astra.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

This prompt keeps failing on GPT-6 Astra and I don't know why. About 1 in 4 runs it wraps the answer in ```json fences and adds a sentence before it, which breaks our parser. Sometimes it also asks me a clarifying question instead of answering. Here is the prompt:

"You are a helpful assistant. Extract the meeting details from the email below. Be careful and thorough. Return JSON with title, start (ISO 8601), end (ISO 8601), attendees (list of emails), location. If something is missing use your best judgment. Feel free to ask if anything is unclear. Email: {email_body}"

Fix it. Keep the five field names and the {email_body} placeholder exactly.
