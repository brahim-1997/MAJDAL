# MAJDAL DESIGN SYSTEM v2.0 — THE FOUND ARCHIVE

Controlled brutalism. Anti-design with a reason. A found archive that
entered street culture.

The system is implemented as code in `src/app/tokens.css`. That file is the
source of truth; this document explains the reasoning so nobody "improves" a
token without understanding what it is doing.

v2.0 replaces v1.0 (signal red / electric blue / acid) by founder decision,
2026-09-27. What changed and why: the brutalist collision read as a generic
brutalist template. v2.0 builds the identity from **six permanent symbols**
and an earthy printed palette, and removes every effect that had no reason.

## 0. The six symbols

Everything on the site supports these. If an element supports none of them,
it goes.

| # | Symbol | Where it lives | Rule |
| --- | --- | --- | --- |
| 01 | **The map** | `MapSheet` — SHEET 00, drawn by MAJDAL | 2D only. A document, never a 3D terrain or globe |
| 02 | **The olive tree** | `public/olive/*.svg`, `Olive` | Our drawing, not a symbol with an assigned meaning |
| 03 | **The red thread** | `Thread`, `PxPath`, the sheet's thread layer | One continuous line; brand graphic, never a claimed route |
| 04 | **48** | `/48`, `0048`, chapter code | Small and exact. Never graffiti-sized |
| 05 | **Archive numbers** | `MJ-0048-A001`, `LC-DIG-matpc-19868` | Real IDs only. Catalogue references are copied, never invented |
| 06 | **The logo** | `public/brand/majdal-*.webp` | The founder's artwork, never redrawn (§7) |

The grammar, printed on the site as MAJDAL's interpretation:
**map = place · olive tree = roots · red thread = continuity · archive =
memory · clothing = the present · community = the future.**

## 1. Colour

| Token | Value | Job |
| --- | --- | --- |
| `--black` | `#080808` | Ground. ~55% of every page |
| `--paper` | `#E9E4D8` | Type on black; the ground of every document. ~25% |
| `--green` | `#173F2A` | Land, the olive tree, the ROOTS page. With olive, ~10% |
| `--green-deep` | `#0D2419` | Dark green ground |
| `--olive` | `#4B5130` | Archive ground, stamps |
| `--red` | `#B8211C` | The thread, marks, annotation, one red page. ~7% |
| `--stone` | `#A49C8C` | Secondary text on black. ~3% |

No acid, no electric blue, no purple, no pink, no gradients, no neon. The
palette must never assemble into a flag: red and green do not meet.

### Contrast — measured

| Pair | Ratio | Allowed |
| --- | --- | --- |
| paper / black | 15.79 | any text |
| stone / black | 7.36 | any text |
| `#857F73` / black | 5.04 | any text (faint) |
| **red / black** | **3.12** | **display type and marks only** |
| red / paper | 5.06 | any text — red annotation lives on paper |
| paper / red | 5.06 | any text |
| paper / green | 9.30 | any text |
| paper / olive | 6.57 | any text |
| red / green, red / olive | 1.84, 1.30 | **never** |

**On black, red is never small text.** On paper, red may annotate.

### Grounds

A class redefines the semantic tokens; components on it inherit legible
colours. `.paper`, `.green-ground`, `.deep-ground`, `.olive-ground`,
`.red-ground`. The header reads the ground under it and swaps the logo
between bone (dark grounds) and ink (paper).

Rhythm: sometimes a red-focused moment (Chapter 001 — red display type on
black), sometimes a green page (the roots), sometimes only black and paper.
**A green field and a red field never touch**: stacked full-bleed with black
and paper they read as a flag.

## 2. Typography

| Voice | Face | Use |
| --- | --- | --- |
| Display | Archivo Variable, `wdth 62`, 900 | Headlines. May be huge, cropped, stacked |
| Stamp | Archivo Variable, `wdth 125` | Short labels, stamps |
| Record | IBM Plex Mono | Archive IDs, SOURCE / MAP / OBJECT / LOCATION / DATE |
| Reading | Archivo Variable, `wdth 100` | Body text |
| Arabic | IBM Plex Sans Arabic | Display Arabic, isolated direction |
| Pencil | Reenie Beanie | A note written on a document. Rare |

