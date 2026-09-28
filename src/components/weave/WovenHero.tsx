"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Loom } from "./loom";

/**
 * The opening: a watermelon woven into black cloth, with the page's first
 * words laid over it. The canvas is decoration (aria-hidden); every word is
 * real text in `children`. Without JavaScript or canvas, the section is
 * black cloth drawn in CSS and the words still stand.
 */
export function WovenHero({ children }: { children: ReactNode }) {
  const host = useRef<HTMLElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let loom: Loom | null = null;
    let disposed = false;

    const onMove = (e: PointerEvent) => {
      if (!loom || e.pointerType === "touch") return;
      const r = cv.getBoundingClientRect();
      loom.setPointer(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = () => loom?.setPointer(null);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      loom?.setScroll(-r.top / Math.max(1, r.height));
    };
    const onResize = () => loom?.resize();
    const io = new IntersectionObserver(([e]) => loom?.setActive(Boolean(e?.isIntersecting)));

    import("./loom").then(({ createLoom }) => {
      if (disposed) return;
      loom = createLoom(cv, { reduced, cell: coarse ? 6 : 7 });
      el.dataset.loom = "live";
      io.observe(el);
      onScroll();
    });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      loom?.dispose();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="woven" ref={host} data-ground="night" aria-labelledby="hero-title">
      <canvas className="woven__cloth" ref={canvas} aria-hidden="true" />
      <div className="woven__over">{children}</div>
    </section>
  );
}
