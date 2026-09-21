/**
 * THE REGISTER — places in the MAJDAL map.
 *
 * Rules enforced by scripts/validate-content.mjs:
 *  - no place without sources
 *  - VERIFIED requires >= 2 sources
 *  - coordinates must state their precision honestly
 *
 * Coordinates here are MODERN CITY positions, labelled `approximate`. They are
 * not surveyed fixes on historic town centres. See
 * cultural-research/dossier-003-maps-and-provenance.md §1.
 */

import type { Tier } from "./archive";

export type Precision = "exact" | "approximate";

export type PlaceSource = { title: string; publisher?: string };

export type Place = {
  id: string;
  slug: string;
  name: string;
  nameArabic: string;
  district: string;
  coordinates: { lat: number; lon: number; precision: Precision };
  /** Shown as a label only at this zoom depth or deeper. 1 = always visible. */
  depth: 1 | 2 | 3;
  tier: Tier;
  /** One line. The register is written, not dumped. */
  line: string;
  body: string[];
  sources: PlaceSource[];
  chapterSlugs: string[];
  archiveSlugs: string[];
  openQuestion?: string;
};

export const places: Place[] = [
  {
    id: "P-0001",
    slug: "al-majdal",
    name: "AL-MAJDAL",
    nameArabic: "المجدل",
    district: "Gaza",
    coordinates: { lat: 31.6749, lon: 34.575, precision: "approximate" },
    depth: 1,
    tier: "CONTESTED",
    line: "The weaving town. Around 2,000 looms. The brand is named after it.",
    body: [
      "Al-Majdal Asqalan was the primary textile and weaving centre of the Gaza District. By the 1940s roughly two thousand looms worked in the town, most of them inside private houses rather than workshops.",
      "Cloth was sold in eight-metre pieces — the length needed for one dress. A weaver took one to two months to complete a piece.",
      "The town held approximately eleven thousand people. It was taken in 1948 and its remaining residents were expelled in stages, most of them to Gaza. Accounts differ on the exact timeline. Ashkelon was founded on the site in 1949.",
      "The weavers who were driven out kept weaving. The craft still carries the name of the town: Majdalawi.",
    ],
    sources: [
      { title: "Majdalawi weaving", publisher: "Wikipedia" },
      { title: "Majdalawi Weaving", publisher: "Sunbula" },
      { title: "al-Majdal", publisher: "Palquest" },
    ],
    chapterSlugs: ["001-roots"],
    archiveSlugs: ["two-thousand-looms", "eight-metres", "taken-in-1948"],
    openQuestion:
      "The expulsion timeline is unresolved: 1948, staged to 1950, or 1951 depending on the source. No date is printed until a historian confirms it.",
  },
  {
    id: "P-0002",
    slug: "yafa",
    name: "YAFA",
    nameArabic: "يافا",
    district: "Jaffa",
    coordinates: { lat: 32.0504, lon: 34.7522, precision: "approximate" },
    depth: 1,
    tier: "VERIFIED",
    line: "The port. Citrus exported under its own name.",
    body: [
      "Yafa is one of the oldest continuously inhabited port cities on the eastern Mediterranean, and was the principal port of Palestine.",
      "Its name travelled on fruit. The Jaffa orange — shamouti — was cultivated in the surrounding groves and exported widely enough that the city's name became a commodity label in Europe.",
      "MAJDAL holds this place in the register because it is the clearest case of a Palestinian place name surviving inside global trade while the place itself was transformed.",
    ],
    sources: [
      { title: "Jaffa", publisher: "Wikipedia" },
      { title: "Jaffa geographic coordinates", publisher: "Geodatos" },
    ],
    chapterSlugs: [],
    archiveSlugs: [],
    openQuestion:
      "The citrus history is well documented in outline; MAJDAL has not yet sourced it to the standard required for a garment. Treated as register-only until it is.",
  },
  {
    id: "P-0003",
    slug: "akka",
    name: "AKKA",
    nameArabic: "عكا",
    district: "Acre",
    coordinates: { lat: 32.9278, lon: 35.0817, precision: "approximate" },
    depth: 1,
    tier: "VERIFIED",
    line: "The walled port. A UNESCO-listed old city.",
    body: [
      "Akka is a walled coastal city with an Old City recognised by UNESCO as a World Heritage site, noted for its Ottoman-era urban fabric above earlier Crusader remains.",
      "It gave its name to the Acre Sanjak, an Ottoman administrative district covering much of northern Palestine.",
    ],
    sources: [
      { title: "Acre, Israel", publisher: "Wikipedia" },
      { title: "Old City of Acre", publisher: "Wikipedia" },
    ],
    chapterSlugs: [],
    archiveSlugs: [],
  },
  {
    id: "P-0004",
    slug: "haifa",
    name: "HAIFA",
    nameArabic: "حيفا",
    district: "Haifa",
    coordinates: { lat: 32.8192, lon: 34.9992, precision: "approximate" },
    depth: 1,
    tier: "VERIFIED",
    line: "Port and rail. The city the Hejaz line reached the sea at.",
    body: [
      "Haifa sits below Mount Carmel on the bay. Under the late Ottoman and Mandate periods it grew into a major port and industrial centre, and was the Mediterranean terminus of the Hejaz railway's Haifa branch.",
      "Its Old City was substantially altered in and after 1948.",
    ],
    sources: [
      { title: "Haifa", publisher: "Wikipedia" },
      { title: "Old City of Haifa", publisher: "Wikipedia" },
    ],
    chapterSlugs: [],
    archiveSlugs: [],
  },
  {
    id: "P-0005",
    slug: "nablus",
    name: "NABLUS",
    nameArabic: "نابلس",
    district: "Nablus",
    coordinates: { lat: 32.2211, lon: 35.2608, precision: "approximate" },
    depth: 1,
    tier: "VERIFIED",
    line: "Soap and olive. The inland manufacturing city.",
    body: [
      "Nablus lies inland between Mount Ebal and Mount Gerizim. Its Old City is a dense Ottoman-era fabric of khans, hammams and soap factories.",
      "The city is closely associated with olive-oil soap manufacture, an industry built directly on the surrounding olive cultivation — which is why the olive enters MAJDAL as an economy and a material, not as an emblem.",
    ],
    sources: [
      { title: "Nablus", publisher: "Wikipedia" },
      { title: "Old City of Nablus", publisher: "Wikipedia" },
    ],
    chapterSlugs: [],
    archiveSlugs: [],
  },
  {
    id: "P-0006",
    slug: "al-quds",
    name: "AL-QUDS",
    nameArabic: "القدس",
    district: "Jerusalem",
    coordinates: { lat: 31.7683, lon: 35.2137, precision: "approximate" },
    depth: 1,
    tier: "CONTESTED",
    line: "The most contested city on earth. Held here as a place, not a claim.",
    body: [
      "Al-Quds is the Arabic name for Jerusalem. The city's status is among the most disputed political questions in the world, and MAJDAL does not adjudicate it.",
      "It appears in this register as a place with a Palestinian name and a Palestinian population, alongside the other cities in the cohort. Any further claim requires review that has not happened.",
    ],
    sources: [{ title: "Jerusalem", publisher: "Wikipedia" }],
    chapterSlugs: [],
    archiveSlugs: [],
    openQuestion:
      "This entry is deliberately minimal. What a streetwear brand should and should not say about al-Quds is a P0 question for a Palestinian reviewer, and until it is answered the record stays at one line.",
  },
];

export const getPlace = (slug: string): Place | undefined =>
  places.find((p) => p.slug === slug);

/** Register order: north to south, as a survey sheet would list them. */
export const placesByLatitude = (): Place[] =>
  [...places].sort((a, b) => b.coordinates.lat - a.coordinates.lat);
