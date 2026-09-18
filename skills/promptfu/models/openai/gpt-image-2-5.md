# Profile: GPT Image 2.5 (Flare and Sunburst)

Delta on `models/openai/_family.md`. Read the family file first for the refusal handling and
the Responses API conventions. This file holds what an image prompt needs: the two model IDs,
the parameters that live outside the prompt, the prompt structures for new images and edits,
and the evaluation rule. Pair it with `tasks/image-generation.md` for the task-level blocks.

Last verified 2026-09-18 against OpenAI's image-generation guide and the model pages for
`gpt-image-2.5-flare` and `gpt-image-2.5-sunburst`, with prompt-structure guidance from
PrompTessor (secondary).
Sources: https://developers.openai.com/api/docs/guides/image-generation,
https://developers.openai.com/api/docs/models/gpt-image-2.5-flare,
https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst,
https://promptessor.com/blog/gpt-image-2-5-prompting-guide (secondary).

## Where this model fits

- `gpt-image-2.5-flare` is OpenAI's fastest model for high-quality everyday generation.
  `gpt-image-2.5-sunburst` is its most capable model for generation and editing, chosen for
  editing precision.
- Both price the same per token: text input $5 ($1.25 cached), image input $8 ($2 cached),
  image output $30 per MTok. There is no text output charge. Cost per image therefore scales
  with `quality` and `size`, and OpenAI publishes no per-image dollar figure.
- Decision rule: test Flare first when GPT Image 2 already met the bar, test Sunburst first when
  edits keep drifting or quality is unmet, and measure cost per accepted image rather than
  request latency (secondary source).
- Two ways in: the Images API (`v1/images/generations`, `v1/images/edits`) or the
  `image_generation` tool inside the Responses API under a mainline model such as
  `gpt-6-astra`. In the Responses path the mainline model rewrites the prompt and returns it as
  `revised_prompt`, so inspect that field when the output surprises you.
- Rate limits run from 100k TPM and 5 images per minute at tier 1 to 8M TPM and 250 per minute
  at tier 5. Organization verification may be required before first use.

## Core shift vs GPT Image 2

Better reference fidelity, precision editing that changes only the requested element,
multi-turn consistency where earlier edits survive later ones, and handling of complex visual
instructions such as layouts, real-world information and transparency, with lower latency on
Flare (secondary source). The prompting job moves from coaxing the model toward the subject to
stating deliverable, subject, composition and preservation precisely and letting the API carry
quality and format.

## Delete on sight

- Style adjectives as the opener ("premium, cinematic, aesthetic"). Lead with the deliverable and
  the subject, and turn adjectives into concrete lighting, palette and material directions.
- Vague preservation ("keep it the same"). Name what must stay: geometry, label text, logo
  placement, colour, camera angle, crop.
- Five major edits in one turn. One narrow change per turn keeps earlier edits stable.
- Several reference images without assigned roles.
- Camera metadata as an exact optical simulation ("shot on 85mm f/1.4"). It steers the look
  and does not compute the optics.
- The assumption that a higher `quality` setting always improves the result.
- Transparency requested only in the prompt. It needs the `background` parameter and a PNG or
  WebP output.
- Pixel-identical preservation by prompt alone. Composite the protected region back in
  afterwards.
- Rewriting the whole prompt while also changing model or quality. Change one variable per test.

## Refusal / safety hazards

Blocked requests return `error.code = "moderation_blocked"` with a `moderation_details` object
holding `moderation_stage` (`input`, `output` or `unknown`) and coarse `categories` such as
harassment, self-harm, sexual or violence. Do not retry without changing the prompt or the input
images. `moderation` accepts `auto` (default) or `low` for less restrictive filtering.

## Always add

