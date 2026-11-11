# Harnesses

Where each harness keeps its model and effort, what a dispatch takes there, and which names exist only there. Read the one section you need: when the target or its effort is not visible to you, or when the prompt is headed for another harness or a chat product.

Verified 2026-11-10 against the Claude Code docs (skills, hooks, sub-agents, model configuration), the Codex docs (skills, subagents, configuration, AGENTS.md, hooks) and the Gemini CLI and Antigravity docs.
Sources: https://code.claude.com/docs/en/skills, https://code.claude.com/docs/en/sub-agents, https://code.claude.com/docs/en/model-config, https://developers.openai.com/codex/llms.txt, https://geminicli.com/docs, https://antigravity.google/docs
Unverified: that Claude Code's system prompt names the session model (observed in sessions, not stated in the docs), and whether the Codex or Gemini CLI system prompt names the session model.

## Claude Code

- **Session model and effort.** The system prompt names the model and its ID. Inside a skill, `${CLAUDE_EFFORT}` is the current effort. Effort resolves in this order: the `CLAUDE_CODE_EFFORT_LEVEL` variable, a level picked in the session, the `--effort` flag, settings, then the model's default.
- **Dispatch.** The Agent tool's `model` takes a tier alias and never a full ID. A call that sets none resolves through the agent definition, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the session model. A non-fork call can also pass `effort`, and a subagent on another model without one runs at that model's own default. A fork inherits the model, the tools and the whole conversation. A workflow stage that names a model counts as a per-call model, and a stage that names none runs on the session model.
- **Auto-triggers.** This plugin's hooks say once at session start that the skill applies to dispatches that carry real work, add one line to a typed prompt over the word threshold, and note the first unstructured dispatch of a session. They never block unless the user turned on gate mode.
- **Names that exist here only.** `AskUserQuestion`, `subagent_type`, `SendMessage`, `Workflow`, `/skill-name`, `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`. Keep them out of a prompt for another harness.

## Codex

- **Session model and effort.** `model` and `model_reasoning_effort` in `~/.codex/config.toml`. Command-line flags and `--config` overrides win over a trusted project's `.codex/config.toml`, which wins over the user file. In a session, `/model [model] [--reasoning=<level>]` changes both. When you read the value from the file, say so in the report, because a flag may have overridden it.
- **Effort levels** are the ones the selected model advertises, such as `low`, `medium`, `high`, `xhigh`, `max` or `ultra`, and they vary by model and client.
- **Dispatch.** A subagent inherits the parent's model and effort unless the prompt asks for another, the `[agents]` defaults set one, or a custom agent file under `.codex/agents/` pins one. Naming a model without an effort drops the subagent to that model's default effort, so name both. Codex delegates when asked directly or when `AGENTS.md` or a skill requests it. The dispatch tool is `spawn_agent`.
- **Skills and instruction files.** Skills load from `~/.agents/skills/` and from `.agents/skills/` in every directory from the working directory up to the repository root. `AGENTS.md` loads from the Codex home and from the project root down to the working directory, up to a combined size limit.
- **Auto-trigger.** When this plugin is installed in Codex, its three hooks run once the user has approved them in `/hooks`. A skill folder copied alone carries no hooks, and the trigger there is a line in `AGENTS.md` that says when to apply the skill.
- **Names.** No `AskUserQuestion`, no `subagent_type`, and Claude Code tool names mean nothing here. Ask a plain question instead.

## Gemini CLI and Antigravity

- **Gemini CLI** reads skills from `~/.agents/skills/` and `.agents/skills/` as well as its own `.gemini/skills/` folders, so a copy made for Codex reaches it. The model is `model.name` in `~/.gemini/settings.json` or the project's `.gemini/settings.json`, the `--model` flag, or `/model`. Thinking is set per model alias under `modelConfigs`. Its question tool is `ask_user`.
- **Antigravity** reads workspace skills from `.agents/skills/`. Its personal folder is `~/.gemini/config/skills/`, and a folder elsewhere has to be listed in `~/.gemini/config/skills.json`. It has a model selector with a thinking level, and its CLI takes `/effort` and `--effort`.
- If you are running in either, state the harness as an assumption in the report.

## Chat and web products

A prompt pasted into a chat app, an image or video tool, or a research mode has no effort, schema or tool parameter to set. Put the depth and format asks into the prompt text the way the card says, name the product's own controls in the report (a research plan review, an image quality option), and take the model shown in the product's picker as the target. The vendor's family file maps it to a card.

## Telling which harness you are in

- Tools named `Agent` and `AskUserQuestion`, and a real path where `SKILL.md` writes its folder variable: Claude Code.
- Base instructions that name Codex, a `.codex/` directory, a `spawn_agent` tool: Codex.
- A `~/.gemini/` directory and an `ask_user` or `activate_skill` tool: Gemini CLI or Antigravity.
- None of these: say so, and resolve the target from the request alone.
