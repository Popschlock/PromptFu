# <Model name> (`<api id>`) TEMPLATE

Copy this file to `models/<vendor>/<model ID>.md`, with dots written as dashes and a leading
`claude-` dropped, and add a row for it to the vendor's `_family.md` table. A card stands on its
own next to the family file: it never points at a predecessor's card. When a model is replaced,
its card shrinks to a few lines in the vendor's `legacy.md`.

Rules for every card:

- Facts come from the vendor's own documentation: the prompting guide, the what's-new or
  migration notes, the model page. Give the date and the pages. A claim with no official source
  goes under "Unverified" or stays out.
- A fenced block holds text copied from the vendor's guide, changed only by writing typographic
  quotes and dashes as plain ones. Everything outside a fence is your own summary.
- Keep what changes a prompt or a dispatch. Leave out prices, benchmark claims and API mechanics
  that change neither.
- Stay under 8 KB, and under 7 KB for a family file. Plain sentences, no em dashes, American spelling.

Verified YYYY-MM-DD against <the official pages you read>.
Sources: <URLs>.
Unverified: <claims with no official source, or "none">.

## Fit

Two to four lines: what the vendor says to use it for, the starting effort or thinking level, and
what it replaced.

## Delete

Prompt habits to remove for this model, one line each with the reason the vendor gives.

## Add

What the vendor's guide says to add. Tag each item with when it applies (unattended runs, a human
watching, coding, search, JSON output), so a rewrite takes only the ones its task calls for.

## Hazards

Refusal categories, safeguards, and the wording that trips them. Write "none documented" when
that is the case.

## Dispatch

Effort by kind of work, how readily the model delegates, and anything a harness or an API call
must set for a prompt to work (a rejected parameter, a required one).
