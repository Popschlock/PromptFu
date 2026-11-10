# Playbook: structured output

The result feeds a program: a JSON object, a row, a label, a schema-shaped record. The prompt
says what each field means and how to decide it, and the schema enforces the shape. A schema
alone cannot say what "severity" means or what to return when evidence is missing.

## Applies when

"Return JSON", "extract the fields", "classify into", "fill this schema", "one row per", "a
label and a confidence", any output a script parses, the grading or extraction stage of a
pipeline. If a parser consumes the output, this playbook wins even when the task is tiny. When a
person reads the answer it is a one-shot ask with no playbook. When the structured value is a
tool call's arguments it is `tasks/tool-agents.md`.

## Blocks

The author's schema is a hard constraint. Never add, rename or drop a field. A schema change you
would recommend goes in the report.

- **Field semantics**, required for each field that takes a judgment call, one line: what it
  means, how to choose between neighbors, what it does not mean. "Choose one primary category
  based on the customer's main issue. Severity describes impact on product use, not emotional
  intensity. Do not infer churn risk unless the customer indicates it." Take the rule from the
  draft. Where the draft does not define a field, ask, or label your reading `Assumption:`. A
  field copied straight from the input gets no line.
- **Evidence**, when values come from supplied input: which inputs they may come from and
  nothing else. "Use only the feedback text and the supplied account context." Prevents gaps
  filled from general knowledge.
- **Uncertainty**, when the evidence can fail to decide a field: "When evidence is insufficient,
  use the schema's `unknown` value rather than guessing." Point at the unknown state the schema
  already has. If it has none, use `null` where the schema allows it and recommend the status
  pattern below. Prevents a confident guess.
- **Examples**, when two categories overlap: two or three input-to-output pairs at the boundary,
  none for the obvious cases. Build them from the draft's rules or the author's cases. A pair
  that settles a boundary the author left open is an assumption.
- **Output**, required: "Conform to the attached schema." The model card names the schema
  control. Where the target has none, paste the schema once and add "Output only the JSON, no
  prose before or after it."

Schema advice for the report: enums for every closed category, `required` for every field the
consumer reads, `additionalProperties: false`, descriptions on fields that carry meaning,
specific names in place of `value`, `data` or `result`, and a version when consumers depend on
the contract. For a field that may be missing, a status enum beside a nullable value, so `null`
does not carry five meanings:

```json
{"value": {"type": ["string", "null"]},
 "status": {"type": "string", "enum": ["verified", "not_found", "conflicting", "not_applicable"]},
 "source_id": {"type": ["string", "null"]}}
```

## Delete

- The schema written out again as prose. Keep field semantics, drop types and nesting.
- "Return valid JSON" as the only enforcement. Valid JSON is not schema conformance, and
  conformance is not correctness.
- "Confidence" with no definition. Ask what it means, or label your definition an assumption.
- Long example sets of easy cases. They use context and teach an accidental format policy.
- Permission or policy checks the model enforces by filling a field. The consumer validates
  evidence, state and permission after the schema check.

## Template

```
[Task] <decide or extract what, from which input>
[Field semantics] <field>: <what it means and how to choose>. <field> is not <common confusion>.
[Evidence] Use only <named inputs>. Do not fill gaps from general knowledge.
[Uncertainty] When the evidence does not decide a field, set <status field> to <unknown value>
and leave the value null. Never guess.
[Examples] <boundary input> -> <output>
[Output] Conform to the attached schema. Output only the JSON.
```

## Check before sending

- Does every field with a judgment call have a one-line rule in Field semantics?
- Does the schema carry the shape, with none of it repeated as prose?
- Is there an explicit unknown state, and does the prompt say when to use it?
- Are the examples boundary cases only?
- Is the author's schema unchanged, and does Output use the control the model card names?
