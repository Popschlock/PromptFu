#!/usr/bin/env node
// PromptFu: UserPromptSubmit hook.
// Stays silent on an ordinary prompt. It speaks in two cases:
//
//   1. The typed prompt runs over the word threshold. The model gets one line
//      asking it to judge the work: optimize first when it is multi-step or
//      needs judgment, run it as typed when it is a lookup, a simple edit or
//      already clear. Length alone never forces a rewrite.
//   2. The kill switch changed since the session started (a `.promptfu` file
//      was written or removed), or the session never got its start-of-session
//      reminder. The model is told once.
//
// Only the text the user typed is counted. Claude Code appends its own blocks
// to the prompt field (system reminders, background-task notifications,
// slash-command output), and those are stripped first so a one-word reply that
// arrives with a long notification does not trip the threshold.
//
// The threshold is PROMPTFU_WORD_THRESHOLD (default 50).
const { disabled, threshold, words, readState, writeState, reminder, main, addContext } = require('./gate');

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

const OFF_NOTE =
  'PromptFu is switched off for this project (.promptfu). Do not apply the promptfu skill on your own ' +
  'until it is switched back on. /promptfu by name still works.';

main((data) => {
  const prompt = typedText(data.prompt);
  if (!prompt) return;
  // Slash commands and prompts that already name PromptFu need no nudge.
  if (/^\//.test(prompt) || /promptfu/i.test(prompt)) return;

  const off = disabled(data.cwd);
  const parts = [];

  // Tell the model once when the switch state differs from what it was last told.
  const session = data.session_id;
  if (session) {
    const now = off ? 'off' : 'on';
    const before = readState('session', session);
    if (before !== now && writeState('session', session, now)) {
      if (!off) parts.push(reminder());
      else if (before === 'on') parts.push(OFF_NOTE);
    }
  }

  if (!off && words(prompt) > threshold()) {
    parts.push(
      'This prompt is over ' + threshold() + ' words. If the work is multi-step or needs judgment, apply the ' +
        'promptfu skill first (hard constraints verbatim, ask only if a missing piece would change the work), ' +
        'then run the rewrite. If it is a lookup, a simple edit, or already clear and complete, run it as typed.'
    );
  }

  if (parts.length) addContext('UserPromptSubmit', parts.join(' '));
});
