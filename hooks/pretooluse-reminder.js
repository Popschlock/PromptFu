#!/usr/bin/env node
// PromptFu: PreToolUse hook for Agent and Workflow calls.
// A PreToolUse hook's additionalContext reaches the model with the tool result,
// after the dispatch has launched, so it cannot shape the prompt it is attached
// to. This hook is therefore a lint: it stays silent when the dispatched prompt
// already shows PromptFu structure, and otherwise tells the model to apply the
// skill before the next dispatch or before continuing this agent. It names the
// target when the call's own options say what it is. It never blocks the call.
// Silenced entirely by the kill switch in gate.js (PROMPTFU_DISABLE env var, or
// a project `.promptfu` file with `off`).
const { disabled } = require('./gate');

const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

// Any of the three dialects PromptFu writes: Anthropic tags, OpenAI/Markdown
// section headers, or the universal opening line.
const STRUCTURED =
  /<(intent|context|constraints|task|output|boundaries)\b[^>]*>|^\s*(#+\s*)?(GOAL|INTENT|CONTEXT|CONSTRAINTS|TASK|OUTPUT|BOUNDARIES|AUTONOMY|TOOL POLICY|STOP CONDITION)\b\s*:?\s*$|\bI'?m working on\b/im;

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
  const text = typeof input.prompt === 'string' ? input.prompt : typeof input.script === 'string' ? input.script : '';
  if (!text.trim() || STRUCTURED.test(text)) process.exit(0);
  const model = typeof input.model === 'string' && input.model.trim();
  const kind = typeof input.subagent_type === 'string' && input.subagent_type.trim();
  const target = model
    ? 'target: ' + model + (kind === 'fork' ? ' (a fork ignores model and inherits the session model)' : '')
    : kind === 'fork'
      ? 'target: the session model (fork)'
      : 'target: the session model unless the agent definition pins one';
  const context =
    'This dispatch has already launched; its prompt shows no PromptFu structure (no intent, ' +
    'constraints, task or output block). Before the next dispatch, and before continuing this agent ' +
    'through SendMessage, apply the PromptFu skill (promptfu) to the prompt: resolve the target per ' +
    'harnesses.md (' + target + '), read that model\'s family file and profile and the task playbook, ' +
    'state the intent, preserve any hard constraints verbatim, delete what the profile marks ' +
    'delete-on-sight (reasoning-echo requests, step scaffolding the model does not need), and set the effort.' +
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
