# Playbook: structured output

Prompts whose result feeds a program: a JSON object, a row, a label, a schema-shaped record. The
prompt defines what each field means and how to decide it. The provider's schema feature enforces
the shape. A prompt that restates the schema in prose costs tokens and still cannot enforce it,
and a schema alone cannot say what "severity" means or what to return when evidence is missing.

Last verified 2026-09-18 against the PrompTessor structured-outputs, reasoning-model and GPT-6
Astra guides, the Gemini 3 developer guide and OpenAI's latest-model guide.
Sources: https://promptessor.com/blog/structured-outputs-how-to-make-ai-return-reliable-json-and-schemas,
https://promptessor.com/blog/reasoning-model-prompting-guide, https://promptessor.com/blog/gpt-6-astra-prompting-guide,
https://ai.google.dev/gemini-api/docs/gemini-3, https://developers.openai.com/api/docs/guides/latest-model

## When this playbook applies

Trigger shapes: "return JSON", "extract the fields", "classify into", "fill this schema", "one
row per", "a label and a confidence", any output a script parses, and the grading or extraction
stage of a pipeline.

Nearest neighbours: `tasks/short-run.md` when a person reads the answer, and `tasks/tool-agents.md`
when the structured value is a tool call's arguments. The separating rule: if a parser consumes
the output, this playbook wins even when the task is tiny.

## Required blocks

- TASK, required. What is decided or extracted, from what input, in one sentence.
- FIELD SEMANTICS, required. One line per field that needs a decision rule: what it means, how
  to choose between neighbours, what it does not mean. The Astra guide's example: "Choose one
  primary category based on the customer's main issue. Severity describes impact on product use,
  not emotional intensity. Do not infer churn risk unless the customer indicates it."
- EVIDENCE, required. Which inputs the values may come from and nothing else: "Use only the
  feedback text and the supplied account context."
- UNCERTAINTY, required. The explicit unknown state and when to use it: "When evidence is
  insufficient, use the schema's `unknown` value rather than guessing." Model unknowns in the
  schema as a status enum (`verified`, `not_found`, `conflicting`, `not_applicable`) beside a
  nullable value, so `null` does not carry five meanings.
- EXAMPLES, conditional. Two or three input-to-output pairs at the boundaries where categories
  overlap. None for the obvious cases.
- OUTPUT, required. "Conform to the attached schema." Without a schema feature, add "Output only
  the JSON, no prose before or after it."

In the schema, outside the prompt: enums for every closed category, `required` for every field
the consumer reads, `additionalProperties: false`, descriptions on fields that carry meaning, and
a version when consumers depend on the contract.

## Delete

- The schema written out again as prose. Keep field semantics, drop types and nesting.
- "Return valid JSON" as the only enforcement. Valid JSON is not schema conformance, and
  conformance is not correctness.
- "Confidence" with no definition. Give it a numeric meaning or use the status enum.
- Generic schema field names (`value`, `data`, `result`). Rename in the schema so the prompt need
  not explain them.
- Long example sets of easy cases. They consume context and teach an accidental format policy.
- Permission or policy checks the model enforces by filling a field. The consumer validates
  evidence, state and permission after the schema check.

## Token rule

The rewrite comes out shorter than the draft in most cases, because the schema prose leaves and
the semantics block stays within six lines. Growth is justified once, for a boundary example set
when two categories overlap and the draft had none. Effort `low` or `medium` holds for extraction
and classification on every vendor. Surface it. The floor applies.

## Template

```
TASK
<decide or extract what, from which input>

FIELD SEMANTICS
<field>: <what it means and how to choose>. <field> is not <common confusion>.

EVIDENCE
Use only <named inputs>. Do not fill gaps from general knowledge.

UNCERTAINTY
When the evidence does not decide a field, set <status field> to <unknown value> and leave the
value null. Never guess.

EXAMPLES
<boundary input> -> <output>

OUTPUT
Conform to the attached schema. Output only the JSON.
```

Schema pattern for a field that may be missing, from the structured-outputs guide:

```json
{"value": {"type": ["string", "null"]},
 "status": {"type": "string", "enum": ["verified", "not_found", "conflicting", "not_applicable"]},
 "source_id": {"type": ["string", "null"]}}
```

## Per-vendor notes

- OpenAI: see `models/openai/_family.md`. Structured Outputs with a JSON Schema in `text.format`
  is schema-constrained. JSON mode only guarantees valid JSON. Function arguments use their own
  `strict: true` schemas.
- Anthropic: see `models/anthropic/_family.md`. JSON output goes through `output_config.format`
  with a schema, and tool inputs through `strict: true`. Fable 5.1 rejects forced `tool_choice`,
  so name the tool in the prompt when a tool carries the schema. A new schema may add latency on
  first use while its grammar is cached.
- Google: see `models/google/_family.md`. Set `response_mime_type` to `application/json` with
  `response_schema`. Google's guide warns that a schema-compliant reply can still be wrong, so the
  semantics block stays.
- Chat apps: no schema feature exists. Paste the schema once, add "Output only the JSON", and
  validate by hand.

## Check before sending

- Does every field with a judgment call have a one-line rule in FIELD SEMANTICS?
- Does the schema carry the shape, with none of it repeated as prose?
- Is there an explicit unknown state, and does the prompt say when to use it?
- Are the examples boundary cases only?
- Does OUTPUT name the provider's schema mechanism, or "only the JSON" where none exists?
