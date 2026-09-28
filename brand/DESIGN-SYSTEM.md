# MAJDAL DESIGN SYSTEM v4.0 — THE WATERMELON, WOVEN

Underground streetwear. Brutalism and anti-design with a reason. Black,
white, green and red. The watermelon, woven into black cloth.

## v4.0 — what changed (founder decision, 2026-09-28)

The founder asked for a website that reads first as a streetwear brand —
deep inspiration from UK underground labels, the colours of Palestine, the
watermelon motif, brutalism and anti-design, the animation and interaction
of sites made now — and for everything before it to be set aside.

- **The watermelon leads.** It is woven, not printed (§3a): every pixel is a
  crossing of warp and weft, so the street's symbol is made in al-Majdal's
  craft. Record A013 (`CONTESTED`) sits one click from it, everywhere.
- **Streetwear first.** The homepage runs like a drop: ticker, cloth, a red
  line of the story, the chapter's objects, the record, the town, the
  community wall, the receipt.
- **Principles from UK underground labels, never their material**: the
  drop is the event; members over customers; raw product on flat ground;
  rules and facts as running copy; nothing polished that does not need to
  be. We do not borrow any label's logos, slogans, graphics, campaigns or
  site layouts.
- **Current web craft**: CSS scroll-driven animation (the record strip rides
  sideways while you scroll down), a custom cursor, draggable stickers,
  infinite tickers, variable-width type, grain, canvas texture. Every one of
  them has a reduced-motion and no-support state that shows the same
  content.
- **The land** stays as a 3D relief, on `/map` only. The homepage film is
  gone.

The v3.0 notes below still hold where v4.0 does not replace them.

---

# v3.0 — THE LAND, PRINTED

Controlled brutalism. Anti-design with a reason. The whole land, in relief,
printed in black, white, green and red.

The system is implemented as code in `src/app/tokens.css`. That file is the
source of truth; this document explains the reasoning so nobody "improves" a
token without understanding what it is doing.

v3.0 replaces v2.0 (the earthy "found archive" palette and the 2D map film)
by founder decision, 2026-09-27, second revision. What changed and why: the
founder found v2.0's olive drawing, map film, colours and homepage layout
weird, and asked for the colours of Palestine, a traditional olive tree and
a 3D animation of the whole land. v3.0 keeps the six symbols and changes
how they are drawn:

- **Palette**: black, white, green, red — as blocks of a screen print.
- **The map** is now a real-elevation 3D relief of the whole land (WebGL),
  engraved rather than rendered. three.js is back for this one job.
- **The olive tree** is a traditional engraving: billowing crown, hatched
  shadow, a split twisted trunk.

## 0. The six symbols

Everything on the site supports these. If an element supports none of them,
it goes.

| # | Symbol | Where it lives | Rule |
| --- | --- | --- | --- |
| 00 | **The watermelon** | `WovenHero` + `weave/loom.ts`; record A013 | Woven, never printed flat. The record always one click away. Off garments until Gate 2 |
| 01 | **The map** | `LandExplore` on `/map` — the whole land in relief; `MapSheet` as the 2D fallback | Real elevation only, vertical scale printed. Never a globe, never a fantasy terrain |
| 02 | **The olive tree** | `public/olive/*.svg`, `Olive` | Our drawing, not a symbol with an assigned meaning |
| 03 | **The red thread** | `Thread`, the thread in the relief, the sheet's thread layer | One continuous line; brand graphic, never a claimed route |
| 04 | **48** | `/48`, `0048`, chapter code | Small and exact. Never graffiti-sized |
| 05 | **Archive numbers** | `MJ-0048-A001`, `LC-DIG-matpc-19868` | Real IDs only. Catalogue references are copied, never invented |
| 06 | **The logo** | `public/brand/majdal-*.webp` | The founder's artwork, never redrawn (§7) |

The grammar, printed on the site as MAJDAL's interpretation:
**map = place · olive tree = roots · red thread = continuity · archive =
memory · clothing = the present · community = the future.**

## 1. Colour

