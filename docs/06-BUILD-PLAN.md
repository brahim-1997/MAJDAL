# 06 — BUILD PLAN

Phased so that each phase ships something real and nothing is blocked behind a
half-built dependency. **Phase 0 is not optional and cannot be parallelised
away** — it is the cultural clearance the whole programme rests on.

---

## PHASE 0 — CLEARANCE  *(blocking, not engineering)*

No map or archive expansion begins until these are answered by named people.

| # | Question | Who | Blocks |
| --- | --- | --- | --- |
| 0.1 | **Is a commercial streetwear brand mapping depopulated villages appropriate at all — and if so, under what conditions?** | Palestinian researcher (paid) | The entire map programme |
| 0.2 | Does framing resistance as *continuity* soften dispossession into heritage? | Palestinian researcher | The spine, Chapters 002–003 |
| 0.3 | Source base cartography via the Israeli National Library digitisation, or Palestinian-held copies? | Researcher + counsel | Any raster use |
| 0.4 | Public-domain status of survey sheets *and* of the specific scans | Counsel | Any raster use |
| 0.5 | ODbL boundary for a commercial site; confirm intent to publish our derived place dataset under ODbL | Counsel | Any POM-derived data |
| 0.6 | Approach Institute for Palestine Studies re *All That Remains*: credit, permission, payment | Founder | Village-level dataset |
| 0.7 | Arabic review: wordmark, vocalisation (`مَجْدَل` vs `مجدل`), all fabric and chapter names | Native speaker | Any printed or set Arabic |
| 0.8 | Moderation policy + a named human moderator + response-time commitment | Founder | All community submission |

**If 0.1 comes back negative, the map is not built.** The rest of the world
still works. That is what it means for the question to be blocking.

---

## PHASE 1 — FOUNDATION  *(~1 week, unblocked — can start now)*

Pure engineering on the existing foundation. No new cultural claims.

1. Content schema: `Tier`, `Rights`, `Source`, `Place` in `content/schema.ts`.
2. `scripts/validate-content.mjs` — fails the build on unsourced places, VERIFIED
   with <2 sources, missing `rights`, dangling references. Wire into `npm run check`.
3. Refactor `archive.ts` to the full record model (ID, location, date, category,
   source, contributor, chapter) and cross-link to chapters.
4. `lib/analytics.ts` — typed event contract, no provider yet.
5. Token additions: z-index, breakpoints, radius, grain ceiling.
6. `/about` — method, corrections, Gate 2 status in public.

**Ships:** a stricter, better-modelled version of today's site. Nothing visible
breaks. **This is the phase that makes the protocol executable.**

## PHASE 2 — THE WORLD  *(~2 weeks)*

7. Homepage re-cut: signal → register → land → story → spine → object → roots → ledger.
8. Overture: first visit, ≤1.2s, skippable, safe when storage is unavailable.
9. `/archive` as a real database — filter by tier, category, chapter, place.
10. Navigation as archive register.
11. `/map` **Phase A**: server-rendered sourced place list, no canvas yet —
    the accessible alternative built *first*, so it is the foundation rather
    than a retrofit.

**Ships:** the world, minus the interactive map. Fully usable and indexable.

## PHASE 3 — THE LAND  *(~2 weeks, gated on Phase 0.1–0.6)*

12. `lib/geo.ts` — build-time projection, label-density bands.
13. `MapCanvas` — SVG, Pointer Events, pan/zoom/pinch, focusable labels.
14. Place records with sources, rights and cross-links.
15. `lib/trace.ts` + `Thread` — the route you traced, shareable.
16. Reduced-motion and keyboard parity verified as a gate, not a checkbox.
17. **Decide on `motion`** — only if the prototype proves CSS insufficient.

**Ships:** THE REGISTER + THE THREAD. Scope: al-Majdal and its district only.

## PHASE 4 — THE COMMUNITY  *(~2 weeks, gated on Phase 0.8)*

18. Supabase: auth, storage, RLS, moderation states.
19. `/roots/carry` — submission with consent, usage terms, attribution choice.
20. Moderation queue; withdrawal flow **including after publication**.
21. Contributions enter the archive with contributor credit.
22. THE ROOTS registration becomes real (privacy policy first).

**Ships:** participation. The loop closes.

## PHASE 5 — THE STORE  *(~2 weeks)*

23. Shopify Storefront API; products stay in our content model.
24. Object records: colourway provenance, spec, real editions only.
25. Cart, checkout handoff, order confirmation.
26. Impact accrual wired to real sales → ledger → `/impact`.

**Ships:** commerce, inside the world.

## PHASE 6 — LAUNCH READINESS

27. Licensed display + Arabic faces installed.
28. Product photography replaces placeholders.
29. Privacy-first analytics with consent; events per `strategy/ANALYTICS.md`.
30. Screen-reader audit by a human, not just automated checks.
31. Lighthouse on throttled mobile against the Phase-5 budget.
32. Real domain; flip `robots.ts` and `metadata.robots` to indexable.
33. CI runs `npm run check` on every push.

---

## Sequencing logic

- **Phase 1 is unblocked and starts immediately.** It is the schema and the
  validator — the work that makes every later phase safe, and it creates no new
  cultural claims while Phase 0 is outstanding.
- **Phase 2 needs no new cultural clearance**, because it re-presents material
  already researched.
- **Phase 3 is hard-gated on 0.1–0.6.** Build nothing on unresolved rights.
- **Phase 4 is hard-gated on 0.8.** No submissions without a moderator.
- Phases 3, 4 and 5 are independent of each other and can reorder to suit
  clearance timing or budget.

## What I would cut under pressure

Asked to ship in half the time, in order: the thread (Phase 3.15), the overture
(2.8), `/about` (1.6). **Never cut:** the content validator, the accessible
place list, consent and moderation, or the impact ledger. Those are the
integrity of the project, and they are exactly what gets cut first on projects
that later embarrass their founders.
