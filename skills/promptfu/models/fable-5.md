# Profile: Claude Fable 5 / Mythos 5

Last verified 2026-07-13 against the model's official prompting guidance. Re-verify when the model or its docs update.

## Where Fable fits now (updated 2026-07-25)

**Fable is no longer the default for judgment-dense work — Opus 5 is.** Until Opus 5 shipped, the routing rule was "ambiguous or judgment-dense ⇒ Fable"; that rule was written when the alternative was Opus 4.8. On the published benchmarks Opus 5 and Fable 5 now sit close enough that the split mostly buys a session handoff rather than better output, at roughly twice the cost.

Reach for Fable on the exceptions, not by default:

1. **Opus 5 already tried and stalled.** Observed failure is the trigger — not anticipating one.
2. **Long-form legal, regulatory, or contract analysis**, where Fable's published margin is widest and a miss is quiet and expensive.
3. **The caller explicitly asks for it**, or a genuinely irreversible fork is worth a second, differently-trained opinion.

Everything below still applies in full whenever Fable *is* the target — the prompting deltas did not change, only when you pick it.

## Core shift vs Opus

Give **intent + constraints, not procedures**. Fable plans better than manual scaffolding; careful Opus-era prompts (numbered step lists, behavior checklists, flight-manual skills) *degrade* Fable output — it follows your steps faithfully, including the wrong ones. Start with less structure than feels safe; add back only what observed failures justify.

## Delete on sight (Opus-era habits)

- Numbered step procedures for judgment work → replace with goal + scope + constraints
- "Think step by step" / "think harder" → the effort setting is the dial (`low|medium|high|xhigh|max`); translate the requested depth into the effort recommendation rather than just deleting the phrase
- "Re-check steps X-Y" / "do not stop until all N steps complete" → one verify pass, evidence-grounded
- "If unsure, include it anyway" → verify-then-report; unverified items explicitly marked

## Safeguards and avoiding accidental refusals

Fable runs safety classifiers that Opus does not. A tripped classifier returns `stop_reason: "refusal"` (HTTP 200, empty content); where fallback is configured the request is served by Opus 4.8 instead (in Claude Code, the `switchModelsOnFlag` setting does this automatically). Four categories (`stop_details.category`):

- `cyber` — offensive-security content such as intrusion tooling or malware development. Benign security work can trip it too.
- `bio` — dangerous life-science methods. Beneficial life-science work can trip it too.
- `frontier_llm` — helping build a competing frontier AI model. Benign machine-learning work can trip it too.
- `reasoning_extraction` — asking the model to reproduce its internal reasoning as response text.

The classifiers fire on **vocabulary and framing**, not on the task's underlying legitimacy: the dual-use filter reads for offense-vs-defense and blocks the offensive read. So when a Fable-targeted prompt touches these areas:

- **Reframe defensively and state authorization.** "Security review / audit / harden / assess exposure / pre-launch check of our own authorized code" passes where "find an exploit / write a payload / brute-force / bypass / weaponize" trips. Name who owns the system and that the goal is to protect it.
- **Never ask for reasoning echo** (`reasoning_extraction`). Preserve auditability with source citations or a send-to-user tool, not "show your reasoning."
- **When the task is genuinely security, bio, or competing-AI-model work, route it to Opus 4.8 from the start.** Opus is the fallback target and does not carry these classifiers, so routing up front avoids a refuse-then-retry round trip. Auto mode already does this.
- **The orchestrator trips too.** When the *session* model is Fable and you are optimizing a security-flavored subagent prompt, the act of handling that content can trip your own classifier. Keep your own change-report prose defensive and brief, don't quote long offensive-security passages back verbatim, and recommend routing the subagent to Opus.
- Budget refusals per request: a single turn (an agent plus its subagents) can produce several.

## Always add

- **Intent framing:** "I'm working on [larger task] for [who]; they need [what the output enables]." Fable measurably uses intent for micro-decisions you didn't specify.
- **Evidence-grounded progress:** "Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if unverified, say so." (Near-eliminates fabricated status reports on long runs.)
- **Boundaries:** assessment vs. action ("report findings and stop; don't fix until asked"), files/systems not to touch, least context and least privilege for the task (treat the agent as an untrusted tenant — scope what it can reach, not just what it's told).
- **Brevity/readability contract:** "Lead with the outcome; first sentence = the TLDR. Select what to include rather than compressing into fragments/arrow chains." One short instruction beats enumerating verbosity patterns — instruction-following is strong enough for brief steering.
- **For autonomous runs:** the pause-only-when rule ("pause only for destructive/irreversible actions, real scope changes, or input only the user can provide") and, for pipelines, "check your last paragraph — if it's a promise of work not done, do it now."

## Dispatch settings (subagents/loops)

- **Effort:** `high` default; `xhigh` only for capability-critical planning/review; `low`/`medium` for routine or grader work (low on Fable often beats xhigh on prior models).
- **Cost routing:** plan + review on Fable at xhigh; well-specified implementation on Sonnet at medium; mechanical routing on Haiku.
- **Maker-never-grader:** fresh-context verifiers judge artifacts against the spec/rubric — never the maker's summary. Verifiers with clean context catch far more seeded issues than self-critique; makers grade their own reasoning trail, verifiers grade the artifact.
- **One bounded unit of work per dispatch**; explicit stop rules (success condition, retry ceiling ~3 identical failures, budget ceiling).
- Fable dispatches parallel subagents readily and manages long-lived ones well — say when delegation is appropriate and prefer async over blocking.
- **Memory activation over storage:** if lessons/notes files exist, name them in the prompt ("consult X; record new lessons in X") — stored memory the prompt never points at doesn't get used.
- Long sessions: don't surface token countdowns; if the harness must, add "You have ample context remaining; do not stop or summarize on account of context limits."
- Before risky actions, a workspace-shaping step helps: have the model state the applicable policies, constraints, and uncertainties first.

## API notes (if constructing raw calls)

Thinking is always on (adaptive; summarized output only). `temperature`/`top_p`/`top_k`/`budget_tokens`/prefills are rejected. Refusals return `stop_reason: "refusal"` — configure fallback to Opus 4.8 and never read `content[0]` unconditionally.
