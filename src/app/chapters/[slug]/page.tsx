import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { chapters, getChapter } from "@/content/chapters";
import { productsInChapter } from "@/content/products";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Chapter not found" };
  return {
    title: `Chapter ${chapter.number} — ${chapter.name}`,
    description: `${chapter.premise} ${chapter.subject}`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const items = productsInChapter(chapter.slug);

  return (
    <>
      <header className="section section--tight">
        <div className="shell">
          <Link href="/chapters" className="backlink">
            ← Chapters
          </Link>
          <div className="chead">
            <p className="display chead__num">{chapter.number}</p>
            <h1 className="display chead__name">
              {chapter.name}
              {chapter.nameArabic ? (
                <span className="arabic phead__ar">{chapter.nameArabic}</span>
              ) : null}
            </h1>
            <p className="lead muted" style={{ paddingTop: "var(--s-5)", maxWidth: "48ch" }}>
              {chapter.premise}
            </p>
            <p className="meta" style={{ paddingTop: "var(--s-5)" }}>
              <span className="status" data-status={chapter.status}>
                {chapter.status}
              </span>
              {"  "}· {chapter.runSize} pieces ·{" "}
              {chapter.opensAt ?? "Opening date not announced"}
            </p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <div className="prose stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                {chapter.body.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
                <p>
                  <Link href="/archive" className="link">
                    Sources, tiered, in the archive
                  </Link>
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="factlist">
                {[
                  ["Chapter", chapter.number],
                  ["Name", chapter.name],
                  ["Subject", chapter.subject],
                  ["Run size", `${chapter.runSize} pieces`],
                  ["Garments", String(items.length)],
                  ["Status", chapter.status],
                ].map(([k, v]) => (
                  <div className="factlist__row" key={k}>
                    <span className="factlist__k">{k}</span>
                    <span className="factlist__v">{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <h2 className="label">
              <span className="label__index">—</span>
              <span className="label__name">The garments</span>
            </h2>
          </Reveal>
          <div className="pgrid">
            {items.map((product, i) => (
              <Reveal as="div" key={product.slug} delay={i * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
