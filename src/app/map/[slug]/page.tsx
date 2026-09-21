import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { TierBadge } from "@/components/TierBadge";
import { getPlace, places } from "@/content/places";
import { formatCoordinates } from "@/lib/geo";
import { getChapter } from "@/content/chapters";
import { getArchiveEntry } from "@/content/archive";
import { site } from "@/content/site";

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return { title: "Place not found" };
  return {
    title: `${place.name} — ${place.nameArabic}`,
    description: place.line,
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const chapters = place.chapterSlugs
    .map(getChapter)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const entries = place.archiveSlugs
    .map(getArchiveEntry)
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    alternateName: place.nameArabic,
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.coordinates.lat,
      longitude: place.coordinates.lon,
    },
    description: place.line,
    isPartOf: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="section">
      <div className="shell">
        <Link href="/map" className="backlink">
          ← The Land
        </Link>

        <header style={{ paddingBottom: "var(--s-7)" }}>
          <p className="meta" style={{ paddingBottom: "var(--s-4)" }}>
            {place.id} · {place.district} district
          </p>
          <h1 className="display d3">{place.name}</h1>
          <p className="arabic phead__ar">{place.nameArabic}</p>
          <p style={{ paddingTop: "var(--s-5)" }}>
            <TierBadge tier={place.tier} />
          </p>
          <p className="lead muted" style={{ paddingTop: "var(--s-5)", maxWidth: "60ch" }}>
            {place.line}
          </p>
        </header>

        <div className="split">
          <Reveal>
            <div className="aentry__body">
              {place.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>

            {place.openQuestion ? (
              <div className="callout">
                <p className="callout__h">Open question</p>
                <p className="muted">{place.openQuestion}</p>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={80}>
            <div className="factlist">
              {[
                ["Record", place.id],
                ["Name", place.name],
                ["Arabic", place.nameArabic],
                ["District", place.district],
                ["Coordinates", formatCoordinates(place)],
                ["Evidence", place.tier],
                ["Sources", String(place.sources.length)],
              ].map(([k, v]) => (
                <div className="factlist__row" key={k}>
                  <span className="factlist__k">{k}</span>
                  <span className="factlist__v">{v}</span>
                </div>
              ))}
            </div>

            <p className="meta" style={{ paddingTop: "var(--s-6)" }}>
              Sources
            </p>
            <ul className="srclist">
              {place.sources.map((s) => (
                <li key={s.title}>
                  {s.title}
                  {s.publisher ? ` — ${s.publisher}` : ""}
                </li>
              ))}
            </ul>

            {chapters.length > 0 || entries.length > 0 ? (
              <>
                <p className="meta" style={{ paddingTop: "var(--s-6)" }}>
                  Connected
                </p>
                <ul className="srclist">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/chapters/${c.slug}`} className="link">
                        Chapter {c.number} — {c.name}
                      </Link>
                    </li>
                  ))}
                  {entries.map((e) => (
                    <li key={e.slug}>
                      <Link href={`/archive/${e.slug}`} className="link">
                        {e.index} — {e.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
