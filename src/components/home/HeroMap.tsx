import { COASTLINE_PATH, SELVEDGE, VIEW_W, VIEW_H } from "@/content/coastline";
import { BBOX, placed, project } from "@/lib/geo";

/**
 * The map under the poster. Drawn from data, then printed badly on purpose.
 *
 * - Sea is water-lined: parallel strokes following the coast, the convention
 *   survey sheets used for water before tone was cheap to print.
 * - The graticule is real, labelled in real degrees.
 * - A blue plate is printed out of register over the black one.
 *
 * It is OUR drawing — Natural Earth coastline, our place register — and it is
 * captioned as such. It is not presented as a historical scan, because it is
 * not one, and faking the provenance of an archival object is the one thing
 * this brand does not do.
 */

const VARIANTS = {
  wide: "0 560 760 470",
  tall: "150 540 380 560",
} as const;

export function HeroMap({ variant, id }: { variant: keyof typeof VARIANTS; id: string }) {
  const rows = SELVEDGE.length;
  const rowY = (r: number) => (VIEW_H / (rows - 1)) * r;
  const sea =
    SELVEDGE.map((x, r) => `${r === 0 ? "M" : "L"}${x.toFixed(1)},${rowY(r).toFixed(1)}`).join("") +
    `L0,${VIEW_H}L0,0Z`;

  const lats: number[] = [];
  for (let v = Math.ceil(BBOX.minLat * 4) / 4; v <= BBOX.maxLat; v += 0.25) lats.push(+v.toFixed(2));
  const lons: number[] = [];
  for (let v = Math.ceil(BBOX.minLon * 4) / 4; v <= BBOX.maxLon; v += 0.25) lons.push(+v.toFixed(2));

  const places = placed();

  const content = (
    <g>
      {/* Graticule */}
      <g className="hm__grat">
        {lats.map((la) => {
          const y = project(la, BBOX.minLon).y;
          return (
            <g key={`la${la}`}>
              <line x1={0} x2={VIEW_W} y1={y} y2={y} />
              {la % 0.5 === 0 ? (
                <text x={VIEW_W - 6} y={y - 4} className="hm__deg" textAnchor="end">
                  {la.toFixed(1)}°N
                </text>
              ) : null}
            </g>
          );
        })}
        {lons.map((lo) => {
          const x = project(BBOX.minLat, lo).x;
          return (
            <g key={`lo${lo}`}>
              <line y1={0} y2={VIEW_H} x1={x} x2={x} />
              {lo % 0.5 === 0 ? (
                <text x={x + 4} y={VIEW_H - 8} className="hm__deg">
                  {lo.toFixed(1)}°E
                </text>
              ) : null}
            </g>
          );
        })}
      </g>

      {/* Water-lined sea */}
      <path d={sea} fill={`url(#${id}-water)`} />
      <path d={COASTLINE_PATH} className="hm__coast" />

      {/* Places */}
      {places.map((p) => {
        const origin = p.slug === "al-majdal";
        return (
          <g key={p.id} className={origin ? "hm__place hm__place--origin" : "hm__place"}>
            <circle cx={p.x} cy={p.y} r={origin ? 7 : 3.5} />
            {origin ? (
              <>
                <line x1={p.x - 16} x2={p.x + 16} y1={p.y} y2={p.y} />
                <line y1={p.y - 16} y2={p.y + 16} x1={p.x} x2={p.x} />
              </>
            ) : null}
            <text x={p.x + 12} y={p.y - 8} className="hm__name">
              {p.name}
            </text>
            <text x={p.x + 12} y={p.y + 16} className="hm__ar">
              {p.nameArabic}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <svg
      className={`hm hm--${variant}`}
      viewBox={VARIANTS[variant]}
      preserveAspectRatio={variant === "tall" ? "xMinYMid slice" : "xMidYMid slice"}
      aria-hidden="true"
      data-map={id}
    >
      <defs>
        <pattern id={`${id}-water`} width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="3" x2="6" y2="3" className="hm__waterline" />
        </pattern>
        <filter id={`${id}-copy`} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="48" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" />
        </filter>
      </defs>
      {/* Blue plate, out of register */}
      <g className="hm__plate hm__plate--blue" transform="translate(4 3)" filter={`url(#${id}-copy)`}>
        {content}
      </g>
      {/* Black/bone plate */}
      <g className="hm__plate" filter={`url(#${id}-copy)`}>
        {content}
      </g>
    </svg>
  );
}
