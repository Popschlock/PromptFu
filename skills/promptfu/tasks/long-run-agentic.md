# Playbook: long-run agentic work

The model picks its own next steps over many tool calls. The prompt sets only what it cannot
infer: what is authorized, what done means, how much to verify and when to stop.

## Applies when

"Implement", "migrate", "refactor across", "investigate and fix", "audit the repo", anything
that ends in a test suite or a deploy. The work takes many tool calls and must be verified
before the model claims success. A bounded brief with
one unit and one return takes the universal shape alone. When a wrong call changes state outside
the workspace (a send, a payment, a deleted record), use `tasks/tool-agents.md` instead.

## Blocks

- **Autonomy**, required, in one form: without it the model stalls on a question or guesses
  at an irreversible step. Pick the template line that fits who can answer. A rule the draft
  already sets, or a card block for unattended runs, replaces it. Never paste a general rule
  and then override it.
- **Completion**, required: a test a reader can run without asking the model. Build it from the
  deliverable and the checks the draft or the repo names. Prevents a run that ends at a plan.
- **Verification**, required when the run changes files or state, sized to the risk. A small
  reversible change gets "the smallest existing check that can catch a regression". A risky
  change gets a list of the checks that exist. Real output, never a claim.
- **Retry**, for unattended runs, written as an assumption because the draft rarely states one.
  It ends the endless retry without ending a run the author wanted finished.
- **Budget**, only when the draft states one, verbatim. Never write a tool-call, token or time
  ceiling of your own.
- **Scope and tests limiter**, for feature work: no fixing or extending what the task did not
  name, and permanent tests only where the task asks or the repo already keeps them. Follow-ups
  are reported and left alone.
- **Progress**, only when a human is watching: a line before starting, an update on a milestone
  or change of plan, a recap that stands alone.
- **Delegation**, when subagents are available: independent tracks that cut wall-clock time
  only. The lead keeps working while they run and owns integration and final verification.
- **State**, for work that spans sessions: the file to read at the start and write at
  checkpoints (step reached, decisions, failed approaches, open items, exact IDs). Name the
  notes file the draft or the workspace gives, or propose one as an `Assumption:`.
- **Output** keeps the author's shape, or the template's order when the draft sets none.

## Delete

- Step-by-step procedures and scripted reasoning. Replace with goal, evidence and criteria.
- "Keep going until it is done" with no completion test. It stops early or never stops.
- Stacked re-check loops. One verification block replaces them.
- "Think harder" and "use maximum intelligence". Depth is the effort setting on the model card.
- Warnings and safety checklists for hypothetical risk. They get obeyed literally.

## Template

```
[Intent] [Context] [Scope] as the universal shape gives them.
[Autonomy] one of:
Someone can answer: Make reasonable assumptions for non-critical missing details. State
important assumptions briefly. Ask a question only when the missing information would
materially change the strategy or create an irreversible decision.
Nobody can answer: Reversible in-scope work is authorized. Make reasonable assumptions, record
the important ones in <the output>, and carry on with everything that does not depend on an
open question. Stop only before an irreversible step.
[Completion]
Done means <deliverable> exists, <named checks> pass with output shown, failures the change
caused are fixed, and blockers are written down. Do not end with a plan for work you can still
perform.
[Verification]
<the smallest existing check that can catch a regression, or the listed checks for a risky change>
[Retry]
Assumption: after three identical failures on one step, stop repeating it and try another
route. Report the step if no route works, and carry on with the rest.
[Output]
Outcome first. Then files changed, verification with its output, remaining uncertainty.
```

## Check before sending

- Does Autonomy say when to assume and when to ask?
- Can a reader test Completion without asking the model whether it is done?
- Is Verification sized to the risk, using only checks that exist?
- Is the retry rule labeled as an assumption, and is every budget one the draft stated?
- Does every block answer something in the draft, and is each rule said only once?
