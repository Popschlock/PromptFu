# Profile: Gemini image models (3 Pro Image, 3.1 Flash Image, 3.1 Flash Lite Image)

Delta on `_family.md`. Read that file first. This profile covers image generation and editing on
`gemini-3-pro-image`, `gemini-3.1-flash-image` and `gemini-3.1-flash-lite-image`.

Last verified 2026-09-18 against the Gemini API image generation guide, the models catalog and
the pricing page.
Sources: https://ai.google.dev/gemini-api/docs/image-generation, https://ai.google.dev/gemini-api/docs/models,
https://ai.google.dev/gemini-api/docs/pricing,
https://promptessor.com/blog/best-gemini-prompts-for-work-writing-research-coding-and-images-in-2026 (secondary),
https://promptessor.com/blog/multimodal-prompting-guide (secondary).

## Where this model fits

| Model | ID | Sizes | Price | Pick it for |
|---|---|---|---|---|
| Gemini 3.1 Flash Image (default) | `gemini-3.1-flash-image` | 0.5K, 1K, 2K, 4K | $0.067 per 1K image | the "generalist workhorse": most generation, edits, multi-turn work |
| Gemini 3 Pro Image | `gemini-3-pro-image` | 1K, 2K, 4K | $0.134 at 1K or 2K, $0.24 at 4K | the "premium choice for most complex visual tasks", precise text, brand consistency |
| Gemini 3.1 Flash Lite Image | `gemini-3.1-flash-lite-image` | 1K only | $0.0336 per image | speed and cost, single-turn edits, many object references |

Google calls `gemini-3.1-flash-image` the "most versatile model" and `gemini-3-pro-image` the one
with "advanced localization and brand consistency". `gemini-2.5-flash-image` is legacy and Google
points it at 3.1 Flash Lite. Pick Flash Lite when many object references matter more than
resolution. Pick Pro when text must be exact or a brand asset must survive edits.

## Core shift vs predecessor

The 3.x image models think before they draw. Complex prompts get a planning pass by default, and
`thinking_level` can be set to `minimal` for speed or `high` for composition work. Prompts written
as keyword lists for 2.5 lose to prompts written as one scene description with a subject, a
setting, lighting, camera and style. Edits are conversational on Flash and Pro, so a change is a
sentence on the prior turn rather than a full re-description.

## Delete on sight

- Keyword soup ("8k, trending, masterpiece"). Describe the scene instead.
- Style adjectives first ("premium, cinematic") ahead of the subject and use.
- "Keep everything else the same". List what to preserve by name.
- Several major edits in one turn. One narrow change per turn on Flash and Pro.
- Reference images without a stated job. Assign each one a role.
- Lowercase size values. The API rejects `2k`, so write `2K` and `4K`.
- On Flash Lite: Google Search grounding, multi-turn editing and any size above 1K. None exist.

## Refusal / safety hazards

Standard image safety filters apply. Every output carries a SynthID watermark. Google asks you to
verify usage rights for any uploaded reference image. None of the text-model hazards apply.

## Always add

The family file's text blocks (prose dialect, long-context ordering, verbosity) do not apply to an image request. Only the routing table, `thinking_level` where the model takes it, and the API conventions carry over.

- The deliverable and its use first, then the scene. Google's photorealistic template, verbatim:
  "A photorealistic [shot type] of a [subject] in a [setting]. [Lighting description]. Shot from a
  [angle] with a [lens]."
- For product work, Google's template, verbatim: "High-resolution, studio-lit product photo of
  [item] on [surface]. Lighting: [setup]. Camera angle: [position]. Focus: [detail]."
- For text in the image, quote the exact copy, name the font style and say how many times it
  appears. Google's template, verbatim: "Create a [image type] with text '[specific words]' in
  [font style]. Design should be [aesthetic], [color scheme]."
- For an edit: a CHANGE list, a PRESERVE list (geometry, label wording, logo placement, colors,
  camera angle, crop) and an EXCLUDE list (no watermark, no extra products, no generated text
  unless asked).
- For multiple references, an INPUT MAP with one role each: product identity, character
  consistency, style only, composition only. Say which properties must not transfer.
- The output line: `aspect_ratio`, `image_size` and background needs, plus copy-safe space when
  a designer will add text later.

## Dispatch settings

- `thinking_level` on image models is `minimal` or `high`. Use `high` for layouts, posters and
  scenes with several subjects, `minimal` for simple single-subject renders.
- Multi-turn editing keeps context through `previous_interaction_id`. Keep one thread per asset
  and restate a preserve list when drift appears.
- Reference limits: Flash Image up to 10 object images plus 4 character images plus 3 style
  references. Pro Image up to 6 object images plus 5 character images. Flash Lite up to 14
  object images.
- Grounding: `tools=[{"type": "google_search"}]` pulls real-time facts (weather, charts, events)
  into the image on Flash and Pro. Image search grounding (`search_types` with `image_search`)
  is Flash Image only. Flash and Flash Lite accept a YouTube URL or an uploaded video as context
  for posters and thumbnails.
- The Batch API takes high-volume jobs with up to 24-hour turnaround.
- Measure cost per accepted image across the edit sequence, then choose the tier.

## API notes

- Aspect ratios documented for 3.1 Flash Lite: `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`,
  `9:16`, `16:9`, `21:9`. The guide lists the same set only for Flash Lite, so confirm the
  value on Flash and Pro before relying on the rarer ratios.
- Sizes: Flash Lite 1K. Flash Image 512px (0.5K), 1K, 2K, 4K. Pro Image 1K, 2K, 4K. Uppercase
  `K` only.
- Generation settings go in `generation_config`, including `thinking_level`.
- Pricing per image: Flash Image $0.067 at 1K, Flash Lite $0.0336 at 1K, Pro $0.134 at 1K or 2K
  and $0.24 at 4K. Prices at other Flash sizes were not listed on the pricing page.
