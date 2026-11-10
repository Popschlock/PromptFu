#!/usr/bin/env node
// PromptFu: SessionStart hook.
// Says once per session that the promptfu skill applies to subagent and
// workflow prompts for multi-step or judgment work, and says it again after a
// compaction, which is the one point where the first copy can be summarized
// away. Nothing is added on later turns, so the reminder costs no tokens per
// prompt.
//
// Silenced by the kill switch in gate.js (PROMPTFU_DISABLE env var, or a
// project `.promptfu` file with `off`). The switch state is recorded so the
// prompt hook can tell the model when it changes mid-session.
const { disabled, readState, writeState, sweep, reminder, main, addContext } = require('./gate');

main((data) => {
  const session = data.session_id;
  if (!session) return;
  sweep();
  if (disabled(data.cwd)) {
    writeState('session', session, 'off');
    return;
  }
  // A resumed session still holds the reminder it got when it started.
  if (data.source === 'resume' && readState('session', session) === 'on') return;
  writeState('session', session, 'on');
  addContext('SessionStart', reminder());
});
