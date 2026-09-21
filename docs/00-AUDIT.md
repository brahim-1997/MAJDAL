# 00 — TECHNICAL & CREATIVE AUDIT

State of the repository at commit `e78bb48`, assessed against the digital-world brief.

## 1. What exists

| Layer | State | Verdict |
| --- | --- | --- |
| **Cultural research** | 3 dossiers, tiered VERIFIED/CONTESTED/INTERPRETATION, sourced; protocol with a 3-gate review process; review log with blocking P0s | **Strong. This is the brand's real asset.** Keep and extend. |
| **Brand system** | Brand book, design system, resistance doctrine, generational spine (cloth → cactus → seed) | **Strong.** Extend, don't replace. |
| **Strategy** | Impact policy, community model, launch sequence, content system, analytics, UK underground playbook | Strong. Needs a *digital* community spec. |
| **Website** | Next.js 16 App Router, TS strict, hand-authored CSS on a token layer, 30 static pages, 0 UI deps | Solid foundation, **wrong shape** for the brief. |
| **Content model** | Typed TS modules: products, chapters, archive, site | Good pattern, **too thin** for an archive/map. |
| **Impact** | Append-only ledger + JSON schema + build-failing validator | **Strong, and the pattern to reuse.** |
| **Quality gates** | `npm run check` = typecheck + ledger validation + build. A11y verified: single h1, correct heading order, no-JS fallback, no mobile overflow | Keep. Extend to content validation. |

## 2. The gap — honest assessment

The current site is a **well-built editorial brochure**. The brief asks for a
**world with a store inside it**. Five specific gaps:

1. **No discovery arc.** Current flow is HOME → sections → SHOP. The brief wants
   LAND → MEMORY → ROOTS → ARCHIVE → COMMUNITY → CHAPTER → PRODUCT.
2. **No map, and no place data model.** There is no geography in the content
   model at all. This is the largest single piece of missing work.
3. **The archive is a list of essays, not a database.** No ID/location/date/
   category/source/contributor/chapter fields, no filtering, no cross-linking.
4. **No community mechanism.** `JoinRoots` deliberately stores nothing. There is
   no submission, consent, moderation or attribution system — so "WHAT DO YOU
   CARRY?" has nowhere to land.
5. **No commerce.** No cart, checkout, inventory or editions.

## 3. What the brief asks for that we should push back on

Stated plainly, because agreeing to everything is not a service.

- **"Parallax, pinned sections, kinetic typography, horizontal sections"** (§11).
  Each is a cost in performance, accessibility and taste. The brief also says
  performance > effects and every animation must have narrative purpose. Most of
  these do not survive that test. **Recommend: reveal, mask, and map motion only.**
  Scroll-jacking and pinned sections are refused outright — they break keyboard
  navigation and reading.
- **A cold-open splash screen** (§10). Emotionally right, but it is also the most
  imitated "underground" device there is, it hurts returning visitors and
  crawlability, and mystery that costs the user nothing is decoration.
  **Recommend: keep it, but first-visit only, under 1.2s, skippable, and never
  gating content.** See `docs/02-CONCEPTS-HOMEPAGE.md`.
- **Tailwind / Framer Motion / Three.js** (§20). Evaluated properly in
  `docs/05-ARCHITECTURE.md`. Short version: keep hand-authored CSS, defer the
  animation library until a prototype proves it is needed, refuse WebGL.
- **"Encrypted-looking identifiers"** (§06). Fine as catalogue numbers. Not fine
  as fake cipher text — that is the cheap-ARG failure the same section bans.

## 4. Hard blockers carried forward

From `cultural-research/REVIEWS.md`, unchanged and still blocking:

- No Gate 2 external review has happened. **Nothing cultural reaches a garment.**
- Chapters 002/003 have no garments, run size or date.
- New from Dossier 003: base-map rights, the ODbL obligation, the Institute for
  Palestine Studies approach, and the question of whether a commercial brand
  should map depopulated villages at all.

**The last one is blocking for the entire map programme.** It must be asked
before design work, not after.

## 5. Recommendation

**Extend, do not restart.** The research, brand system, token layer, impact
pattern and quality gates are the hard part and they are done. The work is:
a place data model, an archive database, the map, the community layer, and a
re-cut homepage — on the foundation that exists.
