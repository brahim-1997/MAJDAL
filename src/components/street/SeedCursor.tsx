"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor is a watermelon seed. Black with a white edge, so it reads on
 * every ground. Over anything with `data-cursor`, it opens into a label.
 * Only for a fine pointer; touch and keyboard never see it. The system
 * cursor stays in text fields.
 */
export function SeedCursor() {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const seed = el.current;
    if (!seed || !window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-seed");
    let x = -100, y = -100, raf = 0;
    const paint = () => {
      raf = 0;
      seed.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      x = e.clientX;
      y = e.clientY;
      seed.dataset.on = "1";
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button, label, summary");
      const field = (e.target as Element | null)?.closest?.("input, textarea, select, [contenteditable]");
      seed.dataset.over = field ? "field" : t ? "1" : "0";
      seed.dataset.label = t?.getAttribute("data-cursor") ?? "";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => (seed.dataset.on = "0");
    const onDown = () => (seed.dataset.down = "1");
    const onUp = () => (seed.dataset.down = "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-seed");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    // the label is the seed's own ::after, reading its data-label
    <div className="seed" ref={el} aria-hidden="true" data-on="0" data-label="">
      <span className="seed__body" />
    </div>
  );
}
