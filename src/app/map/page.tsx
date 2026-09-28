import type { Metadata } from "next";
import Link from "next/link";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import { archiveId } from "@/components/archive/RecordCard";
import { LandExplore } from "@/components/land/LandExplore";
import { MapExplorer, type ExplorerLayer } from "@/components/map/MapExplorer";
import { Reveal } from "@/components/Reveal";
import { TierBadge } from "@/components/TierBadge";
import { getArchiveEntry } from "@/content/archive";
import { getPlace, placesByLatitude } from "@/content/places";
import { formatCoordinates } from "@/lib/geo";
import { resolveSources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "The Land",
  description:
    "Every place has a memory. The whole land of Palestine in relief, from real elevation data, with a register of places — each one sourced, tiered and incomplete on purpose.",
};

export default function MapPage() {
  const register = placesByLatitude();
  const photos = resolveSources("photograph");
  const maps = resolveSources("map");
  const majdal = getPlace("al-majdal");
  const records = (majdal?.archiveSlugs ?? []).map(getArchiveEntry).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const historical: ExplorerLayer[] = maps.map((m, i) => ({
    id: m.id,
    label: `Map 0${i + 1}`,
    note: `${m.title.split(" — ")[0]} · ${m.date} · ${m.hold ? "on hold for review" : m.onFile ? "on file" : "not yet on file"}`,
    href: m.url,
    available: m.shown,
  }));

  return (
    <>
      <section className="land" aria-labelledby="land-title">
        <h1 id="land-title" className="visually-hidden">
          The Land — the whole land of Palestine, in relief
        </h1>
        <LandExplore
          fallback={
            <MapExplorer
              historical={historical}
              archivePanel={
                <div className="explore__archive">
                  <p className="meta">Photographs held: {photos.length}. Records: {records.length}.</p>
                  <ul className="explore__photos">
                    {photos.map((s) => (
                      <li key={s.id}>
                        <ArchivePhoto source={s} compact />
                      </li>
                    ))}
                  </ul>
                  <ul className="explore__records">
                    {records.map((e) => (
                      <li key={e.slug}>
                        <Link href={`/archive/${e.slug}`} className="link">
                          {archiveId(e)} — {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          }
        />
      </section>

      <section className="section">
        <div className="shell">
          <p className="label">
            <span className="label__index">01</span>
            <span className="label__name">The register</span>
            <span className="muted">North to south, as a survey sheet orders them</span>
          </p>
          <p className="lead muted register__lead">
            The same places as the sheet, in a different shape. This is not a fallback for the map — it is the
            map, written out.
          </p>

          <ul className="plist">
            {register.map((p, i) => (
              <Reveal as="li" key={p.id} className="plist__row" delay={i * 40}>
                <Link href={`/map/${p.slug}`} className="plist__link">
                  <span className="plist__head">
                    <span className="plist__id">{p.id}</span>
                    <span className="display plist__name">{p.name}</span>
                    <span className="arabic muted">{p.nameArabic}</span>
                    <TierBadge tier={p.tier} />
                  </span>
                  <span className="muted plist__line">{p.line}</span>
                  <span className="meta plist__coords">
                    {p.district} district · {formatCoordinates(p)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <div className="register__sources">
            <p className="label">
              <span className="label__index">02</span>
              <span className="label__name">Historical sheets</span>
              <span className="muted">Named, sourced — and shown only as themselves</span>
            </p>
            <ul className="sheetlist">
              {maps.map((m, i) => (
                <li key={m.id} className="sheetlist__row">
                  <span className="docid">Map 0{i + 1}</span>
                  <span className="sheetlist__title">{m.title}</span>
                  <dl className="kv">
                    <div><dt>Date</dt><dd>{m.date}</dd></div>
                    <div><dt>Made by</dt><dd>{m.creator}</dd></div>
                    <div><dt>Source</dt><dd>{m.holder}</dd></div>
                    <div><dt>Rights</dt><dd>{m.rights}</dd></div>
                    <div><dt>Status</dt><dd>{m.hold ? `On hold — ${m.hold}` : m.shown ? "On file" : "Not yet on file — the layer stays off until it is"}</dd></div>
                    {m.toConfirm ? <div><dt>To confirm</dt><dd>{m.toConfirm}</dd></div> : null}
                  </dl>
                  <a href={m.url} className="link" target="_blank" rel="noopener noreferrer">
                    View at the holder<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="callout">
            <p className="callout__h">What this map is not</p>
            <p className="muted">
              It is six places, not a gazetteer. Walid Khalidi&apos;s <em>All That Remains</em> documents 418
              Palestinian villages depopulated in 1948; mapping them is a research programme, and doing it thinly
              would be worse than not doing it.
            </p>
            <p className="muted">
              Coordinates are modern city positions, marked approximate. The relief is real elevation (NASA SRTM and
              NOAA ETOPO1 via AWS Terrain Tiles), with the vertical scale exaggerated seven times so the land can be
              read. The outline is Natural Earth 1:10m, with the Syrian Golan excluded.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
