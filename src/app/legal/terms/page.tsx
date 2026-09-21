import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms this site operates under.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">TERMS</h1>
          <p className="lead muted phead__lead">The terms this site operates under.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">This site</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>MAJDAL is pre-launch. Nothing on this site is an offer to sell, no order can be placed, and prices shown are indicative until the chapter opens.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">The archive</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Archive records are MAJDAL's own research, with sources cited. Facts are not owned by anyone; our wording is ours. Quote it with attribution and a link.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>Material contributed by community members belongs to the contributor. MAJDAL publishes it with permission and removes it on request.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">The place dataset</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>MAJDAL's place register is derived in part from openly licensed data and is intended to be published under the same open licence it was built from, with attribution. Coastline geometry is from Natural Earth, which is public domain.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Impact</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>MAJDAL intends to allocate 15% of eligible product sales to support people in Palestine. Public reporting begins once verified transfers are made. No transfer has been made, because nothing has been sold.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
