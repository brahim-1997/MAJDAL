import type { ReactNode } from "react";
import { COASTLINE_PATH } from "@/content/coastline";
import { LAKES, LAKE_LINES, PX_PER_DEGREE_LAT, RIVERS, SEA_LINES } from "@/content/sheet";
import { OLIVE_GEOMETRY } from "@/components/olive/olive-geometry";
import { BBOX, placed, project } from "@/lib/geo";

/**
 * Natural Earth 1:10m places a vertex every few kilometres; filmed close, the
 * coast turns into a polygon. Two passes of corner-cutting smooth the line
 * without moving it off the data by more than a fraction of a vertex spacing
 * — ordinary cartographic generalisation, not invention.
 */
const COAST = (() => {
  const pts = COASTLINE_PATH.slice(1).split("L").map((q) => q.split(",").map(Number) as [number, number]);
  let p = pts;
  for (let k = 0; k < 2; k++) {
    const out: [number, number][] = [p[0]!];
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i]!, [bx, by] = p[i + 1]!;
      out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    out.push(p[p.length - 1]!);
    p = out;
  }
  return "M" + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
})();

/**
 * SHEET 00 — the MAJDAL map drawing.
 *
 * A survey-style sheet drawn by MAJDAL from public-domain Natural Earth data
 * and the place register. It borrows the grammar of a survey sheet —
 * neatline, graticule, water-lining, marginal notes — and says in its own
 * margin that it is NOT a historical survey. Historical sheets are separate
 * objects (src/content/sources.ts) and are only ever shown as themselves.
 *
 * Every layer carries a data-layer attribute and every place a data-place
 * attribute, so the film and the explorer can reveal them without re-drawing.
 */

export const SHEET = {
  /** Neatline: the geographic frame of src/lib/geo.ts. */
  neat: { x0: 40, y0: 67.2, x1: 720, y1: 1192.8 },
  /** Paper, including margins. */
  paper: { x: -40, y: -20, w: 840, h: 1300 },
} as const;

const TICK = 1 / 12; // 5 minutes of arc

/** The thread visits every place on the register, back and forth, like a
 *  shuttle across a loom. A graphic layer — not a road, not a route. */
const THREAD_ORDER = ["al-majdal", "al-quds", "yafa", "nablus", "haifa", "akka"];

