---
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
tags: [rewrite]
---

Silent dispatch pass: you are about to send this prompt in an Agent call with subagent_type general-purpose and model haiku. Apply the skill to it first, the way the plugin's hook asks, and send the result.

Save the prompt you would send, and nothing else, to a file named rewrite.txt in the current directory. Nobody is here to answer questions, and the files the draft names do not exist on this machine.

The draft:

Go through the src/ folder and find every place we call the old logger (log.write or Logger.legacy). Think carefully. For each one tell me the file and line and what the new call should be (logger.info / logger.warn / logger.error depending on the level arg). Don't change any files. Skip src/vendor/ and anything under __generated__. Give me the results as a markdown table: file | line | old call | new call. If you're not sure about the level just say UNSURE. Show your reasoning for each mapping.
