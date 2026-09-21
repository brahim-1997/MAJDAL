# DOSSIER 003 — MAPS, ARCHIVES AND RIGHTS
## What we are legally and ethically allowed to build the map from

**Status:** Gate 1 (internal research). **Gate 2 external review: NOT DONE.**
**Compiled:** 2026-09-21
**Why this dossier exists:** the brief asks for an interactive experience built
on a *historically sourced* map of Palestine. Before designing that experience
we must know what the sources are, who holds rights in them, and what using
them obliges us to do. Getting this wrong is not a licensing footnote — it
would mean building the centrepiece of the brand on material we cannot keep.

---

## 1. The base cartography

`VERIFIED` — **The Survey of Palestine maps exist and are digitised.** Hundreds
of **1:20,000 scale British Mandate-era maps** of Palestine were digitised and
made available through an online viewer by the **Israeli National Library**.
Reporting on Palestine Open Maps describes these maps as **now in the public
domain**. They cover the territory at scales up to 1:20,000 and record
population centres, roads, topographic features and property boundaries —
a level of physical detail with no modern equivalent on the ground.
*Sources: Jadaliyya — Palestine Open Maps; Bloomberg (2018); Wikipedia "Survey of Palestine"; Promised Land Museum.*

`CONTESTED / MUST VERIFY BEFORE USE` — **The precise public-domain status.**
"Public domain" is reported in secondary coverage, not confirmed by us against
a rights statement. Crown copyright terms, the digitiser's own asserted rights
in the scans, and the distinction between *the map* and *a particular scan of
the map* are three different questions. **A lawyer must confirm all three
before any raster sheet is published on majdal's own domain.**

**Open question for review.** There is also a question we should not answer
alone: whether MAJDAL should source its base cartography **through the Israeli
National Library's digitisation** at all, or work from Palestinian-held copies.
The maps are a colonial survey instrument; the digitisation sits with a state
institution. That is a political question about provenance, not only a legal
one, and it goes to a Palestinian reviewer.

## 2. The vector data — and a real obligation

`VERIFIED` — **Palestine Open Maps (POM)**, launched **March 2018**, combines
1940s British Mandate survey maps with present-day maps, historical and modern
data, photography and oral histories. It runs on **OSM-Seed**, a self-hosted
OpenStreetMap environment, and extracts data from the historical maps through
public **mapathons**. Work was funded in part through the **Basel Khartabil
Free Culture Fellowship**, supported by the Creative Commons, Mozilla and
Wikimedia foundations.
*Sources: Jadaliyya; GeoCompas; Bloomberg (2018); Jameel Arts Centre.*

`VERIFIED` — **The licence.** All data produced in the POM mapathons is
published under the **Open Data Commons Open Database License (ODbL)**.
*Source: GeoCompas — Empowering Palestine Open Maps with OSM-Seed.*

### What ODbL actually obliges MAJDAL to do

This is the single most consequential technical finding in this dossier.

ODbL is a **share-alike** licence. In outline: if MAJDAL builds a derived
database from POM data and uses it publicly, MAJDAL must **attribute** the
source and **publish its own derived database under ODbL**.

**Assessment: this is a constraint we should accept deliberately, and it suits
the brand.** MAJDAL already publishes its research, its sources, its impact
ledger and its corrections. Publishing the archive's place dataset openly is
consistent with everything the brand claims to be, and refusing to would be the
inconsistency. **Recommendation: treat the MAJDAL place dataset as an open,
ODbL-licensed contribution back, and say so on the site.**

**But it must be a decision, not an accident.** A commercial brand that
silently absorbs ODbL data into a proprietary product is in breach. Counsel
should confirm the boundary between our ODbL-derived place database and the
rest of the site before launch.

## 3. The village record

`VERIFIED` — **Walid Khalidi, *All That Remains* (1992)**, Institute for
Palestine Studies, describes **418 Palestinian villages** destroyed or
depopulated in 1948. Each village has its own entry with statistical data,
narrative information, the military operations that led to its conquest, and a
description of the site at the time of the project. It is the standard
reference and underlies later databases, including **Zochrot's iNakba**.
*Sources: Wikipedia "All That Remains"; Institute for Palestine Studies; AUB LibGuides; Al Jazeera (2014).*