| Token | Value | Job |
| --- | --- | --- |
| `--black` | `#0a0a0a` | Ground. The film, most sections |
| `--white` | `#f4f2ec` | Type on black; the land in the relief; paper sections |
| `--green` | `#0a6b39` | The olive page; verified stamps on paper |
| `--red` | `#d2161e` | The thread, al-Majdal's pin, Chapter 001, the impact page |
| `--stone` | `#9c988e` | Secondary text on black |

Kept aliases so older components resolve: `--paper` = white, `--olive` =
green, `--green-deep` `#06401f`, `--stone-dim` `#807c73`.

No acid, no electric blue, no purple, no pink, no gradients, no neon. Red
and green are MAJDAL's brand language here — never called Majdalawi
colours, and never assembled into a flag.

### Contrast — measured

| Pair | Ratio | Allowed |
| --- | --- | --- |
| white / black | 17.69 | any text |
| stone / black | 6.88 | any text |
| `#807c73` / black | 4.76 | any text (faint) |
| **red / black** | **3.65** | **large type and marks only** |
| red / white | 4.84 | any text — red annotation lives on white |
| white / red | 4.84 | any text |
| white / green | 5.91 | any text |
| red / green | 1.22 | **never** |

**On black, red is never small text.** On white, red may annotate.

### Grounds

A class redefines the semantic tokens; components on it inherit legible
colours. `.paper` (white), `.green-ground` (also `.deep-ground` and
`.olive-ground`, kept as aliases), `.red-ground`. The header reads the ground
under it and swaps the logo between bone (dark grounds) and ink (paper).

Rhythm on the homepage (v4): black ticker → black woven cloth → red story
ticker → white drop → black watermelon record → white town → green Roots
wall → black receipt → white ticker → black footer. **A green field and a
red field never touch**: there is always black or white between them. On
green, button shadows go black and the seed cursor turns white, never red.

## 2. Typography

| Voice | Face | Use |
| --- | --- | --- |
| Display | Archivo Variable, 900, uppercase | Headlines. May be huge, cropped, stacked, printed on a block |
| Stamp | Archivo Variable, 800, tracked | Short labels, stamps |
| Record | IBM Plex Mono | Archive IDs, SOURCE / MAP / OBJECT / LOCATION / DATE |
| Reading | Archivo Variable, 400 | Body text |
| Arabic | IBM Plex Sans Arabic | Display Arabic, isolated direction |
| Pencil | Reenie Beanie | A note written on a document. Rare |

v4 loads both of Archivo's axes (`@fontsource-variable/archivo/wdth.css`:
weight 100–900, width 62–125%). Use `font-stretch`: **62%** is the poster
cut (headlines, figures, ticker), **125%** the stamp (small caps lines),
100% everything else. The `.cond` and `.ext` utilities set them. Big
figures size themselves to their cell with container units (`cqi`) so they
never cross a rule.

Contrast of scale is the identity: MAJDAL huge → مجدل → ARCHIVE 001 →
tiny SOURCE lines. Do not make everything huge; do not rotate every word.
Anything a reader must read sits upright on a solid ground at `--step-0`+.

All Arabic is blocked from print until native-speaker review.

## 3. The land — the main visual experience

The whole land of Palestine as a 3D relief, engraved. `scripts/build-land.mjs`
builds it once and commits the result:

- **Elevation**: Terrain Tiles on AWS Open Data (Tilezen), derived from NASA
  SRTM and NOAA ETOPO1, public domain. Zoom 9, resampled to a 0.009° grid.
- **Outline**: Natural Earth 1:10m admin-0, public domain — the union of the
  polygons named Palestine and Israel, with the Syrian Golan excluded.
  Lakes: Natural Earth 1:50m.
- Packed into `public/land/land.png` (16-bit height + a class per cell) and
  `src/content/land.ts`. Real metres. **Vertical scale ×7, printed wherever
  the relief is shown.**

How it is drawn (`src/components/land/scene.ts`) — printed, not rendered:
white land, light posterised to four tones, engraved hatching in shadow
fixed to the ground (its density steps with distance so it never
shimmers), contours every 100 m and heavier every 500 m, a black
water-lined sea. The neighbouring relief is dark and sinks to black with
distance from the land, so the land is the object and the frame of the data
never shows. Place pins are black; al-Majdal's is red. The thread is a red
line draped over the relief. The olive tree stands at al-Majdal as a
billboard of the engraving.

