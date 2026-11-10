// PromptFu: shared helpers for the hooks.
//
// Kill switch. disabled(cwd) is true when the hooks should stay quiet:
//   - the PROMPTFU_DISABLE env var is set to 1/true/yes/on (machine-wide), or
//   - a `.promptfu` file at the project root has `off` as its first meaningful
//     line (per project). The file is read on every check, so a script or a
//     skill can toggle it mid-session.
// The switch only stops automatic firing. The /promptfu skill still works by name.
//
// State. The reminder is sent once per session, so the hooks remember per
// session what they last said. State lives in the temp directory, and every
// helper fails quiet: a hook never blocks and never throws.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const STATE_DIR = path.join(os.tmpdir(), 'promptfu-gate');
const STATE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function truthy(name) {
  return /^(1|true|yes|on)$/i.test(process.env[name] || '');
}

function offByFile(root) {
  let text = '';
  try {
    text = fs.readFileSync(path.join(root, '.promptfu'), 'utf8');
  } catch {
    return false;
  }
  const first = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#'));
  return /^off$/i.test(first || '');
}

function disabled(cwd) {
  if (truthy('PROMPTFU_DISABLE')) return true;
  const root = process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd();
  return offByFile(root);
}

function threshold() {
  return Number(process.env.PROMPTFU_WORD_THRESHOLD) || 50;
}

function words(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function keyFile(kind, key) {
  return path.join(STATE_DIR, kind + '-' + crypto.createHash('sha1').update(String(key)).digest('hex'));
}

// Read a small state value, or undefined when there is none.
function readState(kind, key) {
  try {
    return fs.readFileSync(keyFile(kind, key), 'utf8');
  } catch {
    return undefined;
  }
}

// Write a state value. Returns false when the temp directory is not writable.
function writeState(kind, key, value) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(keyFile(kind, key), String(value));
    return true;
  } catch {
    return false;
  }
}

// Drop state older than the TTL. Called once per session start.
function sweep() {
  try {
    const now = Date.now();
    for (const name of fs.readdirSync(STATE_DIR)) {
      const p = path.join(STATE_DIR, name);
      try {
        if (now - fs.statSync(p).mtimeMs > STATE_TTL_MS) fs.unlinkSync(p);
      } catch {}
    }
  } catch {}
}

const REMINDER =
  'PromptFu is installed. Before you send a subagent or workflow prompt that asks for multi-step or ' +
  'judgment work, apply the promptfu skill to it, without narrating the rewrite. Skip it for lookups and ' +
  'one-step tasks. Skill files already read this session are not read again.';

const NEVER_DOWNGRADE_NOTE =
  ' PROMPTFU_NEVER_DOWNGRADE is set: hold the configured model and effort or go higher, and propose no downgrade.';

function reminder() {
  return REMINDER + (truthy('PROMPTFU_NEVER_DOWNGRADE') ? NEVER_DOWNGRADE_NOTE : '');
}

// Read the hook's JSON input from stdin and hand it to `run`. Bad input ends quietly.
function main(run) {
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      process.exit(0);
    }
    if (!data || typeof data !== 'object') process.exit(0);
    try {
      run(data);
    } catch {}
    // No process.exit here: let stdout drain, then the process ends by itself.
  });
}

function addContext(event, text) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: text } }));
}

module.exports = { disabled, truthy, threshold, words, readState, writeState, sweep, reminder, main, addContext };
