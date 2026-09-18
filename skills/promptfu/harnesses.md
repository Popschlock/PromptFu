# Harnesses

How each harness names its model and effort, what a dispatch looks like there, and which names exist only there. Read the section for the harness you are running in when you resolve the target (SKILL.md, workflow step 1), and read the last section when the prompt will be pasted into a chat product.

Last verified 2026-09-18 against a Claude Code session, a Codex session transcript on this machine, `~/.codex/config.toml` and `~/.codex/models_cache.json`.

## Claude Code

- **Session model.** The system prompt says "You are powered by the model named <name>. The exact model ID is <id>." That is the session model. The session effort is the configured level (settings or the `/model` picker), shown to the model when the harness exposes it. If you cannot see it, treat it as `high` and say so in the report.
- **Dispatch.** The `Agent` tool takes `subagent_type` and an optional `model` of `sonnet`, `opus`, `haiku` or `fable`. `fork` inherits the parent model and full context and ignores `model`. An agent definition in `.claude/agents/*.md` may pin its own model and effort in frontmatter. `Workflow` scripts call `agent(prompt, {model, ...})`. A dispatch that sets nothing runs on the session model.
- **Auto-triggers.** The plugin's hooks fire before every `Agent` or `Workflow` call and on any user prompt over the word threshold. They inject a reminder and never block. The reminder names the target it could read from the call's `model` option.
- **Names that exist here only.** `AskUserQuestion`, `context: fork`, `subagent_type`, `SendMessage`, `Workflow`, `ScheduleWakeup`, `/skill-name` invocation, `CLAUDE.md`, `.claude/rules/`, `.claude/agents/`, `.claude/skills/`. Never write them into a prompt for another harness.

## Codex (CLI and desktop app)

- **Session model.** The base instructions say "You are Codex, an agent based on GPT-6" and name only the family. The variant and effort are session settings: `model` and `model_reasoning_effort` in `~/.codex/config.toml`, overridden by a project `.codex/config.toml`, by `codex -m <model> --reasoning-effort <level>`, and by `/model` in the TUI. When the session settings are not visible to you, read the config file and write "from config.toml" as the source, because a flag or `/model` may have overridden it.
- **Models offered** on this machine's account, from the local models cache: `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5`, `gpt-reserve`. Confirm in `/model` when it matters. The effort ladder is `low | medium | high | xhigh | max`, plus `ultra` on Astra, Sol and Terra, described as "maximum reasoning with automatic task delegation".
- **Dispatch.** Subagents inherit the parent model and reasoning effort. They accept a `model` or `reasoning_effort` override only when the user, `AGENTS.md` or a skill asks for one, and PromptFu is a skill. All agents share one workspace, so a dispatch names the files each agent owns and tells it to preserve other agents' edits. Custom agent definitions live in `.codex/agents/*.toml`.
- **Auto-trigger.** No hook in this release. The line `sync_agents.py` writes into `~/.codex/AGENTS.md` ("apply the promptfu skill to any prompt over ~50 words before running it") is the trigger.
- **Names that exist here only.** `AGENTS.md`, `.codex/config.toml`, `.codex/agents/`, `.codex/hooks.json`, `codex exec`, `apply_patch`, the `ultra` effort. There is no `context: fork`, no `AskUserQuestion`, no `subagent_type`, and Claude tool names mean nothing here. Never ask a GPT model for its private reasoning.
- **Skills.** `~/.agents/skills/<name>/SKILL.md` for the user, `<repo>/.agents/skills/` for a project, read from the working directory upward.

## Gemini CLI and Antigravity

- **Session model.** The system prompt if it names one, else `model` in `~/.gemini/settings.json` or the project's `.gemini/settings.json`, and the `-m` flag. Depth is `thinking_level`, set through `modelConfigs` aliases in the settings file (secondary source). Skills are read from `.gemini/skills/` and `~/.gemini/skills/` (secondary source).
- **Antigravity** is Google's agent IDE and managed agent (`antigravity-preview-05-2026`). Its state lives under `~/.gemini/antigravity/`. Whether either reads `.agents/skills` is unverified, so the Codex mirror does not reach them. If you are running there, state the harness as an assumption in the report.
- **Names.** Gemini tool names differ from both harnesses above. No `AskUserQuestion`, no `context: fork`, no `subagent_type`.

## Chat and web products (no API parameters)

When the prompt will be pasted into ChatGPT, claude.ai, the Gemini app, Midjourney or a Deep Research mode, there is no effort, schema or tool parameter to set. Put the depth and format asks into the prompt text the way the profile says, name the product's own controls in the report (a Deep Research plan review, an image quality option, Midjourney `--` flags), and take the product's selected model as the target:

| Product | Target profile |
|---|---|
| ChatGPT | The model in the picker. GPT-5.6 is the default line, GPT-6 Pro the paid tier (OpenAI help center, verify at use). `models/openai/gpt-5-6.md` or `gpt-6-astra.md` |
| claude.ai | The model in the picker, `models/anthropic/` |
| Gemini app | `models/google/gemini-3-8-flash.md` unless Pro or Deep Think is selected |
| Deep Research in any of them | `tasks/deep-research.md` plus the vendor family file |
| Image or video modes | `tasks/image-generation.md` or `tasks/video-generation.md` plus the product's model file |

## Telling which harness you are in

- A `CLAUDE_PLUGIN_ROOT` variable, hook reminders, or tools named `Agent` and `AskUserQuestion`: Claude Code.
- Base instructions naming Codex, an `apply_patch` tool, a `.codex/` directory: Codex.
- A `~/.gemini/` directory and Gemini tool names: Gemini CLI or Antigravity.
- None of these: say so and resolve the target from the request alone.
