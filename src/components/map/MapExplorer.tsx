"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MapSheet, SHEET } from "@/components/map/MapSheet";
import { TierBadge } from "@/components/TierBadge";
import { formatCoordinates, placed, type PlacedPlace } from "@/lib/geo";

/**
 * THE LAND — the sheet, on the table, yours to move.
 *
 * Drag to pan, wheel or pinch to zoom, arrows and +/− on the keyboard. Every
 * place is a control: open it and its record card appears, and the places
 * you open are joined, in the order you found them, by YOUR THREAD — a line
 * that records what you actually read. The brand thread and the archive are
 * layers you switch on. Historical sheets are listed as what they are: named,
 * sourced, and not yet on file.
 */

type Cam = { x: number; y: number; h: number };
const HOME: Cam = { x: 380, y: 610, h: SHEET.paper.h + 180 };
const MIN_H = 110;
const MAX_H = 1500;

export type ExplorerLayer = { id: string; label: string; note: string; href?: string; available: boolean };

export function MapExplorer({
  historical,
  archivePanel,
}: {
  historical: ExplorerLayer[];
  /** Server-rendered archive objects held for al-Majdal. */
  archivePanel: ReactNode;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const cam = useRef<Cam>({ ...HOME });
  const raf = useRef(0);
  const [active, setActive] = useState<PlacedPlace | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);
  const [brandThread, setBrandThread] = useState(false);
  const [archiveLayer, setArchiveLayer] = useState(true);
  const [layersOpen, setLayersOpen] = useState(true);
  const places = useRef(placed());

  const apply = useCallback(() => {
    raf.current = 0;
    const el = host.current;
    const svg = el?.querySelector<SVGSVGElement>("svg.sheet");
    if (!el || !svg) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const c = cam.current;
    const vbH = c.h;
    const vbW = vbH * (w / Math.max(1, h));
    svg.setAttribute("viewBox", `${(c.x - vbW / 2).toFixed(1)} ${(c.y - vbH / 2).toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`);
    el.style.setProperty("--k", (vbH / h).toFixed(4)); // sheet units per pixel
  }, []);
  const schedule = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  }, [apply]);

  const clampCam = () => {
    const c = cam.current;
    c.h = Math.min(MAX_H, Math.max(MIN_H, c.h));
    c.x = Math.min(SHEET.paper.x + SHEET.paper.w, Math.max(SHEET.paper.x, c.x));
    c.y = Math.min(SHEET.paper.y + SHEET.paper.h, Math.max(SHEET.paper.y, c.y));
  };

  /** Zoom by factor f keeping the sheet point under (px, py) fixed. */
  const zoomAt = useCallback(
    (f: number, px?: number, py?: number) => {
      const el = host.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const c = cam.current;
      const k = c.h / r.height;
      const ox = px === undefined ? 0 : px - r.left - r.width / 2;
      const oy = py === undefined ? 0 : py - r.top - r.height / 2;
      const sx = c.x + ox * k;
      const sy = c.y + oy * k;
      c.h *= f;
      clampCam();
      const k2 = c.h / r.height;
      c.x = sx - ox * k2;
      c.y = sy - oy * k2;
      clampCam();
      schedule();
    },
    [schedule],
  );

  const pan = useCallback(
    (dxPx: number, dyPx: number) => {
      const el = host.current;
      if (!el) return;
      const k = cam.current.h / el.clientHeight;
      cam.current.x -= dxPx * k;
      cam.current.y -= dyPx * k;
      clampCam();
      schedule();
    },
    [schedule],
  );

  const open = useCallback((slug: string) => {
    const p = places.current.find((q) => q.slug === slug);
    if (!p) return;
    setArchiveOpen(false);
    setActive(p);
    setTrail((t) => (t.includes(slug) ? t : [...t, slug]));
  }, []);

  // pointer: drag + pinch; wheel zoom; resize
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    apply();
    const pts = new Map<number, { x: number; y: number }>();
    let moved = false;
    let pinch = 0;

    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest(".explore__ui")) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = false;
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      }
    };
    const move = (e: PointerEvent) => {
      const prev = pts.get(e.pointerId);
      if (!prev) return;
      const next = { x: e.clientX, y: e.clientY };
      if (pts.size === 1) {
        const dx = next.x - prev.x, dy = next.y - prev.y;
        if (Math.abs(dx) + Math.abs(dy) > 0) {
          if (!moved && Math.hypot(dx, dy) > 3) {
            moved = true;
            el.setPointerCapture?.(e.pointerId);
          }
          if (moved) pan(dx, dy);
        }
      }
      pts.set(e.pointerId, next);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        if (pinch) zoomAt(pinch / d, (a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
        pinch = d;
        moved = true;
      }
    };
    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = 0;
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
        return;
      }
      const g = (e.target as Element).closest<SVGGElement>("[data-place]");
      if (g) open(g.dataset.place!);
      const pin = (e.target as Element).closest("[data-archive-pin]");
      if (pin) {
        setActive(null);
        setArchiveOpen(true);
      }
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(Math.pow(1.0018, e.deltaY), e.clientX, e.clientY);
    };
    const key = (e: KeyboardEvent) => {
      const t = e.target as Element;
      if (t.closest(".explore__ui") && !t.closest("[data-place]")) return;
      const step = 60;
      const map: Record<string, () => void> = {
        ArrowLeft: () => pan(step, 0),
        ArrowRight: () => pan(-step, 0),
        ArrowUp: () => pan(0, step),
        ArrowDown: () => pan(0, -step),
        "+": () => zoomAt(0.8),
        "=": () => zoomAt(0.8),
        "-": () => zoomAt(1.25),
        "0": () => {
          cam.current = { ...HOME };
          schedule();
        },
      };
      if ((e.key === "Enter" || e.key === " ") && t.closest("[data-place]")) {
        e.preventDefault();
        open((t.closest("[data-place]") as SVGGElement).dataset.place!);
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && t.closest("[data-archive-pin]")) {
        e.preventDefault();
        setActive(null);
        setArchiveOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setActive(null);
        setArchiveOpen(false);
        return;
      }
      const fn = map[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("keydown", key);
    return () => {
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("keydown", key);
    };
  }, [apply, open, pan, schedule, zoomAt]);

  // On a phone the layer list would cover the sheet: start it folded.
  useEffect(() => {
    if (window.matchMedia("(max-width: 47.99rem)").matches) setLayersOpen(false);
  }, []);

  // mark opened places on the sheet
  useEffect(() => {
    host.current?.querySelectorAll<SVGGElement>("[data-place]").forEach((g) => {
      g.dataset.traced = trail.includes(g.dataset.place!) ? "1" : "0";
      g.dataset.active = active?.slug === g.dataset.place ? "1" : "0";
    });
  }, [trail, active]);

  const trailPts = trail
    .map((slug) => places.current.find((p) => p.slug === slug))
    .filter((p): p is PlacedPlace => Boolean(p))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const majdal = places.current.find((p) => p.slug === "al-majdal")!;

  return (
    <div className="explore" data-brand-thread={brandThread ? "on" : "off"} data-archive={archiveLayer ? "on" : "off"}>
      <div
        className="explore__stage paper"
        ref={host}
        tabIndex={0}
        aria-label="Map sheet. Drag or use the arrow keys to move, plus and minus to zoom, 0 to reset. Tab to reach each place."
      >
        <MapSheet id="land" thread interactive title="SHEET 00 — al-Majdal and the coast, drawn by MAJDAL">
          {trail.length > 1 ? <polyline points={trailPts} className="explore__trail" /> : null}
          <g className="explore__pins" data-layer="archive">
            <g data-archive-pin tabIndex={archiveLayer ? 0 : -1} role="button" aria-label="Archive: objects held for al-Majdal">
              <rect x={majdal.x + 14} y={majdal.y + 18} width={46} height={17} />
              <text x={majdal.x + 37} y={majdal.y + 30} textAnchor="middle">
                ARCHIVE
              </text>
            </g>
          </g>
        </MapSheet>
      </div>

      <div className="explore__ui explore__controls" role="group" aria-label="Zoom">
        <button type="button" onClick={() => zoomAt(0.75)} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoomAt(1.33)} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => { cam.current = { ...HOME }; schedule(); }} aria-label="Reset the view">0</button>
      </div>

      <details className="explore__ui explore__layers" open={layersOpen} onToggle={(e) => setLayersOpen((e.target as HTMLDetailsElement).open)}>
        <summary className="explore__h">Layers</summary>
        <ul>
          <li className="is-on"><span>Sheet 00</span> <span className="explore__note">MAJDAL drawing · Natural Earth · on file</span></li>
          <li className="is-on"><span>Places</span> <span className="explore__note">The register · {places.current.length}</span></li>
          <li>
            <label>
              <input type="checkbox" checked={brandThread} onChange={(e) => setBrandThread(e.target.checked)} /> The thread
            </label>
            <span className="explore__note">Brand layer · not a route</span>
          </li>
          <li>
            <label>
              <input type="checkbox" checked={archiveLayer} onChange={(e) => setArchiveLayer(e.target.checked)} /> Archive
            </label>
            <span className="explore__note">Objects held, by place</span>
          </li>
          {historical.map((l) => (
            <li key={l.id} className="is-off">
              <span>{l.label}</span>{" "}
              <span className="explore__note">
                {l.note}
                {l.href ? (
                  <>
                    {" "}
                    ·{" "}
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                      holder<span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </>
                ) : null}
              </span>
            </li>
          ))}
          <li className="is-off"><span>Memory</span> <span className="explore__note">Community submissions · none published yet</span></li>
        </ul>
        <p className="explore__trailnote">
          <span className="explore__trailkey" aria-hidden="true" /> Your thread: {trail.length ? `${trail.length} place${trail.length > 1 ? "s" : ""} opened` : "open a place to begin it"}
        </p>
      </details>

      <aside className="explore__ui explore__card" aria-live="polite" data-open={active || archiveOpen ? "true" : "false"}>
        {active ? (
          <div className="explore__rec">
            <p className="explore__recid">
              <span className="docid">{active.id}</span> <TierBadge tier={active.tier} />
            </p>
            <h2 className="display explore__recname">{active.name}</h2>
            <p className="arabic explore__recar">{active.nameArabic}</p>
            <p className="meta explore__reccoords">{active.district} district · {formatCoordinates(active)}</p>
            <p className="explore__recline">{active.line}</p>
            <Link href={`/map/${active.slug}`} className="btn">Open the record</Link>
            <button type="button" className="explore__close" onClick={() => setActive(null)}>Close</button>
          </div>
        ) : archiveOpen ? (
          <div className="explore__rec">
            <p className="explore__recid"><span className="docid">ARCHIVE · AL-MAJDAL</span></p>
            {archivePanel}
            <button type="button" className="explore__close" onClick={() => setArchiveOpen(false)}>Close</button>
          </div>
        ) : (
          <p className="explore__hint meta">Open a place. Each one is a record with its sources and its evidence tier.</p>
        )}
      </aside>
    </div>
  );
}
