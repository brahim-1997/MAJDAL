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
there is a specific reason.

```
npm run dev              # develop
npm run check            # typecheck + ledger validation + build (run before pushing)
npm run impact:validate  # ledger invariants only
```

- Design tokens: `src/app/tokens.css` — the source of truth. Read
  `brand/DESIGN-SYSTEM.md` before changing a value.
- Content: `src/content/*.ts` — typed. Products, chapters, archive, site.
- Impact: `impact/ledger.json` (append-only) → `src/lib/impact.ts` → `/impact`.
- Fuchsia and turquoise are **documented Majdalawi silk colours**, capped at
  ~5% of any surface. At 50% they become generic streetwear and the reference
  dies. This is the rule most likely to be broken; enforce it.

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
