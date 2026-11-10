# Gemini image models (Nano Banana 2.1, `gemini-nano-banana-2.1`, and siblings)

Verified 2026-11-10 against Google's "Nano Banana image generation" guide, the four image model pages, the changelog and the deprecations page.
Sources: https://aistudio.google.com/docs/image-generation, https://aistudio.google.com/docs/models/gemini-nano-banana-2.1, https://aistudio.google.com/docs/models/gemini-3-pro-image, https://aistudio.google.com/docs/models/gemini-3.1-flash-lite-image
Unverified: the thinking levels `gemini-3-pro-image` takes (its page says thinking is supported and the level table omits it), and 2 Lite's aspect ratios beyond the ten its page lists (the same page counts 14).

## Fit

Nano Banana 2.1 is Google's default image model for generation and conversational editing, recommended for all new projects. It replaced Nano Banana 2. The thinking level is its quality control and starts at `medium`.

| Model | ID | Use it for | Thinking | Sizes | References, inputs, grounding |
|---|---|---|---|---|---|
| Nano Banana 2.1 | `gemini-nano-banana-2.1` | Most generation and editing | `minimal`, `medium` (default), `high` | 1K (default), 2K, 4K | 14 reference images: 10 objects, 4 characters. Video and PDF in. Web and image search |
| Nano Banana Pro | `gemini-3-pro-image` | Professional assets: complex layouts, precise text, brand consistency, studio 4K | levels not documented | 1K, 2K, 4K | 14 reference images: 6 objects, 5 characters, 3 style. Image and text in only. Web search |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | Speed and cost at volume, fast local edits | `minimal` (default), `high` | 1K only | Not optimized for several references or sequential edits. Video and PDF in. No search |
| Nano Banana 2 | `gemini-3.1-flash-image` | Deprecated, no shutdown date. Only when pinned, or for 0.5K output | `minimal` (default), `high` | 0.5K, 1K, 2K, 4K | As 2.1 |

## Delete

- **Generic nouns** ("fantasy armor", "a logo"). Describe the thing in detail and say what the image is for.
- **Bare negatives** ("no cars"). Describe the scene you want: "an empty, deserted street with no signs of traffic."
- **A full re-description to change one thing.** Google recommends multi-turn conversation for iterating.
- **An exact count of output images.** The model does not always return the number asked for.
- **Lowercase sizes** (`2k`). Rejected. Write `1K`, `2K`, `4K`.
- **Audio inputs.** Not supported. Pro takes no video either.
- **On 2 Lite:** Search grounding, 2K and 4K. They do not exist there.

## Add

**Every prompt.** Plain descriptive sentences, with none of the family file's tags. The purpose of the image, then the scene in specifics, with camera terms where framing matters (`wide-angle shot`, `macro shot`, `low-angle perspective`). Break a complex scene into steps: first the background, then the foreground, finally the key object.

**Photorealistic scene:**

```text
A photorealistic [type of shot] of a [subject description] in a [setting
description]. [Description of the light]. Shot from a [camera angle]
with a [lens type].
```

**Text in the image.** Give the exact text and describe the font. When the wording is not settled, generate the text first and then ask for the image. Google points professional assets at Pro.

```text
Create a [image type] for [brand/concept] with the text "[text to render]"
in a [font style]. The design should be [style description], with a
[color scheme].
```

**Edit one element and keep the rest:**

```text
Using the provided image, change only the [specific element] to [new
element/description]. Keep everything else in the image exactly the same,
preserving the original style, lighting, and composition.
```

**Add or remove something:**

```text
Using the provided image of [subject], please [add/remove/modify] [element]
to/from the scene. Ensure the change is [description of how the change should
integrate].
```

**Combine several images.** Say which element comes from which image:

```text
Create a new image by combining the elements from the provided images. Take
the [element from image 1] and place it with/on the [element from image 2].
The final image should be a [description of the final scene].
```

**A face or logo that must survive an edit.** Describe it in detail next to the edit request, and state that its features "remain completely unchanged".

**The same character across images.** Include the earlier generated images in the next prompt.

The guide also has templates for stickers, product shots, negative space, style transfer, sketch to photo and comic panels.

## Hazards

- Every image carries a SynthID watermark.
- Google asks that you hold the rights to any image you upload.
- Search grounding on 2.1 and 2 does not use web images of real people.
- Best results come in English and the 14 other locales the guide lists.

## Dispatch

- **Thinking** cannot be turned off and is billed. Set `thinking_level` in `generation_config`. The docs say only that it trades quality against latency.
- **Size and shape** go in `response_format` as `image_size` and `aspect_ratio`. Without them the output is 1K, in the input image's proportions or 1:1.
- **Aspect ratios.** Pro: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9. 2 Lite's page lists the same ten. 2.1 and 2 add 1:4, 4:1, 1:8, 8:1.
- **Text comes back with the image by default.** Ask for image only in `response_format`.
- **Multi-turn edits** continue through `previous_interaction_id`.
- **Search grounding** (`google_search`) draws real-time facts such as weather, charts and events. Image search (`search_types` with `image_search`) is on 2.1 and 2 only.
- **Video as context** (a YouTube URL or an uploaded file) works on 2.1, 2 and 2 Lite for thumbnails, posters and infographics.
- **Volume** can run through the Batch API.
