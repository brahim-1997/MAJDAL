export const site = {
  name: "MAJDAL",
  nameArabic: "مجدل",
  community: "THE ROOTS",
  code: "48",
  philosophy: "ROOTED IN HISTORY. BUILT FOR TOMORROW.",
  /** Update to the real domain before launch; used for canonical URLs + sitemap. */
  url: "https://majdal.studio",
  description:
    "MAJDAL is a contemporary streetwear house descended from al-Majdal — the weaving town that was the textile centre of the Gaza District until 1948. Heavyweight garments, documented craft, transparent impact.",
  impactPercent: 15,
  tagline: "EVERY PLACE HAS A MEMORY.",
  /**
   * al-Majdal Asqalan. Modern city position, approximate — NOT a surveyed fix
   * on the historic town centre. The supplied logo sheet carried
   * 32.3030 N / 34.7875 E, which is ~70km north and wrong.
   * See brand/IDENTITY-LOGO.md §1.1.
   */
  origin: { lat: 31.67, lon: 34.58, label: "31.67° N  34.58° E · approx." },
  story: ["They carried it.", "We carry it.", "The next generation carries it forward."],
} as const;

export type NavItem = { href: string; label: string; index: string };

export const nav: NavItem[] = [
  { href: "/", label: "Home", index: "00" },
  { href: "/map", label: "The Land", index: "01" },
  { href: "/story", label: "Story", index: "02" },
  { href: "/chapters", label: "Chapters", index: "03" },
  { href: "/archive", label: "Archive", index: "04" },
  { href: "/roots", label: "The Roots", index: "05" },
  { href: "/shop", label: "Shop", index: "06" },
  { href: "/impact", label: "Impact", index: "07" },
];
