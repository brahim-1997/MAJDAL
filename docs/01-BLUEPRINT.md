# 01 — MAJDAL DIGITAL WORLD BLUEPRINT

## A. BRAND INTERPRETATION

MAJDAL is not a streetwear brand that references Palestine. It is a brand
**descended from a specific Palestinian town that made cloth** — al-Majdal, the
textile centre of the Gaza District, roughly 2,000 looms working inside private
houses, cloth sold in eight-metre lengths at one to two months of work per
piece. The town was taken in 1948 and its people expelled. The weavers kept
weaving, and the craft still carries the town's name: *Majdalawi*.

**The one sentence:** *The place was erased from the map and the cloth kept its
name.* That is documented history, not a slogan, and it is the reason the brand
can exist without exploiting its subject.

**What this means for the digital world.** MAJDAL's defensible asset is not an
aesthetic — aesthetics are copied in a weekend. It is **a real, sourced, growing
archive**. So the website should not be a beautiful shell around a shop. It
should be **the archive itself**, with a shop inside it. A competitor can clone
our typography by Friday. They cannot clone four dossiers, a tiered evidence
system, and a community that contributes to it.

**The emotional register.** Not grief, not defiance-as-posture. **Custody.**
The feeling of being handed something and being expected to carry it. That is
the difference between a brand that performs a struggle and one that continues
a lineage — and it is what keeps MAJDAL out of the merchandise category.

## B. CREATIVE DIRECTION

**The world is a working archive at night.**

Not a museum — museums are finished and lit. A working archive: partially
catalogued, in use, with gaps that are visible and marked. Dark ground because
the brand lives at night and underground; off-white because paper and record;
type as the primary material because **the record is made of language**.

**Five principles:**

1. **Type is the architecture.** Not decoration over images. Place names,
   catalogue numbers, coordinates, districts, dates. Signage, archive labels,
   garment care labels, museum metadata. Where other brands put a photograph,
   MAJDAL puts a record — and a record is harder to fake.
2. **Arabic and Latin are one system, not two.** Matched optical weight,
   matched baseline discipline, Arabic never used as ornament behind English,
   never stretched, never faux-bolded. Both scripts carry information.
3. **Restraint is the luxury signal.** The documented Majdalawi silk colours —
   fuchsia, turquoise — appear at thread scale, never as fields. The discipline
   *is* the premium cue.
4. **Incompleteness is shown, not hidden.** Unsourced places, contested dates
   and missing photographs are marked as such on the surface. A visible gap is
   a reason to contribute; a hidden gap is a lie waiting to be found.
5. **No suffering as texture. No flags. No olive-tree logo. No keffiyeh
   pattern as wallpaper.** These are banned in `brand/DESIGN-SYSTEM.md` and the
   ban holds in the digital world.

**Photography — deliberately deferred.** Palestinian photo archives are
permission-based, not openly licensed (Dossier 003 §4). So Phase 1 is
**typographic and cartographic**, and photographs arrive later, one at a time,
each with named provenance and consent. The rights reality and the aesthetic
ambition point the same way, which is unusual and worth taking.

## C. UX CONCEPT — how the world is discovered

The brief's arc — LAND → MEMORY → ROOTS → ARCHIVE → COMMUNITY → CHAPTER →
PRODUCT — is right, but it is a *narrative* order, not a navigation order.
Forcing every visitor through seven gates would be a maze, and mazes are not
mysterious, they are annoying.

**The resolution: one arc, three depths.** Every visitor gets the arc; how far
they travel is theirs to choose.

| Depth | Who | What they get |
| --- | --- | --- |
| **Surface** — 30 seconds | Arrived from a link | The signal, one fact, one object, one way in. Must be legible with no interaction. |
| **Archive** — 5 minutes | Curious | The map, place records, archive entries, sources, the chapter |
| **Custody** — returning | Belonging | Contribution, THE ROOTS, the access window, the thread they have traced |

**The governing rule: mystery must always resolve.** Every hidden thing has an
answer available in one step. `48` always resolves to one plain sentence. A
catalogue number always resolves to a record. Mystery that can never be
resolved is a con, and the audience can tell.

