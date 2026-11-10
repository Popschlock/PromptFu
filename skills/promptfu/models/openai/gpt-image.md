# GPT Image 2.6 and 2.5 (`gpt-image-2.6-flare`, `gpt-image-2.6-sunburst`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`)

Verified 2026-11-10 against the pages under Sources.
Sources: https://developers.openai.com/api/docs/ (guides/image-prompting, guides/image-generation, guides/tools-image-generation, models/gpt-image-2.6-sunburst, models/gpt-image-2.5-sunburst, deprecations) and https://learn.chatgpt.com/docs/image-generation
Unverified: whether the Responses `image_generation` tool accepts a 2.6 model (its guide lists 2.5 and older), the default `quality` on 2.6, and size limits on 2.6 beyond multiples of 16 and the 1:3 to 3:1 ratio.

## Fit

Flare is the smaller model, for when response time matters most. Sunburst is the base model, for demanding detail, layout or edit accuracy. If Sunburst meets the bar, try Flare with the same prompt, references, size and quality. One prompting guide covers both versions with the same eight fundamentals. 2.6 adds `complexity`, SVG and animated GIF output.

The docs disagree on the version for new work. The image prompting guide and the deprecations page point to 2.6. The image generation guide still says to use 2.5 for new integrations, and the guide to the Responses `image_generation` tool lists only 2.5 and older. Until they agree, use 2.6 through the Image API and 2.5 where the Responses tool is the path. GPT Image 2 was deprecated on 2026-11-10.

## Delete

- **Settings written into the prompt** (size, quality, transparency, format). They are request fields, and the prompt describes the image.
- **Mood words alone.** For a cinematic, low-light or neon scene, give scale, atmosphere and color.
- **Camera specs as exact optics.** They are cues for appearance, not a physical simulation.
- **Special syntax.** Paragraphs, labeled sections and JSON-like structures all work. Pick what is easiest to read and update.
- **Several changes in one edit.** Ask for one change per turn.
- **"Same style as before" alone.** Restate the critical constraints when the result drifts.
- **A prompt as the guarantee of a pixel-identical region.** Composite the approved edit into the original.

## Add

- **New image.** Name the subject and the intended use (product photograph, advertisement, diagram), then composition, aspect ratio and placement. For a complex request use labeled sections: scene, subject, details, constraints. Name materials, lighting, colors and the medium, and say "photorealistic" when that is the goal.
- **People.** Body framing, relative scale, gaze and interaction with objects ("full body visible, feet included").
- **Text in the image.** The exact wording in quotes, with position and typography. Spell unusual words and brand names letter by letter, and ask for no extra text.
- **Edits.** Say "change only X" and list what to preserve: identity, geometry, layout, lighting, labels. State exclusions such as extra text, logos or watermarks.
- **References.** Number each input and give it one role (subject, style, clothing, background), and say how they combine.
- **Markup edits.** Circle the target on an overlay and describe the change. The guide's example:

```text
Recolor the striped vase inside the red circle to solid cobalt blue ceramic. Keep its shape, the dried stems, and the rest of the kitchen unchanged. Remove the red circle from the finished photo.
```

- **GIF.** Give the subject a starting pose to return to and say whether the camera moves.
- **Check the result.** Every word readable and as requested, identities, product shapes and labels intact, only the requested change made, and real transparent pixels when transparency was asked for.

## Hazards

Prompts and images are filtered under OpenAI's content policy. A blocked request returns `moderation_blocked` with a stage (`input` or `output`) and coarse categories, and a retry needs a changed prompt or input image. `moderation` takes `auto` (default) or the less restrictive `low`. Documented limits: text placement and clarity, consistency of recurring characters and brand elements, and precise placement in layout-sensitive compositions. A complex prompt can take up to 2 minutes.

## Dispatch

- **`quality`** stands in for effort: `auto` (the 2.5 default), `low`, `medium`, `high`, `xhigh`, `max`. It sets rendered detail such as texture and small lettering. `low` for drafts. Compare `medium` and `high` for small or dense text. `xhigh` and `max` only for a requirement the lower levels miss.
- **`complexity`** (2.6 only): `low`, `medium`, `high`, default `high`. It sets how much the model plans before rendering. High helps dense text, complex layouts and prompts that leave design decisions open, and can add latency and unwanted changes. Start at `low` for a one-detail edit. Change quality or complexity, never both at once.
- **`size`.** `auto` or `WIDTHxHEIGHT`, both multiples of 16, ratio from 1:3 to 3:1. On 2.5, no edge over 3840 and 655,360 to 8,294,400 pixels in total.
- **Transparency.** `background: "transparent"` with PNG or WebP. Check the alpha channel.
- **Formats.** `png`, `jpeg`, `webp`. On 2.6 also `svg` (generations only, `n` of 1) and `gif` (`frame_count` 2 to 16).
- **Edits.** Omit `input_fidelity`. `markup` is a transparent PNG with the first input image's pixel dimensions, on the Image API edit endpoint, never with `mask`. A mask is guidance and may not be followed exactly.
- **Path.** The Image API for one image from one prompt. The Responses `image_generation` tool for multi-turn editing: there the mainline model revises the prompt (read `revised_prompt`) and `action` is `auto`, `generate` or `edit`.
- **Codex.** `$imagegen` in a prompt invokes built-in image generation, which still uses `gpt-image-2`.