**Rights position.** Facts are not copyrightable; Khalidi's *text* is. MAJDAL
may cite figures and name places with citation. MAJDAL may **not** reproduce
entry text, and should not paraphrase entries closely enough to be a
substitute for the book. Where we use it, we cite it and link people to it.

**Ethical position.** *All That Remains* is the work of Palestinian scholars
documenting their own dispossession. If MAJDAL leans on it commercially, the
Institute for Palestine Studies should be **contacted, credited prominently,
and offered payment or a share of impact funds.** Extracting from it silently
would be the exact behaviour this brand exists in opposition to.

## 4. Photographs — the hardest rights problem

`VERIFIED` — Palestinian photographic archives are **generally permission-based,
not openly licensed.** The Institute for Palestine Studies builds its digital
social archive by *asking people for permission* to digitise family papers.
UNRWA holds a major photo and film archive and frames itself as **custodian**,
describing the images as "the property of all Palestinians as part of their
heritage". Other collections sit with Columbia's Center for Palestine Studies,
the Palestinian Museum and university libraries.
*Sources: Institute for Palestine Studies; UNRWA photo and film archive; Columbia CPS; Brown and Georgetown LibGuides.*

**Consequence for the build, and it is a large one:**

> **The map cannot depend on historical photography at launch.** There is no
> open corpus to draw on, per-image clearance is slow, and a launch that
> assumes photographs will exist is a launch that slips or cuts corners.

**This is not a compromise — it is the better design.** A map built from place
names, coordinates and archival metadata, set in type, is:
- unmistakably ours rather than the generic "Palestine aesthetic" the brief bans
- faster, lighter, and crisp at every zoom
- accessible by default, because it is text
- indexable, so the archive earns search traffic
- free of the risk of using images of suffering as texture

Photographs enter later, **one at a time, each with named provenance and
consent**, on individual place and archive pages where they are earned.

## 5. Sourcing rules for any place entry

Every location in the MAJDAL map must carry, in the content model:

| Field | Rule |
| --- | --- |
| `name` / `nameArabic` | Palestinian place name first |
| `coordinates` | With stated precision and source; approximate is labelled approximate |
| `district` | Mandate-era district |
| `tier` | VERIFIED / CONTESTED / INTERPRETATION |
| `sources[]` | At least one citable source; two for VERIFIED |
| `rights` | Licence of every asset used in the entry |
| `contributor` | If community-submitted, with consent record |

**No place ships without sources. No asset ships without a rights field.**
The validator pattern already used for the impact ledger should be extended to
enforce this at build time — an unsourced place should fail the build exactly
as an unevidenced impact claim does.

## 6. Scope discipline

418 villages is a research programme, not a launch scope. Attempting all of
them at once guarantees thin, unverified entries — the failure this repository
exists to prevent.

**Recommendation: Chapter 001 ships a small number of deeply sourced places,
not a complete gazetteer.** Begin with **al-Majdal** and its district, because
that is the town the brand is named after and the one we have already
researched. The map's honesty is then structural: it is visibly incomplete, and
it says so. *The archive is never complete* is not a tagline — it is the
literal state of the record, and it is why community contribution matters.

## 7. Open questions for Gate 2 review

1. Should MAJDAL source base cartography via the Israeli National Library's
   digitisation, or seek Palestinian-held copies? **Blocking for raster use.**
2. Confirm public-domain status of the survey sheets, and of the specific
   scans, with counsel. **Blocking for raster use.**
3. Confirm the ODbL boundary for a commercial site, with counsel, and confirm
   our intention to publish the derived place dataset under ODbL. **Blocking.**
4. Approach the Institute for Palestine Studies regarding *All That Remains*:
   credit, permission, payment. **Blocking for any village-level dataset.**
5. Is a commercial streetwear brand mapping depopulated villages appropriate at
   all — and if so, under what conditions? **This is the question behind all the
   others and it must be asked first, in these words.**
