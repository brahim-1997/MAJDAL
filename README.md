# MAJDAL / مجدل

**ROOTED IN HISTORY. BUILT FOR TOMORROW.**

> They carried it. We carry it. The next generation carries it forward.

MAJDAL is a contemporary Palestinian-inspired streetwear house named after
**al-Majdal** — the town that was the textile and weaving centre of the Gaza
District until 1948, where around 2,000 looms worked, most of them inside
people's houses. Cloth was sold in eight-metre pieces, the length needed for
one dress, and a piece took a weaver one to two months.

Its people were expelled. The weavers who were driven out kept weaving, and the
style still carries the name of the town that was taken off the map:
**Majdalawi**.

MAJDAL is not a brand that puts Palestine on clothes. It is a clothing brand
descended from a clothing town.

## Repository

| Path | What it is |
| --- | --- |
| `cultural-research/` | Sourced dossiers, tiered `VERIFIED`/`CONTESTED`/`INTERPRETATION`, the verification protocol, and the external review log. **Start here.** |
| `brand/` | Brand book and design system |
| `strategy/` | Impact policy, community, launch sequence, content system, analytics, next actions |
| `impact/` | The public impact ledger + JSON schema |
| `scripts/` | Ledger validator |
| `src/` | The website — Next.js App Router, TypeScript, hand-authored CSS |

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run check   # typecheck + impact ledger validation + production build
```

Requires Node ≥ 20.9.

## The site

`/` · `/story` · `/chapters` · `/archive` · `/roots` · `/shop` · `/impact`

All statically generated. No CSS framework, no UI library, no animation
library — a design-token layer in `src/app/tokens.css` and hand-authored CSS.

## What is deliberately not built yet

No checkout, no email capture, no analytics, an empty impact ledger, and
placeholder image frames. These are integrity decisions, documented in
`CLAUDE.md`. The impact page publishes zeros because nothing has been sold —
the ledger, recipient verification and arithmetic checks exist *before* the
first sale, so the first entry lands in a system already built to be audited.

## Before anything reaches a garment

No external cultural review has taken place. Every claim in
`cultural-research/` is internal research awaiting review by named Palestinian
researchers — see `cultural-research/REVIEWS.md` for the P0 blockers.

**An unanswered P0 is a production stop, not a risk to accept.**
