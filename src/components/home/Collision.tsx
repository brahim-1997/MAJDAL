"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { HeroMap } from "./HeroMap";
import { Barcode } from "@/components/brut/Barcode";
import { Crosshair } from "@/components/brut/Crosshair";
import { Thread } from "@/components/brut/Thread";
import { currentChapter } from "@/content/chapters";
import { places } from "@/content/places";
import { site } from "@/content/site";
import { distanceKm, unproject } from "@/lib/geo";

type Readout = { x: number; y: number; lat: number; lon: number; near: string; km: number };

/**
 * THE COLLISION — the hero as a poster pasted from layers that disagree.
 *
 * Behaviours, all optional, none required to use the page:
 *  - move over the map: the real coordinates under the pointer, and the
 *    distance to the nearest place in the register
 *  - hover the giant MAJ/DAL: the Arabic plate prints over it in red
 *  - the small 48 is a button: it says what 48 means, in one sentence
 */
export function Collision() {
  const root = useRef<HTMLElement | null>(null);
  const [read, setRead] = useState<Readout | null>(null);
  const [open48, setOpen48] = useState(false);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const host = root.current;
    if (!host) return;
    const svg = [...host.querySelectorAll<SVGSVGElement>("svg.hm")].find(
      (s) => s.getBoundingClientRect().width > 0 && getComputedStyle(s).display !== "none",
    );
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const { lat, lon } = unproject(pt.x, pt.y);
    let near = "";
    let km = Infinity;
    for (const p of places) {
      const d = distanceKm({ lat, lon }, p.coordinates);
      if (d < km) {
        km = d;
        near = p.name;
      }
    }
    const box = host.getBoundingClientRect();
    setRead({ x: e.clientX - box.left, y: e.clientY - box.top, lat, lon, near, km });
  }, []);

  return (
    <section
      ref={root}
      className="col grain"
      aria-labelledby="col-title"
      onPointerMove={onMove}
      onPointerLeave={() => setRead(null)}
    >
      <div className="col__map">
        <HeroMap variant="wide" id="hmw" />
        <HeroMap variant="tall" id="hmt" />
      </div>

      <Thread
        path={{
          start: [0.276, 0.804],
          knotStart: true,
          curves: [
            [[0.34, 0.62], [0.58, 0.64], [0.52, 0.86]],
            [[0.46, 1.02], [0.14, 0.9], [0.08, 1.0]],
          ],
        }}
      />

      <div className="col__48" aria-hidden="true">
        48
      </div>

      <div className="col__huge" aria-hidden="true">
        <span className="col__maj">MAJ</span>
        <span className="col__dal">DAL</span>
        <span className="col__ghost col__ghost--maj">MAJ</span>
        <span className="col__ghost col__ghost--dal">DAL</span>
        <span className="col__overprint arabic">مجدل</span>
      </div>

      <div className="col__lockup">
        <div className="col__code">
          <button
            type="button"
            className="col__48btn"
            aria-expanded={open48}
            aria-controls="col-48-meaning"
            onClick={() => setOpen48((v) => !v)}
          >
            {site.code}
          </button>
          <span className="meta col__coords">{site.origin.label}</span>
        </div>
        <p id="col-48-meaning" className="col__meaning" hidden={!open48}>
          1948 — and everyone who has carried this since.
        </p>

        <h1 id="col-title" className="col__title">
          <span className="display col__word">{site.name}</span>
          <span className="arabic col__ar">{site.nameArabic}</span>
        </h1>

      </div>

      <p className="col__chapter wide">
        <Link href={`/chapters/${currentChapter.slug}`}>
          Chapter {currentChapter.number} — {currentChapter.name}
        </Link>
      </p>

      <ul className="col__tags" aria-label="Enter">
        <li className="col__tag col__tag--1">
          <Link href="/archive" className="tag">Archive 001</Link>
        </li>
        <li className="col__tag col__tag--2">
          <Link href="/map" className="tag">The land</Link>
        </li>
        <li className="col__tag col__tag--3">
          <Link href="/archive/taken-in-1948" className="tag">1948</Link>
        </li>
        <li className="col__tag col__tag--4">
          <a href="#the-land" className="tag">The thread</a>
        </li>
      </ul>

      <p className="col__phil meta">
        Rooted in history.
        <br />
        Built for tomorrow.
      </p>

      <span className="stamp stamp--blue col__stamp" aria-hidden="true">
        Archive this
      </span>

      <Link href="/roots/carry" className="sticker col__carry">
        What do
        <br />
        you carry?
      </Link>

      <div className="col__bar">
        <Barcode value="MAJDAL-48" />
      </div>

      <Crosshair className="col__x col__x--tl" />
      <Crosshair className="col__x col__x--br" />

      <p className="col__credit meta" aria-hidden="true">
        Map drawn by MAJDAL · Natural Earth coast, public domain · not a historical scan
      </p>

      {read ? (
        <div className="col__read" style={{ left: read.x, top: read.y }} aria-hidden="true">
          <span>
            {read.lat.toFixed(3)}° N {read.lon.toFixed(3)}° E
          </span>
          <span>
            {read.near} {read.km < 1 ? "<1" : Math.round(read.km)} km
          </span>
        </div>
      ) : null}
    </section>
  );
}
