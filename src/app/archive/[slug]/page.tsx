import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { TierBadge } from "@/components/TierBadge";
import { archive, getArchiveEntry } from "@/content/archive";

export function generateStaticParams() {
  return archive.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) return { title: "Entry not found" };
  return {
    title: `${entry.index} — ${entry.title}`,
    description: entry.summary,
  };
}

export default async function ArchiveEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getArchiveEntry(slug);
  if (!entry) notFound();

  return (
    <article className="paper">
      <div className="shell">
        <Link href="/archive" className="backlink">
          ← The Archive
        </Link>

        <header className="rechead">
          <p className="rechead__id">
            {entry.index} — {entry.category} — {entry.location}
          </p>
          <h1 className="display d3">
            {entry.title}
            {entry.titleArabic ? (
              <span className="arabic phead__ar">{entry.titleArabic}</span>
            ) : null}
          </h1>
          <p style={{ paddingTop: "var(--s-5)" }}>
            <TierBadge tier={entry.tier} />
          </p>
          <p className="meta">{entry.period}</p>
          <p className="lead muted" style={{ paddingTop: "var(--s-3)", maxWidth: "60ch" }}>
            {entry.summary}
          </p>
        </header>

        <Reveal>
          <div className="aentry__body">
            {entry.body.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
        </Reveal>

        {entry.openQuestion ? (
          <Reveal>
            <div className="callout">
              <p className="callout__h">Open question</p>
              <p className="muted">{entry.openQuestion}</p>
            </div>
          </Reveal>
        ) : null}

        <Reveal>
          <div style={{ maxWidth: "var(--max-prose)", paddingTop: "var(--s-7)" }}>
            <hr className="rule" />
            <p className="meta" style={{ paddingTop: "var(--s-4)" }}>
              Sources
            </p>
            <ul className="srclist">
              {entry.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
            <p className="meta faint" style={{ paddingTop: "var(--s-5)", textTransform: "none", letterSpacing: "0.02em" }}>
              Full citations and retrieval status are held in the repository under
              cultural-research/. Claims here await external review by named
              Palestinian researchers before they appear on any garment.
            </p>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
