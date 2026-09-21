# 05 — TECHNICAL & COMPONENT ARCHITECTURE

## H. TECH STACK — evaluated, not assumed

The brief asks to *evaluate* these. Here is the evaluation, including where I
recommend against.

| Technology | Verdict | Reasoning |
| --- | --- | --- |
| **Next.js (App Router)** | **Keep** | Static generation for archive/map/place records = fast and indexable; server components keep content off the client bundle; already shipped and working. |
| **TypeScript strict** | **Keep** | With `noUncheckedIndexedAccess`. Already caught real bugs in this repo. Content integrity depends on types. |
| **Hand-authored CSS + tokens** | **Keep — recommend against Tailwind** | See below. |
| **Framer Motion / Motion** | **Defer — do not adopt yet** | See below. |
| **Three.js / WebGL** | **Refuse** | See below. |
| **Supabase** | **Adopt in Phase 3 only** | See below. |
| **Shopify Storefront API** | **Adopt in Phase 4** | See below. |

### Tailwind — recommend against, with the counter-argument stated

**This contradicts the brief's §20 suggestion, so here is the actual reasoning.**

The requirement in §32 is a *centralised design-token system*. That already
exists: `src/app/tokens.css`, CSS custom properties, one file, cascading to
every surface, themeable at runtime. Tailwind would not add a capability here;
it would relocate one.

Against Tailwind for *this* project specifically:
- The layouts are unusual — a typographic map, a register grid, asymmetric
  editorial splits. Utility classes are strongest on conventional layouts and
  noisiest on bespoke ones.
- Long utility strings in JSX obscure the structure of markup that is, in this
  project, semantically load-bearing (records, tiers, sources).
- It is a build dependency and a toolchain to maintain, for a team that does not
  exist yet.

**The honest counter-argument:** Tailwind is far more *onboardable*. If MAJDAL
hires two freelancers, they will already know Tailwind and will not know this
CSS. That is a real cost and it is the strongest case for adopting it. Tailwind
v4 being CSS-first narrows the gap further.

**Recommendation: keep hand-authored CSS**, because the distinctive editorial
and cartographic UI is the product here, and it benefits from direct control.
**Revisit the moment more than two people write CSS.** Your call — say the word
and I will migrate.

### Motion library — defer, do not pay before proving need

The current reveal system is CSS + IntersectionObserver, ~50 lines, and works
with a no-JS fallback. Of the motion in the contract, the only genuinely awkward
pieces are map gestures and the thread draw — and **gestures are Pointer Events,
not animation**, while a thread draw is `stroke-dasharray`, which is trivial CSS.

**Recommendation: build the map prototype with Pointer Events + SVG + CSS. If it
proves insufficient, adopt `motion` for the map surface only, lazy-loaded.**
Not adopting a ~35KB dependency before demonstrating need is not conservatism;
it is the performance budget the brief itself demands in §21.

### WebGL — refuse

Recommended against, firmly. The map is **type on a field**. WebGL would give
worse text rendering, no selectable or indexable text, a parallel accessibility
build, a much larger bundle, and battery cost on the phones most of the audience
uses — in exchange for capabilities (3D, particles, shaders) this design does
not want. The aesthetic is paper and record, not dimensional space.

### Supabase — yes, but only at Phase 3

Genuinely needed for "WHAT DO YOU CARRY?": authenticated submission, file
storage, moderation workflow, row-level security, and withdrawal. Postgres +
storage + auth + RLS in one service fits precisely.

**Hard precondition: not before a privacy policy, a consent record and a named
human moderator exist.** The repo already refuses to capture emails with nowhere
lawful to store them; the same standard governs family photographs, and more
strictly. `JoinRoots` stays a no-op until this lands.

### Commerce — Shopify Storefront API, headless

Inventory, tax, shipping zones, returns, fraud and PCI are solved problems, and
rebuilding them would consume the time that should go into the world. Stripe
alone would mean building inventory and fulfilment ourselves.

