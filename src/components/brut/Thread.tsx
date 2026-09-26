"use client";

import { useEffect, useRef } from "react";

/**
 * THE THREAD — MAJDAL's recurring line.
 *
 * One red thread runs through the homepage, section by section. Each segment
 * enters at the x where the previous one left, so across the page it reads as
 * a single line: map line, then thread, then seam.
 *
 * It sits above the section's ground and beneath its content (see .section >
 * .shell), so it passes behind type rather than striking through it — the way
 * a thread lies under a sheet of paper.
 *
 * Geometry is built in real pixels from normalised points on resize. A
 * stretched viewBox with non-scaling strokes breaks dash-based drawing in
 * some engines; pixels do not.
 */

type Pt = [number, number];
export type ThreadPath = { start: Pt; curves: [Pt, Pt, Pt][]; knotStart?: boolean; knotEnd?: boolean };

export function Thread({ path, tone = "red" }: { path: ThreadPath; tone?: "red" | "black" }) {
  const host = useRef<HTMLDivElement | null>(null);
  const line = useRef<SVGPathElement | null>(null);
  const twin = useRef<SVGPathElement | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const k0 = useRef<SVGCircleElement | null>(null);
  const k1 = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const el = host.current;
    const s = svg.current;
    if (!el || !s) return;

    const build = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      s.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const P = ([x, y]: Pt) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`;
      const d =
        `M${P(path.start)}` +
        path.curves.map(([a, b, c]) => ` C${P(a)} ${P(b)} ${P(c)}`).join("");
      line.current?.setAttribute("d", d);
      twin.current?.setAttribute("d", d);
      const end = path.curves.at(-1)?.[2] ?? path.start;
      k0.current?.setAttribute("cx", String(path.start[0] * w));
      k0.current?.setAttribute("cy", String(path.start[1] * h));
      k1.current?.setAttribute("cx", String(end[0] * w));
      k1.current?.setAttribute("cy", String(end[1] * h));
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setProgress = (p: number) => {
      const off = String(1 - p);
      line.current?.setAttribute("stroke-dashoffset", off);
      twin.current?.setAttribute("stroke-dashoffset", off);
      k1.current?.setAttribute("opacity", p > 0.985 ? "1" : "0");
    };

    if (reduced) {
      setProgress(1);
      return () => ro.disconnect();
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Starts drawing as the section's top crosses 85% of the viewport,
        // finishes as its bottom reaches 60%.
        const p = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  return (
    <div className="thread" data-tone={tone} ref={host} aria-hidden="true">
      <svg ref={svg} preserveAspectRatio="none">
        <path ref={twin} className="thread__twin" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        <path ref={line} className="thread__line" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        {path.knotStart ? <circle ref={k0} className="thread__knot" r={5} /> : null}
        {path.knotEnd ? <circle ref={k1} className="thread__knot" r={5} opacity={0} /> : null}
      </svg>
    </div>
  );
}
