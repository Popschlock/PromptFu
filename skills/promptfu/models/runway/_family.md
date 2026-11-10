# Runway family

Verified 2026-11-10 against Runway's help center (the prompting guides for text to video, image to video, Gen-4 Video, Gen-4 Image and Aleph 2.0, and the prompting introduction, references, languages and generation error articles), developer docs (models, API reference, moderation, task failures) and Usage Policy.
Sources: https://help.runwayml.com/hc/en-us/articles/ (42460036199443-Text-to-Video-Prompting-Guide, 48324313115155-Image-to-Video-Prompting-Guide, 52150503729171-Aleph-2-0-Prompting-Guide), https://docs.dev.runwayml.com/ (llms-full.txt, api.md), https://runway.com/safety/usage-policy
Unverified: none.

## Models

| Model | ID | Use it for |
|---|---|---|
| Gen-4.5 | `gen4.5` | Text to video and image to video, 2 to 10 seconds |
| Gen-4 Turbo | `gen4_turbo` | Fast image to video. Needs an input image |
| Aleph 2.0 | `aleph2` | Editing a video of up to 30 seconds |
| Gen-4 Image, Gen-4 Image Turbo | `gen4_image`, `gen4_image_turbo` | Images, with up to 3 reference images |
| Other makers' models (Seedance, Kling, Veo, GPT Image and more) | per model | Write for the maker's model |

No effort level: the controls are duration, ratio and seed. Any language works, English most consistently. Act-Two (`act_two`) takes a performance video and no text prompt.

## Dialect

Plain descriptive sentences, in any order, with no labels. Start simple and add a detail at a time. Runway's shapes, text to video then image to video:

```text
[Camera] shot of [a subject/object] [action] in [environment]. [Supporting component descriptions]
The camera [motion description] as the subject [action]. [Additional descriptions]
```

- **Text to video** describes the visuals and the motion.
- **Image to video** describes motion only: the image sets subject, composition, lighting and style, and repeating them reduces motion. Say "the subject" or "the woman". Add visuals only for a new element or a transformation.
- **Sequence.** "X occurs, then Y occurs", or rough timestamps that fit the duration:

```text
[00:01] X occurs. [00:03] Y occurs. [00:04] Z occurs.
```

- **No cuts.** Add "Continuous, seamless shot", or raise the duration.
- **Aleph 2.0.** An action verb (add, remove, change, replace, re-light, re-style) and the result wanted. Only what is named changes:

```text
Change the outfit and bag to soft yellow
```

- **Gen-4 Image.** Full sentences. A reference image is called by its tag:

```text
@EiffelTower painted in the style of @StarryNight
```

## Delete

- **Negatives** ("no camera movement", "a man with no hair"). Unsupported: they can produce the opposite. Write "Locked camera", "a bald man".
- **Requests and commands** ("can you please add my dog"). Describe how the element enters or looks. Aleph 2.0 and image references are the exceptions.
- **JSON.** The models ignore the formatting.
- **Abstract words** ("beautiful", "professional") and details that conflict.
- **Multi-paragraph prompts.** They create conflicts. On Gen-4 Turbo, one scene a clip.

## Hazards

- Moderation scans text, media and output. The Usage Policy bans sexual content and adult nudity, graphic violence and gore, anything sexualizing or endangering children, hate and harassment, another person's image, video or audio without permission, the style of a known, living artist, and impersonation.
- Change a blocked prompt before another try: repeats can suspend the account. On the API a block is a `FAILED` task with a `SAFETY` failure code.
- Asking for a prompt to be written, or explicitly for generated text, can fail as `INTERNAL.BAD_OUTPUT.01`, as can logos, watermarks or overlaid text in input media.

## Dispatch

- `promptText` holds up to 1,000 characters on Runway's own models.
- `ratio` and `duration` differ by model, so never reuse them. `gen4.5` requires both: `1280:720` or `720:1280` for text to video, and 2 to 10 whole seconds.
- `gen4_image_turbo` requires 1 to 3 `referenceImages`. A `tag` is 3 to 16 letters, digits or underscores, starting with a letter.
- `gen3a_turbo` and `gen4_aleph` are retired.
