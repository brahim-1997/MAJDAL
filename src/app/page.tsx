import Link from "next/link";
import { archiveId } from "@/components/archive/RecordCard";
import { GarmentFlat } from "@/components/product/GarmentFlat";
import { StickerWall, type Sticker } from "@/components/street/StickerWall";
import { Ticker } from "@/components/street/Ticker";
import { TierBadge } from "@/components/TierBadge";
import { WovenHero } from "@/components/weave/WovenHero";
import { getArchiveEntry } from "@/content/archive";
import { currentChapter } from "@/content/chapters";
import { KINDS } from "@/content/community";
import { formatPrice, productsInChapter } from "@/content/products";
import { site } from "@/content/site";
import { WATERMELON } from "@/content/watermelon";
import { formatMoney, getImpactTotals, ledger } from "@/lib/impact";

const entry = (slug: string) => {
  const e = getArchiveEntry(slug);
  if (!e) throw new Error(`Missing archive entry ${slug}`);
  return e;
};

const STATUS: Record<string, string> = {
  coming: "Not open",
  available: "Available",
  "sold-out": "Sold out",
  closed: "Closed",
};

// Where each sticker lands on the wall (percent of the wall) and how it leans.
const PLACES: [number, number, number, "white" | "black"][] = [
  [0, 4, -7, "white"],
  [30, 0, 4, "black"],
  [70, 12, -3, "white"],
  [3, 56, 5, "black"],
  [29, 46, -5, "white"],
  [73, 62, 8, "black"],
];

