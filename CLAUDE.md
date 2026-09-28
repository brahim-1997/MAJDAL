# MAJDAL — WORKING RULES

Read `brand/BRAND-BOOK.md` and `cultural-research/PROTOCOL.md` before
producing anything for this project.

## The one-paragraph brief

MAJDAL is a contemporary streetwear house named after **al-Majdal** — the
Palestinian town that was the textile and weaving centre of the Gaza District
until 1948, where roughly 2,000 looms worked inside people's houses. Its people
were expelled; the weavers kept weaving; the craft still carries the town's
name, *Majdalawi*. MAJDAL is not a brand that puts Palestine on clothes. It is
a clothing brand descended from a clothing town. Community (**THE ROOTS**)
outranks revenue. 15% of eligible sales goes to people in Palestine, published
in an auditable ledger.

## Hard rules

1. **Never invent Palestinian history, symbolism or meaning.** Every cultural
   claim is tiered `VERIFIED` / `CONTESTED` / `INTERPRETATION` and sourced.
   Where accounts differ, show the disagreement — do not pick the better story.
2. **Never let a cultural claim reach a garment without Gate 2 review** by a
   named Palestinian reviewer. No Gate 2 review has happened yet.
3. **Never claim impact we cannot evidence.** Only *confirmed* funds are
   publishable as delivered. Never commit example figures to the ledger.
4. **Never copy another brand's identity** — logo, type, slogans, graphics,
   campaigns. This includes ADISH, who have worked with Majdalawi cloth.
   Extract principles; build original MAJDAL implementations.
5. **Never manufacture scarcity.** Published run sizes are real PO quantities.
6. **Never use images of Palestinian suffering to sell a garment.**
7. **Arabic must be reviewed by a native speaker before it is printed.**

## Voice

Short lines. Declarative. Specific nouns over adjectives. *"Eight metres of
cloth. One to two months of work. One dress."* — not *"inspired by timeless
traditions"*. No exclamation marks, no hype punctuation. If a sentence could
belong to any brand, delete it.

## Stack

Next.js (App Router) + TypeScript + hand-authored CSS with a design-token layer.
**No CSS framework, no UI library, no animation library** — the editorial look
needs direct control, and dependencies are a cost. Keep it that way unless
there is a specific reason. The one exception is three.js, for the 3D land.

```
npm run dev              # develop
npm run check            # typecheck + ledger validation + build (run before pushing)
npm run impact:validate  # ledger invariants only
```

- Design tokens: `src/app/tokens.css` — the source of truth. Read
  `brand/DESIGN-SYSTEM.md` before changing a value.
- Content: `src/content/*.ts` — typed. Products, chapters, archive, site.
- Impact: `impact/ledger.json` (append-only) → `src/lib/impact.ts` → `/impact`.
- Palette (founder decision, 2026-09-27, second revision — the colours of
  Palestine, printed): black `#0a0a0a`, white `#f4f2ec`, green `#0a6b39`,
  red `#d2161e`, stone `#9c988e`. No acid, no electric blue, no purple, no
  pink, no gradients. **Red never carries small text on black** (3.65:1); on
  white it may annotate (4.84:1). **A red field never touches a green field**
  (1.22:1) — always black or white between them. This is the rule most
  likely to be broken; enforce it.
- Red and green are brand language, not a flag. Never call them Majdalawi
  colours, and never let the page assemble into a flag.
- Fuchsia and turquoise are **documented Majdalawi silk colours**. They live in
  the cloth — garment colourways and archive records — capped at ~5% of a
  garment.
- **The logo is the founder's artwork** (`brand/assets/majdal-logo-sheet.jpg`),
  extracted by `scripts/extract-logo.mjs`, never redrawn. See
  `brand/DESIGN-SYSTEM.md` §7.
- **The six symbols**: the map, the olive tree, the red thread, 48, archive
  numbers, the logo. An element that supports none of them goes.
- **The land is a 3D relief** (founder decision, 2026-09-27, second
  revision): real elevation of the whole land of Palestine, engraved
  (`src/components/land/`). three.js is allowed for this one job only, loaded
  after first paint, with a poster still and the 2D `MapSheet` as fallbacks.
  Elevation is real (AWS Terrain Tiles ← NASA SRTM / NOAA ETOPO1) and the
  vertical scale (×7) is printed wherever the relief appears. Rebuild the
  data with `node scripts/build-land.mjs`; recapture the still with
  `node scripts/capture-poster.mjs`. No globe, no particles, no glow, no
  unlabelled exaggeration.
- **The olive tree is a traditional engraving** (`scripts/draw-olive.mjs` →
  `public/olive/olive-engraved.svg`). Its meaning on the site is labelled
  INTERPRETATION.
- Archive assets live in `src/content/sources.ts` with their catalogue
  records. A frame shows an image only when the file is in `/public` and the
  source is not on `hold`. The survey sheets are on hold under dossier 003.

## Deliberately unfinished, and why

These are integrity decisions, not gaps to be "fixed" by wiring something up:

- **No checkout.** Chapter 001 has not opened.
- **No email capture.** `JoinRoots.tsx` stores nothing and says so. Capturing
  addresses with nowhere lawful to store them is worse than not capturing them.
- **No analytics.** Not before a privacy policy and consent.
- **Empty impact ledger.** Nothing has been sold. Zero is the truth.
- **Placeholder image frames.** No stock photography, ever.
- **`robots.ts` disallows all + `metadata.robots` noindex.** Pre-launch.

## Decision framework

Before any recommendation: Does it strengthen MAJDAL's identity? THE ROOTS? Is
it culturally authentic and verifiable? Contemporary? Original, not copied? Can
the community participate? Can we afford it? Does it build long-term equity? Is
the impact claim accurate? Can we measure it?

Two shortcuts: **the souvenir test** — would this exist in an airport gift
shop? Kill it. **The craft test** — does this respect cloth? If not, kill it.
