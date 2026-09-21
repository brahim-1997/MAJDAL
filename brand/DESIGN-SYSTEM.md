# MAJDAL DESIGN SYSTEM v0.1

The system is implemented as code in `src/app/tokens.css`. That file is the
source of truth; this document explains the reasoning so nobody "improves" a
token without understanding what it is doing.

## 1. Colour

### Ground (the brand lives here — ~95% of every surface)

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0B0B0B` | Washed black. Primary ground. |
| `--ink-raised` | `#141414` | Cards, raised panels. |
| `--stone` | `#B8B0A4` | Secondary text, rules, metadata. |
| `--off-white` | `#EDE8E0` | Primary text on dark, light-mode ground. |
| `--olive` | `#3A4029` | Deep olive. Structural accent, colour-block panels. |
| `--clay` | `#6B2B24` | Dark red. Structural accent. |

### ARCHIVE accents (documented — use with discipline)

Majdalawi cloth is recorded as **black and indigo cotton cut with fuchsia and
turquoise silk**. These are therefore not arbitrary pops of colour; they are the
historically documented signature of the craft we descend from, and no
competitor can claim them honestly.

| Token | Value | Use |
| --- | --- | --- |
| `--indigo` | `#1B2A4A` | Secondary ground, colour-block. |
| `--fuchsia` | `#B4256B` | Accent only. |
| `--turquoise` | `#1F8A8C` | Accent only. |

**The 5% rule.** Fuchsia and turquoise never exceed ~5% of a surface or a
garment. They are the silk thread in a cotton cloth. Used at 50% they become
generic "vibrant streetwear" and the reference dies. Used at 5% they read as a
deliberate archival citation, and people ask why.

This restraint is the single most important rule in the system. It is also the
one most likely to be broken by a freelancer. Brief it explicitly every time.

### Contrast

`--off-white` on `--ink` ≈ 15:1. `--stone` on `--ink` ≈ 7:1. Both clear
WCAG AA. `--fuchsia` and `--turquoise` are **never** used for body text on
dark; accent borders, rules, and small marks only. Any new pairing must be
checked before it ships — the editorial look is no excuse for unreadable text.

## 2. Typography

Two families, no more. Arabic and Latin are equals in the hierarchy.

- **Display / Latin:** a grotesque with tight apertures, set very tight
  (`-0.03em`), uppercase, heavy. Editorial and sporting, not techy.
- **Arabic:** a contemporary Kufi/Naskh pairing chosen by a native speaker.
  Arabic is **never** stretched, faux-bolded, or set as a texture behind Latin.
- **Text:** the same grotesque at regular weight, generous line height (1.6).

The repo ships with a system-font stack so the site builds and runs with no
licensing and no webfont cost. Licensed faces are `P1` in
`strategy/NEXT-ACTIONS.md` — swap the two variables in `tokens.css`
(`--font-display`, `--font-arabic`) and every surface updates.

**Type scale** (fluid, `clamp()`): `--step--1` → `--step-6`. Display sizes use
viewport-relative clamps so the editorial scale survives on a phone, where most
of the audience will see it first.

## 3. Grid & space

- 12-column grid, `--gutter` 20px mobile / 32px desktop, max width 1600px.
- Spacing scale is a 4px base: `--s-1` (4) → `--s-12` (128).
- **Full-bleed by default.** Editorial layouts run to the edge; padding is a
  decision, not a default.
- Deliberate asymmetry: a text block at 7 columns beside an image at 5 reads as
  designed. Perfect symmetry reads as a template.

## 4. Motion

- Entrances only: 400–600ms, `cubic-bezier(0.22, 1, 0.36, 1)`, small travel
  (12–24px) plus opacity. Nothing bounces. Nothing spins.
- Hover on product: image crossfade to the second shot, 300ms. No zoom, no tilt.
- `prefers-reduced-motion: reduce` disables all transforms and reveals content
  immediately — implemented in `globals.css`, not optional.
- No scroll-jacking, no smooth-scroll hijack, no parallax on text.

Rule: if motion is the most interesting thing on screen, the design failed.

## 5. Photography

- Archival material is presented as **document**: visible grain, full frame,
  captioned with source and date. Never filtered to look "vintage" — the real
  thing does not need help, and faking age on a real archive is a lie.
- Product is shot hard-light, plain ground, on real bodies, cropped tight.
- Never use images of suffering to sell a garment.
- Every archival image needs provenance before publication. No provenance, no
  publication. Placeholder slots in the code are marked as such.

## 6. Graphic language

- **Coordinates and place names** set as data: monospaced, small, precise.
  *Blocked from print until verified* — see dossier §2.
- **Tatreez-inspired geometry:** original constructions on a cross-stitch grid.
  Never a copied regional motif, never an invented "meaning".
- **The 48 mark:** small, quiet, in the garment's furniture — woven label, size
  tab, inner neck, box print. Not a chest logo.
- **Loom logic:** stripes and colour-blocking derived from woven bands, aligned
  to panel seams. This is where the Majdalawi reference should live on a
  garment — in the *construction*, not in a print.

## 7. Logo

Wordmark only: `MAJDAL` in display caps, and `مجدل` in the Arabic face, usable
independently or stacked. No emblem, no crest, no monogram, no olive-tree
pictogram — an olive tree logo is the single most predictable move available to
this brand and it is therefore banned.

Arabic wordmark is **blocked pending native-speaker review** (P0).
