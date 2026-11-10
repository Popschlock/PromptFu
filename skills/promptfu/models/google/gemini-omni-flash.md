# Gemini Omni Flash (`gemini-omni-1.2-flash`)

Verified 2026-11-10 against Google's "Generate and edit videos with Gemini Omni Flash" guide, the Gemini Omni Flash model page, the video generation page and the deprecations page.
Sources: https://aistudio.google.com/docs/omni, https://aistudio.google.com/docs/models/gemini-omni-flash, https://aistudio.google.com/docs/video
Unverified: none.

## Fit

The Gemini API's model for generating and editing video: 3 to 15 second clips with native audio, from text, images and video, refined over several turns. It replaced the Veo 3.1 preview models on the Gemini API. The docs give it no thinking level. The controls are duration, aspect ratio and resolution. `gemini-omni-1.1-flash` stops at 10 seconds and routes here from 2026-12-03.

## Delete

- **Control strings** (`<FIRST_FRAME>`, `<LAST_FRAME>`, `<IMAGE_REF_0>`, `<VIDEO_REF_0>`). Deprecated. Say in plain words how each image or video is used.
- **A system instruction or a separate negative prompt.** Neither is supported. Negatives go in the prompt itself.
- **A long, descriptive edit prompt.** Simple prompts work best for editing, and descriptive ones cause unintended changes.
- **A length written in the prompt** when `duration` is set. The setting wins.
- **Vague motion** ("make it move") with an input image. Describe the camera movement, the subject motion and the environment.
- **Reasoning across several videos, audio inputs, voice edits and YouTube sources.** Not supported.
- **New dialogue when extending an uploaded video in which someone talks.** Not supported.

## Add

**Every prompt.** Plain descriptive sentences, with none of the family file's tags: the scene, the camera movement, the lighting and the mood. Google's example of a single-shot prompt:

```text
Continuous, unbroken handheld shot of a fluffy tabby cat sitting on a sunny windowsill, looking out into a leafy garden. The cat's tail twitches slowly, and its ears rotate slightly toward ambient noises. Sunbeams illuminate dust motes in the air. Sound design: Gentle breeze, distant bird chirps. No dialogue.
```

**One continuous shot.** Omni cuts between a few shots by default, so a single scene has to be asked for with one of:

```text
In a single unbroken scene
In a single continuous shot
No scene cuts
```

**Things to keep out.** Short negatives in the prompt:

```text
No dialogue
No embellishments
No extra sound effects
```

**Audio.** The model adds a soundtrack it finds fitting. Describe the audio you want, above all music ("Include calm background music").

**Timed events.** Plain language works ("After 3 seconds, a woman enters the scene."), and so does a timecode:

```text
[0-5s] A person is walking down a quiet street
[5-10s] They stop and turn around toward a glowing doorway
[10-15s] They start running into the portal
```

**Text on screen.** Give the exact words, for background signs too.

**Editing one aspect of a video.** One short instruction and the keep-the-rest sentence, as in Google's example:

```text
Add a cat that jumps onto his lap, he begins to pet it. Keep everything else the same.
```

**Extending a clip.** "Extend this video" or "The scene continues", plus what changes: the audio, a cut to a new scene, a new character from a reference image. Timestamps count from the start of the new part. The model sees only the last 10 seconds, so name again anything that appeared earlier.

## Hazards

- Safety filters run on the prompt and the video and vary by region. A violating prompt is blocked.
- Images of certain recognizable people cannot be uploaded or edited. The same holds for images of minors in the EEA, Switzerland and the UK.
- Editing or extending an uploaded video is unavailable in the EEA, Switzerland and the UK.
- English is the only evaluated language. Every video carries a SynthID watermark.

## Dispatch

- **`response_format`** carries `duration` (whole seconds from 3 to 15, default 10), `aspect_ratio` (`16:9` by default, or `9:16`) and `resolution` (`360p`, `720p` by default, and upscaled `1080p` and `4k`).
- **First and last frame:** two input images and 3 to 10 seconds. A longer duration is an error.
- **Extension:** 3 to 10 seconds a turn, up to 30 seconds in total, at the end of the clip only.
- **References:** up to 6 images, 3 for each of 2 characters. Reference videos work for new clips only: one of up to 3 seconds for an 11 to 15 second clip, up to three for a shorter clip.
- **Editing input:** a video of 15 seconds or less.
- **`task`** in `video_config` is a fallback for when the prompt does not select the mode. It adds strict constraints.
- **`store=false`** is faster, and the video cannot then be edited in a later turn. Later turns use `previous_interaction_id`.
