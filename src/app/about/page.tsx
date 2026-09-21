import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'About',
  description: 'Who MAJDAL is, how it works, and what it has not finished.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">ABOUT</h1>
          <p className="lead muted phead__lead">Who MAJDAL is, how it works, and what it has not finished.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">The short version</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>MAJDAL is a contemporary streetwear house named after al-Majdal — the Palestinian town that was the textile and weaving centre of the Gaza District until 1948, where roughly two thousand looms worked inside people's houses.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>Its people were expelled. The weavers kept weaving, and the craft still carries the town's name: Majdalawi. MAJDAL is not a brand that puts Palestine on clothes. It is a clothing brand descended from a clothing town.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">How we handle history</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Every cultural claim on this site is tiered — verified, contested, or our own interpretation — and carries its sources. Where the record is unresolved, the page says so instead of choosing the version that reads better.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>No claim reaches a garment without review by a named Palestinian researcher. That review has not happened yet, and this site says so rather than implying scholarly backing it does not have.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">What is deliberately unfinished</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>There is no checkout, because Chapter 001 has not opened. There is no email list, because we will not collect addresses with nowhere lawful to keep them. There is no analytics, because there is no privacy policy or consent mechanism yet. The impact ledger reads zero because nothing has been sold.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>These are decisions, not gaps. A brand that asks people to trust it with their history should be able to show its own working.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Corrections</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>We will get something wrong eventually. When we do, we correct it in public at the same volume as the original claim, say what was wrong, and log it. No quiet edits.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
