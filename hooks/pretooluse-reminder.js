#!/usr/bin/env node
// PromptFu — PreToolUse hook for Agent and Workflow calls.
// Reminds the model to run the subagent prompt through the PromptFu skill,
// tuned to the target model, before dispatching. Emits additionalContext and
// exits; it never blocks the tool call.
// Silenced entirely by the kill switch in gate.js (PROMPTFU_DISABLE env var, or
// a project `.promptfu` file with `off`).
const { disabled } = require('./gate');

const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let cwd;
  try {
    cwd = JSON.parse(raw).cwd;
  } catch {
    // fall through — gate.js falls back to CLAUDE_PROJECT_DIR / process.cwd()
  }
  if (disabled(cwd)) process.exit(0);
  const context =
    'Before dispatching this subagent, apply the PromptFu skill (promptfu) to its prompt: ' +
    'read the target-model profile (Opus 5 by default, including all security- or bio-flavored ' +
    'work; Fable 5.1 when Opus 5 falls short or the run is genuinely long-horizon; Sonnet 5 for ' +
    'well-specified building; Haiku 4.5 for mechanical work), state the intent, ' +
    'preserve any hard constraints verbatim, remove reasoning-echo instructions, and set an ' +
    'appropriate effort level. If the prompt already follows PromptFu, proceed.' +
    (NEVER_DOWNGRADE
      ? ' PROMPTFU_NEVER_DOWNGRADE is set: do not propose or apply an effort level or model tier'
        + ' below what is currently configured; hold at the configured level or higher.'
      : '');
  process.stdout.write(
    JSON.stringify({
      suppressOutput: true,
      hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context },
    })
  );
});
