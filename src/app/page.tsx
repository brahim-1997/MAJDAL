import Link from "next/link";
import { Overture } from "@/components/brut/Overture";
import { Thread } from "@/components/brut/Thread";
import { Collision } from "@/components/home/Collision";
import { ArchiveBox } from "@/components/home/ArchiveBox";
import { CarrySleeves } from "@/components/home/CarrySleeves";
import { TheLand } from "@/components/map/TheLand";
import { GarmentFlat } from "@/components/product/GarmentFlat";
import { JoinRoots } from "@/components/JoinRoots";
import { Reveal } from "@/components/Reveal";
import { archive } from "@/content/archive";
import { chapters, currentChapter } from "@/content/chapters";
import { formatPrice, productsInChapter } from "@/content/products";
import { site } from "@/content/site";
import { formatMoney, getImpactTotals } from "@/lib/impact";

export default function HomePage() {
  const objects = productsInChapter(currentChapter.slug);
  const [feature, ...rest] = objects;
  const totals = getImpactTotals();
  const boxed = archive.slice(0, 6);

  return (
    <>
      <Overture />

      {/* ==== SIGNAL / COLLISION ==== */}
      <Collision />

      {/* ==== THE LAND: document → land → memory ==== */}
      <TheLand />

      {/* ==== MEMORY ==== */}
      <section className="mem paper grain" aria-labelledby="mem-title">
        <Thread
          path={{
            start: [0.08, 0],
            curves: [
              [[0.08, 0.3], [0.5, 0.2], [0.62, 0.46]],
              [[0.74, 0.72], [0.96, 0.7], [0.9, 1]],
            ],
          }}
        />
        <div className="shell">
          <h2 id="mem-title" className="visually-hidden">
            The story
          </h2>
          <p className="display mem__l1">They carried it.</p>
          <p className="display mem__l2 outline">We carry it.</p>
          <p className="display mem__l3">The next generation carries it forward.</p>

          <div className="mem__doc">
            <Reveal>
              <div className="shiplabel">
                <p className="shiplabel__top">
                  <span className="wide">Archive 0001</span>
                  <span className="meta">Sourced</span>
                </p>
                <dl>
                {[
                  ["Location", "Al-Majdal · المجدل · Gaza district"],
                  ["Object", "Cloth — Majdalawi"],
                  ["Looms", "~2,000 · 1940s"],
                  ["Piece", "8 metres · one dress"],
                  ["Work", "1–2 months per piece"],
                  ["Taken", "1948"],
                  ["Status", "Sourced · expulsion timeline contested"],
                  ["Records", "A001 – A006"],
                ].map(([k, v]) => (
                  <div className="shiplabel__row" key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
                </dl>
              </div>
            </Reveal>
            <span className="stamp stamp--red mem__stamp" aria-hidden="true">
              1948
            </span>
            <p className="hand mem__note" aria-hidden="true">
              the town left the map.
              <br />
              the cloth kept the name.
            </p>
          </div>

          <p className="mem__body lead">
            Al-Majdal was the weaving town of the Gaza District. Around two
            thousand looms, most inside people&apos;s houses. It was taken in 1948
            and its people expelled. The weavers kept weaving, and the craft
            still carries the town&apos;s name: <em>Majdalawi</em>.
          </p>
          <p>
            <Link href="/story" className="btn">
              Read the record
            </Link>
          </p>
        </div>
      </section>

      {/* ==== ARCHIVE ==== */}
      <section className="section olive-ground arch" aria-labelledby="arch-title">
        <Thread
          path={{
            start: [0.9, 0],
            curves: [
              [[0.9, 0.2], [0.5, 0.12], [0.44, 0.34]],
              [[0.38, 0.6], [0.1, 0.7], [0.12, 1]],
            ],
          }}
        />
        <div className="shell">
          <div className="arch__head">
            <h2 id="arch-title" className="display arch__title">
              Open the box
            </h2>
            <p className="arch__sub">
              {archive.length} records. Every one tiered and sourced. Where
              accounts differ, the disagreement is shown. Drag them aside.
            </p>
          </div>
          <ArchiveBox entries={boxed} total={archive.length} />
          <p className="arch__cta">
            <Link href="/archive" className="btn">
              Enter the archive — {archive.length} records
            </Link>
          </p>
        </div>
      </section>

      {/* ==== PEOPLE ==== */}
      <section className="section carrysec" aria-labelledby="carry-title">
        <Thread
          path={{
            start: [0.12, 0],
            curves: [
              [[0.12, 0.25], [0.86, 0.36], [0.78, 0.6]],
              [[0.7, 0.84], [0.5, 0.8], [0.5, 1]],
            ],
          }}
        />
        <div className="shell">
          <h2 id="carry-title" className="display carrysec__title">
            What do you carry?
          </h2>
          <p className="carrysec__lead lead">
            An object. A photograph. A place. A name. A sentence somebody said
            once and nobody wrote down. The archive is the part of this brand
            only the people in it can build.
          </p>
          <CarrySleeves />
          <p className="carrysec__note meta">
            No photographs of people are shown here, because none have been given
            yet. MAJDAL does not fill that space with stock or generated faces.
          </p>
          <p>
            <Link href="/roots/carry" className="btn">
              Send it to the archive
            </Link>
          </p>
        </div>
      </section>

      {/* ==== PRODUCT ==== */}
      <section className="section paper objects" aria-labelledby="obj-title">
        <Thread
          path={{
            start: [0.5, 0],
            knotEnd: true,
            curves: [
              [[0.5, 0.08], [0.2, 0.06], [0.16, 0.18]],
              [[0.12, 0.28], [0.3, 0.32], [0.3, 0.33]],
            ],
          }}
        />
        <div className="shell">
          <ul className="chapstrip" aria-label="Chapters">
            {chapters.map((c) => (
              <li key={c.slug} data-status={c.status}>
                <Link href={`/chapters/${c.slug}`}>
                  <span className="chapstrip__n">{c.number}</span>
                  <span className="chapstrip__name">{c.name}</span>
                  <span className="chapstrip__st">
                    {c.productSlugs.length ? "objects in preparation" : "in research"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 id="obj-title" className="display objects__title">
            Objects
          </h2>

          {feature ? (
            <article className="objfeat">
              <div className="objfeat__draw">
                <Reveal>
                  <GarmentFlat product={feature} callouts />
                </Reveal>
              </div>
              <div className="objfeat__info">
                <p className="objfeat__no wide">Object {feature.object}</p>
                <h3 className="display objfeat__name">{feature.name}</h3>
                <p className="objfeat__cw">
                  <span className="tag">{feature.colourway.name}</span>{" "}
                  {feature.colourway.arabic ? (
                    <span className="arabic">{feature.colourway.arabic}</span>
                  ) : null}
                </p>
                <p className="objfeat__line">{feature.line}</p>
                <dl className="objfeat__spec">
                  <div><dt>Chapter</dt><dd>{currentChapter.number}</dd></div>
                  <div><dt>Code</dt><dd>{site.code}</dd></div>
                  <div><dt>Price</dt><dd>{formatPrice(feature.priceCents, feature.currency)}</dd></div>
                  <div><dt>Status</dt><dd>Not open</dd></div>
                </dl>
                <p className="objfeat__remain wide">The roots remain.</p>
                <Link href={`/shop/${feature.slug}`} className="btn">
                  Open object {feature.object}
                </Link>
              </div>
            </article>
          ) : null}

          <ol className="objrows">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/shop/${p.slug}`} className="objrow">
                  <span className="objrow__no">{p.object}</span>
                  <span className="objrow__draw">
                    <GarmentFlat product={p} />
                  </span>
                  <span className="display objrow__name">{p.name}</span>
                  <span className="objrow__cw">{p.colourway.name}</span>
                  <span className="objrow__price">{formatPrice(p.priceCents, p.currency)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==== IMPACT ==== */}
      <section className="section impactsec" aria-labelledby="imp-title">
        <div className="shell">
          <h2 id="imp-title" className="visually-hidden">
            Impact
          </h2>
          <p className="display impactsec__pct" aria-hidden="true">
            {site.impactPercent}%
          </p>
          <p className="wide impactsec__of">
            Of every eligible product sale — to support people in Palestine.
          </p>

          <div className="receipt paper">
            <p className="receipt__head wide">Ledger — {site.name}</p>
            {[
              ["Committed", formatMoney(totals.accruedCents)],
              ["Transferred", formatMoney(totals.transferredCents)],
              ["Confirmed received", formatMoney(totals.verifiedCents)],
              ["Recipient", totals.isEmpty ? "None yet" : "See ledger"],
              ["Proof", totals.isEmpty ? "None yet" : "See ledger"],
            ].map(([k, v]) => (
              <p className="receipt__row" key={k}>
                <span>{k}</span>
                <span className="receipt__dots" aria-hidden="true" />
                <span>{v}</span>
              </p>
            ))}
            <p className="receipt__foot">
              Nothing has been sold, so every figure is zero. Zero is the truth.
            </p>
            <span className="stamp stamp--red receipt__stamp" aria-hidden="true">
              System under preparation
            </span>
          </div>
          <p>
            <Link href="/impact" className="btn btn--ghost">
              Read the full ledger
            </Link>
          </p>
        </div>
      </section>

      {/* ==== JOIN ==== */}
      <section className="section joinsec" aria-labelledby="join-title">
        <div className="shell">
          <h2 id="join-title" className="display joinsec__title">
            Join the roots
          </h2>
          <div className="joinsec__panel">
            <p className="joinsec__copy">
              Free. No purchase. Members see the archive first, get the chapter
              window first, and vote on one real decision per chapter. Nobody
              buys their way up.
            </p>
            <JoinRoots />
          </div>
        </div>
      </section>
    </>
  );
}
