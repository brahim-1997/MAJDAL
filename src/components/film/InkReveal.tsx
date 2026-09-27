"use client";

import { useEffect, useRef } from "react";
import { createInk } from "./ink";

/**
 * The hero's ink: a paper-coloured cover over the map fragment that dissolves
 * like ink soaking in. It runs only while the intro is playing, and it keeps
 * time with the CSS timeline by reading the start time of the fragment's own
 * CSS animation — so JS and CSS agree on when "now" is.
 */
export function InkReveal({ at, duration, anchor }: { at: number; duration: number; anchor: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    const root = document.documentElement;
    if (!cv || root.dataset.intro !== "play") return;

    const ink = createInk(cv, [233, 228, 216], 7);
    ink.setOrigin(0.36, 0.52);
    ink.draw(0);
    cv.dataset.live = "1";

    const host = document.querySelector<HTMLElement>(anchor);
    const anim = host?.getAnimations?.()[0];
    const start = typeof anim?.startTime === "number" ? anim.startTime : Number(document.timeline.currentTime ?? 0);

    let raf = 0;
    const tick = () => {
      if (root.dataset.intro !== "play") {
        cv.dataset.live = "0";
        return;
      }
      const now = Number(document.timeline.currentTime ?? 0);
      const t = (now - start - at) / duration;
      ink.draw(Math.max(0, Math.min(1, t)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else cv.dataset.live = "0";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [at, duration, anchor]);

  return <canvas ref={ref} className="inkcover" aria-hidden="true" data-live="0" />;
}
