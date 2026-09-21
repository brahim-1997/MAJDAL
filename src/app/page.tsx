import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { Spine } from "@/components/Spine";
import { JoinRoots } from "@/components/JoinRoots";
import { TierBadge } from "@/components/TierBadge";
import { site } from "@/content/site";
import { currentChapter } from "@/content/chapters";
import { productsInChapter } from "@/content/products";
import { archive } from "@/content/archive";

export default function HomePage() {
  const chapterProducts = productsInChapter(currentChapter.slug);
  const featured = archive.slice(0, 3);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="shell">
          <p className="hero__code">
            <span className="hero__code-num">{site.code}</span>
            <span className="meta">Chapter {currentChapter.number} — {currentChapter.name}</span>
          </p>

          <h1 className="display d1 hero__title">
            {site.name}
            <span className="arabic hero__ar">{site.nameArabic}</span>
          </h1>

          <p className="meta hero__phil">{site.philosophy}</p>

          <div className="hero__story">
            {site.story.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="hero__cta">
            <Link href="/chapters/001-roots" className="btn">
              Chapter 001
            </Link>
            <Link href="/story" className="btn btn--ghost">
              Why MAJDAL
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- THE PREMISE ---------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">01</span>
              <span className="label__name">The premise</span>
            </p>
          </Reveal>

          <div className="split">
            <Reveal>
              <div className="prose stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <h2 className="display d3">
                  A weaving town made this brand possible.
                </h2>
                <p className="lead muted">
                  Al-Majdal was the textile centre of the Gaza District. Around two
                  thousand looms, most of them inside people&apos;s houses. Cloth sold in
                  eight-metre lengths — the amount needed for one dress, one to two
                  months of a weaver&apos;s work.
                </p>
                <p className="muted">
                  The town held roughly eleven thousand people. It was taken in 1948
                  and its remaining residents were expelled in stages, most of them to
                  Gaza. The industry was destroyed. The weavers kept weaving, and the
                  style still carries the name of the town: Majdalawi — of al-Majdal.
                </p>
                <p>
                  MAJDAL is not a brand that puts Palestine on clothes. It is a
                  clothing brand descended from a clothing town. That is the whole
                  difference.
                </p>
                <p>
                  <Link href="/archive" className="link">
                    Read the archive
                  </Link>
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="factlist">
                {[
                  ["Place", "al-Majdal Asqalan"],
                  ["Meaning", "Tower"],
                  ["Looms, 1940s", "~2,000"],
                  ["Population, 1948", "~11,000"],
                  ["One piece of cloth", "8 metres"],
                  ["Time to weave it", "1–2 months"],
                  ["Craft name today", "Majdalawi"],
                ].map(([k, v]) => (
                  <div className="factlist__row" key={k}>
                    <span className="factlist__k">{k}</span>
                    <span className="factlist__v">{v}</span>
                  </div>
                ))}
              </div>
              <p className="meta" style={{ paddingTop: "var(--s-4)" }}>
                Sourced in the archive. Where accounts differ, we say so.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Loom band — the colour-block reference, at thread scale */}
      <div className="shell">
        <div className="band" aria-hidden="true">
          <span className="band__ink" />
          <span className="band__olive" />
          <span className="band__clay" />
          <span className="band__ink" />
          <span className="band__indigo" />
          <span className="band__fuchsia" />
          <span className="band__ink" />
          <span className="band__turquoise" />
          <span className="band__stone" />
          <span className="band__ink" />
        </div>
      </div>

      {/* ---------- THE SPINE ---------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">02</span>
              <span className="label__name">The spine</span>
            </p>
          </Reveal>

          <Reveal>
            <h2 className="display d3" style={{ maxWidth: "20ch" }}>
              Resistance held as continuity.
            </h2>
            <p className="lead muted" style={{ paddingTop: "var(--s-5)", maxWidth: "56ch" }}>
              Not a slogan. Three objects, each with a source: a cloth that kept
              a town&apos;s name, a plant that still marks the villages, a seed
              whose name means &ldquo;my country&rdquo;.
            </p>
          </Reveal>

          <div style={{ paddingTop: "var(--s-8)" }}>
            <Spine />
          </div>
        </div>
      </section>

      {/* ---------- CHAPTER 001 ---------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">03</span>
              <span className="label__name">Chapter {currentChapter.number}</span>
            </p>
          </Reveal>

          <Reveal>
            <h2 className="display d2">{currentChapter.name}</h2>
            <p className="lead muted" style={{ paddingTop: "var(--s-4)", maxWidth: "48ch" }}>
              {currentChapter.premise}
            </p>
            <p className="meta" style={{ paddingTop: "var(--s-5)" }}>
              {currentChapter.runSize} pieces — the actual first production run ·{" "}
              <span className="status" data-status={currentChapter.status}>
                {currentChapter.status}
              </span>
            </p>
          </Reveal>

          <div className="pgrid" style={{ paddingTop: "var(--s-8)" }}>
            {chapterProducts.map((product, i) => (
              <Reveal as="div" key={product.slug} delay={i * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p style={{ paddingTop: "var(--s-7)" }}>
              <Link href={`/chapters/${currentChapter.slug}`} className="btn btn--ghost">
                Read Chapter {currentChapter.number}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- ARCHIVE PREVIEW ---------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">04</span>
              <span className="label__name">The archive</span>
            </p>
          </Reveal>

          <ul className="alist">
            {featured.map((entry, i) => (
              <Reveal as="li" key={entry.slug} className="aitem" delay={i * 60}>
                <Link href={`/archive/${entry.slug}`} className="aitem__link">
                  <span className="aitem__head">
                    <span className="aitem__index">{entry.index}</span>
                    <span className="display aitem__title">{entry.title}</span>
                    <TierBadge tier={entry.tier} />
                  </span>
                  <span className="aitem__summary">{entry.summary}</span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <p style={{ paddingTop: "var(--s-7)" }}>
              <Link href="/archive" className="btn btn--ghost">
                All entries
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- THE ROOTS ---------- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">05</span>
              <span className="label__name">{site.community}</span>
            </p>
          </Reveal>

          <div className="split split--reverse">
            <Reveal delay={80}>
              <div className="statrow">
                <div className="bigstat">
                  <span className="bigstat__n">{site.impactPercent}%</span>
                  <span className="bigstat__l">
                    of every eligible sale, committed and published to the piece
                  </span>
                </div>
                <div className="bigstat">
                  <span className="bigstat__n">{site.code}</span>
                  <span className="bigstat__l">
                    1948 — and everyone who has carried this since
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="prose stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <h2 className="display d3">The community comes first.</h2>
                <p className="lead muted">
                  Before revenue. THE ROOTS is free, and your place in it is earned by
                  turning up rather than by spending. Members see the archive first,
                  get the chapter access window, and vote on one real decision per
                  chapter.
                </p>
                <JoinRoots />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
