import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { chapters } from "@/content/chapters";

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
            Chapters, not seasons. Each one takes a subject, documents it, and
            produces garments as its artefacts. A chapter closes and does not
            return.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
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
                    {chapter.runSize} pieces · {chapter.subject}
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
