# Playbook: video generation

A video prompt describes motion over time, and the common failure is a still-image description
with "cinematic" attached. The rewrite separates subject motion, camera motion and environmental
motion, gives the clip one visual idea, one primary camera move and an ending frame, and states
what must stay consistent from shot to shot.

Last verified 2026-09-18 against the PrompTessor Veo, Runway, AI video and image-to-video guides, the Google model catalog and OpenAI's video generation guide.
Sources: https://promptessor.com/blog/best-veo-prompts-for-cinematic-videos-dialogue-and-audio-in-2026, https://promptessor.com/blog/best-runway-prompts-for-text-to-video-and-image-to-video-in-2026, https://promptessor.com/blog/ai-video-prompts-how-to-write-better-prompts-for-any-ai-video-generator-in-2026, https://promptessor.com/blog/image-to-video-prompts-how-to-animate-photos-products-characters-and-art-in-2026, https://ai.google.dev/gemini-api/docs/models, https://developers.openai.com/api/docs/guides/video-generation

## When this playbook applies

Trigger words: video, clip, animate, image-to-video, text-to-video, b-roll, product video, ad
spot, Veo, Runway, Kling, Seedance, `veo-3.1-generate-preview`, `gemini-omni-1.1-flash`.

Nearest neighbour: `tasks/image-generation.md` when nothing moves, and
`tasks/multimodal-input.md` when a video is the input and the output is text.

## Required blocks

Text-to-video, from the Veo and AI video guides:

- STYLE (required): the treatment. Cinematic live action, documentary, stop motion, anime.
- SUBJECT (required): a physical description with age, hair, clothing and distinguishing features, or exact product geometry.
- ENVIRONMENT (required): location, time, weather.
- ACTION (required): one or two observable physical actions that fit the clip length.
- SHOT (required): framing and angle. Close-up, medium, wide, over-the-shoulder, low angle.
- CAMERA (required): one primary movement. Locked, push-in, pull-back reveal, tracking, orbit, crane, handheld follow.
- ENVIRONMENTAL MOTION (conditional): wind, rain, dust, reflections, background people.
- LIGHT AND PALETTE (required): direction, quality, three or four hues.
- MOOD AND PACING (conditional): one phrase.
- DIALOGUE (conditional): the speaker named and one short line in quotes.
- AUDIO (conditional): each cue tied to a visible action, two or three layers at most.
- CONTINUITY (required for multi-shot): face, hair, wardrobe, logo placement, lighting direction, spatial relations.
- ENDING (required): the final visible state.

Image-to-video replaces STYLE, SUBJECT and ENVIRONMENT with the source frame. The prompt then
holds only motion, camera, environmental motion, timing, a PRESERVE list and the ending. The
Runway guide puts it this way: "Let the input image define the appearance. Use the text prompt
primarily to describe what moves, how the camera moves, how the scene develops over time."

Preserve lists by subject type. Portrait: facial identity, hairstyle, clothing, pose,
background, lighting direction, palette. Product: shape, dimensions, packaging, cap, label
position, logo, typography, materials. Character: face, costume, proportions, weapon,
accessories. Art: linework, eye shape, rendering style, composition.

## Delete

- A still-image description that never says what moves.
- Abstract direction such as "moves dramatically", "acts powerful" or "make it cinematic".
- More than one primary camera move, or several major events in one short clip.
- Negative phrasing for the camera. Write "locked camera" in place of "do not move the camera".
- A restatement of everything already visible in the reference image.
- Dialogue longer than the clip can carry, or dialogue with no speaker.
- A generic soundscape with cues tied to nothing on screen.
- A whole-prompt rewrite between attempts. Change one element per iteration.

## Token rule

A single-shot prompt runs 60 to 130 words. An image-to-video prompt runs 40 to 90 words because
the frame carries the appearance. A multi-shot sequence is several prompts sharing one compact
character block. The guides agree that a short clip has room for one idea, so words describing
a second idea are the cost to cut.

## Template

Text-to-video, the Veo formula quoted from the guide:

```
{video_style} of {subject_description} in {environment}. The subject {action}.
{shot_framing_and_camera_angle}. The camera {camera_movement}. {environmental_motion}.
{lighting_and_color_palette}. {mood_and_pacing}. The character says, "{dialogue}."
Audio includes {sound_effects_and_ambience}. Preserve {continuity_requirements}.
End with {ending_state}.
```

Image-to-video, from the same guides:

```
Animate the reference image. {subject_motion}. The camera {camera_movement}.
{environmental_motion}. {timing_and_pacing}. Preserve {unchanged_elements}.
End with {final_state}.
```

Approximate timing, where the product accepts it, is one `[00:00–00:02] ...` line per action.
The Runway guide calls these "approximate temporal guidance, not frame-perfect commands".

## Per-vendor notes

- Google Veo 3.1, `veo-3.1-generate-preview` and `veo-3.1-lite-generate-preview`: native audio and dialogue, reference images, and first-and-last-frame workflows in supported interfaces. Duration and aspect controls sit in the request and were not itemized by the guide. `gemini-omni-1.1-flash` is Google's fast video generation and editing model. Details in `models/google/veo-3-1.md`.
- Runway Gen-4.5: two to ten seconds per clip, so match the action to the duration. Its camera vocabulary adds crash zoom, whip pan, focus shift and macro slide. Settings change, so check the current Runway docs before relying on a ratio.
- OpenAI Sora: the Videos API and the `sora-2` models are deprecated and shut down on 2026-09-24, and the consumer app closed on 2026-04-26. Do not target Sora. OpenAI's catalog lists no video model, so an OpenAI-vendor request routes to a Google or third-party generator and the report says so.
- Seedance and Kling: multi-shot workflows want a role per reference, a shot order and one action per shot. Not verified beyond the AI video guide.
- Chat products: duration and ratio are UI choices. Say them in words anyway.

## Check before sending

- Does the prompt name what moves in three layers: subject, camera, environment?
- Is there exactly one primary camera movement?
- Does the action fit the clip length?
- Is the ending frame stated?
- For image-to-video, is appearance left to the frame and the preserve list explicit?
- Are dialogue and audio cues short, attributed and tied to visible action?