- **Explore** (`LandExplore`, `/map`): orbit, pan, zoom, keyboard; every
  place is a real button pinned to the relief; the record card opens with
  its evidence tier. Draws only while visible. (The v3 homepage film was
  removed in v4; it is in git history.)
- **Loading**: three.js is imported after first paint. Without WebGL2,
  `/map` shows the 2D sheet (`MapSheet`, SHEET 00).

## 3a. The watermelon, woven (v4)

`src/components/weave/loom.ts`, mounted by `WovenHero`. A canvas where every
cell is one crossing of warp and weft. Where the coloured weft is up you see
red, white or green; where the black warp is up you see black. A 4×4
ordered dither decides which thread is up, so the image is made of the
decision a weaver makes at every crossing.

- **The slice**: a half-moon, cut edge up. Red flesh, twelve black seeds in
  two rings, white pith, green rind striped in darker green. The pith
  always separates red from green.
- **The red thread**: one red pick runs the width of the cloth.
- **On arrival** the cloth is woven in row by row (1.6 s) with a red
  shuttle riding the fell; unwoven rows show bare warp.
- **The pointer** is a lamp over the cloth; **scroll** turns the slice.
- **Reduced motion**: the finished cloth, lit from the middle, no weaving.
  **No JS / no canvas**: a plain weave drawn in CSS behind the same words.
- Renders only while on screen; cells are stamped from pre-drawn thread
  sprites, so a frame is a few thousand `drawImage` calls.
- **Historical sheets** (PEF 1880; Survey of Palestine 1940s) are separate
  objects in `src/content/sources.ts`, shown only as themselves, and **on
  hold** under dossier 003's P0 reviews even once the files exist.

Not allowed: a globe, particles, glow, bloom, a fantasy terrain, exaggeration
that is not labelled, any border or place we cannot source.

## 4. The olive tree

Generated once by `scripts/draw-olive.mjs` (seeded) and committed:

- **engraved** — the identity drawing, a traditional engraving: a wide
  billowing crown of lobes shaded with hatching and cross-hatching, fringe
  leaves, a split twisted trunk with a hollow and grain, limbs disappearing
  into the crown, roots, a hatched ground line
- **mark** — silhouette for 16–64px

Rendered as a CSS mask over `currentColor`, so it prints in any ink (white on
the green page, black on white). In the relief it is a billboard at
al-Majdal. Never as a repeating pattern, never as a wreath, never pasted on
every section. What it stands for on the site — patience, staying, being
handed on — is labelled INTERPRETATION.

## 5. Brutalism and anti-design — what they are allowed to be

Brutalism comes from hard edges, black grounds, big type, strong rules, raw
structure, monospace records, physical texture. Anti-design comes from
breaking composition on purpose: a title leaving the viewport, a map taking
70% of the screen, Arabic interrupting Latin, a tiny note in a huge empty
space, documents overlapping on a table.

The block is the unit: a line of type printed on its own slab of black,
white or red (`.blk`). Borders are 3px and square. Nothing is rounded.

**Removed in v2.0 and not to return:** acid stickers, blue outline type,
bracketed `[LABELS]`, random red rectangles, huge circles, "ARCHIVE THIS",
barcodes, glitch jitter, misregistered blue plates.

## 6. Motion

The camera over the land, ink, scanning, cutting. Overlays cut in with a
stepped scan (0.36 s) and cut out hard. Durations 90 / 180 / 480ms elsewhere.
Everything has a reduced-motion state that shows the same content without
movement. `.reveal` clips children, never the observed element.

## 7. The logo

The official logo is the founder's artwork (`brand/assets/majdal-logo-sheet.jpg`).
`scripts/extract-logo.mjs` crops the three lockups — primary, stacked, mark —
and turns the black ground into transparency: alpha from brightness, colour
un-premultiplied, so on black it is pixel-identical to the sheet. The ink
version is the same alpha in black, for paper grounds. Nothing is redrawn.

- Header: stacked lockup. Film end card, footer: primary.
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
