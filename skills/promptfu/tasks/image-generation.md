# Playbook: image generation

An image prompt is a specification for a picture, and a weak one reads like a mood board. The
rewrite names the deliverable, the subject, the scene, the composition, the light, any text and
the exclusions, in that order, and keeps everything the product controls through a parameter
out of the prose. Edits get a second structure that splits what changes from what must stay.

Last verified 2026-09-18 against the PrompTessor GPT Image 2.5, AI image and Midjourney guides and the Google model catalog.
Sources: https://promptessor.com/blog/gpt-image-2-5-prompting-guide, https://promptessor.com/blog/ai-image-prompts-how-to-write-better-prompts-for-any-ai-image-generator-in-2026, https://promptessor.com/blog/best-midjourney-prompts-for-realistic-photos-characters-products-and-art-in-2026, https://ai.google.dev/gemini-api/docs/models

## When this playbook applies

Trigger words: generate an image, make a picture, render, illustration, product shot, logo,
thumbnail, hero image, edit this photo, remove the background, change the background, in the
style of, `gpt-image-2.5`, `gemini-3-pro-image`, Nano Banana, Midjourney, Imagen, Flux, Stable
Diffusion.

Nearest neighbour: `tasks/multimodal-input.md` when an image is the input and the output is
text, and `tasks/video-generation.md` when the output moves. When a reference image is supplied
and the output is a new image, this playbook applies and the reference gets a role.

## Required blocks

New image, in this order, from the GPT Image 2.5 guide and generalized:

1. DELIVERABLE (required): asset type and where it will be used. This is the Intent block.
2. SUBJECT (required): the primary element with visible attributes, pose and geometry.
3. SCENE (required): environment and context.
4. COMPOSITION (required): framing, hierarchy, placement regions such as "lower-left third", copy-safe zones as percentages, negative space.
5. VISUAL DIRECTION (required): lighting as direction and quality, a palette of two or three colours, materials, texture.
6. TEXT (conditional): exact copy in quotes, how many times it appears, placement, typography.
7. CONSTRAINTS (conditional): exclusions, kept short.
8. OUTPUT (required): aspect ratio and format in prose for chat products, or as parameters for the API.

Edit, in this order:

1. EDIT TARGET (required): what changes.
2. PRESERVE (required): the explicit list of what stays. For a product that is silhouette, proportions, materials, label dimensions, logo placement, printed copy and camera perspective.
3. REFERENCE ROLES (conditional): one job per input. "Image 1 = product identity. Image 2 = lighting reference only (do not copy subject/background). Image 3 = composition reference (do not copy colors/text/product design)."
4. INTEGRATION (conditional): match the lighting, geometry and perspective of the untouched parts.
5. EXCLUSIONS (conditional): what must not be added.
6. OUTPUT (required).

Lighting is written as direction. The guide's example: "Large softbox from camera-left creates
broad controlled highlight. Gentle negative fill on right preserves shape without crushing
shadows." Adjectives such as cinematic or premium carry nothing the model can act on.

## Delete

- Opening style adjectives: premium, cinematic, aesthetic, beautiful, professional.
- "Keep it the same" as a preservation instruction. Name the elements.
- Five edits in one turn. Make one narrow change per turn, then restate any constraint that drifted.
- Several references with no roles.
- Long negative lists. Keep one short exclusion line, only for things the model tends to add.
- Camera and lens metadata treated as an optical simulation.
- A request for transparency that lives only in the prose, because it needs the API parameter.
- Pixel-identical preservation asked of the prompt. That is a compositing job.

## Token rule

A good image prompt is 60 to 150 words for a new image and 40 to 100 for an edit. Growth comes
from the preserve list and from exact text. Every phrase must describe something visible in the
result. A rewrite of a one-line draft may triple in length and still save tokens, because the
second and third generations it prevents cost more than the words.

## Template

```
DELIVERABLE  {asset type} for {use}
SUBJECT      {what, with visible attributes and pose}
SCENE        {where, context}
COMPOSITION  {framing, placement region, copy-safe zone, negative space}
LIGHT        {direction and quality}. PALETTE {two or three colours}. MATERIALS {texture}
TEXT         "{exact copy}", rendered exactly once, {placement}, {typography}
EXCLUDE      {short list}
OUTPUT       {aspect ratio}, {format}

EDIT
CHANGE       {the one thing that changes}
PRESERVE     {explicit list}
REFERENCES   Image 1 = {role}. Image 2 = {role, and what not to copy}.
INTEGRATE    match {lighting, perspective, scale} of the untouched region
EXCLUDE      {what must not be added}
OUTPUT       {as above}
```

Midjourney takes the same content as one flowing phrase list with parameters last:
`{medium} of {subject}, {action}, in {environment}, {composition}, {camera}, {lighting}, {palette}, {mood}, {details} --ar 3:2 --raw --s 100`.

## Per-vendor notes

- OpenAI GPT Image 2.5, `gpt-image-2.5-flare` (fast, the default) and `gpt-image-2.5-sunburst` (quality): `quality` runs `auto`, `low`, `medium`, `high`, `xhigh`, `max`, and the guide says to test the lowest setting that meets acceptance. `background: transparent` needs PNG or WebP output and an alpha-channel check. Details in `models/openai/gpt-image-2-5.md`.
- Google `gemini-3-pro-image` (4K, text rendering) and `gemini-3.1-flash-image` (volume): descriptive scene prose works, and edits are conversational with one revision per turn. Details in `models/google/gemini-image.md`.
- Midjourney: focused visual phrases with no conversational framing. `--ar` sets the shape, `--s` stylize (lower follows the words more literally), `--c` chaos, `--w` weird, `--raw` less automatic styling, `--no` exclusions. Parameters go at the end and never inside the description. Flags such as `--sref` exist and were not verified this session.
- Chat products (ChatGPT, the Gemini app): quality and size are picked in the UI or by prose, so say the aspect ratio in words.
- Evaluate by cost per accepted image across instruction following, subject fidelity, text accuracy, preservation and drift.

## Check before sending

- Is the first line the deliverable and its use?
- Is every adjective replaced by a visible property?
- Is exact text quoted with a count and a placement?
- For an edit, is the preserve list explicit and the change singular?
- Does each reference image have one role and a do-not-copy note?
- Are quality, size, background and aspect ratio set as parameters where the product has them?
