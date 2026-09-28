"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { places } from "@/content/places";
import { placeLabels, type Pinned } from "./labels";
import type { LandScene, Stop } from "./scene";

/**
 * THE LAND — a flight over the whole land of Palestine, driven by scroll.
 *
 * Real elevation, engraved. The reader holds the crank: scroll moves the
 * camera from a map lying flat (the document) out over the sea, down the
 * coast, to al-Majdal — where the olive tree rises — then up while the red
 * thread is sewn place to place, and back to the whole land.
 *
 * three.js loads after first paint. Until then, and wherever WebGL is not
 * available, the stage shows a still of the same land. Reduced motion: the
 * camera cuts between stops instead of flying.
 */

// World km relative to the grid centre (35.10°E, 31.40°N). z grows south.
const STOPS: Record<string, Stop> = {
  top: { target: [-12, 18], dist: 960, polar: 16, azimuth: -8, shift: 0.2 },
  oblique: { target: [-12, -35], dist: 560, polar: 56, azimuth: -32, shift: -0.2 },
  north: { target: [-8, -158], dist: 210, polar: 56, azimuth: -68 },
  coast: { target: [-18, -78], dist: 230, polar: 58, azimuth: -74 },
  majdal: { target: [-44, -30], dist: 105, polar: 63, azimuth: -80, shift: 0.12 },
  thread: { target: [-10, -85], dist: 470, polar: 42, azimuth: -38, shift: 0.14 },
  south: { target: [-18, 95], dist: 460, polar: 52, azimuth: 16 },
};

// [from p, to p, from stop, to stop]
const MOVES: [number, number, string, string][] = [
  [0.1, 0.22, "top", "oblique"],
  [0.22, 0.36, "oblique", "north"],
  [0.36, 0.5, "north", "coast"],
  [0.5, 0.62, "coast", "majdal"],
  [0.64, 0.74, "majdal", "thread"],
  [0.78, 0.88, "thread", "south"],
  [0.9, 0.98, "south", "top"],
];

