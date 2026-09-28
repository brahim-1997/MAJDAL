"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { TierBadge } from "@/components/TierBadge";
import { places } from "@/content/places";
import { formatCoordinates } from "@/lib/geo";
import { placeLabels, type Pinned } from "./labels";
import type { LandScene, Stop } from "./scene";

/**
 * THE LAND — explore mode. The whole land, engraved, yours to turn.
 *
 * Drag to orbit, right-drag (or two fingers) to pan, wheel or pinch to zoom;
 * arrow keys pan once the land has focus. Every place is a real button
 * pinned to the relief — tab to it, open its record. Without WebGL the 2D
 * sheet (the `fallback`) takes its place.
 */

const HOME: Stop = { target: [-12, -20], dist: 620, polar: 50, azimuth: -28 };

export function LandExplore({ fallback }: { fallback: ReactNode }) {
  const host = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);
  const landRef = useRef<LandScene | null>(null);
  const [status, setStatus] = useState<"pending" | "live" | "unavailable">("pending");
  const [active, setActive] = useState<string | null>(null);
  const [thread, setThread] = useState(true);

  useEffect(() => {
    const cv = canvas.current, el = host.current, lb = labelsRef.current;
    if (!cv || !el || !lb) return;
    let land: LandScene | null = null;
    let raf = 0;
    let running = true;
    let disposed = false;
    const mobile = window.matchMedia("(max-width: 47.99rem), (pointer: coarse)").matches;
    const labelEls = new Map<string, HTMLElement>();
    lb.querySelectorAll<HTMLElement>("[data-slug]").forEach((b) => labelEls.set(b.dataset.slug!, b));

    const tick = () => {
      raf = 0;
      if (!land || !running) return;
      land.controls?.update();
      land.render();
      const shown: Pinned[] = [];
      for (const m of land.places) {
        const b = labelEls.get(m.slug);
        if (!b) continue;
        const q = land.project(m.world);
        b.dataset.on = q.visible ? "1" : "0";
        if (q.visible) shown.push({ el: b, x: q.x, y: q.y });
      }
      placeLabels(shown);
      raf = requestAnimationFrame(tick);
    };
    const onResize = () => land?.resize();

    (async () => {
      try {
        if (!document.createElement("canvas").getContext("webgl2")) throw new Error("no webgl2");
        const { createLand } = await import("./scene");
        if (disposed) return;
        land = await createLand(cv, { mode: "explore", mobile, oliveSrc: "/olive/olive-engraved.svg" });
        if (disposed) return land.dispose();
        landRef.current = land;
        land.setCamera(HOME);
        const [tx, tz] = HOME.target;
        land.controls?.target.set(tx, 0, tz);
        land.controls?.listenToKeyEvents(el);
        land.setUniforms({ rise: 1, ink: 1, thread: 1, olive: 1 });
        setStatus("live");
        raf = requestAnimationFrame(tick);
      } catch {
        setStatus("unavailable");
      }
    })();

    // Stop drawing when the land is off screen or the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      running = Boolean(e?.isIntersecting) && document.visibilityState === "visible";
      if (running && !raf && land) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    const vis = () => {
      running = document.visibilityState === "visible";
      if (running && !raf && land) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("resize", onResize);
      land?.dispose();
    };
  }, []);

  useEffect(() => {
    landRef.current?.setUniforms({ thread: thread ? 1 : 0 });
  }, [thread, status]);

  const zoom = useCallback((k: number) => {
    const land = landRef.current;
    const c = land?.controls;
    if (!land || !c) return;
    const off = land.camera.position.clone().sub(c.target).multiplyScalar(k);
    const d = Math.min(c.maxDistance, Math.max(c.minDistance, off.length()));
    land.camera.position.copy(c.target).add(off.setLength(d));
  }, []);
  const reset = useCallback(() => {
    const land = landRef.current;
    if (!land) return;
    land.setCamera(HOME);
    land.controls?.target.set(HOME.target[0], 0, HOME.target[1]);
  }, []);
  const open = useCallback((slug: string) => {
    setActive(slug);
    landRef.current?.focusOn(slug);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (status === "unavailable") return <>{fallback}</>;
  const place = places.find((p) => p.slug === active);

  return (
    <div className="lx" data-status={status}>
      <div
        className="lx__stage"
        ref={host}
        tabIndex={0}
        aria-label="The whole land of Palestine in relief. Drag to turn, right-drag to move, scroll to zoom; arrow keys move it. Tab to reach each place."
      >
        <canvas ref={canvas} className="lx__canvas" />
        {status === "pending" ? <p className="lx__loading meta">Raising the land…</p> : null}
      </div>
      <div className="lx__labels" ref={labelsRef}>
        {places.map((p) => (
          <button
            key={p.slug}
            type="button"
            className={`lx__label${p.slug === "al-majdal" ? " is-origin" : ""}`}
            data-slug={p.slug}
            data-on="0"
            data-active={active === p.slug ? "1" : "0"}
            onClick={() => open(p.slug)}
          >
            <b>{p.name}</b>
            <i className="arabic">{p.nameArabic}</i>
          </button>
        ))}
      </div>

      <div className="lx__controls" role="group" aria-label="View">
        <button type="button" onClick={() => zoom(0.75)} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => zoom(1.33)} aria-label="Zoom out">−</button>
        <button type="button" onClick={reset} aria-label="Reset the view">0</button>
      </div>

      <div className="lx__layers">
        <p className="lx__h">The land</p>
        <label>
          <input type="checkbox" checked={thread} onChange={(e) => setThread(e.target.checked)} /> The thread — brand line, not a route
        </label>
        <p className="lx__credit">
          Real elevation, vertical ×7 · NASA SRTM &amp; NOAA ETOPO1 via AWS Terrain Tiles · outline: Natural Earth · public domain
        </p>
      </div>

      <aside className="lx__card" aria-live="polite" data-open={place ? "true" : "false"}>
        {place ? (
          <div className="lx__rec">
            <p className="lx__recid">
              <span className="docid">{place.id}</span> <TierBadge tier={place.tier} />
            </p>
            <h2 className="display lx__recname">{place.name}</h2>
            <p className="arabic lx__recar">{place.nameArabic}</p>
            <p className="meta lx__reccoords">{place.district} district · {formatCoordinates(place)}</p>
            <p className="lx__recline">{place.line}</p>
            <Link href={`/map/${place.slug}`} className="btn">Open the record</Link>
            <button type="button" className="lx__close" onClick={() => setActive(null)}>Close</button>
          </div>
        ) : (
          <p className="lx__hint">Turn the land. Open a place: each one is a record with its sources and its evidence tier.</p>
        )}
      </aside>
    </div>
  );
}
