# Google legacy models

Verified 2026-11-10 against Google's deprecations page, changelog, thinking guide, Gemini 3.6 guide, Veo guide and enterprise Veo 3.1 page.
Sources: https://aistudio.google.com/docs/deprecations, https://aistudio.google.com/docs/veo, https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate
Unverified: how a routed request is validated, for example `minimal` sent to `gemini-3.7-flash`.

- **`gemini-3.6-flash`.** Previous generation, supported. Levels `minimal`, `low`, `medium` (default), `high`: the Flash for `minimal`. On UI work give explicit design guidelines, and expect diagnostic scripts before edits.
- **`gemini-3.7-flash`, `gemini-3.5-flash`.** Deprecated. Requests route to `gemini-3.8-flash` and `gemini-3.6-flash`, so write for those.
- **`gemini-3.1-flash-lite`.** Shuts down 2027-05-07. `minimal` by default. Replacement: `gemini-3.5-flash-lite`.
- **`gemini-3-flash-preview`.** Preview. Default `high`, all four levels. Replacement: `gemini-3.6-flash`.
- **`gemini-2.5-pro`, `gemini-2.5-flash`.** Deprecated, existing users only. From 2026-12-01 they route to `gemini-3.8-flash` and `gemini-3.5-flash-lite`, where `thinking_level` replaces `thinking_budget` and sampling parameters and prefilled model turns are gone. `gemini-2.5-flash-lite` is not deprecated.
- **`gemini-2.5-flash-image`.** Shuts down 2027-03-15. Best with up to 3 input images. No thinking, no search. Replacement: `gemini-3.1-flash-lite-image`, in `gemini-image.md`.
- **`imagen-*`.** Shut down. Use `gemini-nano-banana-2.1` and `gemini-image.md`.
- **Veo 3.1** (`veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview`, `veo-3.1-lite-generate-preview`). These preview IDs shut down on the Gemini API on 2026-10-22. Rewrite for `gemini-omni-1.2-flash` with `gemini-omni-flash.md`. Veo 3.1 stays on Gemini Enterprise Agent Platform as `veo-3.1-generate-001`, `veo-3.1-fast-generate-001` and the preview `veo-3.1-lite-generate-001`. Pinned there: clips of 4, 6 or 8 seconds, `16:9` or `9:16`, generated sound, English prompts. Reference images need 8 seconds and are not on Lite. Prompt elements: subject, action, style, camera position and motion, composition, focus and lens, ambiance. Put dialogue in quotes and describe sound effects and ambient noise.
- **Shut down:** `gemini-3-pro-preview`, `gemini-2.0-*`, `gemini-omni-flash-preview`, `deep-research-pro-preview-12-2025`, `antigravity-preview-05-2026`. The family table has the current IDs.
