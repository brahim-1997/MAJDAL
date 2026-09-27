import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Thread } from "@/components/brut/Thread";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import { RecordCard, archiveId } from "@/components/archive/RecordCard";
import { MapFilm } from "@/components/film/MapFilm";
import { Hero } from "@/components/home/Hero";
import { MemoryTable, type TableItem } from "@/components/home/MemoryTable";
import { MapSheet } from "@/components/map/MapSheet";
import { Olive } from "@/components/olive/Olive";
import { GarmentFlat, calloutsFor } from "@/components/product/GarmentFlat";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { archive, getArchiveEntry } from "@/content/archive";
import { currentChapter } from "@/content/chapters";
import { KINDS } from "@/content/community";
import { formatPrice, productsInChapter } from "@/content/products";
import { site } from "@/content/site";
import { formatMoney, getImpactTotals, ledger } from "@/lib/impact";
import { resolveSource } from "@/lib/sources";

const entry = (slug: string) => {
  const e = getArchiveEntry(slug);
  if (!e) throw new Error(`Missing archive entry ${slug}`);
  return e;
};

export default function HomePage() {
  const looms = resolveSource("loc-matpc-19868");
  const closer = resolveSource("loc-matpc-19871");
  const market = resolveSource("loc-matpc-19865");
  const objects = productsInChapter(currentChapter.slug);
  const [feature, ...rest] = objects;
  const totals = getImpactTotals();

  const table: TableItem[] = [
    { key: "p1", node: <ArchivePhoto source={looms} className="taped" />, at: { l: 1, t: 4, w: 31, r: -2 } },
    {
      key: "a001",
      href: "/archive/two-thousand-looms",
      label: `${archiveId(entry("two-thousand-looms"))} — open the record`,
      node: <RecordCard entry={entry("two-thousand-looms")} stamp />,
      at: { l: 29, t: 0, w: 24, r: 2 },
    },
    {
      key: "map",
      node: (
        <div className="mcut paper">
          <MapSheet id="table-cut" bare thread viewBox="120 860 250 170" preserveAspectRatio="xMidYMid slice" />
          <p className="hand mcut__note">the weaving town</p>
        </div>
      ),
      at: { l: 55, t: 6, w: 25, r: -3 },
    },
    { key: "p2", node: <ArchivePhoto source={closer} compact />, at: { l: 76, t: 22, w: 23, r: 3.5 } },
    {
      key: "a002",
      href: "/archive/eight-metres",
      label: `${archiveId(entry("eight-metres"))} — open the record`,
      node: <RecordCard entry={entry("eight-metres")} />,
      at: { l: 5, t: 50, w: 24, r: 2.5 },
    },
    {
      key: "note",
      node: (
        <p className="slip paper">
          <span className="hand">The weavers kept weaving.</span>
          <span className="slip__ref">see {archiveId(entry("the-cloth-kept-the-name"))}</span>
        </p>
      ),
      at: { l: 31, t: 46, w: 17, r: -5 },
    },
    {
      key: "a005",
      href: "/archive/taken-in-1948",
      label: `${archiveId(entry("taken-in-1948"))} — open the record`,
      node: <RecordCard entry={entry("taken-in-1948")} stamp />,
      at: { l: 47, t: 52, w: 25, r: -1.5 },
    },
    { key: "p3", node: <ArchivePhoto source={market} compact className="taped" />, at: { l: 73, t: 60, w: 25, r: 1.2 } },
  ];

  return (
    <>
      {/* 01 — THE LAND */}
      <Hero />

      {/* 02 — THE MAP */}
      <MapFilm
        layers={<ArchivePhoto source={looms} compact />}
        second={<ArchivePhoto source={closer} compact />}
        archivePhoto={<ArchivePhoto source={market} compact />}
        record={<RecordCard entry={entry("two-thousand-looms")} stamp />}
        garment={feature ? <GarmentFlat product={feature} uid="film" /> : null}
        logo={<Logo lockup="primary" tone="bone" alt="" />}
      />

      {/* 03 — THE MEMORY */}
      <section className="section memory" id="memory" aria-labelledby="memory-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">03</span>
            <span className="label__name">The memory</span>
            <span className="muted">Archive 001 — what is on the table</span>
          </p>
          <div className="memory__head">
            <h2 id="memory-title" className="display memory__title">
              The archive is never complete.
            </h2>
            <p className="memory__lead">
              Three photographs of al-Majdal&rsquo;s looms and market, taken by the American Colony Photo
              Department between 1934 and 1939, now in the Library of Congress. The records beside them, with
              their sources. Push them around. Open any of them.
            </p>
          </div>
        </div>
        <div className="memory__table">
          <MemoryTable items={table} label="Archive material on the table" />
        </div>
        <div className="shell memory__foot">
          <Link href="/archive" className="btn">
            Enter the archive — {archive.length} records
          </Link>
          <p className="meta">Frames stay empty until the object is on file. Nothing is substituted.</p>
        </div>
      </section>

      {/* 04 — THE THREAD */}
      <section className="section threadsec" aria-labelledby="thread-title">
        <Thread
          path={{
            start: [0.62, 0],
            curves: [
              [[0.62, 0.18], [0.2, 0.2], [0.26, 0.4]],
              [[0.32, 0.6], [0.86, 0.52], [0.78, 0.76]],
              [[0.7, 0.96], [0.4, 0.9], [0.44, 1]],
            ],
            knotStart: true,
          }}
        />
        <div className="shell">
          <p className="label">
            <span className="label__index">04</span>
            <span className="label__name">The thread</span>
            <span className="muted">The MAJDAL grammar — our reading, not a historical claim</span>
          </p>
          <h2 id="thread-title" className="visually-hidden">
            The thread
          </h2>
          <ol className="grammar">
            {[
              ["A place", "becomes", "a memory."],
              ["A memory", "becomes", "an archive."],
              ["An archive", "becomes", "a thread."],
              ["The thread", "becomes", "clothing."],
              ["Clothing", "creates", "community."],
              ["Community", "carries it", "forward."],
            ].map(([a, verb, b], i) => (
              <Reveal as="li" key={a} className={`grammar__row grammar__row--${i + 1}`}>
                <span className="display grammar__a">{a}</span>
                <span className="grammar__verb">{verb}</span>
                <span className="display grammar__b">{b}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — THE ROOTS */}
      <section className="section rootsec green-ground" aria-labelledby="roots-title">
        <div className="shell rootsec__grid">
          <p className="label rootsec__label">
            <span className="label__index">05</span>
            <span className="label__name">The roots</span>
          </p>
          <div className="rootsec__tree">
            <Olive variant="woodcut" label="The MAJDAL olive tree: an old tree with a split, twisted trunk and a wide crown, cut as a woodcut." />
            <p className="meta rootsec__cap">Drawn by MAJDAL. An old olive: split trunk, exposed roots, low wide limbs.</p>
          </div>
          <div className="rootsec__text">
            <h2 id="roots-title" className="display rootsec__title">Roots</h2>
            <p className="lead rootsec__lead">
              The olive tree is how MAJDAL draws roots. It is not a symbol we have given a meaning to. It is a
              tree: old, rooted, slow, still there.
            </p>
            <dl className="equation" aria-label="The MAJDAL visual grammar">
              {[
                ["Map", "place"],
                ["Olive tree", "roots"],
                ["Red thread", "continuity"],
                ["Archive", "memory"],
                ["Clothing", "the present"],
                ["Community", "the future"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="meta rootsec__tier">
              <span className="tier" data-tier="INTERPRETATION">INTERPRETATION</span> MAJDAL&rsquo;s own grammar.{" "}
              <Link href="/archive/the-olive-and-the-key" className="link">
                Why an olive tree — record {archiveId(entry("the-olive-and-the-key"))}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 06 — CHAPTER 001 */}
      <section className="section chaptersec" aria-labelledby="chapter-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">06</span>
            <span className="label__name">Chapter {currentChapter.number}</span>
            <span>48 / {currentChapter.name}</span>
          </p>
          <h2 id="chapter-title" className="display chaptersec__title">
            <span className="chaptersec__n">{currentChapter.number}</span>
            <span className="chaptersec__name">{currentChapter.name}</span>
          </h2>
          <div className="chaptersec__body">
            <p className="chaptersec__premise">{currentChapter.premise}</p>
            <dl className="chaptersec__facts">
              <div><dt>Status</dt><dd>Not open</dd></div>
              <div><dt>Objects</dt><dd>{objects.length}</dd></div>
              <div><dt>Code</dt><dd>0048</dd></div>
              <div><dt>Run</dt><dd>{currentChapter.runSize ? `${currentChapter.runSize} pieces` : "Not set"}</dd></div>
            </dl>
            <Link href={`/chapters/${currentChapter.slug}`} className="btn">
              Open Chapter {currentChapter.number}
            </Link>
          </div>
        </div>
      </section>

      {/* 07 — THE OBJECT */}
      <section className="section objectsec" aria-labelledby="object-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">07</span>
            <span className="label__name">The object</span>
            <span className="muted">Technical drawings — no product photography exists yet</span>
          </p>
          {feature ? (
            <div className="objfeat">
              <div className="objfeat__draw paper">
                <Reveal>
                  <GarmentFlat product={feature} callouts />
                </Reveal>
              </div>
              <div className="objfeat__tag paper">
                <p className="objfeat__no">
                  OBJECT {feature.object} · CHAPTER {currentChapter.number} · 48 / {currentChapter.name}
                </p>
                <h2 id="object-title" className="display objfeat__name">
                  {feature.name}
                </h2>
                <p className="objfeat__line">{feature.line}</p>
                <dl className="kv objfeat__kv">
                  <div><dt>Colourway</dt><dd>{feature.colourway.name}</dd></div>
                  <div><dt>Price</dt><dd>{formatPrice(feature.priceCents, feature.currency)}</dd></div>
                  <div><dt>Status</dt><dd>Chapter not open</dd></div>
                </dl>
                <div className="objfeat__proposed">
                  <p className="objfeat__ph">Proposed for sampling — not final</p>
                  <ul>
                    <li>Small MAJDAL logo, chest</li>
                    <li>The olive tree, embroidered</li>
                    <li>The thread, as the seam where the band meets the body</li>
                    <li>Inside label: They carried it. We carry it.</li>
                  </ul>
                </div>
                <Link href={`/shop/${feature.slug}`} className="btn">
                  Read the object
                </Link>
              </div>
            </div>
          ) : null}
          {rest.length ? (
            <ul className="pgrid objectsec__rest" aria-label="The other objects in the chapter">
              {rest.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : null}
          {feature ? <p className="visually-hidden">{calloutsFor(feature).length} numbered details on the drawing.</p> : null}
        </div>
      </section>

      {/* 08 — THE COMMUNITY */}
      <section className="section carrysec" aria-labelledby="carry-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">08</span>
            <span className="label__name">The community</span>
            <span className="muted">{site.community}</span>
          </p>
          <h2 id="carry-title" className="display carrysec__title">
            What do you carry?
          </h2>
          <p className="lead carrysec__lead">
            The archive grows through people. An object, a photograph, a place, a name, a family story, a length of
            cloth. You decide what is shared, how you are credited, and you can withdraw it later.
          </p>
          <ul className="sleeves">
            {KINDS.filter((k) => k.value !== "other").map((k, i) => (
              <li key={k.value} style={{ "--r": `${[-1.5, 1, -0.6, 1.8, -2, 0.8][i % 6]}deg` } as React.CSSProperties}>
                <Link href={`/roots/carry?kind=${k.value}`} className="sleeve">
                  <span className="sleeve__frame" aria-hidden="true">
                    <span className="sleeve__id">MJ-0048-C{String(i + 1).padStart(3, "0")}</span>
                    <span className="sleeve__empty">Not yet received</span>
                  </span>
                  <span className="sleeve__kind">{k.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="carrysec__more">
            <Link href="/roots" className="link">
              Join THE ROOTS
            </Link>{" "}
            — free, no purchase.
          </p>
        </div>
      </section>

      {/* 09 — THE IMPACT */}
      <section className="section impactsec" aria-labelledby="impact-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">09</span>
            <span className="label__name">The impact</span>
            <span className="muted">Ledger — {ledger.currency}</span>
          </p>
          <div className="impactsec__grid">
            <div>
              <h2 id="impact-title" className="display impactsec__pct">
                {site.impactPercent}%
              </h2>
              <p className="wide impactsec__word">Committed</p>
              <p className="impactsec__of">
                Of every eligible product sale, to support people in Palestine. Only confirmed transfers are ever
                published as delivered.
              </p>
            </div>
            <div className="ledger">
              <div className="table-wrap">
                <table className="table">
                  <caption className="visually-hidden">Impact ledger</caption>
                  <thead>
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                      <th scope="col">Recipient</th>
                      <th scope="col">Documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="ledger__empty">
                        No entries. Nothing has been sold, so nothing has been sent.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <dl className="ledger__totals">
                <div><dt>Committed</dt><dd>{formatMoney(totals.accruedCents)}</dd></div>
                <div><dt>Transferred</dt><dd>{formatMoney(totals.transferredCents)}</dd></div>
                <div><dt>Confirmed received</dt><dd>{formatMoney(totals.verifiedCents)}</dd></div>
              </dl>
              <p className="meta ledger__foot">Zero is the truth. The ledger is append-only and published in full.</p>
              <Link href="/impact" className="btn btn--ghost">
                Read the full ledger
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
