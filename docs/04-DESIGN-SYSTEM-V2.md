# 04 — DESIGN SYSTEM v2

Extends `brand/DESIGN-SYSTEM.md` (v0.1, shipped). Implemented in
`src/app/tokens.css`, which stays the single source of truth. This document
adds what the world needs: archive UI, map UI, and a motion contract.

## 1. Colour — as a system

Base and accents are unchanged and already shipped. What is new is the
**semantic layer**: colour carries meaning consistently, so a reader learns the
system without being taught.

| Token | Role in the world | Where |
| --- | --- | --- |
| `--ink` `#0B0B0B` | Night, underground, the unrecorded | Ground everywhere |
| `--ink-raised` `#141414` | A surface holding a record | Cards, panels, map cards |
| `--off-white` `#EDE8E0` | Paper, archive, memory | Primary text, documents |
| `--stone` `#B8B0A4` | Material, architecture, metadata | Secondary text, labels |
| `--olive` `#3A4029` | Land, continuity | Structural blocks, chapter 001 |
| `--clay` `#6B2B24` | Chapter, signal, intensity | Chapter marks, alerts |
| `--indigo` `#1B2A4A` | The documented Majdalawi ground | Colour-block, chapter 002 |
| `--fuchsia` `#B4256B` | **Live signal** — index marks, current | Catalogue numbers, active nav |
| `--turquoise` `#1F8A8C` | **Verified** — evidence, confirmed | VERIFIED tier, confirmed impact |

**These are MAJDAL design-system meanings, not historical claims.** Stated in
the system so nobody later presents them as cultural symbolism.

**The 5% rule holds.** Fuchsia and turquoise are the silk thread in a cotton
cloth — documented Majdalawi colours, used at thread scale. Above ~5% of a
surface they become generic streetwear and the reference dies.

**New: evidence colour is load-bearing.** Turquoise = VERIFIED, fuchsia =
CONTESTED, stone = INTERPRETATION. This is already shipped in `TierBadge` and
now extends to map labels and place records. Colour must never be the *only*
signal — the tier word is always present.

## 2. Typography — as architecture

Three registers, one identity.

| Register | Role | Treatment |
| --- | --- | --- |
| **DISPLAY** | The voice. Statements, place names at scale | Grotesque, 800, `-0.03em`, uppercase, line-height 0.88 |
| **RECORD** | The archive. Metadata, catalogue numbers, coordinates | Mono, `0.14em` tracking, uppercase, small |
| **READING** | The body. Sourced prose | Regular, 1.6, max 68ch |

**Arabic is a fourth register that must sit level with the first three.**
Matched optical weight and cap-height relationship to the Latin display; never
stretched, faux-bolded, or placed as ornament behind English. Shipped:
`unicode-bidi: isolate` on `.arabic` — required, since without it the bidi
algorithm pulls neighbouring Latin punctuation into the Arabic run.

**Test cases** (must be set and reviewed by a native speaker before launch):

```
MAJDAL            مَجْدَل
THE ROOTS         الجذور
CHAPTER 001       الفصل ٠٠١
```

**Note on the brief's vocalisation.** The brief writes `مَجْدَل` with full
harakat. Whether to set the wordmark vocalised or bare is a typographic *and*
cultural decision — vocalisation is unusual in contemporary signage and can
read as either careful or foreign. **A native speaker decides.** Logged as P0
in `cultural-research/REVIEWS.md`.

**Type as signage.** Archive labels, coordinates, catalogue numbers, care
labels, museum metadata. Newspaper fragments and photocopy texture are
permitted **only on real archival material**, never as a filter on new work —
faking age on a record is the same lie as faking a source.

**Fonts are still placeholders.** System stack ships today. Licensing a display
face and a real Arabic face is P1 in `strategy/NEXT-ACTIONS.md`; swapping
`--font-display` and `--font-arabic` updates every surface.

## 3. Spacing, grid, containers

Shipped and unchanged: 4px base (`--s-1` … `--s-12`), 12-column grid,
`--gutter` 20/32px, `--max-w` 1600px, `--max-prose` 68ch.

**New — the register grid.** The archive register and map cards use a fixed
four-part row: `[index] [name + arabic] [metadata] [tier]`. On narrow screens it
folds to two lines rather than reflowing into a different structure, so the
scanning pattern survives on a phone.

**New tokens required:** `--radius-0` (0 — the system is square by default),
`--z-map`, `--z-header`, `--z-overlay`, `--z-card`, `--texture-grain` (opacity
ceiling 0.04), `--bp-*` breakpoints as documented values.

## 4. Motion contract

The brief asks for parallax, pinned sections and kinetic typography. It also
says performance beats effects and every animation must have narrative purpose.
**Those two instructions conflict, and this contract resolves them.**

**Permitted — each has a job:**

| Motion | Duration | Job |
| --- | --- | --- |
| Reveal (opacity + ≤24px) | 400–600ms | Entry into the record |
| Overture | ≤1.2s, once | The signal |
| Map pan/zoom | 200–320ms | Spatial continuity |
| Thread draw | 600ms | Marking what you found |
| Label density change | 160ms | Depth of field in the archive |
| Product image crossfade | 300ms | Second view |

**Refused, with reasons:**
- **Scroll-jacking / pinned sections** — breaks keyboard scrolling, reading pace
  and find-in-page. No narrative gain that a reveal does not give.
- **Parallax on text** — costs legibility, buys nothing.
- **Kinetic typography as decoration** — the type already carries meaning.
- **Anything bouncing, spinning, or elastic** — wrong register entirely.

**`prefers-reduced-motion: reduce` disables all transforms and reveals content
immediately.** Already shipped and non-negotiable: content is never gated
behind an animation.

## 5. Components — visual specification

**Archive row.** `[index · fuchsia mono] [TITLE display · اسم arabic] [location
· date · category mono stone] [TIER badge]`. Hover shifts inline padding and
raises the ground — the row moves *as a card being pulled*, not as a glow.

**Record header.** Catalogue number, tier badge, title in both scripts, period,
source count. Sources always visible without interaction — never behind a
disclosure, because hiding sources is hiding the evidence.

**Map label.** Name at coordinate; tier as a 3px underline in tier colour;
district in mono beneath at deeper zoom only. Focus and hover are identical
states, so keyboard and pointer get the same experience.

**Map card.** Raised panel on `--ink-raised`, square, one hairline rule, name,
district, coordinates with precision, tier, one sentence, source count, link.

**Object (product) record.** Presented as an archive record: `OBJECT 001 /
CHAPTER 001 / CODE 48`, colourway with its documented meaning, spec table,
then commerce. **Editions shown only where they exist** — no invented `001/100`.

**Contribution card.** Contributor name or "anonymous by request", consent
status, date received, moderation state. **Withdrawal link always present.**

**Empty and incomplete states are first-class.** `UNSOURCED`, `NOT DESIGNED
YET`, `NO RECORD HELD`, `AWAITING REVIEW` are designed, not fallbacks. They are
how the archive shows its gaps, and the gaps are the invitation.
