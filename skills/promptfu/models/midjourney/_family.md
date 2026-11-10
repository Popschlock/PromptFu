# Midjourney family

Verified 2026-11-10 against Midjourney's Prompt Basics, Parameter List, Version, Image Prompts, Style Reference, Edit Model, Text Generation, Video and Community Guidelines articles, and the article for each parameter named here.
Sources: https://docs.midjourney.com/hc/en-us/articles/ (32023408776205-Prompt-Basics, 32859204029709-Parameter-List, 32199405667853-Version, 32173351982093-No, 48495453462797-Edit-Model, 32013696484109-Community-Guidelines)
Unverified: what `--exp` does. The Version chart lists it and no article explains it.

## Models

| Model | Selected by | Use it for |
|---|---|---|
| V8.2 | nothing: the default since 2026-07-24 | Images |
| V8.1, V7, V6.1, V6, Niji 7 | `--v` or `--niji` and the number | Only when pinned |
| Edit model | `--edit` and up to 4 image URLs | Changing or combining images by instruction (V8.1, V8.2) |
| Video | `--video` in Discord, Animate on the website | A 5 second clip from a starting image |

No effort level: parameters are the controls. Midjourney has no general API and bans automation, so the rewrite is text a person pastes.

## Dialect

A short, simple phrase that describes the picture, with none of the universal shape's labels. Midjourney's example:

```text
Colored pencil illustration of bright orange California poppies
```

- Name only the details that matter: subject, medium, environment, lighting, color, mood, composition. The default style fills in the rest.
- Exact words and counts: "three cats" or "flock of birds", not "cats" or "birds".
- Words to render go in double quotes, near "with the words", "text" or "written". Single quotes fail. Short Latin-alphabet text works best.

## Parameters

Last, after a space, with no punctuation in them and no text after them:

```text
still life gouache painting --no fruit, apple, pear
```

- `--ar 16:9`: whole numbers, default `1:1`, up to `14:1` (`4:1` in HD).
- `--no`: things to leave out, separated by commas.
- `--raw`: less default styling, so the words count for more.
- `--stylize` or `--s`: 0 to 1000, default 100. Low follows the prompt, high is more artistic.
- `--chaos` 0 to 100 for variety, `--weird` 0 to 3000, `--seed`, `--tile`, `--hd` or `--sd` (2048 or 1024 pixels), `--p` for a Personalization profile.
- Not on V8.1 or V8.2: `--q`, `::` multi-prompts and weights, `--oref`. The Edit model replaced Omni Reference and Character Reference.

## References

- **Image prompt.** In Discord the image URLs go first. The text describes everything wanted in the final image, not changes to the reference. `--iw` 0 to 3, default 1.
- **Style reference.** `--sref` with an image URL or a style code, and `--sw` 0 to 1000, default 100. It needs a text prompt, which describes content and drops style words that fight the reference.
- **Edit model.** The one place instructions work. It keeps the first image's aspect ratio unless `--ar` is set. With `--sref`, name the style in the text too:

```text
hand drawn pencil sketch of this image --sref 2708276657
```

## Delete

- **Requests and commands** ("Show me a picture of", "make them bright", "copy this style and make a bunny"). Describe the result.
- **Long lists and detailed instructions.** The docs say they confuse the process.
- **Negatives in the sentence** ("without any fruit", "no cake"). The thing can still appear. Use `--no`.

## Hazards

- Safe for work only. The rules ban gore, blood and violence, nudity and sexualized imagery, anything sexualizing minors, offensive images of public figures, and images for political campaigns or to deceive. Some inputs are blocked automatically.
- Moderation reads each word after `--no` alone: `--no modern clothing` reads as "no clothing" and can draw a warning. Name the clothing wanted instead.

## Video

A starting image is required and text is optional. Only `--motion low` (default) or `--motion high`, `--raw`, `--loop`, `--end` with an image URL, and `--bs` 1, 2 or 4 apply. In Discord the image URL goes first and `--video` last. Clips extend 4 seconds at a time, to 21.
