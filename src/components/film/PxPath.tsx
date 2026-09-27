"use client";

import { useEffect, useRef } from "react";

type Pt = [number, number];

/** Catmull-Rom through normalised points, in pixel units. */
export function smoothPath(pts: Pt[], w: number, h: number): string {
  const P = pts.map(([x, y]) => [x * w, y * h] as Pt);
  let d = `M${P[0]![0].toFixed(1)} ${P[0]![1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)]!, p1 = P[i]!, p2 = P[i + 1]!, p3 = P[Math.min(P.length - 1, i + 2)]!;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * A line drawn in real pixels across its box. A stretched viewBox would
 * distort the stroke, and a non-scaling stroke breaks dash-based drawing —
 * so the geometry is rebuilt in pixels whenever the box changes size.
 * Points are fractions of the box: [0..1, 0..1], and may run outside it.
 */
export function PxPath({ pts, className = "" }: { pts: Pt[]; className?: string }) {
  const svg = useRef<SVGSVGElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const s = svg.current;
    if (!s) return;
    const build = () => {
      const { width, height } = s.getBoundingClientRect();
      if (!width || !height) return;
      s.setAttribute("viewBox", `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`);
      path.current?.setAttribute("d", smoothPath(pts, width, height));
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(s);
    return () => ro.disconnect();
  }, [pts]);

  return (
    <svg ref={svg} className={className} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <path ref={path} d={smoothPath(pts, 1000, 1000)} pathLength={1} />
    </svg>
  );
}
