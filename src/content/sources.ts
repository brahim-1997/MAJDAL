/**
 * ARCHIVE SOURCES — real objects in real collections.
 *
 * Every photograph and map sheet the site can show is listed here with its
 * catalogue record, holder and rights statement, copied from the holding
 * institution — never paraphrased into something it does not say.
 *
 * `file` is where the asset lives once it is on file. The site checks at build
 * time whether that file exists in /public: if it does, the image is shown;
 * if not, the frame is shown EMPTY with the catalogue record and a link to
 * the object at its holder. We never substitute a different image, never
 * "age" one, and never generate one.
 *
 * An asset with a `hold` is never shown, on file or not, until the review it
 * names is answered — the survey sheets are held under dossier 003's P0s.
 *
 * Status on 2026-09-27: none of these files are on file yet — the build
 * environment could not reach the holding institutions. See
 * cultural-research/SOURCES.md §Archive assets for how to add them.
 */

export type SourceKind = "photograph" | "map";

export type ArchiveSource = {
  id: string;
  kind: SourceKind;
  /** Title exactly as catalogued by the holder. */
  title: string;
  /** What the holder says the object shows. */
  description: string;
  creator: string;
  /** Date as catalogued. */
  date: string;
  place: string;
  holder: string;
  /** Holder's reference or reproduction number. */
  reference: string;
  url: string;
  /** Rights statement as given by the holder, or the platform that publishes it. */
  rights: string;
  /** Path under /public. */
  file: string;
  /** Width / height of the object, for layout before the file exists. */
  aspect: number;
  /** Anything we have not yet confirmed about this record. */
  toConfirm?: string;
  /** A note on the catalogue record itself — e.g. wording that is the
   *  photographer's, not ours. Printed wherever the title is. */
  titleNote?: string;
  /** If set, the asset is ON HOLD: not shown even when the file is present,
   *  until the named review in cultural-research/REVIEWS.md is answered. */
  hold?: string;
};

export const SOURCES: ArchiveSource[] = [
  {
    id: "loc-matpc-19868",
    kind: "photograph",
    title: "Majdel village & its primitive weaving. A native weaving establishment",
    description: "Men working at looms in the town of al-Majdal (al-Majdal Asqalan).",
    creator: "American Colony (Jerusalem). Photo Department",
    date: "1934–1939",
    place: "al-Majdal Asqalan",
    holder: "Library of Congress, Prints & Photographs Division — G. Eric and Edith Matson Photograph Collection",
    reference: "LC-DIG-matpc-19868",
    url: "https://www.loc.gov/resource/matpc.19868",
    rights: "No known restrictions on publication (Library of Congress rights advisory)",
    file: "/archive/loc-matpc-19868.jpg",
    aspect: 5 / 4,
    titleNote: "Title as catalogued. \u201cPrimitive\u201d is the 1930s photographer\u2019s word, not ours.",
  },
  {
    id: "loc-matpc-19871",
    kind: "photograph",
    title: "Majdel village & its primitive weaving. A native weaving establishment, closer",
    description: "A man working at a loom in the town of al-Majdal (al-Majdal Asqalan).",
    creator: "American Colony (Jerusalem). Photo Department",
    date: "1934–1939",
    place: "al-Majdal Asqalan",
    holder: "Library of Congress, Prints & Photographs Division — G. Eric and Edith Matson Photograph Collection",
    reference: "LC-DIG-matpc-19871",
    url: "https://www.loc.gov/resource/matpc.19871",
    rights: "No known restrictions on publication (Library of Congress rights advisory)",
    file: "/archive/loc-matpc-19871.jpg",
    aspect: 5 / 4,
    titleNote: "Title as catalogued. \u201cPrimitive\u201d is the 1930s photographer\u2019s word, not ours.",
  },
  {
    id: "loc-matpc-19865",
    kind: "photograph",
    title: "Majdel village & its primitive weaving. Majdel market showing town mosque",
    description: "The market of al-Majdal, with the town mosque.",
    creator: "American Colony (Jerusalem). Photo Department",
    date: "1934–1939",
    place: "al-Majdal Asqalan",
    holder: "Library of Congress, Prints & Photographs Division — G. Eric and Edith Matson Photograph Collection",
    reference: "LC-DIG-matpc-19865",
    url: "https://www.loc.gov/resource/matpc.19865",
    rights: "No known restrictions on publication (Library of Congress rights advisory)",
    file: "/archive/loc-matpc-19865.jpg",
    aspect: 5 / 4,
    titleNote: "Title as catalogued. \u201cPrimitive\u201d is the 1930s photographer\u2019s word, not ours.",
  },
  {
    id: "pom-al-majdal",
    kind: "map",
    title: "[Al Majdal] Survey of Palestine",
    description:
      "Survey of Palestine sheet covering al-Majdal, published on Palestine Open Maps; also catalogued by the National Library of Israel.",
    creator: "Survey of Palestine",
    date: "1940s",
    place: "al-Majdal and surrounding villages, Gaza District",
    holder: "Palestine Open Maps (Visualizing Palestine / Columbia GSAPP Studio-X Amman)",
    reference: "palopenmaps.org/en/maps/al-majdal-gaza",
    url: "https://palopenmaps.org/en/maps/al-majdal-gaza",
    rights: "Public domain — as stated by Palestine Open Maps for its 1940s survey sheets",
    file: "/archive/maps/pom-al-majdal.jpg",
    aspect: 1,
    toConfirm: "Exact sheet scale and survey year, from the sheet margin once on file.",
    hold: "Dossier 003 P0: counsel to confirm the rights in the map and in this scan; a Palestinian reviewer to answer whether MAJDAL should use this survey at all.",
  },
  {
    id: "pef-swp-1880",
    kind: "map",
    title: "Map of Western Palestine in 26 sheets — sheet covering Askalan and el Mejdel",
    description:
      "Survey of Western Palestine, conducted for the Palestine Exploration Fund by C. R. Conder and H. H. Kitchener. Scale 1:63,360.",
    creator: "Palestine Exploration Fund — C. R. Conder, H. H. Kitchener",
    date: "1880",
    place: "Coastal plain, Gaza to Esdud",
    holder: "Wikimedia Commons (scans of the 1880 sheets)",
    reference: "Survey of Western Palestine 1880",
    url: "https://commons.wikimedia.org/wiki/Category:Survey_of_Western_Palestine",
    rights: "Public domain (published 1880)",
    file: "/archive/maps/pef-swp-1880.jpg",
    aspect: 1.3,
    toConfirm: "Sheet number (volume III covers sheets XVII–XXVI) — read from the sheet itself.",
    hold: "Dossier 003 P0: counsel to confirm the rights in the map and in this scan; a Palestinian reviewer to answer whether MAJDAL should use this survey at all.",
  },
];

export const getSource = (id: string) => SOURCES.find((s) => s.id === id);
