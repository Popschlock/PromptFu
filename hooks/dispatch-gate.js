#!/usr/bin/env node
// PromptFu: PreToolUse backstop for Agent and Workflow calls.
// The session-start reminder already asks the model to apply PromptFu before a
// dispatch that carries real work. This hook is the backstop for one that went
// out unstructured anyway.
//
// It only looks at dispatch prompts over the word threshold. A short brief is
// almost always a lookup, and a lookup is not worth a rewrite.
//
//   lint (default)  Adds a short note to the tool result, once per session. A
//                   PreToolUse note reaches the model after the call has run,
//                   so it shapes the next dispatch and cannot change this one.
//                   Once per session, because text that keeps arriving after
//                   tool results can be read as a prompt injection.
//   gate            Denies the call once, with a reason that says to apply the
//                   skill and send it again. The second attempt at the same
//                   prompt always passes. A deny shows in the transcript as a
//                   hook error, which is why this mode is opt-in.
//   off             Skips dispatch checks.
//
// PROMPTFU_DISPATCH_MODE picks the mode. The kill switch in gate.js silences
// every mode. A Workflow call that names a saved script carries no text to
// check and passes untouched.
const crypto = require('crypto');
const { disabled, truthy, threshold, words, readState, writeState, main, addContext } = require('./gate');

const MODE = (process.env.PROMPTFU_DISPATCH_MODE || 'lint').trim().toLowerCase();

// Any of the dialects PromptFu writes: tags, section headers, or the universal opening line.
const STRUCTURED =
  /<(intent|context|constraints|task|output|boundaries)\b[^>]*>|^\s*(#+\s*)?(GOAL|INTENT|CONTEXT|CONSTRAINTS|TASK|OUTPUT|BOUNDARIES|AUTONOMY|TOOL POLICY|STOP CONDITION)\b\s*:?\s*$|\bI'?m working on\b/im;

const HOW_TO =
  'apply the promptfu skill to a subagent or workflow prompt that asks for multi-step or judgment work ' +
  'before sending it: state the intent, keep hard constraints verbatim, say what shape you need back.';

main((data) => {
  const input = data.tool_input || {};
  if (MODE === 'off' || disabled(data.cwd)) return;
  // Claude Code's Agent carries the brief in `prompt` and Workflow in `script`. Codex's spawn_agent,
  // which also matches `Agent`, carries it in `message`.
  const text = [input.prompt, input.script, input.message].find((value) => typeof value === 'string') || '';
  if (words(text) <= threshold() || STRUCTURED.test(text)) return;
  const never = truthy('PROMPTFU_NEVER_DOWNGRADE')
    ? ' PROMPTFU_NEVER_DOWNGRADE is set: propose no model or effort below the configured level.'
    : '';

  if (MODE === 'gate') {
    // Deny once per prompt. If the deny cannot be remembered, never deny, because it could repeat.
    const key = crypto.createHash('sha1').update(text).digest('hex');
    if (readState('deny', key) !== undefined || !writeState('deny', key, '1')) return;
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason:
            'PromptFu gate: this dispatch was held because its prompt has no intent, constraints or output ' +
            'block. Now ' + HOW_TO + never + ' Then send the call again. The same call passes on its second ' +
            'attempt even if unchanged.',
        },
      })
    );
    return;
  }

  // lint: once per session.
  const session = data.session_id || 'no-session';
  if (readState('lint', session) !== undefined || !writeState('lint', session, '1')) return;
  addContext(
    'PreToolUse',
    'PromptFu: that dispatch had no intent, constraints or output block. Apply the promptfu skill to the next ' +
      'subagent or workflow prompt that asks for multi-step or judgment work, before sending it.' + never
  );
});
