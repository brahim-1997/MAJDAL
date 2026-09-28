import type { Tier } from "./archive";

/**
 * THE WATERMELON — the record behind the motif, as a timeline.
 *
 * The full record, with its sources, is archive entry A013
 * (`the-watermelon`). Every line here says which tier it is. The disputed
 * story is kept in, marked as disputed, rather than dropped or told as fact.
 */
export type Moment = {
  year: string;
  head: string;
  line: string;
  tier: Tier;
  /** Short form of the source, printed under the line. */
  source: string;
};

export const WATERMELON: Moment[] = [
  {
    year: "1967",
    head: "The flag is banned",
    line: "Military Order 101 prohibits flags and political symbols in the occupied West Bank without army approval.",
    tier: "VERIFIED",
    source: "B’Tselem; Human Rights Watch",
  },
  {
    year: "1980",
    head: "“Even a watermelon”",
    line: "The army closes 79 Gallery in Ramallah. Sliman Mansour remembers the officer: even a watermelon in those colours would be confiscated.",
    tier: "VERIFIED",
    source: "Sliman Mansour to The National, 2021 — his account",
  },
  {
    year: "1993",
    head: "The story nobody could confirm",
    line: "Young men arrested in Gaza for carrying sliced watermelons. Printed in The New York Times, then walked back in an editor’s note.",
    tier: "CONTESTED",
    source: "NYT editor’s note; Decolonize Palestine",
  },
  {
    year: "1993",
    head: "The ban ends",
    line: "Under the Oslo Accords the flag can be shown again.",
    tier: "VERIFIED",
    source: "Time (2023); Wikipedia, Watermelon as a Palestinian symbol",
  },
  {
    year: "2007",
    head: "The Story of the Watermelon",
    line: "Khaled Hourani’s silkscreen series for the Subjective Atlas of Palestine.",
    tier: "VERIFIED",
    source: "Hyperallergic; Time",
  },
  {
    year: "2023",
    head: "This is not a Palestinian flag",
    line: "Zazim puts watermelons on 16 Tel Aviv taxis. Online, the fruit goes everywhere the flag is taken down.",
    tier: "VERIFIED",
    source: "The Times of Israel; Time",
  },
  {
    year: "2024",
    head: "A fruit in place of a people?",
    line: "Yasmine Rishmawi asks whether the trend also helps empty the symbol it carries.",
    tier: "CONTESTED",
    source: "Rowaq Arabi 29(3)",
  },
];