**Shape: the entire world stays in Next.js; only the checkout leaves.** Product
records live in our content model, Shopify holds inventory and money. The brief's
rule holds — commerce exists inside the world, not the reverse.

## I. COMPONENT ARCHITECTURE

Four layers, strictly separated. Business logic never enters a view; content
never imports a component.

```
src/
├── content/          DATA — typed, no React
│   ├── site.ts  chapters.ts  products.ts  archive.ts
│   ├── places.ts            NEW — the gazetteer
│   └── schema.ts            NEW — shared types + tiers + rights
│
├── lib/              LOGIC — pure, testable, no JSX
│   ├── impact.ts            shipped
│   ├── geo.ts               NEW — projection, label density
│   ├── trace.ts             NEW — the thread
│   ├── archive.ts           NEW — query, filter, cross-link
│   └── analytics.ts         NEW — typed events
│
├── components/
│   ├── primitives/   Reveal, Rule, Label, TierBadge, Meta, Arabic
│   ├── archive/      ArchiveRow, RecordHeader, SourceList, TierFilter
│   ├── map/          MapCanvas, MapLabel, MapCard, Thread, PlaceList
│   ├── chapter/      Spine, ChapterHead, ObjectCard
│   ├── community/    JoinRoots, CarryForm, ConsentBlock, ContributionCard
│   ├── commerce/     PriceTag, SizePicker, EditionMark, CartLine
│   └── shell/        SiteHeader, SiteFooter, Overture, Nav
│
└── app/              ROUTES — composition only
```

**Rules:**
1. **`content/` imports nothing.** Pure data; swappable for a CMS later without
   touching a component.
2. **`lib/` is pure and unit-testable.** Projection and label density are
   algorithms, not effects.
3. **Server components by default.** `"use client"` only for the map canvas,
   forms, the overture, and the trace.
4. **`primitives/` never know about the domain.** `archive/` and `map/` do.
5. **Every component that renders a cultural claim must render its tier and its
   sources.** Enforced by the prop types — a record component cannot be
   constructed without `sources`.

### The content model — the important new work

```ts
type Tier = "VERIFIED" | "CONTESTED" | "INTERPRETATION";

type Rights = {
  licence: string;          // "ODbL" | "public-domain" | "permission" | ...
  holder?: string;
  obtained?: string;        // ISO date permission was granted
  note?: string;
};

type Source = { title: string; publisher?: string; url?: string; year?: string };

type Place = {
  id: string;               // "P-0001"
  name: string; nameArabic?: string;
  district: string;
  coordinates: { lat: number; lon: number; precision: "exact" | "approximate" };
  status: "depopulated" | "extant" | "unknown";
  tier: Tier;
  summary: string;
  body?: string[];
  sources: Source[];        // required — non-empty enforced at build
  rights: Rights;
  chapterSlugs: string[];
  archiveIds: string[];
  openQuestion?: string;
};
```

**Extend the validator pattern.** `scripts/validate-impact-ledger.mjs` already
fails the build on an unevidenced impact claim. A sibling
`validate-content.mjs` must fail the build on: a place with no sources; a
VERIFIED tier with fewer than two sources; any asset with no `rights`;
coordinates marked `exact` without an exact-precision source; a dangling
`archiveIds` or `chapterSlugs` reference.

**This is the single most important engineering decision in the project.** It
makes the cultural protocol executable rather than aspirational — the same move
that made the impact commitment auditable.

## Performance & SEO budget

| Metric | Budget |
| --- | --- |
| Homepage JS (gzip) | ≤ 60KB |
| `/map` JS (gzip) | ≤ 110KB including place data |
| LCP, mid-tier phone, 4G | ≤ 2.0s |
| CLS | ≤ 0.02 |
| Overture | ≤ 1.2s, first visit only, skippable |

Static generation for every record. `sitemap.ts` extended to places. JSON-LD:
`Organization`, `Product`, and `Place` / `ArchiveComponent` on records. Every
place is a real URL — the archive should earn search traffic for place names,
which is also how diaspora families will find it.
