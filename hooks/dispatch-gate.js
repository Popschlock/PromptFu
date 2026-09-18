#!/usr/bin/env node
// PromptFu: PreToolUse gate for Agent and Workflow calls.
// A PreToolUse hook's additionalContext only reaches the model with the tool
// result, after the dispatch has launched, so a reminder cannot shape the
// prompt it is attached to. The only way to get in front of a dispatch is to
// deny it: when the prompt shows no PromptFu structure, this hook denies the
// call once with a reason that tells the model to apply the skill and re-issue.
// The second attempt at the same prompt is always allowed, so a dispatch is
// never blocked twice and the worst case is one extra round trip.
//
// PROMPTFU_DISPATCH_MODE selects the behaviour: `gate` (default) denies once,
// `lint` only adds the note to the tool result, `off` skips dispatch checks.
// Silenced entirely by the kill switch in gate.js (PROMPTFU_DISABLE env var, or
// a project `.promptfu` file with `off`).
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { disabled } = require('./gate');

const MODE = (process.env.PROMPTFU_DISPATCH_MODE || 'gate').trim().toLowerCase();
const NEVER_DOWNGRADE = /^(1|true|yes|on)$/i.test(process.env.PROMPTFU_NEVER_DOWNGRADE || '');
const MARKER_DIR = path.join(os.tmpdir(), 'promptfu-gate');
const MARKER_TTL_MS = 24 * 60 * 60 * 1000;

// Any of the three dialects PromptFu writes: Anthropic tags, OpenAI/Markdown
// section headers, or the universal opening line.
const STRUCTURED =
  /<(intent|context|constraints|task|output|boundaries)\b[^>]*>|^\s*(#+\s*)?(GOAL|INTENT|CONTEXT|CONSTRAINTS|TASK|OUTPUT|BOUNDARIES|AUTONOMY|TOOL POLICY|STOP CONDITION)\b\s*:?\s*$|\bI'?m working on\b/im;

// Returns true when this prompt was already denied once (and marks it if not).
function seenBefore(text) {
  const marker = path.join(MARKER_DIR, crypto.createHash('sha1').update(text).digest('hex'));
  try {
    fs.mkdirSync(MARKER_DIR, { recursive: true });
    const now = Date.now();
    for (const name of fs.readdirSync(MARKER_DIR)) {
      const p = path.join(MARKER_DIR, name);
      try {
        if (now - fs.statSync(p).mtimeMs > MARKER_TTL_MS) fs.unlinkSync(p);
      } catch {}
    }
    if (fs.existsSync(marker)) return true;
    fs.writeFileSync(marker, '');
    return false;
  } catch {
    // No writable temp dir: never deny, because a deny we cannot remember could repeat.
    return true;
  }
}

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
  if (MODE === 'off' || disabled(cwd)) process.exit(0);
  const text = typeof input.prompt === 'string' ? input.prompt : typeof input.script === 'string' ? input.script : '';
  if (!text.trim() || STRUCTURED.test(text)) process.exit(0);
  const model = typeof input.model === 'string' && input.model.trim();
  const kind = typeof input.subagent_type === 'string' && input.subagent_type.trim();
  const target = model
    ? 'target: ' + model + (kind === 'fork' ? ' (a fork ignores model and inherits the session model)' : '')
    : kind === 'fork'
      ? 'target: the session model (fork)'
      : 'target: the session model unless the agent definition pins one';
  const howTo =
    'Apply the PromptFu skill (promptfu) to the prompt: resolve the target per harnesses.md (' + target +
    '), read that model\'s family file and profile and the task playbook, state the intent, preserve any ' +
    'hard constraints verbatim, delete what the profile marks delete-on-sight (reasoning-echo requests, step ' +
    'scaffolding the model does not need), and set the effort.' +
    (NEVER_DOWNGRADE
      ? ' PROMPTFU_NEVER_DOWNGRADE is set: do not propose or apply an effort level or model tier'
        + ' below what is currently configured; hold at the configured level or higher.'
      : '');
  if (MODE === 'lint' || seenBefore(text)) {
    if (MODE !== 'lint') process.exit(0);
    process.stdout.write(
      JSON.stringify({
        suppressOutput: true,
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext:
            'This dispatch has already launched and its prompt shows no PromptFu structure (no intent, ' +
            'constraints, task or output block). Before the next dispatch, and before continuing this agent ' +
            'through SendMessage: ' + howTo,
        },
      })
    );
    process.exit(0);
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'PromptFu gate: this dispatch was held because its prompt shows no PromptFu structure (no intent, ' +
          'constraints, task or output block). ' + howTo + ' Then re-issue the call. The same call is allowed on ' +
          'its second attempt even if unchanged, so this gate never holds a dispatch twice.',
      },
    })
  );
});
