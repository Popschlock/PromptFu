#!/usr/bin/env node
// PromptFu: UserPromptSubmit hook.
// When a submitted prompt runs long (over the word threshold), remind the model
// to run it through the PromptFu skill before executing, so the ask is tuned to
// the model in use and the task type while keeping the spirit of what was typed.
//
// Only the text the user typed is counted. Claude Code appends its own blocks
// to the prompt field (system reminders, background-task notifications,
// slash-command output); those are stripped first so a one-word reply that
// arrives with a long notification does not trip the threshold.
//
// Threshold is configurable with the PROMPTFU_WORD_THRESHOLD env var (default 50).
// Silenced entirely by the kill switch in gate.js (PROMPTFU_DISABLE env var, or
// a project `.promptfu` file with `off`).
const { disabled } = require('./gate');

const THRESHOLD = Number(process.env.PROMPTFU_WORD_THRESHOLD) || 50;
const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

// Blocks the harness injects into the prompt field alongside the typed text.
const INJECTED =
  /<(system-reminder|task-notification|local-command-caveat|local-command-stdout|local-command-stderr|command-name|command-message|command-args|forked-skill-launch)\b[^>]*>[\s\S]*?<\/\1\s*>/g;

function typedText(prompt) {
  let text = String(prompt || '');
  let prev;
  do {
    prev = text;
    text = text.replace(INJECTED, '');
  } while (text !== prev);
  return text.trim();
}

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  if (disabled(data.cwd)) process.exit(0);
  const prompt = typedText(data.prompt);
  if (!prompt) process.exit(0);
  // Skip slash commands and prompts that already mention PromptFu.
  if (/^\//.test(prompt) || /promptfu/i.test(prompt)) process.exit(0);
  const words = prompt.split(/\s+/).filter(Boolean).length;
  if (words <= THRESHOLD) process.exit(0);
  const context =
    'This prompt runs long (over ' + THRESHOLD + ' words). Before executing it, apply the PromptFu ' +
    'skill (promptfu) to restructure the ask for the model in use: resolve the target per harnesses.md, ' +
    'pick the task playbook, state the intent, preserve any hard constraints verbatim (ask if a ' +
    'constraint is ambiguous and the user is present), and apply the matching family file and model ' +
    'profile. Then execute the optimized version, keeping the spirit of what was typed.' +
    (NEVER_DOWNGRADE
      ? ' PROMPTFU_NEVER_DOWNGRADE is set: do not propose or apply an effort level or model tier'
        + ' below what is currently configured; hold at the configured level or higher.'
      : '');
  process.stdout.write(
    JSON.stringify({
      suppressOutput: true,
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context },
    })
  );
});
