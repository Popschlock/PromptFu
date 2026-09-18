# Profile: Veo 3.1 (standard, Fast and Lite)

Delta on `_family.md`. Read that file first. This profile covers video generation on
`veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview` and `veo-3.1-lite-generate-preview`.

Last verified 2026-09-18 against the Gemini API Veo guide, the video models page and the pricing
page.
Sources: https://ai.google.dev/gemini-api/docs/veo, https://ai.google.dev/gemini-api/docs/video,
https://ai.google.dev/gemini-api/docs/pricing,
https://promptessor.com/blog/best-veo-prompts-for-cinematic-videos-dialogue-and-audio-in-2026 (secondary).

## Where this model fits

| Model | ID | Resolutions | Inputs | Price |
|---|---|---|---|---|
| Veo 3.1 (default for quality) | `veo-3.1-generate-preview` | 720p, 1080p, 4k | text, image, video | $0.40 per second, $0.60 at 4k |
| Veo 3.1 Fast | `veo-3.1-fast-generate-preview` | 720p, 1080p, 4k | text, image, video | not listed separately |
| Veo 3.1 Lite | `veo-3.1-lite-generate-preview` | 720p, 1080p | text, image | $0.05 per second at 720p, $0.08 at 1080p |

Veo 3.1 generates video with native audio and supports extension, first and last frame control
and reference images. Google points at it when "scene extension, last-frame control, or
integration with legacy pipelines are required". Lite drops video-to-video, reference images and
extension, so it fits drafts and volume. `gemini-omni-1.1-flash` is a separate fast video model
for generation, editing and keyframe interpolation and is not covered here.

## Core shift vs predecessor

Audio is part of the clip now, so the prompt describes sound and dialogue with the picture. A
prompt that reads as a still image produces a still image that barely moves. The prompting job is
to describe one moment that develops: what moves, how the camera moves, what is heard, and how
the clip ends.

## Delete on sight

- A description of a still frame with no action and no ending state.
- Several events or several camera moves in one clip. One moment, one primary camera move.
- Vague action words such as "moves dramatically". Name the visible behaviour.
- Dialogue longer than one or two short lines, or a line with no named speaker.
- Generic audio ("nice background music"). Tie each sound to a visible action or the place.
- Re-describing the subject when a reference image or a first frame already fixes it.
- Anything Lite cannot do: reference images, extension, video-to-video, 4k.

## Refusal / safety hazards

Google documents that "Veo 3.1 will sometimes block a video from generating because of safety
filters" on audio. Retry with the sound cue reworded or removed. `personGeneration` is
`allow_all` for text-to-video and extension and `allow_adult` for image-to-video, interpolation
and reference images. In the EU, UK, Switzerland and MENA it is `allow_adult` in every mode.
Every clip carries a SynthID watermark. Only English prompts have been evaluated.

## Always add

The family file's text blocks (thinking level, prose dialect, long-context ordering) do not apply to a video request. Only the routing table and the API conventions carry over.

Google's element list, in this order, each as a short clause: subject, action, style, camera
position and motion, composition, focus and lens, ambiance, then audio and dialogue. The
secondary source adds environmental motion, lighting and palette, mood and pacing, continuity and
an ending state, which fit after the camera clauses.

- Camera vocabulary from Google: "aerial view, eye-level, top-down shot, dolly shot, or worms eye".
  Composition: "wide shot, close-up, single-shot or two-shot". Lens: "shallow focus, deep focus,
  soft focus, macro lens, and wide-angle lens". Ambiance: "blue tones, night, or warm tones".
- Dialogue in quotation marks with the speaker named. Google's example, verbatim: "'This must be
  the key,' he murmured."
- Sound as a list tied to action. Secondary source form: "Audio includes rainfall, distant
  traffic, soft footsteps, and quiet umbrella fabric movement."
- A preservation sentence for continuity across shots, for example "Preserve her facial identity,
  clothing, umbrella, environment, and lighting direction."
- An ending state: "End as the streetlight turns off."
- For image-to-video, the prompt covers motion and continuity only: subtle movement, environmental
  motion, camera behaviour relative to the frame, synced audio, and an explicit preserve list.
- The output line: duration, aspect ratio, resolution, and whether the clip will be extended.

Google's full example, verbatim: "A close up of two people staring at a cryptic drawing on a wall,
torchlight flickering. A man murmurs, 'This must be it. That's the secret code.' The woman looks
at him and whispering excitedly, 'What did you find?'"

## Dispatch settings

- Duration is 4, 6 or 8 seconds. 8 seconds is required for 1080p, 4k and reference images
  (1080p and reference images on Lite).
- Aspect ratio is `16:9` by default or `9:16`. One video per request at 24 fps.
- Reference images: up to three, used as style and content references, on standard and Fast only.
- Extension: 7 seconds per step, up to 20 times, 720p only, input video up to 141 seconds,
  standard and Fast only.
- Generation is asynchronous. Poll for between 11 seconds and 6 minutes at peak. Outputs stay on
  the server for 2 days, so download them.
- Draft on Lite at 720p, then re-run the accepted prompt on standard. Measure cost per accepted
  clip, since a failed 8-second 4k clip costs $4.80.

## API notes

- IDs `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`, `veo-3.1-lite-generate-preview`.
- Modes: text-to-video, image-to-video with a first frame and optional last frame, video-to-video
  (standard and Fast), extension (standard and Fast).
- `personGeneration` values as listed under hazards. Resolution and duration constraints as
  listed under dispatch. Pricing per second as in the table.
- Negative guidance is written as a description of what should not appear, in plain words, without
  "no" or "don't" prefixes, since the model reads the noun and may render it (secondary source,
  consistent with Google's earlier Veo guidance).