**Discovery mechanics that earn their place:**
- **Progressive density.** The map shows more names as you zoom, as a real
  survey sheet does. Discovery is a property of the data, not a trick.
- **The trace.** Places you open are remembered and drawn as a thread. Your
  route through the archive is yours.
- **Catalogue numbers as links.** `A001`, `ARCHIVE/0048`, `OBJECT 001` are all
  real addresses. Learning the numbering *is* learning the world.
- **The window.** Chapter access opens to whoever can answer an archive
  question. You learn the history to get in (`UK-UNDERGROUND-PLAYBOOK.md`).

## E. INFORMATION ARCHITECTURE

The brief says not to assume its navigation and to explain the decision.

```
/                    THE SIGNAL      entry, the arc in one screen
/map                 THE LAND        interactive archive map
/map/[place]         A PLACE         place record, sources, related
/archive             THE ARCHIVE     the database, filterable
/archive/[id]        A RECORD        entry, tier, sources, contributor
/chapters            THE SPINE       cloth / cactus / seed
/chapters/[slug]     A CHAPTER       story, objects, archive, activation
/roots               THE ROOTS       community, rituals, join
/roots/carry         WHAT DO YOU CARRY?   submission, consent, moderation
/shop                THE OBJECTS     chapter objects
/shop/[slug]         AN OBJECT       object record + commerce
/impact              THE LEDGER      auditable impact
/about               THE POSITION    who, why, method, corrections
```

**Decisions and why:**

- **`/story` is removed and absorbed.** It was a brochure page. The story is now
  told by the map, the archive and the chapters — showing beats telling, and a
  dedicated "our story" page is the most ecommerce-template artefact we had.
- **`/map` is a top-level destination, not a homepage takeover.** It needs its
  own URL to be shareable, indexable and linkable from place records. Making the
  homepage a map would gate all content behind an interactive canvas — bad for
  SEO, bad on mobile data, bad for accessibility.
- **`/archive` is the spine of the site, not a gallery.** Everything else links
  into it. This is the one section a competitor cannot clone.
- **`/roots/carry` is separate from `/roots`.** Submission is a considered act
  with consent attached; it should not be a widget in a marketing page.
- **`/about` is added.** The brief did not list it as certain, but a brand
  handling other people's history must state its method and publish its
  corrections. This is also where the Gate 2 review status lives, in public.
- **Navigation is the identity.** Rendered as an archive register — index
  number, name, Arabic — not as a shop menu. The nav teaches the numbering
  system every time it is seen.

## G. COMMUNITY LOOP

The brief's loop — DISCOVER → EXPLORE → UNDERSTAND → BELONG → PARTICIPATE →
SHARE → RETURN → NEW CHAPTER — mapped to concrete mechanisms:

| Stage | Mechanism | Instrumented as |
| --- | --- | --- |
| **Discover** | The signal; a shared place link | `map_open`, `archive_open` |
| **Explore** | Map; progressive density; the trace | `map_location_open` |
| **Understand** | Records with tiers and sources | `archive_depth` (records/session) |
| **Belong** | Join THE ROOTS — free, no purchase | `join_roots` |
| **Participate** | **WHAT DO YOU CARRY?** submission | `submission_started/completed` |
| **Share** | Your traced thread; a place record | `thread_shared` |
| **Return** | Chapter window; the reading; new records | returning-visitor rate |
| **New chapter** | Cloth → cactus → seed | `chapter_open` |

**The load-bearing mechanism is contribution, and it must be built properly.**
"WHAT DO YOU CARRY?" is where a visitor stops being an audience. It requires,
non-negotiably: explicit consent, stated usage terms, named or anonymous
attribution by choice, moderation before publication, and **the ability to
withdraw** — including after publication.

**The hardest part is moderation, and it is a duty of care, not a feature.**
People will submit family photographs, names of the dead, and accounts of
displacement. That material needs a human reviewer, a documented policy, a
response time, and a refusal path that treats the contributor with respect.
**If we cannot staff moderation, we do not open submissions.** An unmoderated
archive of other people's memory is worse than no archive.

**Archive depth is the honest leading indicator** — records read per session.
Followers are not members; a member who reads three records is worth more to
this brand than a thousand impressions.
