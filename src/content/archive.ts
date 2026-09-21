/**
 * THE MAJDAL ARCHIVE.
 *
 * Every entry carries its evidence tier and its sources. `tier` mirrors
 * cultural-research/PROTOCOL.md and is rendered on the page — the reader can
 * always see whether they are reading the record or our reading of it.
 */

export type Tier = "VERIFIED" | "CONTESTED" | "INTERPRETATION";

/** What kind of record this is. Drives filtering and the archive ID prefix. */
export type Category =
  | "PLACE"
  | "OBJECT"
  | "TEXTILE"
  | "PHOTOGRAPH"
  | "DOCUMENT"
  | "MEMORY"
  | "STORY"
  | "COMMUNITY";

export const CATEGORIES: Category[] = [
  "PLACE",
  "OBJECT",
  "TEXTILE",
  "PHOTOGRAPH",
  "DOCUMENT",
  "MEMORY",
  "STORY",
  "COMMUNITY",
];

/**
 * Rights on any asset attached to a record. Required, because an asset with
 * no known rights cannot be published — see cultural-research/PROTOCOL.md.
 */
export type Rights = {
  status: "cleared" | "public-domain" | "permission-pending" | "none-held";
  holder?: string;
  note?: string;
};

export type ArchiveEntry = {
  slug: string;
  index: string;
  title: string;
  titleArabic?: string;
  /** Period or date the entry concerns. */
  period: string;
  category: Category;
  /** Place the record concerns. Links to the map register where one exists. */
  location: string;
  /** Map place slug, when this record belongs to a place on the register. */
  placeSlug?: string;
  tier: Tier;
  summary: string;
  body: string[];
  sources: string[];
  tags: string[];
  /** Named contributor, where a person gave this. Undefined = MAJDAL research. */
  contributor?: string;
  /** Rights on attached media. No media yet, so none-held is the honest state. */
  rights: Rights;
  chapterSlugs: string[];
  /** Set when the record is genuinely unresolved. Rendered as an open question. */
  openQuestion?: string;
};

