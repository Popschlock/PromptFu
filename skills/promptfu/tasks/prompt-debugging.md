# Playbook: prompt debugging

The user says a prompt keeps failing and wants it fixed, not rewritten. A rewrite destroys the
evidence, so find the layer that failed, change one thing and retest the same case. The result
is one edit.

## Applies when

"This prompt keeps", "it ignored my instruction", "it worked on the old model", "why does it
call the wrong tool", "the JSON is valid but the values are wrong". With no failing case in
hand, optimize with the playbook the prompt's task type names. With one, debug first and keep
the case as a test.

## Blocks

The capture record, written before any change. Write "not recorded" for a field you cannot fill
and ask for it, because a guessed field makes the hypothesis a guess.

- **Expected and observed**, required: the task, what should have happened and what did, on one
  concrete input. A failure names the input and the wrong output.
- **Runtime**, required: the same prompt behaves differently across models, effort levels,
  schema settings, tools and harnesses.
- **Prompt state**, required: as it was at the failing turn.
- **Layer**, required: the first layer in this order that explains the failure, with its fix.
  1. Input accessibility: could the model read the input (legible text, right page, right frame)?
  2. Instruction clarity: was the task explicit, with success criteria? Replace the vague verb
     with named operations and a number taken from the expected output.
  3. Context sufficiency: was information missing, stale, irrelevant or buried? Cut the
     irrelevant, label sources, state authority, retrieve instead of paste.
  4. Instruction conflicts: did rules, examples or an instruction file contradict each other?
     Ask the model to quote the line it followed. Rank the rules into mandatory and preference,
     or delete one. Never add a rule to settle a conflict.
  5. Interpretation ambiguity: did the phrasing allow two readings? Operationalize the word
     ("professional" becomes a list of properties).
  6. Output contract: was the shape enforced only by prose? Move it into the schema control the
     model card names. Semantics stay in prose.
  7. Tool or retrieval: wrong tool, invented argument, evidence that never reached context? Fix
     the tool description's boundary or the retrieval step before the prompt.
  8. Model or runtime: a model change, effort, limits, a safeguard? Check the settings against
     the model card, then change only the model or the effort. "It worked on the old model"
     usually sits here. A refusal routes per the family file.
  9. Workflow causality: did an earlier stage hand over corrupted state? Debug from the first
     wrong intermediate state, never the final sentence.
- **Hypothesis and change**, required: one cause, one edit, named before the retest. The usual
  edit is a replacement, a removal or a ranking, so the prompt stays the same size or shrinks.
- **Retest**, required when the case can be run: the same failing case, then the neighboring
  cases, then keep or revert. When you cannot run it, hand the user the edit and the cases.

## Delete

- Rewriting the whole prompt first. It loses the cause.
- Assuming every bad output is a prompt problem. Valid JSON can hold wrong values, and a
  hallucination can be evidence that retrieval never surfaced.
- Adding examples without reading the existing ones, which may teach the opposite.

## Template

```
[Capture]
Task: <what the prompt is for>
Expected: <the correct output on this input>
Observed: <what came back>
Input: <the failing case, verbatim or by ID>
Runtime: <model and version, effort or thinking level, schema, tools, retrieval, harness>
Prompt state: <system, user, examples, context, history at the failing turn>
[Layer] <number and name from the nine, with the evidence for it>
[Hypothesis] <one cause>
[Change] <one edit: old line and new line, or the removal, or the ranking>
[Retest] Same case: <pass or fail>. Neighbors: <cases and results>. Decision: keep / revert /
new hypothesis. Regression: <where the case is now kept>
```

## Check before sending

- Is there one concrete failing input with expected and observed output?
- Is the runtime recorded, so a model change can be told from a prompt change?
- Is exactly one layer named, with evidence?
- Is exactly one thing changed, and is it the prompt or the effort, never both?
- Was the same case retested, then the neighbors, and is the case kept as a regression test?