Contrast of scale is the identity: MAJDAL huge → مجدل → ARCHIVE 001 →
tiny SOURCE lines. Do not make everything huge; do not rotate every word.
Anything a reader must read sits upright on a solid ground at `--step-0`+.

All Arabic is blocked from print until native-speaker review.

## 3. The map — the main visual experience

- **SHEET 00** is a survey-style drawing by MAJDAL: neatline, graticule every
  5′, water-lined sea and lakes, rivers, the place register, scale bar,
  north arrow, legend, and a margin that says *a drawing, not a historical
  survey*. Data: Natural Earth (public domain).
- **Historical sheets** (PEF 1880; Survey of Palestine 1940s) are separate
  objects in `src/content/sources.ts`, shown only as themselves, and **on
  hold** under dossier 003's P0 reviews even once the files exist.
- **Motion**: the camera is the SVG viewBox — pan, zoom, crop. Ink reveals
  through a dissolving noise mask. Place names appear one at a time. Hard
  cuts between scenes. No 3D, no terrain, no globe, no particles, no glow.

The film (`MapFilm`) is scroll-driven — the reader holds the crank. Reduced
motion gets the same scenes as hard cuts. Screen readers get the film in
words. A skip link jumps past it.

## 4. The olive tree

Generated once by `scripts/draw-olive.mjs` (seeded) and committed:

- **woodcut** — the identity drawing: split twisted trunk with a hollow,
  carved bark, exposed roots, low wide limbs, leaf masses with carved leaves
- **pencil** — the same tree as outlines (kept for print studies)
- **mark** — silhouette for 16–64px

Rendered as a CSS mask over `currentColor`, so it prints in any ink. It
appears where it means something: growing from al-Majdal on the map, as the
ROOTS stamp, on the green page, in the footer. Never as a repeating pattern,
never as a wreath, never pasted on every section.

## 5. Brutalism and anti-design — what they are allowed to be

Brutalism comes from hard edges, black grounds, big type, strong rules, raw
structure, monospace records, physical texture. Anti-design comes from
breaking composition on purpose: a title leaving the viewport, a map taking
70% of the screen, Arabic interrupting Latin, a tiny note in a huge empty
space, documents overlapping on a table.

**Removed in v2.0 and not to return:** acid stickers, blue outline type,
bracketed `[LABELS]`, random red rectangles, huge circles, "ARCHIVE THIS",
barcodes, glitch jitter, misregistered blue plates.

## 6. Motion

Paper, ink, scanning, folding, cutting, layering. Durations 90 / 180 /
480ms, stepped timing for scans. The homepage intro is a CSS timeline armed
in `<head>` once per session, skipped by any input, absent under reduced
motion. `.reveal` clips children, never the observed element.

## 7. The logo

The official logo is the founder's artwork (`brand/assets/majdal-logo-sheet.jpg`).
`scripts/extract-logo.mjs` crops the three lockups — primary, stacked, mark —
and turns the black ground into transparency: alpha from brightness, colour
un-premultiplied, so on black it is pixel-identical to the sheet. The ink
version is the same alpha in black, for paper grounds. Nothing is redrawn.

- Header: stacked lockup. Hero intro, film end card, footer: primary.
- Protection zone: the height of the M on all sides.
- Never stretch, rotate, recolour outside bone/ink, or add effects.
- The coordinates line under the primary lockup on the sheet is **not** used:
  it points ~70 km north of al-Majdal. See `brand/IDENTITY-LOGO.md` §1.

## 8. Photography

None of MAJDAL's own yet, and no stock, ever. Archive photographs are shown
only when the file is on file and not on hold, framed with their full
catalogue record. Until then the frame is empty and says so. Catalogue
titles are printed verbatim; where the wording is the photographer's and not
ours, a note says so.

## 9. Graphic language on garments

- The small logo, the olive tree embroidered, the thread as the seam, the
  inside label *They carried it. We carry it.* — proposed for sampling, not
  final, and no cultural claim reaches a garment without Gate 2.
- 48 stays quiet on the body: woven label, size tab, inner neck.
