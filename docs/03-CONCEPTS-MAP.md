# 03 — THREE INTERACTIVE MAP CONCEPTS

**Read `cultural-research/dossier-003-maps-and-provenance.md` first.** It sets
the constraints every concept below has to live inside:

- 1940s Survey of Palestine sheets are **reported** public domain — unconfirmed.
- Palestine Open Maps vector data is **ODbL** — share-alike applies.
- Khalidi's *All That Remains* documents **418 villages**; facts citable, text not.
- **No open corpus of historical photography exists.** Permission-based only.
- **Blocking question:** is a commercial brand mapping depopulated villages
  appropriate at all? That is asked before any of this is built.

---

## CONCEPT A — THE REGISTER
*The map is made of type. There is no basemap image.*

Place names sit at their true coordinates on a dark field, set in the MAJDAL
type system, Arabic and Latin together. No raster, no tiles, no satellite.
Zooming changes **label density** exactly as a real survey sheet does: at low
zoom only districts and major towns; deeper in, villages, khirbats, wells,
groves. Hovering or focusing a name lifts a metadata card — district,
coordinates with stated precision, evidence tier, sources. Clicking opens the
place record.

**For:**
- **It is text.** So it is accessible, indexable, translatable, and crisp at any
  zoom — and the "non-map alternative" the brief requires in §23 is not a second
  build, it is the same markup in a different layout. That convergence is rare.
- Tiny payload. No tile server, no raster licensing exposure, no CDN bill.
- **Unmistakably MAJDAL.** Nobody else's map looks like this, because everyone
  else starts from a basemap. It is the cartographic version of the brand's own
  rule: type is the architecture.
- Sidesteps the unresolved raster-rights question entirely for Phase 1.

**Against:**
- Less immediately legible as "a map" — no coastline, no relief.
- Lives or dies on typography and label-collision logic, which is real work.
- Needs accurate coordinates per place, sourced and precision-labelled.

---

## CONCEPT B — THE SURVEY SHEET
*The historical raster, revealed under a moving mask.*

The 1940s survey sheet is present but hidden under darkness. The cursor reveals
a soft circle of the original map — contours, property boundaries, Arabic place
names in the surveyor's own hand. "The land remembers."

**For:** the strongest single emotional idea here. Uses the actual historical
artefact. Makes erasure and recovery physically legible.

**Against — and it accumulates:**
- **Raster tiles are heavy**, and the rights question is unresolved and blocking.
- **A cursor-mask has no touch equivalent.** Most of the audience is on a phone,
  where the entire interaction has to be reinvented.
- Accessibility is a parallel build; a masked image carries no semantics.
- **It turns a survey document into a texture** — which edges toward the
  aestheticisation the brand refuses. The maps were an instrument of a colonial
  survey; using them as a mood layer is not neutral.
- The reveal-under-cursor effect is itself well-worn.

---

## CONCEPT C — THE THREAD
*A behaviour, not a substrate.*

Every place you open is remembered. A fine line is drawn between them in the
order you found them. Over a session you build a route — *your* route — through
the archive. It persists, it is shareable as an image or a permalink, and it can
be carried into THE ROOTS as something you made.

**For:** genuinely participatory; a natural growth loop (a shared thread is a
personal artefact, not an ad); ties the map to the community rather than leaving
it a toy; cheap to build on top of either substrate.

**Against:** meaningless without depth — a thread between four places is a
disappointment; needs persistence and a privacy decision; risks gimmick if the
thread is decorative rather than a real record of what you read.

---

## RECOMMENDATION

> **Build A as the substrate. Layer C on top as behaviour. Do not build B —
> instead use the survey sheet as a deep-zoom detail on individual place
> records, where it is earned, per-item, and separately licensable.**

**Why A over B.** B is the more beautiful idea and the wrong foundation. It is
heavy, it is blocked on unresolved rights, it breaks on touch, it needs a
parallel accessibility build, and it uses a colonial survey instrument as
atmosphere. A is lighter, legally clean today, accessible by construction, and
*more* original — because starting from type instead of a basemap is a decision
no competitor will copy, since it requires having a type system worth mapping
with.

**Why A and C together.** A supplies the archive; C supplies the custody. The
thread is the moment a visitor's reading becomes an object they own — which is
precisely the DISCOVER → PARTICIPATE → SHARE transition in the brief's loop.

**Where B survives.** On a place record, one sheet, deep-zoomable, captioned
with its provenance and its rights statement — presented **as a document, not as
a texture**, which is the treatment `brand/DESIGN-SYSTEM.md` §5 already requires
of archival material. It becomes evidence rather than atmosphere. That is the
honest use of it, and it is also cheaper.

**Scope for Chapter 001.** Not 418 villages. **al-Majdal and its district**,
deeply sourced, with the rest of the field visibly empty and marked as such.
*The archive is never complete* stops being a line and becomes a description.

## Technical shape of Concept A

- **SVG, not canvas or WebGL.** Real text nodes: selectable, searchable,
  screen-reader navigable, styleable, indexable. Canvas would throw all of that
  away for no gain at this scale.
- **Projection:** a single fixed projection computed at build time from source
  coordinates; no runtime projection library.
- **Pan/zoom:** Pointer Events, one handler for mouse/touch/pen. Pinch via two
  active pointers. No gesture dependency.
- **Label density:** precomputed per zoom band at build time, not solved live.
- **Keyboard:** every place is a real focusable link in DOM order by district —
  so tabbing through the map *is* the list alternative.
- **Reduced motion:** thread draws instantly; pan/zoom transitions disabled.
- **Progressive:** places render server-side as a list; interactivity enhances
  it. With JS off, `/map` is a browsable sourced index of places.
