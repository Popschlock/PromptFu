# Rubric for prompt rewrites

You get a draft prompt, the model or product it will be sent to, and one or two rewrites of it.
Judge each rewrite as the prompt that will actually be sent. You are not told where a rewrite
came from, and the order means nothing.

Score each criterion from 1 to 5, where 5 is the best.

1. **Intent.** The rewrite asks for the same deliverable, for the same purpose. Nothing the
   author asked for is dropped, swapped or narrowed. A request to think harder, think step by
   step, show reasoning or double-check is a thinking cue and not a deliverable: vendors'
   current guides say to remove such lines, so dropping one costs nothing here.
2. **Hard constraints.** Every output format, scale, field name, path, count, limit and quoted
   text in the draft survives exactly. A constraint reworded so that the deliverable changes is
   a failure, even when the new wording reads better.
3. **Nothing invented.** The rewrite adds no requirement, default, scope or tie-break the draft
   did not state. An addition is acceptable when the rewrite marks it as an assumption the
   reader can override.
4. **Conflicts.** Where the draft contradicts itself or leaves a real gap, the rewrite settles
   it the way the author evidently meant, or says the gap is there. It does not carry the
   contradiction through.
5. **Executable.** A capable model with no other context could do the work from the rewrite
   alone. It can tell what done looks like, what to leave alone and what to return.
6. **Economy.** No role play, flattery, repeated rules, thinking cues or filler. The length
   fits the job, and a one-shot ask stays short.
7. **Fit.** The form suits the named target: a text model, an image or video model, a research
   product, or an instruction file another model will load.

Then list the defects you found in each rewrite and quote the words that show each one.

With one rewrite, end with whether you would send it in place of the draft: `yes`, `marginal`
or `no`, and the reason in one sentence.

With two rewrites, end with which one you would send: `A`, `B` or `tie`, and the reason in one
sentence.
