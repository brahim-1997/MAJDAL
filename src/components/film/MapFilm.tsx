"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MapSheet } from "@/components/map/MapSheet";
import { Olive } from "@/components/olive/Olive";
import { createInk } from "./ink";
import { PxPath } from "./PxPath";
import { placed } from "@/lib/geo";

/**
 * THE MAP THAT REMEMBERS.
 *
 * A film on a 2D map sheet, driven by scroll. No 3D, no terrain: the camera
 * is the SVG viewBox — pan, zoom, crop — and every other move is paper, ink,
 * thread and a hard cut. Scroll is the projector's crank: the reader decides
 * the speed, and can stop on any frame.
 *
 * Reduced motion: the same scenes, as hard cuts only — the camera jumps, the
 * ink is already dry, the thread is already sewn.
 */

type Box = { x: number; y: number; w: number; h: number };

// Regions of the sheet the camera frames (sheet units, see MapSheet).
const CAM: Record<string, Box> = {
  all: { x: 380, y: 640, w: 880, h: 1330 },
  north: { x: 425, y: 310, w: 540, h: 400 },
  mid: { x: 400, y: 740, w: 560, h: 500 },
  majdal: { x: 232, y: 922, w: 380, h: 260 },
  weave: { x: 380, y: 620, w: 720, h: 1160 },
  olive: { x: 262, y: 902, w: 320, h: 210 },
  yafa: { x: 300, y: 742, w: 320, h: 230 },
};

// Camera moves: [from p, to p, from box, to box]. Between moves it holds.
const MOVES: [number, number, keyof typeof CAM, keyof typeof CAM][] = [
  [0.16, 0.215, "all", "north"],
  [0.215, 0.262, "north", "mid"],
  [0.262, 0.3, "mid", "majdal"],
  [0.35, 0.38, "majdal", "weave"],
  [0.42, 0.445, "weave", "olive"],
  [0.65, 0.675, "all", "yafa"],
];

// Places appear one at a time as the camera passes them.
const NAMES: [string, number][] = [
  ["akka", 0.2],
  ["haifa", 0.212],
  ["nablus", 0.232],
  ["yafa", 0.246],
  ["al-quds", 0.262],
  ["al-majdal", 0.286],
];

export const SCENES = [
  { from: 0, name: "48" },
  { from: 0.055, name: "Paper" },
  { from: 0.08, name: "Ink" },
  { from: 0.16, name: "The camera moves" },
  { from: 0.215, name: "Place names" },
  { from: 0.3, name: "Majdal" },
  { from: 0.35, name: "The thread" },
  { from: 0.42, name: "The olive tree" },
  { from: 0.48, name: "Roots" },
  { from: 0.53, name: "Layers" },
  { from: 0.6, name: "The table" },
  { from: 0.65, name: "Another part of the map" },
  { from: 0.7, name: "A second object" },
  { from: 0.74, name: "Connected" },
  { from: 0.78, name: "Cut" },
  { from: 0.87, name: "They carried it" },
  { from: 0.905, name: "We carry it" },
  { from: 0.935, name: "Forward" },
  { from: 0.97, name: "Chapter 001" },
] as const;

