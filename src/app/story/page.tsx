import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Story",
  description:
    "MAJDAL is named after al-Majdal — the weaving town that was the textile centre of the Gaza District until 1948. This is why the brand exists.",
};

export default function StoryPage() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">STORY</h1>
          <p className="arabic phead__ar">مجدل — برج</p>
          <p className="lead muted phead__lead">
            Majdal means tower. It was a weaving town on the southern coast of
            Palestine, and it is the reason this brand makes clothes rather than
            merchandise.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <div className="prose stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <h2 className="display d3">The town made cloth.</h2>
                <p>
                  Through the late Ottoman and Mandate periods, al-Majdal became the
                  primary textile and weaving centre of the Gaza District. Cotton
                  production was falling elsewhere in Palestine. Al-Majdal&apos;s weavers
                  kept their industry running by importing raw thread from Egypt, India
                  and Europe.
                </p>
                <p>
                  By the 1940s about two thousand looms were working in the town, very
                  often set up inside private houses rather than in workshops. The
                  town&apos;s industry ran through its homes.
                </p>
                <p>
                  Weaving there was a man&apos;s trade, worked on a single-treadle loom.
                  The cloth was cotton and wool, and it was striped. It was sold in
                  eight-metre pieces — the length needed for one dress. A piece took one
                  to two months.
                </p>

                <h2 className="display d3" style={{ paddingTop: "var(--s-6)" }}>
                  The weavers named their cloth.
                </h2>
                <p>
                  Malak — silk. Ikhdari — bands of red and green. Jiljileh — dark red
                  bands. These went to festival dresses across southern Palestine. Other
                  fabrics carried names like heaven and hell, breath of the soul, father
                  of two hundred.
                </p>
                <p>
                  MAJDAL names its colourways after these cloths and states, on every
                  product page, which fabric the name comes from and what it meant. We
                  are not going to improve on names like those.
                </p>

                <h2 className="display d3" style={{ paddingTop: "var(--s-6)" }}>
                  1948.
                </h2>
                <p>
                  Al-Majdal held roughly eleven thousand people. It was taken in 1948
                  and the textile industry was destroyed. Accounts differ on what
                  followed: some sources describe expulsion in 1948, one dates the
                  depopulation to 1951, and the wider record describes residents being
                  confined and then expelled in stages, with the last transfers to Gaza
                  around 1950.
                </p>
                <p>
                  We do not flatten that disagreement into a single confident date. The
                  gaps in the record are part of what was done. Ashkelon was founded on
                  the site in 1949.
                </p>

                <h2 className="display d3" style={{ paddingTop: "var(--s-6)" }}>
                  The cloth kept the name.
                </h2>
                <p>
                  The weavers who were driven out kept weaving, in Gaza and elsewhere.
                  The style is still called Majdalawi — of al-Majdal. Machine-made
                  imports later undercut it, demand fell, and by the 1990s there were
                  revival efforts in Gaza. A very small number of weavers still work in
                  the tradition; accounts of exactly how many differ, and we will not
                  publish a figure we cannot stand behind.
                </p>
                <p className="lead">
                  The place was removed from the map and the name survived in the cloth.
                  That is not a slogan we wrote. It is what happened, and it is why
                  MAJDAL exists.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="stack" style={{ ["--flow" as string]: "var(--s-6)" }}>
                <div className="callout callout--verified">
                  <p className="callout__h">How to read this site</p>
                  <p className="muted">
                    Every cultural claim MAJDAL publishes is tiered — verified,
                    contested, or our own interpretation — and sourced. Where the
                    historical record is unresolved, the page says so instead of
                    choosing the version that reads better.
                  </p>
                  <p style={{ paddingTop: "var(--s-3)" }}>
                    <Link href="/archive" className="link">
                      The archive
                    </Link>
                  </p>
                </div>

                <div className="factlist">
                  {[
                    ["Name", "al-Majdal Asqalan"],
                    ["Meaning", "Tower / fortress"],
                    ["District", "Gaza"],
                    ["Role", "Textile centre of the district"],
                    ["Looms, 1940s", "~2,000"],
                    ["Population, 1948", "~11,000"],
                    ["Loom", "Single treadle"],
                    ["Trade", "Men's"],
                    ["Cloth", "Cotton and wool, striped"],
                    ["Piece length", "8 metres — one dress"],
                    ["Weaving time", "1–2 months per piece"],
                    ["Site today", "Ashkelon, founded 1949"],
                    ["Craft name", "Majdalawi"],
                  ].map(([k, v]) => (
                    <div className="factlist__row" key={k}>
                      <span className="factlist__k">{k}</span>
                      <span className="factlist__v">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="callout">
                  <p className="callout__h">Why {site.code}</p>
                  <p className="muted">
                    Palestinians who remained inside the 1949 armistice line are
                    colloquially known as 48 Arabs — عرب ٤٨. The 48 is 1948. For MAJDAL
                    it marks continuity: the people who stayed, the people who were
                    driven out, and the cloth that kept its name.
                  </p>
                  <p className="muted" style={{ paddingTop: "var(--s-3)" }}>
                    It is not a puzzle and it is not mysticism. Asked what it means, the
                    answer is one sentence.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
