# MAJDAL DESIGN SYSTEM v1.0 — BRUTALIST STREET ARCHIVE

The system is implemented as code in `src/app/tokens.css`. That file is the
source of truth; this document explains the reasoning so nobody "improves" a
token without understanding what it is doing.

v1.0 replaces v0.1 (quiet editorial, silk accents in the UI) and
`docs/04-DESIGN-SYSTEM-V2.md`. Founder decision, 2026-09-26: the site is a
street archive, not a catalogue. Brutalism, anti-design, collision — with
the evidence rules untouched.

## 1. Colour

### The six

| Token | Value | Job |
| --- | --- | --- |
| `--black` | `#050505` | Night. Default ground. |
| `--bone` | `#F1EDE2` | Paper. Text on night; ground for documents. |
| `--red` | `#E3261A` | Signal. THE THREAD, 48, display type, fills, stamps. |
| `--blue` | `#1747FF` | Electric. Focus ring, VERIFIED, overprint plates. |
| `--acid` | `#C7FF00` | Almost never. One sticker, the skip link. |
| `--olive` | `#596044` | Archive ground. The boxes of material. |

Tints of bone on black for hierarchy: `--bone-72` (8.99:1), `--bone-55`
(5.52:1), `--bone-20` (rules only, never text).

### Contrast — measured, not eyeballed

| Pair | Ratio | Allowed |
| --- | --- | --- |
| bone / black | 17.42 | any text |
| acid / black | 17.21 | any text |
| bone / blue, blue / bone | 5.31 | any text |
| bone / olive | 5.64 | any text |
| red / black, black / red | 4.42 | **large type only** |
| red / bone | 3.94 | **large type only** |

**Red never carries small text.** Red is display type, fills behind large
type, borders, marks, and the thread. This is the rule most likely to be
broken. A red caption is a bug.

### The silk colours moved — they did not disappear

Majdalawi cloth is recorded as black and indigo cotton cut with fuchsia and
turquoise silk (dossier, `VERIFIED` with sources). Those colours now live
where they belong: **in the cloth.** They appear in product colourway data
(`src/content/products.ts`, e.g. the ARCHIVE tee hairlines) and in archive
records — not as interface accents.

The 5% rule still holds for them: on a garment, fuchsia and turquoise never
exceed ~5% of the surface. They are the silk thread in a cotton cloth.

Signal red and electric blue are **brand language**, not heritage. Never
describe them as Majdalawi colours, Palestinian colours, or as carrying any
historical meaning.

### Grounds

Colour scopes are classes that redefine the semantic tokens (`--bg`, `--fg`,
`--fg-muted`, `--fg-faint`, `--rule`):

- default — night (bone on black)
- `.paper` — records, documents, tech drawings (black on bone)
- `.olive-ground` — the archive boxes (bone on olive)
- `.joinsec` — red field with a black panel for the form

A component placed on a ground inherits correct text colours without
knowing where it is. Components that always sit on paper (product frames,
`.pdp__draw`) set paper tokens themselves.

## 2. Typography — type is the artwork

| Variable | Face | Behaviour |
| --- | --- | --- |
| `--font-display` | Archivo Variable | `wdth 62`, 900, uppercase, `line-height .84` — condensed industrial |
| `--font-text` | Archivo Variable | `wdth 100` — grotesk text |
| `.wide` | Archivo Variable | `wdth 125` — wide stamp |
| `--font-mono` | IBM Plex Mono | metadata, coordinates, ledgers, labels |
| `--font-arabic` | IBM Plex Sans Arabic | Arabic at display scale, isolated direction |
| `--font-hand` | Reenie Beanie | pencil marginalia, a handful of times |

All self-hosted via `@fontsource`, all OFL. One variable family carries three
behaviours through its width axis, so the display system costs one file.

Rules:

- Display type may be cropped, rotated, outlined, and run off the viewport.
  Body text may not. Anything a reader must read sits upright, on a solid
  ground, at `--step-0` or above.