// Which ground the stage is, per range — the header reads it.
const PAPER: [number, number][] = [
  [0.055, 0.53],
  [0.65, 0.74],
  [0.78, 0.795],
  [0.815, 0.83],
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

function cameraAt(p: number, reduced: boolean): Box {
  let box = CAM.all!;
  for (const [a, b, from, to] of MOVES) {
    if (p < a) break;
    const t = reduced ? (p >= a ? 1 : 0) : ease(span(p, a, b));
    box = lerpBox(CAM[from]!, CAM[to]!, t);
  }
  // Scene 15's map cuts and scene 12's return to the whole sheet
  if (p >= 0.6 && p < 0.65) box = CAM.all!;
  if (p >= 0.78 && p < 0.795) box = CAM.all!;
  if (p >= 0.815 && p < 0.83) box = CAM.majdal!;
  return box;
}

export function MapFilm({
  layers,
  second,
  archivePhoto,
  record,
  garment,
  logo,
}: {
  /** Scene 10: the photograph in the stack. */
  layers: ReactNode;
  /** Scene 13: the second archive object. */
  second: ReactNode;
  /** Scene 15: the archive cut. */
  archivePhoto: ReactNode;
  /** Scene 10: the document in the stack. */
  record: ReactNode;
  /** Scene 15: the garment cut. */
  garment: ReactNode;
  /** Scene 19. */
  logo: ReactNode;
}) {
  const track = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const hud = useRef<HTMLSpanElement | null>(null);
  const hudName = useRef<HTMLSpanElement | null>(null);
  const ruler = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const tr = track.current;
    const st = stage.current;
    const cv = canvas.current;
    if (!tr || !st || !cv) return;
    const svg = st.querySelector<SVGSVGElement>("svg.sheet");
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ink = createInk(cv, [233, 228, 216]);
    const thread = svg.querySelector<SVGPathElement>('[data-layer="thread"] path');
    const grow = svg.querySelector<SVGCircleElement>("[data-olive-grow]");
    const placeEls = new Map<string, SVGGElement>();
    svg.querySelectorAll<SVGGElement>("[data-place]").forEach((g) => placeEls.set(g.dataset.place!, g));
    const mark = svg.querySelector<SVGGElement>('[data-layer="mark"]');
    const overlays = Array.from(st.querySelectorAll<HTMLElement | SVGElement>("[data-r]")).map((el) => ({
      el,
      ranges: (el.dataset.r ?? "").split(" ").map((r) => r.split(":").map(Number) as [number, number]),
    }));

    // Ink starts where al-Majdal will be on screen in the overview.
    const majdal = placed().find((q) => q.slug === "al-majdal")!;

    let lastScene = -1;
    let lastGround = "";
    let raf = 0;

    const frame = () => {
      raf = 0;
      const r = tr.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(-r.top / Math.max(1, r.height - vh));

      // camera
      const sw = st.clientWidth;
      const sh = st.clientHeight;
      const aspect = sw / Math.max(1, sh);
      const box = cameraAt(p, reduced);
      const vbH = Math.max(box.h, box.w / aspect);
      const vbW = vbH * aspect;
      svg.setAttribute("viewBox", `${(box.x - vbW / 2).toFixed(1)} ${(box.y - vbH / 2).toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`);

      // ink: scene 3
      const inkT = reduced ? (p >= 0.08 ? 1 : 0) : span(p, 0.085, 0.15);
      cv.style.visibility = inkT >= 1 ? "hidden" : "visible";
      if (inkT < 1) {
        ink.setOrigin((majdal.x - (box.x - vbW / 2)) / vbW, (majdal.y - (box.y - vbH / 2)) / vbH);
        ink.draw(inkT);
      }

      // names, mark, thread, olive
      for (const [slug, at] of NAMES) {
        const on = p >= at && !(p >= 0.53 && p < 0.65);
        placeEls.get(slug)?.setAttribute("data-on", on ? "1" : "0");
      }
      mark?.setAttribute("data-on", p >= 0.3 ? "1" : "0");
      if (thread) {
        const t = reduced ? (p >= 0.35 ? 1 : 0) : span(p, 0.36, 0.415);
        thread.style.strokeDashoffset = String(1 - t);
        // a thread, not a rope: constant on screen however close the camera
        thread.style.strokeWidth = (2.6 * (vbH / sh)).toFixed(2);
      }
      if (grow) {
        const t = reduced ? (p >= 0.42 ? 1 : 0) : span(p, 0.445, 0.475);
        grow.setAttribute("r", String(Math.round(t * 150)));
      }

      // overlays: each declares its own range
      for (const { el, ranges } of overlays) {
        const on = ranges.some(([a, b]) => p >= a && p < b);
        if ((el.dataset.on === "1") !== on) el.dataset.on = on ? "1" : "0";
      }
      st.style.setProperty("--spread", String(reduced ? (p >= 0.6 ? 1 : 0) : ease(span(p, 0.6, 0.64))));
      st.style.setProperty("--connect", String(reduced ? (p >= 0.74 ? 1 : 0) : span(p, 0.745, 0.775)));

      // scene + ground
      let scene = 0;
      SCENES.forEach((s, i) => {
        if (p >= s.from) scene = i;
      });
      if (scene !== lastScene) {
        lastScene = scene;
        st.dataset.scene = String(scene + 1);
        if (hud.current) hud.current.textContent = String(scene + 1).padStart(2, "0");
        if (hudName.current) hudName.current.textContent = SCENES[scene]!.name;
      }
      if (ruler.current) ruler.current.style.setProperty("--p", p.toFixed(4));
      const ground = PAPER.some(([a, b]) => p >= a && p < b) ? "paper" : "night";
      if (ground !== lastGround) {
        lastGround = ground;
        st.dataset.ground = ground;
        window.dispatchEvent(new Event("majdal:ground"));
      }
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      ink.resize();
      request();
    };
    frame();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="film" id="the-map" aria-labelledby="film-title">
      <h2 id="film-title" className="visually-hidden">
        02 — The map that remembers
      </h2>
      <a className="film__skip" href="#memory">
        Skip the map film
      </a>

      {/* The film in words, for screen readers. The stage itself is hidden
          from assistive tech: it is the same content, performed. */}
      <ol className="visually-hidden">
        <li>Black. 48. The land remembers.</li>
        <li>A sheet of paper. A map is inked onto it: SHEET 00, al-Majdal and the coast, drawn by MAJDAL from public-domain Natural Earth data.</li>
        <li>The camera moves down the coast. Akka, Haifa, Nablus, Yafa, al-Quds, al-Majdal appear one at a time.</li>
        <li>Majdal — مجدل. A red thread is sewn across the sheet, place to place. It is a brand graphic, not a route.</li>
        <li>An olive tree grows from al-Majdal and becomes a stamp: ROOTS.</li>
        <li>Layers on a table: the map, a photograph of men working at looms in al-Majdal (American Colony Photo Department, 1934–1939, Library of Congress), a record, the olive stamp, the thread.</li>
        <li>Yafa: no photograph in the archive yet. A second object: a man at a loom in al-Majdal. The thread connects them.</li>
        <li>Map. Garment. Map. Person. Archive.</li>
        <li>They carried it. We carry it. The next generation carries it forward.</li>
        <li>MAJDAL — مجدل. Chapter 001 — Roots.</li>
      </ol>

      <div className="film__track" ref={track}>
        <div className="film__stage" ref={stage} data-scene="1" data-ground="night" inert>
          {/* --- the map on its paper --- */}
          <div className="film__paper" data-r="0.055:0.53 0.65:0.74 0.78:0.795 0.815:0.83" />
          <div className="film__map" data-r="0.08:0.53 0.65:0.74 0.78:0.795 0.815:0.83">
            <MapSheet id="film" thread olive oliveGrow preserveAspectRatio="xMidYMid meet" />
          </div>
          <canvas className="film__ink" ref={canvas} data-r="0.055:0.16" />
          <div className="film__grain" data-r="0.055:0.53 0.65:0.74 0.78:0.795 0.815:0.83" />

          {/* 01 */}
          <p className="film__o film__48" data-r="0:0.03">48</p>
          <p className="film__o film__remember display" data-r="0.03:0.055">The land remembers.</p>

          {/* 06 */}
          <div className="film__o film__majdal" data-r="0.3:0.35">
            <span className="display">Majdal</span>
            <span className="arabic">مجدل</span>
          </div>

          {/* 07 */}
          <p className="film__o film__note" data-r="0.37:0.42">
            <span className="film__notek">The thread</span> A MAJDAL graphic layer, sewn place to place. Not a road, not a route.
          </p>

          {/* 09 */}
          <div className="film__o film__stamp" data-r="0.48:0.53">
            <span className="ostamp">
              <Olive variant="woodcut" />
              <span className="ostamp__line">MAJDAL · 0048 · CHAPTER 001</span>
            </span>
          </div>
          <p className="film__o film__roots display" data-r="0.505:0.53">Roots</p>

          {/* 10–11: the table */}
          <div className="film__o film__table" data-r="0.53:0.65">
            <div className="film__sheet film__sheet--map paper">
              <MapSheet id="film-crop" bare thread viewBox="90 820 330 230" preserveAspectRatio="xMidYMid slice" />
            </div>
            <div className="film__sheet film__sheet--photo">{layers}</div>
            <div className="film__sheet film__sheet--doc paper">{record}</div>
            <p className="film__sheet film__sheet--text display">Around two thousand looms.</p>
            <div className="film__sheet film__sheet--olive">
              <span className="ostamp">
                <Olive variant="woodcut" />
                <span className="ostamp__word">Roots</span>
              </span>
            </div>
            <PxPath className="film__sheet film__sheet--thread" pts={[[-0.05, 0.7], [0.22, 0.42], [0.46, 0.9], [0.7, 0.5], [1.05, 0.3]]} />
          </div>

          {/* 12–14: another part of the map, a second object, connected */}
          <div className="film__o film__slot" data-r="0.675:0.78">
            <span className="film__slotid">YAFA — يافا</span>
            <span className="film__slotnote">No photograph of Yafa in the archive yet.</span>
            <span className="film__slotnote">This is where one goes when someone sends it.</span>
          </div>
          <div className="film__o film__second" data-r="0.7:0.78">{second}</div>
          <div className="film__o film__connect" data-r="0.74:0.78">
            <PxPath pts={[[0.3, 0.42], [0.42, 0.24], [0.56, 0.78], [0.7, 0.5]]} />
          </div>

          {/* 15: cuts */}
          <div className="film__o film__cut film__cut--garment" data-r="0.795:0.815">
            <div className="film__garment paper">{garment}</div>
            <p className="film__cutlabel">Object 001 — Roots hoodie</p>
          </div>
          <div className="film__o film__cut film__cut--person" data-r="0.83:0.85">
            <div className="film__person">
              <span className="film__personid">0048 / THE NEXT</span>
              <span className="film__personnote">This frame is empty. The first portrait in the archive will be someone who sends what they carry.</span>
            </div>
          </div>
          <div className="film__o film__cut film__cut--archive" data-r="0.85:0.87">{archivePhoto}</div>

          {/* 16–18 */}
          <p className="film__o film__line display" data-r="0.87:0.905">They carried it.</p>
          <p className="film__o film__line display" data-r="0.905:0.935">We carry it.</p>
          <p className="film__o film__line film__line--long display" data-r="0.935:0.97">
            The next generation carries it forward.
          </p>

          {/* 19 */}
          <div className="film__o film__end" data-r="0.97:1.01">
            {logo}
            <p className="wide film__chapter">Chapter 001 — Roots</p>
          </div>

          {/* the slate */}
          <p className="film__hud">
            <span>02 · The map that remembers</span>
            <span>
              Scene <span ref={hud}>01</span>/19 · <span ref={hudName}>48</span>
            </span>
          </p>
          <span className="film__ruler" ref={ruler} />
        </div>
      </div>
    </section>
  );
}
