---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a prompt meant for Agent tool, model: haiku. It is a rewrite of the draft below. The draft is a brief one agent was about to send to a subagent.

PASS if it asks for the same deliverable as the draft and someone could act on it without seeing the draft.

FAIL if it asks for a different deliverable, if it describes or critiques the draft and is not itself a usable prompt, or if it tells the model to think step by step, think harder or show its reasoning.

Added structure, added detail and lines labeled as assumptions are not reasons to fail.

The draft:

Go through the src/ folder and find every place we call the old logger (log.write or Logger.legacy). Think carefully. For each one tell me the file and line and what the new call should be (logger.info / logger.warn / logger.error depending on the level arg). Don't change any files. Skip src/vendor/ and anything under __generated__. Give me the results as a markdown table: file | line | old call | new call. If you're not sure about the level just say UNSURE. Show your reasoning for each mapping.