export default function HomePage() {
  const objects = productsInChapter(currentChapter.slug);
  const totals = getImpactTotals();
  const looms = entry("two-thousand-looms");
  const metres = entry("eight-metres");
  const melon = entry("the-watermelon");
  const stickers: Sticker[] = KINDS.filter((k) => k.value !== "other").map((k, i) => {
    const [x, y, tilt, tone] = PLACES[i % PLACES.length]!;
    return {
      href: `/roots/carry?kind=${k.value}`,
      label: k.label,
      code: `MJ-0048-C${String(i + 1).padStart(3, "0")}`,
      tone,
      tilt,
      x,
      y,
    };
  });

  return (
    <>
      <Ticker
        className="ticker--top"
        speed={48}
        items={[
          `Chapter ${currentChapter.number} — ${currentChapter.name} — not open`,
          `${site.impactPercent}% of eligible sales to people in Palestine`,
          `Ledger ${formatMoney(totals.verifiedCents)} — nothing sold yet`,
          "The Roots — free",
          "0048",
        ]}
      />

      {/* 01 — THE CLOTH */}
      <WovenHero>
        <Link href={`/archive/${melon.slug}`} className="hero__file" data-cursor="Read">
          <span>File {archiveId(melon)}</span>
          <span>The watermelon</span>
          <TierBadge tier={melon.tier} />
        </Link>
        <h1 id="hero-title" className="hero__h">
          <span className="hero__small">They carried it.</span>
          <span className="hero__big">We carry</span>
          <span className="hero__big hero__big--red">it.</span>
        </h1>
        <div className="hero__foot">
          <p className="hero__note">
            A watermelon, woven. Every square is one crossing of two threads — over or under, the decision a weaver
            makes at every crossing. <span className="hero__hint">Move across the cloth.</span>
          </p>
          <p className="hero__cta">
            <Link href={`/chapters/${currentChapter.slug}`} className="sbtn sbtn--red" data-cursor="Open">
              Chapter {currentChapter.number} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/roots" className="sbtn sbtn--ghost" data-cursor="Join">
              Join The Roots <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        <span className="hero__sticker" aria-hidden="true">
          مجدل
        </span>
      </WovenHero>

      <Ticker
        className="ticker--red"
        speed={30}
        items={[...site.story]}
      />

      {/* 02 — THE DROP */}
      <section className="drop paper" aria-labelledby="drop-title">
        <header className="drop__head">
          <p className="stag">02 — The drop</p>
          <h2 id="drop-title" className="drop__h">
            <span className="drop__n">{currentChapter.number}</span>
            <span className="drop__name">{currentChapter.name}</span>
          </h2>
          <dl className="drop__facts">
            <div><dt>Status</dt><dd className="schip schip--black">Not open</dd></div>
            <div><dt>Opens</dt><dd>{currentChapter.opensAt ?? "No date set"}</dd></div>
            <div><dt>Run</dt><dd>{currentChapter.runSize} pieces</dd></div>
            <div><dt>First look</dt><dd>The Roots</dd></div>
          </dl>
          <p className="drop__premise">{currentChapter.premise}</p>
        </header>
        <ul className="drop__grid">
          {objects.map((p, i) => (
            <li key={p.slug} className="drop__item" style={{ ["--tilt" as string]: `${[-1.2, 0.8, -0.6, 1.4][i % 4]}deg` }}>
              <Link href={`/shop/${p.slug}`} className="dcard" data-cursor="View">
                <span className="dcard__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="dcard__img">
                  <GarmentFlat product={p} uid="drop" />
                </span>
                <span className="dcard__meta">
                  <span className="dcard__name">{p.name}</span>
                  <span className="dcard__row">
                    <span>{formatPrice(p.priceCents, p.currency)}</span>
                    <span className="schip">{STATUS[p.status]}</span>
                  </span>
                  <span className="dcard__obj">Object {p.object} · Chapter {currentChapter.number}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="drop__cta">
          <Link href="/shop" className="sbtn sbtn--black" data-cursor="Shop">
            All objects <span aria-hidden="true">→</span>
          </Link>
          <span className="drop__small">No checkout until the chapter opens. No fake countdown.</span>
        </p>
      </section>

      {/* 03 — THE WATERMELON: the record behind the motif */}
      <section className="melon" aria-labelledby="melon-title">
        <div className="melon__pin">
          <header className="melon__head">
            <p className="stag stag--night">03 — Why a watermelon</p>
            <h2 id="melon-title" className="melon__h">
              <span>The flag</span>
              <span>was banned.</span>
              <span className="melon__h-red">The colours</span>
              <span className="melon__h-red">were in a fruit.</span>
            </h2>
            <p className="melon__lead">
              Red, black, white, green. What is on the record, what is only a story, and what is ours — marked, line by
              line.
            </p>
          </header>
          <ol className="melon__track" aria-label="The watermelon, 1967 to 2024">
            {WATERMELON.map((m) => (
              <li key={m.year + m.head} className="mcard" data-tier={m.tier}>
                <span className="mcard__year">{m.year}</span>
                <TierBadge tier={m.tier} />
                <h3 className="mcard__head">{m.head}</h3>
                <p className="mcard__line">{m.line}</p>
                <p className="mcard__src">{m.source}</p>
              </li>
            ))}
            <li className="mcard mcard--ours">
              <span className="mcard__year">Us</span>
              <span className="tier" data-tier="INTERPRETATION">INTERPRETATION</span>
              <h3 className="mcard__head">Woven, not printed</h3>
              <p className="mcard__line">
                A clothing brand from a weaving town puts the colours back into cloth. The record goes with it, so the
                fruit never stands alone.
              </p>
              <Link href={`/archive/${melon.slug}`} className="mcard__link" data-cursor="Read">
                Full record {archiveId(melon)} →
              </Link>
            </li>
          </ol>
        </div>
        <p className="melon__q">
          <span className="stag stag--night">Open question</span> {melon.openQuestion}
        </p>
      </section>

      {/* 04 — AL-MAJDAL: where the name comes from */}
      <section className="town paper" aria-labelledby="town-title">
        <p className="stag">04 — Our story</p>
        <h2 id="town-title" className="town__h">
          <span>Not a brand that puts Palestine on clothes.</span>
          <span className="town__h-blk">A clothing brand descended from a clothing town.</span>
        </h2>
        <ul className="bento">
          <li className="bento__a">
            <span className="bento__n">2,000</span>
            <span className="bento__l">looms working in al-Majdal by the 1940s — most of them inside people&rsquo;s houses</span>
            <Link href={`/archive/${looms.slug}`} className="bento__src">{archiveId(looms)} · {looms.tier}</Link>
          </li>
          <li className="bento__b">
            <span className="bento__n">8 m</span>
            <span className="bento__l">of cloth in one piece</span>
            <Link href={`/archive/${metres.slug}`} className="bento__src">{archiveId(metres)} · {metres.tier}</Link>
          </li>
          <li className="bento__c">
            <span className="bento__n">1–2</span>
            <span className="bento__l">months to weave it</span>
            <Link href={`/archive/${metres.slug}`} className="bento__src">{archiveId(metres)} · {metres.tier}</Link>
          </li>
          <li className="bento__d">
            <span className="bento__n">1</span>
            <span className="bento__l">dress</span>
          </li>
          <li className="bento__e">
            <span className="bento__big">1948</span>
            <span className="bento__l">
              The town was taken. Its people were expelled in stages over the following years, most of them to Gaza.
              The weavers kept weaving. The cloth still carries the town&rsquo;s name: Majdalawi.
            </span>
            <Link href="/story" className="bento__src" data-cursor="Read">Read the story →</Link>
          </li>
          <li className="bento__f">
            <span className="bento__l">The whole land, in relief — real elevation, every place with its record.</span>
            <Link href="/map" className="sbtn sbtn--black" data-cursor="Fly">
              See the land <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 05 — THE ROOTS: the community */}
      <section className="roots green-ground" aria-labelledby="roots-title">
        <div className="roots__text">
          <p className="stag stag--night">05 — {site.community}</p>
          <h2 id="roots-title" className="roots__h">
            What do <span className="roots__you">you</span> carry?
          </h2>
          <p className="roots__lead">
            The archive grows through people. An object, a photograph, a place, a name, a family story, a length of
            cloth. You decide what is shared and how you are credited — and you can take it back.
          </p>
          <div className="card-id" aria-label="The Roots membership">
            <p className="card-id__top">
              <span>The Roots</span>
              <span>MJ-0048</span>
            </p>
            <p className="card-id__no">Nº — — — —</p>
            <p className="card-id__foot">Free. No list yet: we store nothing until we can store it lawfully.</p>
          </div>
          <p className="roots__cta">
            <Link href="/roots" className="sbtn sbtn--white" data-cursor="Join">
              Join The Roots <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        <StickerWall stickers={stickers} label="What you can carry — each opens the form" />
      </section>

      {/* 06 — 15% */}
      <section className="impact" aria-labelledby="impact-title">
        <div className="impact__pct">
          <p className="stag stag--night">06 — Impact</p>
          <h2 id="impact-title" className="impact__n">
            {site.impactPercent}%
          </h2>
          <p className="impact__of">
            Of every eligible sale, to people in Palestine. Only confirmed transfers are ever published as delivered.
          </p>
        </div>
        <div className="receipt" role="group" aria-label="Impact ledger receipt">
          <p className="receipt__h">MAJDAL — LEDGER</p>
          <p className="receipt__sub">{ledger.currency} · public · append-only</p>
          <dl className="receipt__rows">
            <div><dt>Entries</dt><dd>0</dd></div>
            <div><dt>Committed</dt><dd>{formatMoney(totals.accruedCents)}</dd></div>
            <div><dt>Transferred</dt><dd>{formatMoney(totals.transferredCents)}</dd></div>
            <div><dt>Confirmed</dt><dd>{formatMoney(totals.verifiedCents)}</dd></div>
          </dl>
          <p className="receipt__total">Zero is the truth.</p>
          <p className="receipt__foot">Nothing has been sold, so nothing has been sent.</p>
          <Link href="/impact" className="receipt__link" data-cursor="Read">
            Read the full ledger →
          </Link>
        </div>
      </section>

      <Ticker className="ticker--white" speed={36} reverse items={["The Roots", "Chapter 001", "مجدل", "0048", "What do you carry?"]} />
    </>
  );
}
