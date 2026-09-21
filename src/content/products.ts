/**
 * Product catalogue.
 *
 * `colourway.clearedForProduction` gates the documented Majdalawi fabric names.
 * A colourway whose name comes from a weaver's phrase may NOT go to print until
 * the P0 reviews in cultural-research/REVIEWS.md are answered. The UI reads this
 * flag — it does not decide for itself.
 */

export type ProductStatus = "coming" | "available" | "sold-out" | "closed";

export type Colourway = {
  name: string;
  /** Arabic source term, where documented. */
  arabic?: string;
  /** What the documented source says the fabric was — never invented. */
  documentedMeaning: string;
  /** Plain description of what the garment actually looks like. */
  appliedAs: string;
  /** False until a named reviewer clears the name. Gates display of the name. */
  clearedForProduction: boolean;
};

export type Product = {
  slug: string;
  name: string;
  /** Short editorial line. */
  line: string;
  chapterSlug: string;
  status: ProductStatus;
  /** Minor units (cents) to avoid float money. */
  priceCents: number;
  currency: "EUR";
  /** Counts toward the 15% impact commitment. */
  impactEligible: boolean;
  colourway: Colourway;
  spec: { label: string; value: string }[];
  sizes: string[];
  notes: string[];
  /** Placeholder slots — real photography pending. */
  imageCount: number;
};

export const products: Product[] = [
  {
    slug: "roots-hoodie",
    name: "ROOTS COLOUR-BLOCK HOODIE",
    line: "Loom logic on the body: woven bands rebuilt as panels.",
    chapterSlug: "001-roots",
    status: "coming",
    priceCents: 14500,
    currency: "EUR",
    impactEligible: true,
    colourway: {
      name: "IKHDARI",
      arabic: "إخضري",
      documentedMeaning:
        "One of the three major fabrics woven in al-Majdal: bands of red and green. Used for festival dresses across southern Palestine.",
      appliedAs:
        "Deep olive body, dark red chest and sleeve band, washed black hood and cuffs. The band sits where the woven stripe sat.",
      clearedForProduction: true,
    },
    spec: [
      { label: "Weight", value: "480 GSM loopback cotton" },
      { label: "Fibre", value: "100% cotton, combed, ring-spun" },
      { label: "Fit", value: "Oversized. Dropped shoulder, boxy body" },
      { label: "Construction", value: "Colour-blocked panels, flatlock seams" },
      { label: "Detail", value: "Woven 48 label at inner neck" },
      { label: "Finish", value: "Garment-washed for a dry, broken hand" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    notes: [
      "Colour-blocking follows the band structure of Majdalawi cloth rather than printing an image of it. The reference is in the construction.",
      "Run of 480 across Chapter 001. No restock of a closed chapter.",
    ],
    imageCount: 4,
  },
  {
    slug: "roots-tee",
    name: "ROOTS HEAVYWEIGHT TEE",
    line: "The plain one. Built to outlive the chapter.",
    chapterSlug: "001-roots",
    status: "coming",
    priceCents: 6500,
    currency: "EUR",
    impactEligible: true,
    colourway: {
      name: "JILJILEH",
      arabic: "جلجلة",
      documentedMeaning:
        "A documented al-Majdal fabric woven with dark red bands.",
      appliedAs:
        "Washed black body with a single dark red band across the back yoke.",
      clearedForProduction: true,
    },
    spec: [
      { label: "Weight", value: "260 GSM single jersey" },
      { label: "Fibre", value: "100% cotton, combed, ring-spun" },
      { label: "Fit", value: "Oversized, boxy. Ribbed collar, twin-needle hems" },
      { label: "Detail", value: "48 at left hem. Woven label at side seam" },
      { label: "Finish", value: "Enzyme-washed, pre-shrunk" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    notes: ["Run of 480 across Chapter 001."],
    imageCount: 3,
  },
  {
    slug: "archive-tee",
    name: "ARCHIVE TEE",
    line: "The record, printed as a record.",
    chapterSlug: "001-roots",
    status: "coming",
    priceCents: 6000,
    currency: "EUR",
    impactEligible: true,
    colourway: {
      name: "MALAK",
      arabic: "ملك",
      documentedMeaning:
        "Recorded as one of the three major al-Majdal fabrics: silk.",
      appliedAs:
        "Off-white body, washed black print, with turquoise and fuchsia hairlines — the silk threads documented in Majdalawi cloth, used at the smallest possible scale.",
      clearedForProduction: true,
    },
    spec: [
      { label: "Weight", value: "260 GSM single jersey" },
      { label: "Fibre", value: "100% cotton, combed, ring-spun" },
      { label: "Fit", value: "Oversized, boxy" },
      { label: "Print", value: "Water-based screen print, 4 colours, soft hand" },
      { label: "Front", value: "MAJDAL wordmark, Latin and Arabic, stacked" },
      { label: "Back", value: "Archive card: the record of al-Majdal, set as data" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    notes: [
      "Back print is typeset from the dossier, not paraphrased. Sources credited on the inner label.",
      "No coordinates are printed on this garment. The surveyed position of the historic town centre is not yet verified, and an approximate figure would be a fabrication. See cultural-research/al-majdal-dossier.md §2.",
    ],
    imageCount: 4,
  },
  {
    slug: "majdal-cap",
    name: "MAJDAL CAP",
    line: "Wordmark, two scripts, equal weight.",
    chapterSlug: "001-roots",
    status: "coming",
    priceCents: 5000,
    currency: "EUR",
    impactEligible: true,
    colourway: {
      name: "INDIGO GROUND",
      documentedMeaning:
        "Not a fabric name. Majdalawi cloth is documented as black and indigo cotton cut with fuchsia and turquoise silk; this is a direct reference to that ground, named plainly rather than borrowing a weaver's term.",
      appliedAs: "Indigo crown, washed black brim, off-white embroidery.",
      clearedForProduction: true,
    },
    spec: [
      { label: "Construction", value: "6-panel, structured, mid-profile" },
      { label: "Fabric", value: "Heavy brushed cotton twill" },
      { label: "Front", value: "مجدل embroidered, flat stitch" },
      { label: "Side", value: "48, small, single colour" },
      { label: "Closure", value: "Woven strap, metal clasp" },
    ],
    sizes: ["One size"],
    notes: [
      "Arabic embroidery is blocked pending native-speaker review of the wordmark (P0 in cultural-research/REVIEWS.md).",
    ],
    imageCount: 3,
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const productsInChapter = (chapterSlug: string): Product[] =>
  products.filter((p) => p.chapterSlug === chapterSlug);

export const formatPrice = (cents: number, currency: Product["currency"]): string =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