- **New image, eight parts in this order** (secondary source): deliverable (asset type and use),
  subject (visible attributes, pose, product geometry), scene, composition (placement regions
  such as "lower-left third", copy-safe zones as percentages, negative space, hierarchy), visual
  direction (lighting as direction and quality, palette, materials, texture), text (exact copy in
  quotes, "render exactly once", placement, typography), constraints (exclusions), output
  (aspect ratio and format, matched to the `size` parameter).
- **Edit, six parts** (secondary source): edit target (what changes), preserve (explicit
  unchanged elements), reference roles, integration (match lighting, geometry, perspective),
  exclusions (what must not be added), output.
- **Reference roles, one job each.** "Image 1 = product identity. Image 2 = lighting reference
  only, do not copy subject or background. Image 3 = composition reference, do not copy colours,
  text or product design."
- **Preservation list for product work.** Silhouette, proportions, materials, label dimensions,
  logo placement, printed copy, camera perspective.
- **Lighting as direction.** "Large softbox from camera-left creates a broad controlled
  highlight. Gentle negative fill on the right preserves shape without crushing shadows."
- **Text verification step.** Check spelling, count and legibility after generation, since text
  placement is still imprecise.
- **UI, slides and diagrams as a specification.** Real titles, labels, hierarchy and exact data,
  then verify the factual relationships in the output.
- **Sketch inputs as layout constraints.** Preserve geometry and perspective, and specify
  materials, lighting and texture separately.

## Dispatch settings

- **Quality.** `quality` takes `low | medium | high | xhigh | max | auto` (default `auto`). Test
  the lowest setting that meets the acceptance criteria and record the cost per accepted image.
- **Size.** Presets `1024x1024`, `1536x1024`, `1024x1536`, or a custom `WIDTHxHEIGHT` with
  width and height multiples of 16, aspect ratio between 1:3 and 3:1, and no edge over 3840
  pixels. `auto` lets the model choose.
- **Background and format.** `background` takes `transparent | opaque | auto`. Transparency
  requires `output_format` of `png` or `webp`. Inspect the alpha channel and exclude
  checkerboards, scenery, floors and cast shadows in the prompt.
- **Format and compression.** `output_format` is `png` (default), `jpeg` (faster) or `webp`, with
  `output_compression` 0 to 100 for JPEG and WebP.
- **Multiple candidates.** `n` returns several images per request. `partial_images` 0 to 3 with
  `stream: true` returns intermediate frames.
- **Edits and masks.** Multiple input images are accepted and a mask applies to the first. The
  image and mask must share format and size, stay under 50 MB, and the mask needs an alpha
  channel. `input_fidelity` controls adherence to the reference in edits.
- **Multi-turn in Responses.** Continue with `previous_response_id` or include the earlier
  image generation call's output ID as a context item. `action` takes `auto` (default),
  `generate` or `edit`, and forcing `edit` with no image in context errors.
- **Iteration rule.** One narrow change per turn. Restate the critical constraints when drift
  appears. Track consistency across the whole edit sequence, since OpenAI notes recurring
  characters and brand elements can still drift.
- **Latency.** Complex prompts can take up to two minutes. Do not treat a slow response as a
  failure.
- **Evaluation dimensions** (secondary source). Generation: instruction following, composition,
  subject fidelity, text accuracy, style consistency, constraint adherence, production
  usability. Editing: edit success, preservation, identity and geometry retention, integration
  realism, unwanted drift, multi-turn stability. Performance: response time, failure rate,
  retry rate, accepted-image rate, cost per accepted asset.

## API notes

- IDs `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`. Endpoints `v1/images/generations` and
  `v1/images/edits`, or the `image_generation` tool in Responses with the image model named in
  the tool definition and a mainline model at the top level.
- Reference images in Responses: fully qualified URLs, base64 data URLs, or File IDs uploaded
  with purpose `vision`.
- Documented limits: text placement still imprecise, recurring characters and brand elements
  may drift across generations, precise placement in layout-sensitive compositions is hard.
- Streaming events: `image_generation.partial_image` on the Images API and
  `response.image_generation_call.partial_image` on Responses.
