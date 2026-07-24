#!/usr/bin/env node
// PromptFu — PreToolUse hook for Agent and Workflow calls.
// Reminds the model to run the subagent prompt through the PromptFu skill,
// tuned to the target model, before dispatching. Emits additionalContext and
// exits; it never blocks the tool call.
const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  const context =
    'Before dispatching this subagent, apply the PromptFu skill (promptfu) to its prompt: ' +
    'read the target-model profile (Fable 5 by default; Opus 5 for security- or bio-flavored ' +
    'work and hard agentic coding; Sonnet 5 for well-specified building; Haiku 4.5 for mechanical ' +
    'work), state the intent, ' +
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
