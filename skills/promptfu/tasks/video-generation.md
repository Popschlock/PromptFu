# Playbook: video generation

A video prompt describes motion over time. The rewrite keeps subject, camera and environmental
motion apart and adds no look the author did not state.

## Applies when

The output is a moving clip, from text or from a source image: video, clip, animate, b-roll,
ad spot.

Nearest neighbor: `tasks/image-generation.md` when nothing moves, and
`tasks/multimodal-input.md` when a video goes in and text comes out.

## Blocks

Write a block only from what the draft gives. A subject's looks, a camera move, a style, dialogue,
sound, a duration or a resolution the author did not state stays open. If a gap would sink the
clip, ask, or fill it on a closing line labeled `Assumption:`, which the author can strike.

Text-to-video, required:

- SUBJECT: who or what, with the age, hair, clothing, distinguishing features or product geometry the draft gives. Prevents a subject that changes between takes.
- ACTION: one or two observable physical actions that fit the clip length. With no motion in the draft, ask, or add the smallest one the scene implies as an assumption. Prevents a still that barely moves.
- CONTINUITY, for multi-shot: face, hair, wardrobe, logo placement, lighting direction, spatial relations, a shot order and one action per shot. Prevents drift across shots.

Only when the draft states it:

- STYLE, ENVIRONMENT (location, time, weather), SHOT (close-up, medium, wide, over-the-shoulder, low angle), ENVIRONMENTAL MOTION (wind, rain, reflections, background people), LIGHT AND PALETTE (direction, quality, three or four hues), MOOD AND PACING (one phrase).
- CAMERA, also when the action implies it: one primary movement. Locked, push-in, pull-back reveal, tracking, orbit, crane, handheld follow.
- DIALOGUE: the speaker named and one short line in quotes.
- AUDIO: each cue tied to a visible action, two or three layers at most.
- ENDING, also when the action implies one: the final visible state. Prevents a clip that stops mid-motion.
- OUTPUT: duration, ratio, resolution. The model card names the control. Use prose only where it names none.

Image-to-video: the source frame replaces STYLE, SUBJECT and ENVIRONMENT, so the image defines
the appearance and the prompt describes only what moves. A reference that is not the first frame
gets one role. PRESERVE names what must stay. Portrait: facial identity, hairstyle, clothing,
pose, background, lighting direction, palette. Product: shape, dimensions, packaging, cap, label
position, logo, typography, materials. Character: face, costume, proportions, weapon,
accessories. Art: linework, eye shape, rendering style, composition.

A negative in the draft ("no music", "no text on screen") keeps its meaning exactly. The card
says how to phrase it: a positive ("locked camera" for "do not move the camera"), a description,
or a negative-prompt field.

Size: most single shots land under 130 words, image-to-video under 90. Never pad toward that.
Multi-shot is several prompts sharing one compact character block.

## Delete

- A still-image description that never says what moves.
- Praise ("beautiful", "award-winning"). Abstract direction ("moves dramatically", "make it cinematic"), which becomes the visible behavior the draft implies.
- More than one primary camera move or major event in one short clip. Flag it and offer a split into shots.
- Restating what the reference image shows, a soundscape tied to nothing on screen, dialogue with no speaker or too long for the clip.
- A whole-prompt rewrite between attempts. Change one element per iteration.

## Template

Keep only the sentences the draft fills.

```
{style} of {subject} in {environment}. The subject {action}.
{shot and angle}. The camera {movement}. {environmental motion}.
{lighting and palette}. {mood and pacing}. The character says, "{dialogue}."
Audio includes {sounds}. Preserve {continuity}.
End with {ending state}.
```

```
Animate the reference image. {subject motion}. The camera {movement}.
{environmental motion}. {timing and pacing}. Preserve {unchanged elements}.
End with {final state}.
```

Where the card allows timing, add one approximate `[00:00-00:02] ...` line per action.

## Check before sending

- Does the prompt say what moves, with at most one primary camera move and an action that fits the clip length?
- Does every look, camera move, line, sound and output setting trace to the draft or sit on a line labeled `Assumption:`?
- Does every negative in the draft keep its meaning?
- For image-to-video, is appearance left to the frame and the preserve list explicit?
