import type { Metadata } from "next";
import Link from "next/link";
import { MapRegister } from "@/components/map/MapRegister";
import { Reveal } from "@/components/Reveal";
import { TierBadge } from "@/components/TierBadge";
import { placesByLatitude } from "@/content/places";
import { formatCoordinates } from "@/lib/geo";

export const metadata: Metadata = {
  title: "The Land",
  description:
    "Every place has a memory. An interactive register of places in the MAJDAL archive — each one sourced, tiered, and incomplete on purpose.",
};

export default function MapPage() {
  const register = placesByLatitude();

  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">THE LAND</h1>
          <p className="arabic phead__ar">الأرض</p>
          <p className="lead muted phead__lead">
            Every place has a memory. This is a register, not a basemap — the
            places are set in type at their own coordinates, and each one carries
            its sources and its evidence tier.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <MapRegister />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <h2 className="label">
              <span className="label__index">—</span>
              <span className="label__name">The register</span>
            </h2>
          </Reveal>

          <Reveal>
            <p className="lead muted" style={{ maxWidth: "58ch", paddingBottom: "var(--s-7)" }}>
              The same places, listed north to south as a survey sheet would
              order them. This is not a fallback for the map — it is the map,
              in a different shape.
            </p>
          </Reveal>

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
                  <span className="muted" style={{ maxWidth: "68ch" }}>
                    {p.line}
                  </span>
                  <span className="meta" style={{ textTransform: "none", letterSpacing: "0.08em" }}>
                    {p.district} district · {formatCoordinates(p)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="callout" style={{ marginTop: "var(--s-9)" }}>
              <p className="callout__h">What this register is not</p>
              <p className="muted">
                It is six places, not a gazetteer. Walid Khalidi&apos;s{" "}
                <em>All That Remains</em> documents 418 Palestinian villages
                depopulated in 1948; mapping them is a research programme, and
                doing it thinly would be worse than not doing it.
              </p>
              <p className="muted" style={{ paddingTop: "var(--s-3)" }}>
                Coordinates here are modern city positions, marked approximate.
                They are not surveyed fixes on historic town centres, and we say
                so rather than implying a precision we do not have.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
