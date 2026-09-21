export type ChapterStatus = "upcoming" | "open" | "closed";

export type Chapter = {
  slug: string;
  number: string;
  name: string;
  nameArabic?: string;
  status: ChapterStatus;
  /** One line, no adjectives. */
  premise: string;
  subject: string;
  /** The line of the core story this chapter carries. */
  storyLine: string;
  /** The documented object at the centre of the chapter. Noun, never adjective. */
  object: string;
  /** Actual first production run financed by budget — never a marketing number. */
  runSize: number;
  /** ISO date or null while unscheduled. Never fake a countdown. */
  opensAt: string | null;
  body: string[];
  productSlugs: string[];
};

export const chapters: Chapter[] = [
  {
    slug: "001-roots",
    number: "001",
    name: "ROOTS",
    nameArabic: "جذور",
    status: "upcoming",
    premise: "The town left the map. The cloth kept its name.",
    subject: "al-Majdal, its looms, and the craft that survived displacement.",
    storyLine: "They carried it.",
    object: "The cloth",
    runSize: 480,
    opensAt: null,
    body: [
      "Al-Majdal was a weaving town on the southern coast of Palestine. Through the late Ottoman and Mandate periods it became the primary textile centre of the Gaza District. When cotton production declined elsewhere, its weavers kept going by importing raw thread from Egypt, India and Europe.",
      "By the 1940s around two thousand looms were working in the town — most of them inside people's houses, not in factories. Weaving was a man's trade there, worked on a single-treadle loom. Cloth was sold in eight-metre pieces, the length needed for one dress. A piece took one to two months.",
      "The town held roughly eleven thousand people. It was taken in 1948, and its remaining residents were expelled in stages over the following years, most of them to Gaza. The textile industry was destroyed. Ashkelon was founded on the site in 1949.",
      "The weavers who were driven out kept weaving. The style they carried is still called Majdalawi — of al-Majdal. The place was removed from the map and the cloth went on carrying its name.",
      "Chapter 001 is that lineage. Four garments, 480 pieces, built heavy enough to be handed down.",
    ],
    productSlugs: ["roots-hoodie", "roots-tee", "archive-tee", "majdal-cap"],
  },
  {
    slug: "002-sabr",
    number: "002",
    name: "SABR",
    nameArabic: "صبر",
    status: "upcoming",
    premise: "The word for patience is also the word for the cactus.",
    subject:
      "The cactus that still marks the sites of depopulated Palestinian villages.",
    storyLine: "We carry it.",
    object: "The cactus",
    runSize: 0,
    opensAt: null,
    body: [
      "Sabr (صبر) is the Arabic word for patience. It is also what the prickly pear cactus is called.",
      "The cactus was planted as field boundaries and fences. It is still standing. At the sites of depopulated Palestinian villages — and sources describe efforts to conceal the ruins of more than five hundred of them — the cactus rows remain, rooted deep enough to outlast the attempt, marking where those villages stood.",
      "There is a proverb for it: saber as-sabbar. The patience of the cactus.",
      "Al-Majdal is one of those depopulated places. Chapter 001 is the cloth that kept the name. Chapter 002 is the plant that kept the place. That is not a connection we constructed for a campaign — it is the same landscape.",
      "The cactus is also claimed as a symbol by others, in Hebrew as sabra, for native-born Israelis. We state the Palestinian meaning we are working with and we do not pretend the symbol is uncontested.",
    ],
    productSlugs: [],
  },
  {
    slug: "003-baladi",
    number: "003",
    name: "BALADI",
    nameArabic: "بلدي",
    status: "upcoming",
    premise: "The word for heirloom seed means \u201cmy country\u201d.",
    subject:
      "Palestinian heirloom seeds, saved by one generation and replanted by the next.",
    storyLine: "The next generation carries it forward.",
    object: "The seed",
    runSize: 0,
    opensAt: null,
    body: [
      "Baladi (بلدي) is the term for heirloom seed. It translates directly as \u201cmy country\u201d.",
      "In 2014 Vivien Sansour, a Palestinian writer, artist and agricultural conservationist, founded the Palestine Heirloom Seed Library in Battir, a UNESCO World Heritage site. It began with a request to her community for seeds to grow baladi bandora \u2014 \u201cmy country\u2019s tomatoes\u201d \u2014 a drought-resistant heirloom adapted to the region.",
      "The collection holds varieties with their own names: Abu Samara wheat, Bamyeh okra, Bitinjan Battiri eggplant, Jadu\u2019i watermelon, Silq Baladi chard. Seeds developed over generations of cultivation, from the westernmost arc of the Fertile Crescent.",
      "A seed is the most precise object for what this brand is about. It is the actual mechanism by which one generation hands the next something that can grow.",
      "This chapter is not designed yet, and it will not be until we have asked whether it is ours to make. The seed library is somebody else\u2019s work and we will not borrow its name.",
    ],
    productSlugs: [],
  },
];

export const getChapter = (slug: string): Chapter | undefined =>
  chapters.find((c) => c.slug === slug);

/**
 * The chapter the site leads with. Resolved once, with an explicit guard so a
 * a typo in `chapters` fails the build rather than rendering "undefined" into
 * the hero. There is always at least one chapter.
 */
function resolveCurrentChapter(): Chapter {
  const open = chapters.find((c) => c.status === "open");
  const upcoming = chapters.find((c) => c.status === "upcoming");
  const current = open ?? upcoming ?? chapters[0];
  if (!current) {
    throw new Error("content/chapters.ts: at least one chapter is required");
  }
  return current;
}

export const currentChapter: Chapter = resolveCurrentChapter();
