# Profile: Claude Opus 4.8 (and Opus 4.x)

Last verified 2026-07-13 against official model guidance. Re-verify on Opus point releases.

## Where Opus fits now

- **Fallback / routing target for Fable's safety classifiers.** Security-flavored, bio/life-science, competing-AI-model, and reasoning-visibility tasks should be sent to Opus from the start rather than tripping a Fable refusal and retrying. Opus is the published fallback model and does not carry Fable's classifiers.
- **Strong in its own right:** long-horizon agentic work, knowledge work, vision, and memory tasks. Cheaper per token than Fable. Reach for it when the task doesn't need Fable's frontier autonomy, or when you want visible reasoning.

## Prompting deltas vs Fable

- **Explicit structure helps rather than hurts.** Numbered procedures, behavior checklists, and enumerated edge cases are load-bearing on Opus — keep them. It fills fewer gaps from intent alone, so spell out the micro-decisions you care about.
- **Literal instruction following.** Opus 4.8 does not silently generalize an instruction from one item to the next, and won't infer requests you didn't make (especially at lower effort). If something should apply broadly, say so ("apply this to every section, not just the first").
- **Enumerate behaviors you want steered.** One brief meta-instruction ("be concise") steers less reliably than listing the specific patterns (no preamble, don't restate the diff, output format X). Positive examples beat "don't" lists.
- **Effort is the depth dial, through adaptive thinking — not `budget_tokens`.** On Opus 4.8 thinking is off unless you set `thinking: {type: "adaptive"}`, and `budget_tokens` returns a 400. Start at `xhigh` for coding/agentic work; use a minimum of `high` for intelligence-sensitive work; `medium`/`low` for cost- or latency-sensitive scoped tasks. Effort matters more on this model than any prior Opus, so tune it actively. "think hard"-style cues still nudge depth when thinking is on.
- **Tool use leans toward reasoning.** Opus favors reasoning over tool calls; raise effort (or say so explicitly) when you want more searching and reading in agentic work.
- **Nudge parallelism and subagents explicitly.** Opus spawns fewer subagents and runs fewer parallel calls by default; if you want fan-out, say so ("launch these N searches in parallel"; "spawn a subagent per file when reading several").
- **Long-horizon is a strength, not a risk.** Opus 4.8 tracks state well across long and multi-window work. Use progress files, a structured test list, and git for state across context windows because it is an effective pattern here, not to paper over a weakness. Restating standing constraints at phase boundaries is still good hygiene on very long runs.
- Prefills are removed on 4.6+ (400 error); `temperature`/`top_p`/`top_k` are also rejected.

## Always add (same content set as Fable — only the form differs)

These are model-agnostic and MUST appear in the Opus rewrite too; dropping any because "Opus is the more forgiving target" is the transport failure this section exists to prevent.

- **Intent framing** — who wants it, why, what the output enables.
- **Evidence-audit block, near-verbatim:** "Before reporting, check each claim against something you actually read/ran this session; mark anything unverified as unverified."
- **Boundaries with explicit exclusions** — least privilege, assess-vs-act, and named exclusions for vendored/third-party/generated trees in any scope. Opus fills fewer gaps from intent alone, so it needs these spelled out *more* than Fable, not less.
- **Hard constraints verbatim** and the exact output contract.
- **Maker-never-grader verification and bounded units of work** for dispatch.

The Opus difference is *additive*: on top of the shared content set, Opus also wants the procedural detail (numbered steps, enumerated behaviors, restated constraints) that would degrade Fable.
