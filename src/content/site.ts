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
  story: ["They carried it.", "We carry it.", "The next generation carries it forward."],
} as const;

export type NavItem = { href: string; label: string; index: string };

export const nav: NavItem[] = [
  { href: "/", label: "Home", index: "00" },
  { href: "/story", label: "Story", index: "01" },
  { href: "/chapters", label: "Chapters", index: "02" },
  { href: "/archive", label: "Archive", index: "03" },
  { href: "/roots", label: "The Roots", index: "04" },
  { href: "/shop", label: "Shop", index: "05" },
  { href: "/impact", label: "Impact", index: "06" },
];
