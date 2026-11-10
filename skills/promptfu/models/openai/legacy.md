# OpenAI legacy models

Verified 2026-11-10 against the pages under Sources.
Sources: https://developers.openai.com/api/docs/ (models/all, the model page for each ID below, guides/latest-model/gpt-5.6, guides/latest-model/gpt-6-astra, guides/prompt-guidance-gpt-5p6, guides/daybreak, deprecations), https://learn.chatgpt.com/docs/models, https://help.openai.com/en/articles/20001354-gpt-6-and-other-models-in-chatgpt
Unverified: none.

Use an entry only when a dispatch or a request pins the model. OpenAI does not call the models with an entry here legacy or deprecated: its catalog lists them under "More models", and GPT-5.6 Cyber under "OpenAI Daybreak". The family file applies to all of them.

## GPT-6 Sol (`gpt-6-sol`)

Built for complex coding and agentic workflows. Its page points to GPT-6.1 Sol as the newer Sol. Unlike GPT-6.1 Sol it accepts `none` (`none` to `max`, default `medium`). In Chat Completions it calls functions only at `none`, so use the Responses API for tools. The Help Center says it powers GPT-6 in ChatGPT's Chat at every level below Pro. OpenAI publishes no prompt text for it.

## GPT-5.6 Sol, Terra, Luna (`gpt-5.6-sol` or `gpt-5.6`, `gpt-5.6-terra`, `gpt-5.6-luna`)

Sol is the GPT-5.6 flagship, Terra balances intelligence and cost, and Luna is for cost-sensitive, high-volume work. The family file's Structure section was written for these three, so apply it as it stands.

- Effort `none` to `max`, default `medium`. Coming from GPT-5.5 or GPT-5.4, keep the current level and test one level lower.
- More concise by default than GPT-5.5. Test a "be concise" rule before keeping it.
- Proactive and persistent on multi-step tasks, so say what each request authorizes (the autonomy block in the family file).
- Reasoning from earlier turns is reused by default (`reasoning.context` is `all_turns`). Set `current_turn` when earlier reasoning no longer applies.
- Pro mode is a request setting (`reasoning.mode: "pro"`, also on GPT-6) and needs no change to the prompt.
- Cyber and biology classifiers can block a request or pause a stream for several seconds.
- Moving to GPT-6: keep the effective effort, and use `low` on Astra or GPT-6.1 Sol where the old setting was `none`.

## GPT-5.6 Cyber (`gpt-5.6-cyber`)

For approved defenders with Daybreak Red access. Its context window is 400,000 tokens with 272,000 of input, well under the other tiers.

## GPT-5.5, GPT-5.4, GPT-5.2 (`gpt-5.5`, `gpt-5.4`, `gpt-5.2`)

Effort stops at `xhigh`, with no `max`. GPT-5.5 defaults to `medium`, and GPT-5.4 and GPT-5.2 to `none`, so set effort explicitly. Codex with ChatGPT sign-in has retired GPT-5.5 and GPT-5.4 and deprecated GPT-5.2, and API-key sessions are unaffected.

The GPT-5, o3, GPT-4.1 and GPT-4o lines are deprecated with shutdown dates. The deprecations page names `gpt-5.6-sol` to replace `gpt-5` and `o3`, and `gpt-6-luna` to replace GPT-4o and GPT-4.1.