export const archive: ArchiveEntry[] = [
  {
    slug: "two-thousand-looms",
    index: "A001",
    title: "TWO THOUSAND LOOMS",
    period: "Late Ottoman period – 1940s",
    category: "TEXTILE",
    location: "AL-MAJDAL",
    placeSlug: "al-majdal",
    tags: ["looms", "industry", "gaza district"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "TEXTILE",
    location: "AL-MAJDAL",
    placeSlug: "al-majdal",
    tags: ["cloth", "labour", "thobe"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "TEXTILE",
    location: "AL-MAJDAL",
    placeSlug: "al-majdal",
    tags: ["malak", "ikhdari", "jiljileh", "naming"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "TEXTILE",
    location: "AL-MAJDAL",
    placeSlug: "al-majdal",
    tags: ["colour", "silk", "indigo"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "PLACE",
    location: "AL-MAJDAL",
    placeSlug: "al-majdal",
    tags: ["1948", "expulsion", "ashkelon"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "TEXTILE",
    location: "GAZA",
    tags: ["majdalawi", "survival", "diaspora"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "STORY",
    location: "PALESTINE",
    tags: ["48", "continuity", "naming"],
    chapterSlugs: ["001-roots"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
    category: "TEXTILE",
    location: "PALESTINE",
    tags: ["tatreez", "embroidery", "unesco"],
    chapterSlugs: [],
    rights: { status: "none-held", note: "No media attached to this record yet." },
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
  {
    slug: "sumud",
    index: "A009",
    title: "SUMUD",
    titleArabic: "صمود",
    period: "1920s – present",
    category: "STORY",
    location: "PALESTINE",
    tags: ["sumud", "steadfastness", "land"],
    chapterSlugs: ["002-sabr"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
    tier: "VERIFIED",
    summary:
      "Steadfastness. The documented Palestinian concept of resistance as remaining present on the land. It does not translate cleanly.",
    body: [
      "Sumud is usually rendered in English as steadfastness or steadfast perseverance. Sources agree that neither word carries its full weight. It describes everyday, largely nonviolent resistance centred on remaining present on the land.",
      "The term entered political discourse as a national symbol in the 1960s and became a formal strategic concept in the 1970s and 80s. In 1978 the PLO recommended sumud as a way of helping people remain in Palestine. Its practice is traced back further, to resistance during the 1920s and 30s.",
      "Scholarship describes it not as a fixed definition but as a continuum of practices responsive to changing conditions — broadly, the actions people take against politics of erasure.",
      "The weavers of al-Majdal who were expelled and kept weaving are an instance of this. We did not have to stretch the definition to reach them.",
      "MAJDAL does not print this word on a garment. It is a serious political term with a specific history, not a word to use because it sounds good.",
    ],
    sources: [
      "Palquest — Sumud",
      "Institute for Palestine Studies — To Exist Is To Resist: Sumud, Heroism, and the Everyday",
      "Wikipedia — Sumud",
      "Journal of Holy Land and Palestine Studies (2025)",
    ],
  },
  {
    slug: "the-patience-of-the-cactus",
    index: "A010",
    title: "THE PATIENCE OF THE CACTUS",
    titleArabic: "صبر",
    period: "1948 – present",
    category: "PLACE",
    location: "PALESTINE",
    tags: ["sabr", "cactus", "village sites"],
    chapterSlugs: ["002-sabr"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
    tier: "VERIFIED",
    summary:
      "Sabr is the Arabic word for patience. It is also the word for the prickly pear cactus, which still stands at the sites of depopulated villages.",
    body: [
      "The prickly pear is known colloquially as sabr — the same word as patience, or endurance.",
      "It was planted as field boundaries and fences. It is still standing. Sources describe efforts to conceal the ruins of more than five hundred depopulated Palestinian villages; the cactus, rooted deep, persisted through them and still shows where those villages stood.",
      "There is a proverb: saber as-sabbar. The patience of the cactus.",
      "Al-Majdal is one of those depopulated places. The cloth kept the name and the plant kept the place.",
    ],
    sources: [
      "The Avery Review — صَبْر: Patience as Resistance",
      "Middle East Eye — Olive tree, za'atar, cactus",
      "Dazed MENA — Al-Wah'at Collective",
    ],
    openQuestion:
      "The same plant is claimed as a symbol by others — in Hebrew as sabra, for native-born Israelis. We state the Palestinian meaning we work with and do not present the symbol as uncontested. Whether it is appropriate for MAJDAL to use at all is with reviewers.",
  },
  {
    slug: "baladi-my-country",
    index: "A011",
    title: "BALADI — MY COUNTRY",
    titleArabic: "بلدي",
    period: "2014 – present",
    category: "OBJECT",
    location: "BATTIR",
    tags: ["seeds", "baladi", "agriculture"],
    chapterSlugs: ["003-baladi"],
    rights: { status: "none-held", note: "No media attached to this record yet." },
    tier: "VERIFIED",
    summary:
      "The Palestinian word for heirloom seed translates directly as \u201cmy country\u201d. Seeds saved by one generation, replanted by the next.",
    body: [
      "Baladi is the term for heirloom seeds. It translates directly as \u201cmy country\u201d.",
      "In 2014 Vivien Sansour — a Palestinian writer, artist and agricultural conservationist — founded the Palestine Heirloom Seed Library in the village of Battir, a UNESCO World Heritage site. It began when she asked her community for seeds to grow baladi bandora, \u201cmy country\u2019s tomatoes\u201d, a drought-resistant heirloom adapted to the region.",
      "The collection holds named varieties: Abu Samara wheat, Bamyeh okra, Bandura Baladiye tomato, Bitinjan Battiri eggplant, Fakous, Jadu\u2019i watermelon, Jarjeer, Kousa, Molokhia, Sabanikh, Silq Baladi chard, Yakteen gourd. Seeds carrying generations of cultivation from the westernmost arc of the Fertile Crescent.",
      "Stewardship now extends into the diaspora, with the stated hope of returning the varieties home.",
      "This is the most precise available answer to what it means for a generation to carry something forward. It is also somebody else\u2019s work, and MAJDAL will not use it without asking first.",
    ],
    sources: [
      "The Jerusalem Fund — Baladi, Palestinian Heirloom Seeds as a Subversive Archive (2026)",
      "Palestine Heirloom Seed Library / viviensansour.com",
      "Organic Seed Alliance (2025)",
      "Wikipedia — Vivien Sansour",
    ],
  },
  {
    slug: "the-olive-and-the-key",
    index: "A012",
    title: "THE OLIVE AND THE KEY",
    period: "1948 – present",
    category: "OBJECT",
    location: "PALESTINE",
    tags: ["olive", "key", "symbols"],
    chapterSlugs: [],
    rights: { status: "none-held", note: "No media attached to this record yet." },
    tier: "CONTESTED",
    summary:
      "Two of the most reproduced Palestinian symbols. MAJDAL keeps both out of product on purpose.",
    body: [
      "Families customarily pass olive trees down to children and grandchildren, entrusting the next generation with their care. Popular coverage often adds that some Palestinian olive trees are nearly five thousand years old; individual ages of that order are hard to verify, so we do not repeat a number.",
      "During the Nakba an estimated 750,000 Palestinians were displaced. Many took their house keys with them, expecting to return. The key — miftah — has become a representation of the right of return.",
      "Both are real and both matter. Both are also among the most reproduced images in Palestinian-themed merchandise, which is precisely the category MAJDAL exists outside of. An olive tree logo is the most predictable move available to this brand, and it is banned in our design system.",
      "So the olive enters MAJDAL as colour — deep olive, already in the palette — and as the idea of inheritance. The key stays in the archive. If it ever appears it will be a photograph of one family\u2019s actual key, with their consent and their story attached, never a decorative icon.",
    ],
    sources: [
      "Middle East Eye — Olive tree, za'atar, cactus",
      "Wikipedia — List of national symbols of Palestine",
      "Days of Palestine",
    ],
    openQuestion:
      "Whether keeping the key out of product reads as restraint or as avoidance of the right of return is a question for a Palestinian reviewer, not for us.",
  },
];

export const getArchiveEntry = (slug: string): ArchiveEntry | undefined =>
  archive.find((e) => e.slug === slug);
