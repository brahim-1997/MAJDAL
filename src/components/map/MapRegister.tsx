"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { VIEW, placed, formatCoordinates } from "@/lib/geo";
import { COASTLINE_PATH } from "@/content/coastline";
import type { PlacedPlace } from "@/lib/geo";

/**
 * THE REGISTER — the map is made of type.
 *
 * No basemap raster: place names sit at their projected coordinates. Every
 * label is a real SVG <text> inside a focusable <g>, so the map is selectable,
 * screen-reader navigable and indexable. The accessible alternative the brief
 * requires is not a second build — it is this same markup, tabbed through in
 * register order.
 *
 * THE THREAD: places you open are remembered in the order you found them and
 * joined by a line. It records what you actually read, not decoration.
 */
export function MapRegister() {
  const items = useMemo(() => placed(), []);
  const [active, setActive] = useState<PlacedPlace | null>(null);
  const [thread, setThread] = useState<string[]>([]);

  const discover = useCallback((place: PlacedPlace) => {
    setActive(place);
    setThread((prev) => (prev.includes(place.id) ? prev : [...prev, place.id]));
  }, []);

  // Escape closes the open card without losing the thread.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const threadPoints = thread
    .map((id) => items.find((p) => p.id === id))
    .filter((p): p is PlacedPlace => Boolean(p))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const traced = thread.length;

  return (
    <div className="mapreg">
      <svg
        className="mapreg__svg"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        role="group"
        aria-label="Map of places in the MAJDAL archive. Each place is a link; a list of the same places follows."
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Print texture: a screen-print / photocopy tooth, generated rather
              than a bitmap. Kept very low opacity — the brief asks for
              imperfection that feels physical, not for everything distressed. */}
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves={3}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
            <feComponentTransfer in="mono" result="tooth">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
          </filter>
          {/* The coastline fades inland rather than ending on a hard cut */}
          <linearGradient id="coastFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--stone)" stopOpacity="0.15" />
            <stop offset="45%" stopColor="var(--stone)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--stone)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* The coastline. Natural Earth, public domain — modern physical
            geography, not a political basemap and not the Mandate rasters. */}
        <path className="mapreg__coast" d={COASTLINE_PATH} aria-hidden="true" />

        {/* Graticule — a survey sheet's rule, not decoration */}
        <g className="mapreg__grid" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              x2={VIEW.w}
              y1={(VIEW.h / 6) * i}
              y2={(VIEW.h / 6) * i}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`v${i}`}
              y1={0}
              y2={VIEW.h}
              x1={(VIEW.w / 4) * i}
              x2={(VIEW.w / 4) * i}
            />
          ))}
        </g>

        {/* THE THREAD */}
        {traced > 1 ? (
          <polyline
            className="mapreg__thread"
            points={threadPoints}
            aria-hidden="true"
          />
        ) : null}

        {/* Places */}
        {items.map((p) => {
          const isActive = active?.id === p.id;
          const isTraced = thread.includes(p.id);
          return (
            <g
              key={p.id}
              className="mapreg__place"
              data-tier={p.tier}
              data-active={isActive}
              data-traced={isTraced}
              tabIndex={0}
              role="link"
              aria-label={`${p.name}, ${p.district} district. ${p.line}`}
              onMouseEnter={() => setActive(p)}
              onFocus={() => discover(p)}
              onClick={() => discover(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  discover(p);
                }
              }}
            >
              {/* Generous invisible hit area — fingers are not cursors */}
              <rect
                x={p.x - 110}
                y={p.y - 34}
                width={220}
                height={68}
                fill="transparent"
              />
              <circle className="mapreg__dot" cx={p.x} cy={p.y} r={3} />
              <text className="mapreg__name" x={p.x} y={p.y - 14}>
                {p.name}
              </text>
              <text className="mapreg__ar" x={p.x} y={p.y + 26}>
                {p.nameArabic}
              </text>
            </g>
          );
        })}
        {/* Tooth over the whole sheet, last so it sits above everything */}
        <rect
          className="mapreg__grain"
          width={VIEW.w}
          height={VIEW.h}
          filter="url(#grain)"
          aria-hidden="true"
        />
      </svg>

      {/* The record card */}
      <div className="mapreg__card" data-open={Boolean(active)} aria-live="polite">
        {active ? (
          <>
            <p className="meta mapreg__card-id">
              {active.id} · {active.district} district
            </p>
            <h3 className="display d4 mapreg__card-name">
              {active.name}
              <span className="arabic mapreg__card-ar">{active.nameArabic}</span>
            </h3>
            <p className="meta mapreg__card-coords">{formatCoordinates(active)}</p>
            <p className="mapreg__card-line">{active.line}</p>
            <p className="meta">
              <span className="tier" data-tier={active.tier}>
                {active.tier}
              </span>{" "}
              · {active.sources.length} source
              {active.sources.length === 1 ? "" : "s"}
            </p>
            <Link href={`/map/${active.slug}`} className="link mapreg__card-link">
              Open the record
            </Link>
          </>
        ) : (
          <p className="meta mapreg__card-empty">
            Move across the register. Every place has a memory.
          </p>
        )}
      </div>

      {/* The thread status — never a score */}
      <p className="mapreg__trace meta" aria-live="polite">
        {traced === 0
          ? `${items.length} places held. The archive is never complete.`
          : traced === items.length
            ? "You have traced the whole register. It is still incomplete."
            : `Thread: ${traced} of ${items.length} traced`}
      </p>
    </div>
  );
}
