// PromptFu — shared kill switch for the auto-invoke hooks.
// disabled(cwd) returns true when the hooks should stay quiet:
//   - the PROMPTFU_DISABLE env var is set to 1/true/yes/on (machine-wide), or
//   - a `.promptfu` file at the project root has `off` as its first meaningful
//     line (per project, same idea as wlah's `.wlah` file). The file is read on
//     every check, so a script or skill can toggle it mid-session.
// The switch only stops automatic firing; the /promptfu skill still works by name.
const fs = require('fs');
const path = require('path');

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
  if (/^(1|true|yes|on)$/i.test(process.env.PROMPTFU_DISABLE || '')) return true;
  const root = process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd();
  return offByFile(root);
}

module.exports = { disabled };
