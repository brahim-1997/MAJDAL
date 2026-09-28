import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { archiveId } from "@/components/archive/RecordCard";
import { LandFilm } from "@/components/land/LandFilm";
import { Olive } from "@/components/olive/Olive";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { TierBadge } from "@/components/TierBadge";
import { getArchiveEntry } from "@/content/archive";
import { currentChapter } from "@/content/chapters";
import { KINDS } from "@/content/community";
import { productsInChapter } from "@/content/products";
import { site } from "@/content/site";
import { formatMoney, getImpactTotals, ledger } from "@/lib/impact";

const entry = (slug: string) => {
  const e = getArchiveEntry(slug);
  if (!e) throw new Error(`Missing archive entry ${slug}`);
  return e;
};

export default function HomePage() {
  const objects = productsInChapter(currentChapter.slug);
  const totals = getImpactTotals();
  const looms = entry("two-thousand-looms");
  const metres = entry("eight-metres");

  return (
    <>
      <h1 className="visually-hidden">MAJDAL, مجدل — the land remains.</h1>

      {/* 01 — THE LAND: a flight over the whole land */}
      <LandFilm poster="/land/poster.webp">
        <div className="lfo lfo--title" data-r="0:0.11">
          <p className="lfo__h display">
            <span className="blk">The land</span>
            <span className="blk blk--in">remains.</span>
          </p>
          <p className="lfo__scroll">Scroll — fly the land ↓</p>
        </div>
        <dl className="lfo lfo--data kv" data-r="0:0.11">
          <div><dt>Land</dt><dd>Galilee to the Naqab</dd></div>
          <div><dt>Relief</dt><dd>Real elevation · vertical ×7</dd></div>
          <div><dt>Code</dt><dd>0048</dd></div>
        </dl>
        <p className="lfo lfo--memory display" data-r="0.13:0.25">
          <span className="blk">Every place</span>
          <span className="blk">has a</span>
          <span className="blk blk--in">memory.</span>
        </p>
        <div className="lfo lfo--majdal" data-r="0.53:0.645">
          <p className="lfo__id">
            <span className="docid">{archiveId(looms)}</span> <TierBadge tier={looms.tier} />
          </p>
          <p className="display lfo__name">
            <b>Al-Majdal</b> <span className="arabic">مجدل</span>
          </p>
          <p className="lfo__line">The weaving town. Around 2,000 looms worked here by the 1940s, most of them inside people&rsquo;s houses.</p>
        </div>
        <div className="lfo lfo--thread" data-r="0.66:0.78">
          <p className="display">The thread</p>
          <p className="lfo__small">Sewn place to place. A brand line — not a road, not a route.</p>
        </div>
        <p className="lfo lfo--carried display" data-r="0.79:0.905">
          <span className="blk">They carried it.</span>
          <span className="blk blk--in">We carry it.</span>
        </p>
        <div className="lfo lfo--end" data-r="0.915:1.01">
          <p className="display lfo__next">
            <span className="blk">The next generation</span>
            <span className="blk blk--red">carries it forward.</span>
          </p>
          <Logo lockup="primary" tone="bone" className="lfo__logo" alt="" />
        </div>
        <p className="lfo__credit">
          Elevation: NASA SRTM &amp; NOAA ETOPO1 via AWS Terrain Tiles · Outline: Natural Earth · Vertical scale ×7 · Public domain
        </p>
        <span className="lfo__ruler" aria-hidden="true" />
      </LandFilm>

      {/* 02 — MANIFESTO */}
      <section className="section manifesto paper" aria-labelledby="manifesto-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">02</span>
            <span className="label__name">What MAJDAL is</span>
          </p>
          <h2 id="manifesto-title" className="display manifesto__h">
            <span className="manifesto__l1">Not a brand that puts</span>
            <span className="manifesto__l2">Palestine on clothes.</span>
            <span className="manifesto__l3 blk">A clothing brand</span>
            <span className="manifesto__l4">descended from a</span>
            <span className="manifesto__l5">clothing town.</span>
          </h2>
        </div>
      </section>

      {/* 03 — AL-MAJDAL, IN NUMBERS */}
      <section className="section numbers" aria-labelledby="numbers-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">03</span>
            <span className="label__name" id="numbers-title">Al-Majdal, in numbers</span>
            <span className="muted">From the archive — with sources</span>
          </p>
          <ol className="numbers__grid">
            <li>
              <span className="numbers__n display">2,000</span>
              <span className="numbers__l">Looms working in al-Majdal by the 1940s</span>
              <Link href={`/archive/${looms.slug}`} className="numbers__src">{archiveId(looms)} · {looms.tier}</Link>
            </li>
            <li>
              <span className="numbers__n display">8&nbsp;m</span>
              <span className="numbers__l">Of cloth in one piece</span>
              <Link href={`/archive/${metres.slug}`} className="numbers__src">{archiveId(metres)} · {metres.tier}</Link>
            </li>
            <li>
              <span className="numbers__n display">1–2</span>
              <span className="numbers__l">Months of work to weave it</span>
              <Link href={`/archive/${metres.slug}`} className="numbers__src">{archiveId(metres)} · {metres.tier}</Link>
            </li>
            <li>
              <span className="numbers__n display numbers__n--red">1</span>
              <span className="numbers__l">Dress</span>
              <Link href={`/archive/${metres.slug}`} className="numbers__src">{archiveId(metres)} · {metres.tier}</Link>
            </li>
          </ol>
          <p className="meta numbers__note">
            Sources cited on each record. Verified at Gate 1; a named Palestinian reviewer has not yet checked them.
          </p>
        </div>
      </section>

      {/* 04 — THE OLIVE */}
      <section className="section olivesec green-ground" aria-labelledby="olive-title">
        <div className="olivesec__tree">
          <Olive label="An old olive tree, drawn as a traditional engraving: a wide billowing crown, a twisted split trunk, roots." />
        </div>
        <div className="shell olivesec__text">
          <p className="label">
            <span className="label__index">04</span>
            <span className="label__name">The olive</span>
          </p>
          <h2 id="olive-title" className="display olivesec__h">Roots</h2>
          <p className="olivesec__lead">Old trees. Slow work. Roots before fruit.</p>
          <p className="olivesec__body">
            The olive tree is how MAJDAL draws patience: it stays where it is planted, it takes its time, and it is
            handed on. We build the same way — slowly, in the open, with receipts.
          </p>
          <p className="olivesec__tier">
            <span className="tier" data-tier="INTERPRETATION">INTERPRETATION</span>
            <Link href="/archive/the-olive-and-the-key" className="link">
              Read the record — {archiveId(entry("the-olive-and-the-key"))}
            </Link>
          </p>
        </div>
      </section>

      {/* 05 — CHAPTER 001 */}
      <section className="section chaptersec" aria-labelledby="chapter-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">05</span>
            <span className="label__name">Chapter {currentChapter.number}</span>
            <span className="muted">Not open · code 48</span>
          </p>
          <h2 id="chapter-title" className="display chaptersec__h">
            <span className="chaptersec__n">{currentChapter.number}</span>
            <span className="chaptersec__name blk">{currentChapter.name}</span>
          </h2>
          <div className="chaptersec__row">
            <p className="chaptersec__premise">{currentChapter.premise}</p>
            <dl className="chaptersec__facts">
              <div><dt>Status</dt><dd>Not open</dd></div>
              <div><dt>Objects</dt><dd>{objects.length}</dd></div>
              <div><dt>Run</dt><dd>{currentChapter.runSize ? `${currentChapter.runSize} pieces` : "Not set"}</dd></div>
              <div><dt>First to see it</dt><dd>The Roots</dd></div>
            </dl>
          </div>
          <ul className="pgrid chaptersec__objects" aria-label={`The objects of Chapter ${currentChapter.number}`}>
            {objects.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <p className="chaptersec__cta">
            <Link href={`/chapters/${currentChapter.slug}`} className="btn">
              Open Chapter {currentChapter.number}
            </Link>
            <Link href="/roots" className="btn btn--ghost">
              Join The Roots — free
            </Link>
          </p>
        </div>
      </section>

      {/* 06 — WHAT DO YOU CARRY? */}
      <section className="section carrysec paper" aria-labelledby="carry-title">
        <div className="shell">
          <p className="label">
            <span className="label__index">06</span>
            <span className="label__name">{site.community}</span>
          </p>
          <h2 id="carry-title" className="display carrysec__h">
            What do <span className="blk">you</span> carry?
          </h2>
          <p className="lead carrysec__lead">
            The archive grows through people. An object, a photograph, a place, a name, a family story, a length of
            cloth. You decide what is shared and how you are credited — and you can take it back.
          </p>
          <ul className="sleeves">
            {KINDS.filter((k) => k.value !== "other").map((k, i) => (
              <li key={k.value}>
                <Link href={`/roots/carry?kind=${k.value}`} className="sleeve">
                  <span className="sleeve__id">MJ-0048-C{String(i + 1).padStart(3, "0")}</span>
                  <span className="sleeve__kind display">{k.label}</span>
                  <span className="sleeve__empty">Not yet received →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 — IMPACT */}
      <section className="section impactsec red-ground" aria-labelledby="impact-title">
        <div className="shell impactsec__grid">
          <div>
            <p className="label">
              <span className="label__index">07</span>
              <span className="label__name">Impact</span>
            </p>
            <h2 id="impact-title" className="display impactsec__pct">
              {site.impactPercent}%
            </h2>
            <p className="impactsec__of">
              Of every eligible sale, to support people in Palestine. Only confirmed transfers are ever published as
              delivered.
            </p>
          </div>
          <Reveal className="ledger">
            <div className="ledger__panel">
              <p className="ledger__h wide">Ledger — {ledger.currency}</p>
              <div className="table-wrap">
                <table className="table">
                  <caption className="visually-hidden">Impact ledger</caption>
                  <thead>
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                      <th scope="col">Recipient</th>
                      <th scope="col">Proof</th>
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
                <div><dt>Confirmed</dt><dd>{formatMoney(totals.verifiedCents)}</dd></div>
              </dl>
              <p className="ledger__foot">Zero is the truth.</p>
              <Link href="/impact" className="btn">
                Read the full ledger
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
