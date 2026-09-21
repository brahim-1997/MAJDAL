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
