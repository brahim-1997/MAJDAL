import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { chapters } from "@/content/chapters";
import { Spine } from "@/components/Spine";

export const metadata: Metadata = {
  title: "Chapters",
  description:
    "MAJDAL releases in chapters, not seasons. A chapter is a researched subject, with garments as its artefacts.",
};

export default function ChaptersPage() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">CHAPTERS</h1>
          <p className="lead muted phead__lead">
            Chapters, not seasons. Each one takes a line of the story and the
            documented object that carries it — a cloth, a plant, a seed. A
            chapter closes and does not return.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <h2 className="label">
            <span className="label__index">01</span>
            <span className="label__name">The spine</span>
          </h2>
          <p className="lead muted" style={{ maxWidth: "58ch", paddingBottom: "var(--s-7)" }}>
            They carried it. We carry it. The next generation carries it
            forward. Each line has an object behind it, and each object has a
            source.
          </p>
          <Spine />

          <h2 className="label" style={{ marginTop: "var(--s-10)" }}>
            <span className="label__index">02</span>
            <span className="label__name">All chapters</span>
          </h2>

          <ul className="alist">
            {chapters.map((chapter, i) => (
              <Reveal as="li" key={chapter.slug} className="aitem" delay={i * 60}>
                <Link href={`/chapters/${chapter.slug}`} className="aitem__link">
                  <span className="aitem__head">
                    <span className="aitem__index">{chapter.number}</span>
                    <span className="display aitem__title">{chapter.name}</span>
                    <span className="status" data-status={chapter.status}>
                      {chapter.status}
                    </span>
                  </span>
                  <span className="aitem__summary">{chapter.premise}</span>
                  <span className="meta">
                    {chapter.runSize > 0
                      ? `${chapter.runSize} pieces · `
                      : "Run size not set · "}
                    {chapter.subject}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="callout" style={{ marginTop: "var(--s-9)" }}>
              <p className="callout__h">On scarcity</p>
              <p className="muted">
                Chapter run sizes are the real production quantities our budget
                finances, not marketing numbers. If a purchase order changes, the
                published number changes. Core garments may continue as a permanent
                line under a different name — pretending a good hoodie is
                unrepeatable would be fake scarcity, and we do not do that.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