const NAMES: [string, number][] = [
  ["akka", 0.3],
  ["haifa", 0.31],
  ["yafa", 0.42],
  ["nablus", 0.44],
  ["al-quds", 0.47],
  ["al-majdal", 0.55],
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerpStop = (a: Stop, b: Stop, t: number): Stop => {
  // shortest turn for azimuth
  let d = b.azimuth - a.azimuth;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return {
    target: [a.target[0] + (b.target[0] - a.target[0]) * t, a.target[1] + (b.target[1] - a.target[1]) * t],
    dist: a.dist * Math.pow(b.dist / a.dist, t),
    polar: a.polar + (b.polar - a.polar) * t,
    azimuth: a.azimuth + d * t,
    shift: (a.shift ?? 0) + ((b.shift ?? 0) - (a.shift ?? 0)) * t,
  };
};

function cameraAt(p: number, reduced: boolean): Stop {
  let s = STOPS.top!;
  for (const [a, b, from, to] of MOVES) {
    if (p < a) break;
    const t = reduced ? 1 : ease(span(p, a, b));
    s = lerpStop(STOPS[from]!, STOPS[to]!, t);
  }
  return s;
}

export function LandFilm({ children, poster }: { children: ReactNode; poster: string }) {
  const track = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const labels = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"pending" | "live" | "unavailable">("pending");

  useEffect(() => {
    const tr = track.current, st = stage.current, cv = canvas.current, lb = labels.current;
    if (!tr || !st || !cv || !lb) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 47.99rem), (pointer: coarse)").matches;
    const overlays = Array.from(st.querySelectorAll<HTMLElement>("[data-r]")).map((el) => ({
      el,
      ranges: (el.dataset.r ?? "").split(" ").map((r) => r.split(":").map(Number) as [number, number]),
    }));

    let land: LandScene | null = null;
    let raf = 0;
    let disposed = false;
    // The land rises once, on arrival — not tied to scroll, so it is never
    // flat when the reader lands on it. Reduced motion: already risen.
    let born = 0;
    const RISE_MS = 2400;
    const labelEls = new Map<string, HTMLElement>();
    lb.querySelectorAll<HTMLElement>("[data-slug]").forEach((el) => labelEls.set(el.dataset.slug!, el));

    const progress = () => {
      const r = tr.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    };

    const frame = () => {
      raf = 0;
      const p = progress();
      for (const { el, ranges } of overlays) {
        const on = ranges.some(([a, b]) => p >= a && p < b);
        if ((el.dataset.on === "1") !== on) el.dataset.on = on ? "1" : "0";
      }
      st.style.setProperty("--p", p.toFixed(4));
      if (!land) return;
      const t = reduced ? 1 : clamp((performance.now() - born) / RISE_MS);
      land.setUniforms({
        rise: 0.03 + 0.97 * ease(t),
        ink: span(t, 0.45, 1),
        // the tree grows at al-Majdal and returns to the ground as we leave
        olive: reduced ? (p >= 0.55 && p < 0.64 ? 1 : 0) : ease(span(p, 0.56, 0.62)) * (1 - ease(span(p, 0.64, 0.69))),
        thread: reduced ? (p >= 0.66 ? 1 : 0) : span(p, 0.66, 0.77),
      });
      land.setCamera(cameraAt(p, reduced));
      land.render();
      // Names stand clear of the header strip and leave the end card alone.
      const top = 96, bottom = st.clientHeight - 48;
      const shown: Pinned[] = [];
      for (const m of land.places) {
        const el = labelEls.get(m.slug);
        if (!el) continue;
        const at = NAMES.find(([s]) => s === m.slug)?.[1] ?? 1;
        const q = land.project(m.world);
        const until = m.slug === "al-majdal" ? 0.9 : 0.78;
        const on = p >= at && p < until && q.visible && q.y > top && q.y < bottom && q.x > 0 && q.x < st.clientWidth - 40;
        el.dataset.on = on ? "1" : "0";
        if (on) shown.push({ el, x: q.x, y: q.y });
      }
      placeLabels(shown);
      if (t < 1) request();
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      land?.resize();
      request();
    };

    frame();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);

    // WebGL after first paint; the still holds the stage until then.
    const start = async () => {
      try {
        const probe = document.createElement("canvas");
        if (!probe.getContext("webgl2")) throw new Error("no webgl2");
        const { createLand } = await import("./scene");
        if (disposed) return;
        land = await createLand(cv, { mode: "film", mobile, oliveSrc: "/olive/olive-engraved.svg" });
        if (disposed) {
          land.dispose();
          return;
        }
        born = performance.now();
        setStatus("live");
        onResize();
      } catch {
        setStatus("unavailable");
      }
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (idle) idle(() => void start());
    else window.setTimeout(() => void start(), 200);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
      land?.dispose();
    };
  }, []);

  return (
    <section className="lf" id="the-land" aria-labelledby="lf-title" data-status={status}>
      <h2 id="lf-title" className="visually-hidden">
        The land — a flight over the whole land of Palestine
      </h2>
      <a className="lf__skip" href="#after-land">
        Skip the flight
      </a>
      <ol className="visually-hidden">
        <li>The whole land of Palestine, from the Galilee to the Naqab, lying flat like a map, rises into relief.</li>
        <li>The camera tilts out over the sea. Every place has a memory.</li>
        <li>North: Akka and Haifa. Down the coast: Yafa, Nablus inland, al-Quds on the ridge.</li>
        <li>Al-Majdal, the weaving town. An olive tree rises there, and returns to the ground as the camera leaves.</li>
        <li>A red thread is sewn from place to place. It is a brand graphic, not a route.</li>
        <li>South over the Naqab, and back to the whole land. They carried it. We carry it. The next generation carries it forward.</li>
      </ol>
      <div className="lf__track" ref={track}>
        <div className="lf__stage" ref={stage} data-ground="night" inert>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lf__poster" src={poster} alt="" decoding="async" fetchPriority="high" />
          <canvas className="lf__canvas" ref={canvas} />
          <div className="lf__labels" ref={labels}>
            {NAMES.map(([slug]) => (
              <span key={slug} className={`lf__label${slug === "al-majdal" ? " is-origin" : ""}`} data-slug={slug} data-on="0">
                <PlaceName slug={slug} />
              </span>
            ))}
          </div>
          {children}
        </div>
      </div>
      <span id="after-land" />
    </section>
  );
}

function PlaceName({ slug }: { slug: string }) {
  const p = places.find((q) => q.slug === slug)!;
  return (
    <>
      <b>{p.name}</b>
      <i className="arabic">{p.nameArabic}</i>
    </>
  );
}
