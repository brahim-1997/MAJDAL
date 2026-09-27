import { Logo } from "@/components/brand/Logo";
import { InkReveal } from "@/components/film/InkReveal";
import { PxPath } from "@/components/film/PxPath";
import { MapSheet } from "@/components/map/MapSheet";
import { site } from "@/content/site";

/**
 * 01 — THE LAND.
 *
 * Black. The logo. 48. A fragment of the map, inked in. مجدل. ROOTS. The
 * thread through it. The olive tree. Then the line, one word-group at a time.
 *
 * The sequence is a CSS timeline, armed by the script in <head> before first
 * paint, once per session, never under reduced motion. Any key, click, touch
 * or scroll ends it at its final frame. Without JS it is simply the poster.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-ground="night">
      <span className="hero__clock" aria-hidden="true" />

      <div className="hero__intrologo" aria-hidden="true">
        <Logo lockup="primary" tone="bone" alt="" eager />
      </div>

      <p className="hero__code" aria-hidden="true">
        <span className="hero__48">48</span>
        <span className="hero__coords">{site.origin.label}</span>
      </p>

      <figure className="hero__frag">
        <p className="hero__roots tag" aria-hidden="true">Roots · Sheet 00</p>
        <div className="hero__fragpaper paper">
          <MapSheet id="hero" viewBox="70 842 380 250" bare thread olive preserveAspectRatio="xMidYMid slice" />
          <InkReveal at={2000} duration={1500} anchor=".hero__clock" />
        </div>
        <figcaption className="hero__fragcap">
          <dl className="kv">
            <div><dt>Map</dt><dd>Sheet 00 — detail</dd></div>
            <div><dt>Location</dt><dd>al-Majdal · {site.origin.label}</dd></div>
            <div><dt>Source</dt><dd>Drawn by MAJDAL from Natural Earth, public domain. Not a historical scan.</dd></div>
          </dl>
        </figcaption>
      </figure>

      <p className="hero__ar arabic" aria-hidden="true">مجدل</p>

      {/* The thread leaves the map where the map's own thread enters it,
          and runs on under the story. */}
      <PxPath className="hero__thread hero__thread--wide" pts={[[0.53, 0.64], [0.565, 0.74], [0.5, 0.86], [0.3, 0.9], [0.1, 1.04]]} />
      <PxPath className="hero__thread hero__thread--tall" pts={[[0.12, 0.43], [0.2, 0.52], [0.08, 0.64], [0.4, 0.8], [0.7, 1.04]]} />

      <h1 id="hero-title" className="hero__title display">
        <span className="visually-hidden">MAJDAL, مجدل — </span>
        <span className="hero__l hero__l--1">The land</span>
        <span className="hero__l hero__l--2">remains</span>
        <span className="hero__l hero__l--3">in the</span>
        <span className="hero__l hero__l--4">story.</span>
      </h1>

      <p className="hero__chapter vlabel" aria-hidden="true">Chapter 001 — Roots · /48</p>

      <a className="hero__next" href="#the-map">
        <span aria-hidden="true">↓</span> 02 The map that remembers
      </a>

      <p className="hero__skip meta" aria-hidden="true">Any key to skip</p>
    </section>
  );
}
