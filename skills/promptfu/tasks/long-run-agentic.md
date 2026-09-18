# Playbook: long-run agentic prompts

Work that runs for many tool calls, across files or sessions, with the model deciding what to do
next. Frontier models plan better than a hand-written procedure, so the prompt sets only the
boundaries the model cannot infer: what is authorized, what "done" means, how much to verify,
when to stop, where to write state. Every block below names a behaviour the model gets wrong
without it.

Last verified 2026-09-18 against OpenAI's GPT-6 Astra model guidance, `models/anthropic/fable-5-1.md`,
and the PrompTessor GPT-6 Astra, Fable 5.1, reasoning-model, agent-memory and agent-evaluation guides.
Sources: https://developers.openai.com/api/docs/guides/latest-model, https://promptessor.com/blog/gpt-6-astra-prompting-guide,
https://promptessor.com/blog/claude-fable-5-1-prompting-guide, https://promptessor.com/blog/reasoning-model-prompting-guide,
https://promptessor.com/blog/ai-agent-memory-and-state-management-how-to-keep-agents-consistent-across-tasks, https://promptessor.com/blog/ai-agent-evaluation-how-to-test-tool-use-decisions-and-multi-step-workflows

## When this playbook applies

Trigger shapes: "implement", "migrate", "refactor across", "investigate and fix", "run until",
"audit the repo", a subagent or workflow dispatch, a roadmap task, anything with a test suite or a
deploy at the end. The deliverable takes more than a handful of tool calls and must be verified
before the model can claim success. Nearest neighbours: `tasks/short-run.md` when it fits in one
turn, and `tasks/tool-agents.md` when the risk sits in the tools (external writes, several MCP
servers, guessable IDs). Use both when a long task also has risky tools.

## Required blocks

- INTENT, required. One line: the larger goal, who consumes the output, what it enables. Models
  use it for every micro-decision the prompt does not cover.
- CONTEXT, required. Current state, the files and decisions that matter, and the memory or
  lessons file to consult by name. Notes the prompt never points at go unused.
- SCOPE, required. In, out, what may change, and named exclusions for vendored, generated and
  third-party trees. Keep the original scope wording. Exclusions bind, examples illustrate.
- AUTONOMY, required. In the Astra guide's words: "Make reasonable assumptions for non-critical
  missing details. State important assumptions briefly. Ask a question only when the missing
  information would materially change the strategy or create an irreversible decision."
  Reversible in-scope work is authorized. Approval comes last, on a concrete reviewable result.
- COMPLETION, required. Testable: deliverable exists, results inspected, failures the change
  caused are fixed, required checks pass, blockers written down, no authorized step left. Add "Do
  not end with a plan for work you can still perform."
- VERIFICATION, required, proportional to risk. A small reversible change gets "the smallest
  existing check that can catch a regression". A risky change gets an enumerated list. Real
  output, never a claim.
- LIMITS, required. A retry ceiling (three identical failures, then report) and a budget ceiling
  in tool calls or minutes, with "stop and report" when either is hit.
- OUTPUT, required. Outcome first, then files changed, verification with its output, remaining
  uncertainty, follow-ups noticed and left alone.
- SCOPE-AND-TESTS LIMITER, conditional, for feature work. No fixing or extending what the task
  did not name. Permanent tests only where the task asks or the repo already keeps them.
- TOOL BATCHING, conditional, for loops where the next reads are implied: "Request every item
  that does not depend on another's result in this one turn." Never invent arguments to batch.
- PROGRESS, conditional, only when a human is watching: a line before starting, an update on a
  milestone or change of plan, a recap that stands alone. Leave it out of unattended dispatch.
- DELEGATION, conditional, when subagents exist. Independent tracks that cut wall-clock time
  only. The lead keeps working while they run and owns integration and final verification.
- STATE, conditional, for cross-session work. The file to read at start and write at
  checkpoints: step reached, decisions, failed approaches, open items, exact IDs.

## Delete

- Step-by-step procedures and scripted reasoning. Replace with goal, evidence and criteria.
- "Keep going until it is done" with no completion test. It stops early or never stops.
- Re-check loops and "verify with a subagent". Current models self-verify. It compounds.
- "Think harder" and "use maximum intelligence". Map the depth to the effort recommendation.
- Unsolicited warnings and safety checklists for hypothetical risk. Astra obeys them literally.
- Token countdowns, and anything the system prompt, `AGENTS.md` or `CLAUDE.md` already enforces.

## Token rule

The rewrite may be longer than the draft, because drafts of this type almost never carry
autonomy, completion or limits, and those prevent the expensive failures: a stalled run, an
over-tested change, an endless retry. Keep each block to four lines and the whole prompt within
about 150 words of the draft. A block that does not fix a behaviour comes out. Recommend `high`,
and `xhigh` where a wrong call is expensive. The floor applies.

## Template

```
INTENT
<larger goal, who consumes the output, what it enables>
CONTEXT
<current state and the files that matter. Consult <file> and record lessons in <file>.>
SCOPE
In: <original scope wording>. Out: <named exclusions>. May change: <files or areas>.
AUTONOMY
Make reasonable assumptions for non-critical missing details and state them briefly.
Ask only when the answer would materially change the approach or the action is irreversible.
Reversible in-scope work is authorized. Approval comes last, on a concrete reviewable result.
COMPLETION
Done means <deliverable> exists, <checks> pass with output shown, failures the change caused
are fixed, blockers are written down. Do not end with a plan for work you can still perform.
VERIFICATION
<smallest existing check for a small change, or the enumerated list for a risky one>
LIMITS
Stop and report after three identical failures or <N> tool calls.
OUTPUT
Outcome first. Then files changed, verification with output, uncertainty, follow-ups left alone.
```

Add SCOPE-AND-TESTS, TOOL BATCHING, PROGRESS, DELEGATION or STATE only when the condition holds.

## Per-vendor notes

- Anthropic: see `models/anthropic/_family.md`. Fable 5.1 wants the finish-the-task pair and the
  scope-and-tests limiter word for word from `models/anthropic/fable-5-1.md`, plus the batching
  nudge. Opus 5 needs verification scaffolding removed and a delegation cap.
- OpenAI: see `models/openai/_family.md`. GPT-6 Astra asks more often than it should, so the
  bias-toward-action block from `models/openai/gpt-6-astra.md` goes in AUTONOMY, verification is
  told to stay proportional, and delegation needs criteria. Start at `high`. Codex adds `ultra`.
- Google: see `models/google/_family.md`. Gemini 3.8 Flash wants the tool policy and stop
  condition spelled out and the prompt concise. `thinking_level` `medium`, `high` for planning.
- Any harness: durable rules go in the instruction file, per `tasks/instruction-files.md`.

## Check before sending

- Does AUTONOMY say when to assume and when to ask, in one sentence each?
- Can a reader test COMPLETION without asking the model whether it is done?
- Is VERIFICATION sized to the risk of this change?
- Are the retry and budget ceilings numbers?
- Are the scope exclusions named, with the original scope wording intact?
- Is every block one the model would get wrong without it?