- Arabic is never stretched, faux-bolded, mirrored, or used as texture behind
  Latin. The hover overprint of مجدل in the hero is a second plate, not a
  pattern. **All Arabic is blocked from print until native-speaker review.**
- Scale: `--step--2` → `--step-6` (`clamp(6rem, -1rem + 28vw, 30rem)`).

## 3. Layout — anti-grid, with an index

- The page is a sequence of grounds: SIGNAL → COLLISION → MAP → MEMORY →
  ARCHIVE → PEOPLE → PRODUCT → IMPACT → JOIN.
- Break the grid with overlap, rotation, and overflow — but every section
  keeps one legible reading line. If a reader cannot find the next sentence,
  the collision went too far.
- 0px radius everywhere. 2px borders. `--shift: 4px` misregistration.
- Horizontal overflow is clipped per section, never on the page. A phone must
  never scroll sideways (checked at 390px on every route before shipping).

## 4. Signature elements

- **THE THREAD** (`src/components/brut/Thread.tsx`). A 3px red line drawn by
  scroll. Each section's thread enters where the previous one exited. On the
  product drawings it becomes the seam (`.gf__seam`). It is the one continuous
  object on the site.
- **The ground-aware header.** The header reads which ground sits under it
  (night / paper / olive / red) and swaps its chips. It replaced a
  `mix-blend-mode: difference` header that measured 2.09:1 over olive.
- **Stamps, tags, stickers, tape.** `.stamp`, `.tag` (`[BRACKETS]`),
  `.sticker` (acid — one per page at most), `.taped`. Structural, not
  decorative: each carries a label that is true.
- **Barcode.** A real Code 39 encoding of `MAJDAL-48`. A scanner reads it.
- **Tier marks.** Colour is the border: `VERIFIED` blue, `CONTESTED` red
  double, `INTERPRETATION` dashed. The words are always printed too — colour
  is never the only signal.
- **Textures** (`.grain`, `.scanlines`, `.halftone`) are used on a few
  surfaces, never behind body text.

Experimental labels (`[THE LAND]`, `[THE THREAD]`, `WHAT DO YOU CARRY?`) are
brand language and read as such. Anything that looks like a historical claim
must be one, with a source.

## 5. Motion — cuts, not glides

- Durations 90 / 160 / 420ms. Stepped timing (`steps(6)`) for reveals: a
  scanner wipe, not a fade.
- **Reveal rule:** clip the *children* of `.reveal`, observe the parent.
  Clipping the observed element stops IntersectionObserver from ever firing.
  Insets are negative (`-48px`) so tape and offset shadows survive.
- THE LAND: three.js, dynamically imported, desktop pointer only. Touch,
  reduced motion, and no-WebGL get the static map on paper. The map is the
  content; WebGL is the enhancement.
- `prefers-reduced-motion: reduce` removes clips, drift, jitter and the
  overture. `<noscript>` shows everything.
- No scroll-jacking. The sticky map scene scrolls with the page.

## 6. Photography

- There is none yet, and the frames say so. No stock photography, ever.
- Products are shown as **objects**: technical drawings generated from the
  colourway data, captioned "not product photography".
- Archival material is presented as document: grain, full frame, captioned
  with source and date. Never faked to look old.
- Never use images of suffering to sell a garment.

## 7. Graphic language on garments

- **Coordinates and place names** set as data — blocked from print until
  verified (dossier §2).
- **The 48 mark:** small and quiet on the garment — woven label, size tab,
  inner neck. Loud on the website, quiet on the body.
- **Loom logic:** colour-blocking derived from woven bands, aligned to panel
  seams. The Majdalawi reference lives in the construction, not in a print.
- No cultural claim reaches a garment without Gate 2 review.

## 8. Logo

Wordmark only: `MAJDAL` and `مجدل`, usable independently or stacked. No
emblem, no olive tree. The Arabic wordmark is blocked pending native-speaker
review (P0).