function catmull(pts: [number, number][]) {
  let d = `M${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!, p1 = pts[i]!, p2 = pts[i + 1]!, p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function threadPath(): string {
  const all = placed();
  const pts = THREAD_ORDER.map((slug) => all.find((p) => p.slug === slug)!).map((p) => [p.x, p.y] as [number, number]);
  // enters from the sea south-west of al-Majdal, leaves north-east
  return catmull([[70, 1150], [150, 1030], ...pts, [560, 150], [640, 30]]);
}

/** Olive tree anchored at al-Majdal, in sheet units. */
export function oliveBox() {
  const m = placed().find((p) => p.slug === "al-majdal")!;
  const w = 112;
  const h = (w * OLIVE_GEOMETRY.height) / OLIVE_GEOMETRY.width;
  const rootX = m.x + 44;
  const rootY = m.y + 4;
  return { x: rootX - w * OLIVE_GEOMETRY.root[0], y: rootY - h * OLIVE_GEOMETRY.root[1], w, h, rootX, rootY };
}

type Props = {
  id: string;
  viewBox?: string;
  className?: string;
  /** Hide the marginalia (for tight crops). */
  bare?: boolean;
  thread?: boolean;
  olive?: boolean;
  /** Olive revealed by a growing circle from its roots (the film sets r). */
  oliveGrow?: boolean;
  preserveAspectRatio?: string;
  /** Places become links into the register. */
  linked?: boolean;
  /** Places become keyboard-operable controls; the host handles activation. */
  interactive?: boolean;
  title?: string;
  /** Extra layers, drawn in sheet units on top of everything else. */
  children?: ReactNode;
};

export function MapSheet({
  id,
  viewBox = `${SHEET.paper.x} ${SHEET.paper.y} ${SHEET.paper.w} ${SHEET.paper.h}`,
  className = "",
  bare = false,
  thread = false,
  olive = false,
  oliveGrow = false,
  preserveAspectRatio = "xMidYMid meet",
  linked = false,
  interactive = false,
  title,
  children,
}: Props) {
  const { x0, y0, x1, y1 } = SHEET.neat;
  const places = placed();

  const lats: number[] = [];
  for (let v = Math.ceil(BBOX.minLat / TICK) * TICK; v <= BBOX.maxLat + 1e-9; v += TICK) lats.push(+v.toFixed(4));
  const lons: number[] = [];
  for (let v = Math.ceil(BBOX.minLon / TICK) * TICK; v <= BBOX.maxLon + 1e-9; v += TICK) lons.push(+v.toFixed(4));
  const half = (v: number) => Math.abs(v * 2 - Math.round(v * 2)) < 1e-6;
  const dms = (v: number) => {
    const d = Math.floor(v + 1e-9);
    const m = Math.round((v - d) * 60);
    return `${d}°${m.toString().padStart(2, "0")}′`;
  };

  // Scale bar: 0–20 km
  const pxPerKm = PX_PER_DEGREE_LAT / 111.2;
  const ob = oliveBox();
  const majdal = places.find((p) => p.slug === "al-majdal")!;

  return (
    <svg
      className={`sheet ${className}`}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      role={interactive ? "group" : title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title || interactive ? undefined : true}
      data-sheet={id}
    >
      <defs>
        <clipPath id={`${id}-neat`}>
          <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
        </clipPath>
        <clipPath id={`${id}-grow`}>
          <circle cx={ob.rootX} cy={ob.rootY} r="0" data-olive-grow />
        </clipPath>
      </defs>

      <g data-layer="base">
        {/* graticule, every 5′; heavier every 30′ */}
        <g clipPath={`url(#${id}-neat)`} className="sheet__grat">
          {lats.map((la) => {
            const y = project(la, BBOX.minLon).y;
            return <line key={`a${la}`} x1={x0} x2={x1} y1={y} y2={y} className={half(la) ? "is-major" : undefined} />;
          })}
          {lons.map((lo) => {
            const x = project(BBOX.minLat, lo).x;
            return <line key={`o${lo}`} y1={y0} y2={y1} x1={x} x2={x} className={half(lo) ? "is-major" : undefined} />;
          })}
        </g>

        <g clipPath={`url(#${id}-neat)`}>
          <path d={SEA_LINES} className="sheet__water" />
          <path d={LAKE_LINES} className="sheet__water" />
          <path d={LAKES} className="sheet__lake" />
          <path d={RIVERS} className="sheet__river" />
          <path d={COAST} className="sheet__coast" />
        </g>

        {/* neatline: a double rule, the edge of a printed sheet */}
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} className="sheet__neat" />
        <rect x={x0 - 6} y={y0 - 6} width={x1 - x0 + 12} height={y1 - y0 + 12} className="sheet__neat sheet__neat--outer" />

        {!bare && (
          <g className="sheet__margin">
            {lats.filter(half).map((la) => {
              const y = project(la, BBOX.minLon).y;
              return (
                <text key={`la${la}`} x={x0 - 10} y={y + 3} textAnchor="end">
                  {dms(la)}N
                </text>
              );
            })}
            {lons.filter(half).map((lo) => {
              const x = project(BBOX.minLat, lo).x;
              return (
                <text key={`lo${lo}`} x={x} y={y1 + 20} textAnchor="middle">
                  {dms(lo)}E
                </text>
              );
            })}
            <text x={x0} y={y0 - 34} className="sheet__series">MAJDAL · SHEET 00</text>
            <text x={x0} y={y0 - 14} className="sheet__title">AL-MAJDAL AND THE COAST</text>
            <text x={x1} y={y0 - 14} className="sheet__series" textAnchor="end">0048</text>

            {/* north arrow — true north: the sheet is not rotated */}
            <g transform={`translate(${x1 - 28} ${y0 + 36})`} className="sheet__north">
              <path d="M0 -24 L7 6 L0 0 L-7 6 Z" />
              <text y={20} textAnchor="middle">N</text>
            </g>

            {/* scale bar */}
            <g transform={`translate(${x1 - 20 * pxPerKm - 18} ${y1 - 30})`} className="sheet__scale">
              {[0, 5, 10, 20].map((k, i, arr) => (
                <g key={k}>
                  {i < arr.length - 1 ? (
                    <rect x={k * pxPerKm} y={0} width={(arr[i + 1]! - k) * pxPerKm} height={5} className={i % 2 ? "is-open" : undefined} />
                  ) : null}
                  <text x={k * pxPerKm} y={17} textAnchor="middle">{k}</text>
                </g>
              ))}
              <text x={20 * pxPerKm + 8} y={6}>KM</text>
            </g>

            <text x={x0} y={y1 + 42} className="sheet__credit">
              DRAWN BY MAJDAL, 2026 · COAST: NATURAL EARTH 1:10M · LAKES, RIVERS: NATURAL EARTH 1:50M · PUBLIC DOMAIN
            </text>
            <text x={x0} y={y1 + 56} className="sheet__credit">
              A DRAWING, NOT A HISTORICAL SURVEY · PLACE POSITIONS: MODERN CITIES, APPROXIMATE
            </text>

            {/* legend, set in the sea */}
            <g transform={`translate(${x0 + 18} ${y0 + 22})`} className="sheet__legend">
              <rect x={-8} y={-14} width={188} height={98} />
              <text className="sheet__legend-h">LEGEND</text>
              <line x1={0} x2={22} y1={16} y2={16} className="sheet__coast" />
              <text x={30} y={20}>COAST</text>
              <circle cx={11} cy={36} r={3} className="sheet__dot" />
              <text x={30} y={40}>PLACE ON THE REGISTER</text>
              <line x1={0} x2={22} y1={56} y2={56} className="sheet__threadkey" />
              <text x={30} y={60}>THE THREAD — BRAND LAYER</text>
              <text x={30} y={74} className="sheet__legend-sub">NOT A ROUTE</text>
            </g>
          </g>
        )}
      </g>

      {/* the register */}
      <g data-layer="places">
        {places.map((p) => {
          const origin = p.slug === "al-majdal";
          const body = (
            <>
              <circle cx={p.x} cy={p.y} r={origin ? 4 : 3} className="sheet__dot" />
              {/* al-Majdal is labelled into the sea: inland is where the tree grows */}
              <text x={origin ? p.x - 16 : p.x + 10} y={p.y - 6} className="sheet__name" textAnchor={origin ? "end" : "start"}>
                {p.name}
              </text>
              <text x={origin ? p.x - 16 : p.x + 10} y={p.y + 12} className="sheet__ar" textAnchor={origin ? "end" : "start"}>
                {p.nameArabic}
              </text>
            </>
          );
          return (
            <g
              key={p.id}
              data-place={p.slug}
              className={origin ? "sheet__place is-origin" : "sheet__place"}
              {...(interactive ? { tabIndex: 0, role: "button", "aria-label": `${p.name} — open the record card` } : {})}
            >
              {linked ? (
                <a href={`/map/${p.slug}`} aria-label={`${p.name} — open the record`}>
                  {body}
                </a>
              ) : (
                body
              )}
            </g>
          );
        })}
      </g>

      {/* red annotation: the registration mark on al-Majdal */}
      <g data-layer="mark" className="sheet__mark">
        <circle cx={majdal.x} cy={majdal.y} r={13} />
        <line x1={majdal.x - 20} x2={majdal.x + 20} y1={majdal.y} y2={majdal.y} />
        <line x1={majdal.x} x2={majdal.x} y1={majdal.y - 20} y2={majdal.y + 20} />
      </g>

      {thread && (
        <g data-layer="thread" className="sheet__thread">
          <path d={threadPath()} pathLength={1} />
        </g>
      )}

      {children}

      {olive && (
        <g data-layer="olive" className="sheet__olive" clipPath={oliveGrow ? `url(#${id}-grow)` : undefined}>
          <image href="/olive/olive-woodcut.svg" x={ob.x} y={ob.y} width={ob.w} height={ob.h} />
        </g>
      )}
    </svg>
  );
}
