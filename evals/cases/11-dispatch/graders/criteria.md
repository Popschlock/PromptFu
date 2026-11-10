---
type: llm
focus: { source: file, path: rewrite.txt }
---

The text you are judging is a rewrite of the draft prompt below, meant for Agent tool, model: haiku.

PASS if the rewrite asks for the same deliverable as the draft, keeps every format, name, path, count, limit and quoted text the draft states, and adds no requirement the draft did not state unless that addition is labeled as an assumption. Dropping a request to think harder, think step by step, show reasoning or double-check is fine and does not count against it.

FAIL if the rewrite drops or changes something the draft asked for, adds unlabeled requirements such as budgets, caps or extra outputs, or pads the prompt with role play or filler.

The draft:

Go through the src/ folder and find every place we call the old logger (log.write or Logger.legacy). Think carefully. For each one tell me the file and line and what the new call should be (logger.info / logger.warn / logger.error depending on the level arg). Don't change any files. Skip src/vendor/ and anything under __generated__. Give me the results as a markdown table: file | line | old call | new call. If you're not sure about the level just say UNSURE. Show your reasoning for each mapping.
