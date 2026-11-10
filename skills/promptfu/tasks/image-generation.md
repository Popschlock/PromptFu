# Playbook: image generation

An image prompt specifies a picture. The rewrite states what the author specified in visible
terms and leaves the rest open.

## Applies when

The output is a picture, new or edited: generate, render, illustration, product shot, logo,
thumbnail, edit this photo, remove the background.

Nearest neighbor: `tasks/multimodal-input.md` when an image goes in and text comes out, and
`tasks/video-generation.md` when the output moves. A reference image in and a new image out
stays here.

## Blocks

Write a block only from what the draft gives. A subject's looks, a setting, a style, a palette,
an aspect ratio or a resolution the author did not state stays open. If a gap would sink the
picture, ask, or fill it on a closing line labeled `Assumption:`, which the author can strike.

New image, in order (condition in parentheses):

1. DELIVERABLE (required): the asset type, and its use when the draft names one. Prevents a picture that fits no layout.
2. SUBJECT (required): only the attributes, pose and geometry the draft gives. Prevents an invented look.
3. SCENE (a setting is named).
4. COMPOSITION (framing is stated, or the use fixes it): regions such as "lower-left third", copy-safe zones as percentages. Prevents a subject where the copy must go.
5. VISUAL DIRECTION (a light, color, material or look is named): lighting as direction, as in "Large softbox from camera-left creates broad controlled highlight." Prevents adjectives the model cannot act on.
6. TEXT (the image carries words): the author's exact copy in quotes, with a count. Prevents misspelled or repeated text.
7. EXCLUDE (the draft excludes something): one short line. "No people" keeps its meaning exactly, however the model card says to phrase it.
8. OUTPUT (a ratio, size, format or background is stated, or the use fixes one). Prevents a wrong crop.

Edit, in order:

1. CHANGE (required): one narrow change per turn.
2. PRESERVE (required): what stays, named from the draft and the source image. For a product: silhouette, proportions, materials, label dimensions, logo placement, printed copy, camera perspective. Prevents drift.
3. REFERENCES (a reference is supplied, for a new image too): one job per input. "Image 1 = product identity. Image 2 = lighting reference only (do not copy subject/background). Image 3 = composition reference (do not copy colors/text/product design)."
4. INTEGRATE (something is added or replaced): match the lighting, geometry and perspective of the untouched parts.
5. EXCLUDE and OUTPUT, as above.

Quality, size, background, transparency and reference-image limits are product controls. The
model card names the control. Put the value in the prompt only where the card names none.

Size: most rewrites land under 150 words for a new image and 100 for an edit. Never pad toward
that. Only the preserve list, exact text and reference roles justify growth past the draft.

## Delete

- Praise and quality filler that names nothing visible: 8k, masterpiece, beautiful, premium. A look word that carries intent (cinematic) may stay, or become a visible property labeled as an assumption.
- "Keep it the same" as a preservation instruction. Name the elements.
- Several edits in one turn. Sequence them and restate any constraint that drifted.
- Negative lists beyond the author's own exclusions.
- Camera and lens metadata treated as an optical simulation.
- Pixel-identical preservation asked of the prompt. That is a compositing job.

## Template

Keep only the lines the draft fills. The card sets the form.

```
DELIVERABLE  {asset type} for {use}
SUBJECT      {what, stated attributes, pose}
SCENE        {where, context}
COMPOSITION  {framing, hierarchy, placement region, copy-safe zone, negative space}
LIGHT        {direction and quality}. PALETTE {two or three colors}. MATERIALS {texture}
TEXT         "{exact copy}", rendered exactly once, {placement}, {typography}
EXCLUDE      {short list}
OUTPUT       {aspect ratio}, {format}

EDIT         CHANGE {one thing}. PRESERVE {explicit list}. INTEGRATE {what to match}.
REFERENCES   Image 1 = {role}. Image 2 = {role, and what not to copy}.
```

## Check before sending

- Is the first line the deliverable, and does every visible detail trace to the draft or sit on a line labeled `Assumption:`?
- Is exact text quoted with a count and a placement?
- Is an edit's change singular and its preserve list explicit?
- Does each reference have one role and a do-not-copy note?
- Does every exclusion keep its meaning, and does each product control sit where the card names it?
