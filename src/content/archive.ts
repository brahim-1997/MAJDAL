/**
 * THE MAJDAL ARCHIVE.
 *
 * Every entry carries its evidence tier and its sources. `tier` mirrors
 * cultural-research/PROTOCOL.md and is rendered on the page — the reader can
 * always see whether they are reading the record or our reading of it.
 */

export type Tier = "VERIFIED" | "CONTESTED" | "INTERPRETATION";

export type ArchiveEntry = {
  slug: string;
  index: string;
  title: string;
  titleArabic?: string;
  /** Period or date the entry concerns. */
  period: string;
  tier: Tier;
  summary: string;
  body: string[];
  sources: string[];
  /** Set when the record is genuinely unresolved. Rendered as an open question. */
  openQuestion?: string;
};

export const archive: ArchiveEntry[] = [
  {
    slug: "two-thousand-looms",
    index: "A001",
    title: "TWO THOUSAND LOOMS",
    period: "Late Ottoman period – 1940s",
    tier: "VERIFIED",
    summary:
      "Al-Majdal was the primary textile and weaving centre of the Gaza District. By the 1940s around 2,000 looms were working in the town.",
    body: [
      "Through the late Ottoman and British Mandate periods, al-Majdal became the dominant weaving town of the Gaza District. Cotton production was declining elsewhere in Palestine; al-Majdal's weavers kept their industry running by importing raw thread from Egypt, India and Europe.",
      "By the 1940s roughly two thousand looms were operating. They were frequently installed inside private houses rather than in workshops — the town's industry ran through its homes.",
      "Cloth from al-Majdal was worn across the south of Palestine. This is the fact the brand is built on: the town MAJDAL is named after was a town that made cloth.",
    ],
    sources: [
      "Wikipedia — Majdalawi weaving",
      "Sunbula — Majdalawi Weaving",
      "The Jerusalem Fund — From al-Majdal to Exile (2026)",
    ],
  },
  {
    slug: "eight-metres",
    index: "A002",
    title: "EIGHT METRES",
    period: "Traditional practice",
    tier: "VERIFIED",
    summary:
      "Cloth was sold in eight-metre pieces — the length needed for a single thobe. One piece took a weaver one to two months.",
    body: [
      "Weaving in al-Majdal was a man's trade, worked on a single-treadle loom. The cloth was mostly cotton and wool based and characteristically striped.",
      "It was commonly sold in eight-metre pieces, the quantity required for one dress. A weaver needed one to two months to complete a piece.",
      "Two months of a person's work for one garment. That is the standard MAJDAL measures its own products against — not the price, the intention to last.",
    ],
    sources: ["Wikipedia — Majdalawi weaving", "Sunbula — Majdalawi Weaving"],
  },
  {
    slug: "the-named-cloths",
    index: "A003",
    title: "THE NAMED CLOTHS",
    titleArabic: "الأقمشة",
    period: "Traditional practice",
    tier: "VERIFIED",
    summary:
      "The weavers of al-Majdal named their fabrics. Malak — silk. Ikhdari — bands of red and green. Jiljileh — dark red bands. And others: heaven and hell, breath of the soul, father of two hundred.",
    body: [
      "Three major fabrics are documented: malak (ملك), silk; ikhdari (إخضري), bands of red and green; and jiljileh (جلجلة), dark red bands. These were used for festival dresses throughout southern Palestine.",
      "Many other fabrics carried poetic names. Ji'nneh u nar (جنة ونار) — heaven and hell. Nasheq rohoh — breath of the soul. Abu mitayn — father of two hundred.",
      "MAJDAL names its colourways after these cloths, states where each name comes from, and only uses a name where the garment's colours honestly reference the documented fabric. The weavers named their work better than any brand could. We are not going to improve on it.",
    ],
    sources: [
      "Wikipedia — Majdalawi weaving",
      "Birzeit University Museum — Palestinian Costumes",
      "Sunbula — Majdalawi Weaving",
    ],
    openQuestion:
      "Whether the poetic names are appropriate for commercial use at all is under review. Until a named Palestinian reviewer answers that, MAJDAL uses only the three descriptive fabric names.",
  },
  {
    slug: "black-indigo-fuchsia-turquoise",
    index: "A004",
    title: "BLACK, INDIGO, FUCHSIA, TURQUOISE",
    period: "Traditional practice",
    tier: "VERIFIED",
    summary:
      "Majdalawi cloth is documented as black and indigo cotton combined with fuchsia and turquoise silk — a bold stripe with a sheen.",
    body: [
      "The documented Majdalawi palette is not muted. Black and indigo cotton grounds, cut with fuchsia and turquoise silk thread. The result is a bold striped textile, durable, with a characteristic sheen.",
      "This is why MAJDAL's accent colours are fuchsia and turquoise, and why they are used at the scale of a thread rather than a field. They are a citation, not a trend.",
    ],
    sources: [
      "Handmade Palestine — Majdalawi Fabric",
      "Sunbula — Majdalawi Weaving",
    ],
  },
  {
    slug: "taken-in-1948",
    index: "A005",
    title: "TAKEN IN 1948",
    period: "1948 – c.1950",
    tier: "CONTESTED",
    summary:
      "Al-Majdal held around 11,000 people. It was taken in 1948 and its remaining residents were expelled in stages, most to Gaza. Accounts of the exact timeline differ.",
    body: [
      "Al-Majdal's population was approximately eleven thousand. The town was taken in 1948 and its textile industry destroyed.",
      "Accounts differ on the timeline that followed. Several sources describe forcible expulsion in 1948 during the Nakba. At least one dates the depopulation to 1951. The wider record describes the town being taken in late 1948, with the remaining Palestinian residents confined and then expelled in stages, the last transfers to the Gaza Strip completed around 1950.",
      "MAJDAL does not resolve this with a single confident date. The disagreement is part of the record, and flattening it would be the same carelessness that produced the gap in the first place.",
      "Ashkelon was founded on the site in 1949, about four kilometres inland from ancient Ascalon.",
    ],
    sources: [
      "Wikipedia — Majdalawi weaving",
      "Wikipedia — Majdal",
      "Wikipedia — Ashkelon",
      "Palquest — al-Majdal",
    ],
    openQuestion:
      "The precise expulsion timeline is an open question for external review. No date will be printed on a garment until a Palestinian historian confirms it.",
  },
  {
    slug: "the-cloth-kept-the-name",
    index: "A006",
    title: "THE CLOTH KEPT THE NAME",
    period: "1948 – present",
    tier: "VERIFIED",
    summary:
      "The weavers who were expelled kept weaving. The style is still called Majdalawi — of al-Majdal.",
    body: [
      "After al-Majdal was depopulated, former residents continued to produce the same style of weaving in the Gaza Strip and elsewhere.",
      "The craft carries the name of the town that was removed from the map. Majdalawi: of al-Majdal.",
      "Machine-made imports later flooded the market, handmade cloth became comparatively expensive, demand fell. In the 1990s the Palestinian Authority attempted to revive the tradition in Gaza. A very small number of weavers still work in it; accounts of exactly how many differ, and we will not publish a figure we cannot stand behind.",
      "This entry is the reason the brand exists, and it is documented history rather than a slogan: the place was erased and the name survived in the cloth.",
    ],
    sources: [
      "Wikipedia — Majdalawi weaving",
      "The Jerusalem Fund — From al-Majdal to Exile (2026)",
      "Nol Collective — interview with a Gaza weaver",
      "Al Rawiya — On Heritage and Heartache",
    ],
    openQuestion:
      "How many weavers continue the practice today, and under what conditions, is not something we can state reliably.",
  },
  {
    slug: "why-48",
    index: "A007",
    title: "WHY 48",
    titleArabic: "عرب ٤٨",
    period: "1948 – present",
    tier: "VERIFIED",
    summary:
      "Palestinians who remained inside the 1949 armistice line are colloquially known as 48 Arabs — عرب ٤٨. The 48 refers to 1948.",
    body: [
      "The term is already in use by Palestinians for Palestinians: 48 Arabs, عرب ٤٨. It refers to 1948. In repeated surveys a majority of those it describes self-identify as Palestinian.",
      "MAJDAL uses 48 as a mark of continuity — the people who stayed, the people who were driven out, and the cloth that kept its name.",
      "It is not a puzzle and it is not mysticism. Asked what it means, the answer is one sentence: 1948, and everyone who has carried this since.",
    ],
    sources: [
      "Wikipedia — Arab citizens of Israel",
      "Wikipedia — Green Line (Israel)",
    ],
  },
  {
    slug: "tatreez-is-a-different-craft",
    index: "A008",
    title: "TATREEZ IS A DIFFERENT CRAFT",
    period: "Traditional practice – 2021",
    tier: "VERIFIED",
    summary:
      "Palestinian embroidery was inscribed by UNESCO on 15 December 2021. It is a distinct practice from Majdalawi weaving and MAJDAL does not merge the two.",
    body: [
      "Tatreez is cross-stitch embroidery, traditionally made and worn in rural Palestine. Patterns and colours historically indicated the wearer's regional origin, social standing and marital status — a visual language carried on clothing.",
      "On 15 December 2021, at the 16th session of the Intergovernmental Committee for the Safeguarding of the Intangible Cultural Heritage, UNESCO inscribed the art of embroidery in Palestine on the Representative List of the Intangible Cultural Heritage of Humanity.",
      "Tatreez and Majdalawi weaving are not the same thing. Different practice, different tools, different regions — and where embroidery was women's work, weaving in al-Majdal was a men's trade. Collapsing them into one story would be the exact error MAJDAL exists to avoid.",
      "MAJDAL uses original geometry built on the cross-stitch grid. We do not copy a regional motif, and we do not assign meanings to motifs that our sources do not assign.",
    ],
    sources: [
      "UNESCO ICH inscription, 16th session, 15 December 2021",
      "Wikipedia — Tatreez",
      "CNN — Tatreez explained (2026)",
    ],
    openQuestion:
      "Popular coverage often describes tatreez as 3,000 years old. Embroidery in the region is ancient, but the continuity of this specific practice over three millennia is not something we can source rigorously, so MAJDAL does not repeat the claim.",
  },
];

export const getArchiveEntry = (slug: string): ArchiveEntry | undefined =>
  archive.find((e) => e.slug === slug);
