#!/usr/bin/env node
// PromptFu — UserPromptSubmit hook.
// When a submitted prompt runs long (over the word threshold), remind the model
// to run it through the PromptFu skill before executing, so the ask is tuned to
// the current model while keeping the spirit of what the user typed.
//
// Threshold is configurable with the PROMPTFU_WORD_THRESHOLD env var (default 50).
const THRESHOLD = Number(process.env.PROMPTFU_WORD_THRESHOLD) || 50;
const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let prompt = '';
  try {
    prompt = JSON.parse(raw).prompt || '';
  } catch {
    process.exit(0);
  }
  // Skip slash commands and prompts that already mention PromptFu.
  if (/^\s*\//.test(prompt) || /promptfu/i.test(prompt)) process.exit(0);
  const words = prompt.trim().split(/\s+/).filter(Boolean).length;
  if (words <= THRESHOLD) process.exit(0);
  const context =
    'This prompt runs long (over ' + THRESHOLD + ' words). Before executing it, apply the PromptFu ' +
    'skill (promptfu) to restructure the ask for the current model: state the intent, preserve any ' +
    'hard constraints verbatim (ask via AskUserQuestion if a constraint is ambiguous), and apply the ' +
    'matching model profile. Then execute the optimized version, keeping the spirit of what was typed.' +
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
