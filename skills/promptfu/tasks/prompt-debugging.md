# Playbook: prompt debugging

Used when the user says a prompt keeps failing and wants it fixed rather than rewritten. A
rewrite destroys the evidence. This playbook finds the layer that failed, changes one thing, and
retests the same case, so the fix is known to be the cause and the prompt does not grow a new
rule for every symptom. The blocks are the capture record and the loop. The result is one edit.

Last verified 2026-09-18 against the PrompTessor prompt-debugging, reasoning-model,
structured-outputs and agent-evaluation guides.
Sources: https://promptessor.com/blog/prompt-debugging-guide, https://promptessor.com/blog/reasoning-model-prompting-guide,
https://promptessor.com/blog/structured-outputs-how-to-make-ai-return-reliable-json-and-schemas, https://promptessor.com/blog/ai-agent-evaluation-how-to-test-tool-use-decisions-and-multi-step-workflows

## When this playbook applies

Trigger shapes: "this prompt keeps", "it ignored my instruction", "wrong half the time", "it
worked on the old model", "why does it call the wrong tool", "the JSON is valid but the values
are wrong". The user has a prompt, an observed failure, and usually a guess about the cause.
Nearest neighbour: the task playbook the prompt belongs to. With no failing case in hand,
optimize with that playbook. With one, debug first and keep the case as a test.

## Required blocks

The fields of the capture record, written before any change. A hypothesis without them is a guess.

- EXPECTED and OBSERVED, required. The task, what should have happened, what did, on one
  concrete input. "It is bad" is a complaint. A failure names the input and the wrong output.
- RUNTIME, required. Model and version, effort or thinking level, schema configuration, tools and
  retrieval, harness. The same prompt behaves differently across these.
- PROMPT STATE, required. System and user instructions, examples, context and history as they
  were at the failing turn.
- LAYER, required. The first layer in this order that explains the failure:
  1. Input accessibility: could the model read the input (legible text, right page, right frame)?
  2. Instruction clarity: was the task explicit, with its success criteria stated?
  3. Context sufficiency: was needed information missing, stale, irrelevant, or buried?
  4. Instruction conflicts: did rules, examples or constraints contradict each other?
  5. Interpretation ambiguity: did the phrasing allow two valid readings?
  6. Output contract: was the shape unclear or enforced only by prose?
  7. Tool or retrieval: wrong tool, invented argument, or the evidence never reached context?
  8. Model or runtime: model change, effort, limits, provider behaviour?
  9. Workflow causality: did an earlier stage hand over corrupted state?
- HYPOTHESIS and CHANGE, required. One cause, one edit, named before the retest.
- RESULT, required. Same failing case, then the neighbouring cases, then keep or revert.

## Delete

- Rewriting the whole prompt first. It loses the cause.
- Assuming every bad output is a prompt problem. Retrieval, schema, tools and runtime fail too.
- Changing the prompt and the model or effort in the same step. Neither can then be credited.
- Adding a rule to resolve a conflict. Remove or rank the conflicting rule instead.
- Adding examples without reading the existing ones, which may teach the opposite.
- Treating valid JSON as a correct answer, or blaming hallucination when retrieval never
  surfaced the evidence.
- Fixing tool selection in the prompt when the tool descriptions overlap. Fix the descriptions.
- Skipping the neighbouring cases, or throwing away the failing case instead of keeping it.

## Token rule

A debugging pass leaves the prompt the same size or smaller. The usual fix is a replacement, a
removal or a ranking. The guide's example: "Be concise. Be very concise. Do not be verbose."
becomes "Return 180 to 220 words. Use exactly 3 short paragraphs. Do not include a separate
conclusion." Growth is justified once, for a boundary rule the examples contradicted, such as
"If the user explicitly indicates they may cancel, label Cancellation Risk even when another
issue triggered the threat." Change the prompt or the effort in a step, never both.

## Template

```
CAPTURE
Task: <what the prompt is for>
Expected: <the correct output on this input>
Observed: <what came back>
Input: <the failing case, verbatim or by ID>
Runtime: <model, effort, schema, tools, retrieval, harness>
Prompt state: <system, user, examples, context, history at the failing turn>

LAYER
<number and name from the nine, with the evidence for it>

HYPOTHESIS
<one cause>

CHANGE
<one edit: old line and new line, or the removal, or the ranking>

RETEST
Same case: <pass or fail>. Neighbours: <cases and results>. Decision: keep / revert / new
hypothesis. Regression: <where the case is now kept>
```

| Layer | Typical fix |
|---|---|
| Instruction clarity | Replace the vague verb with named operations and a numeric threshold |
| Context sufficiency | Remove irrelevant material, label sources, state authority, retrieve instead of paste |
| Instruction conflicts | Rank rules into mandatory and preference, or delete one |
| Interpretation ambiguity | Operationalize the word ("professional" becomes a list of properties) |
| Output contract | Move shape into the provider schema, keep semantics in prose |
| Tool or retrieval | Fix the tool description's boundary or the retrieval step before the prompt |
| Model or runtime | Hold everything else constant, change only the model or the effort, compare |
| Workflow causality | Debug from the first wrong intermediate state, never the final sentence |

## Per-vendor notes

- OpenAI: see `models/openai/_family.md`. Prefer Structured Outputs to prose schemas, and use
  the Evals API to run the same case set across a prompt or model change.
- Anthropic: see `models/anthropic/_family.md`. Effort names carry different depth on Fable 5
  and 5.1, so "worked on the old model" often sits at layer 8. A `stop_reason` of `refusal` is a
  classifier rather than a prompt bug and routes per the family file.
- Google: see `models/google/_family.md`. A temperature below `1.0` on Gemini 3 causes looping,
  so check the runtime before the prompt. Query placement after the data is a layer 3 fix.
- Any harness: a prompt that pauses or diverges may be obeying an instruction file. Ask the model
  to name and quote the `SKILL.md` or `AGENTS.md` line it followed before editing the prompt.

## Check before sending

- Is there one concrete failing input with expected and observed output?
- Is the runtime recorded, so a model or effort change can be told apart from a prompt change?
- Is exactly one layer named, with evidence?
- Is exactly one thing changed, and is it the prompt or the effort, never both?
- Was the same case retested, then the neighbours?
- Is the failing case kept as a regression test?
