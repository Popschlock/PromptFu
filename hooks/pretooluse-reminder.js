#!/usr/bin/env node
// PromptFu: PreToolUse hook for Agent and Workflow calls.
// Reminds the model to run the subagent prompt through the PromptFu skill,
// tuned to the model the subagent will run on, before dispatching. It names
// the target when the call's own options say what it is. Emits
// additionalContext and exits. It never blocks the tool call.
// Silenced entirely by the kill switch in gate.js (PROMPTFU_DISABLE env var, or
// a project `.promptfu` file with `off`).
const { disabled } = require('./gate');

const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input = {};
  let cwd;
  try {
    const data = JSON.parse(raw);
    input = data.tool_input || {};
    cwd = data.cwd;
  } catch {
    input = {};
  }
  if (disabled(cwd)) process.exit(0);
  const model = typeof input.model === 'string' && input.model.trim();
  const kind = typeof input.subagent_type === 'string' && input.subagent_type.trim();
  const target = model
    ? 'target: ' + model + (kind === 'fork' ? ' (a fork ignores model and inherits the session model)' : '')
    : kind === 'fork'
      ? 'target: the session model (fork)'
      : 'target: the session model unless the agent definition pins one';
  const context =
    'Before dispatching this subagent, apply the PromptFu skill (promptfu) to its prompt. ' +
    'Resolve the target per harnesses.md (' + target + '), read that model\'s family file and profile ' +
    'and the task playbook, state the intent, preserve any hard constraints verbatim, delete what the ' +
    'profile marks delete-on-sight (reasoning-echo requests, step scaffolding the model does not need), ' +
    'and set the effort. If the prompt already follows PromptFu, proceed.' +
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
