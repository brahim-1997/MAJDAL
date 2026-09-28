"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type Sticker = { href: string; label: string; code: string; tone: "white" | "black"; tilt: number; x: number; y: number };

/**
 * Stickers slapped on a wall. Each one is a real link — tab to it, press
 * Enter. With a mouse or a finger you can also peel one off and move it;
 * a drag never counts as a click. Positions are play, not saved.
 */
export function StickerWall({ stickers, label }: { stickers: Sticker[]; label: string }) {
  const wall = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    let drag: { a: HTMLElement; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null = null;
    let top = 10;

    const down = (e: PointerEvent) => {
      const a = (e.target as Element).closest<HTMLElement>(".sticker");
      if (!a || e.button !== 0) return;
      const [ox, oy] = (a.dataset.off ?? "0,0").split(",").map(Number) as [number, number];
      drag = { a, sx: e.clientX, sy: e.clientY, ox, oy, moved: false };
      a.style.zIndex = String(++top);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.a.setPointerCapture(e.pointerId);
        drag.a.dataset.lifted = "1";
      }
      e.preventDefault();
      const nx = drag.ox + dx, ny = drag.oy + dy;
      drag.a.dataset.off = `${nx},${ny}`;
      drag.a.style.translate = `${nx}px ${ny}px`;
    };
    const up = () => {
      if (!drag) return;
      const { a, moved } = drag;
      a.dataset.lifted = "0";
      if (moved) {
        // swallow the click that follows a drag
        a.addEventListener("click", (ev) => ev.preventDefault(), { once: true, capture: true });
      }
      drag = null;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <ul className="stickers" ref={wall} aria-label={label}>
      {stickers.map((s) => (
        <li key={s.href} className="stickers__slot" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          <Link
            href={s.href}
            className={`sticker sticker--${s.tone}`}
            style={{ rotate: `${s.tilt}deg` }}
            data-cursor="Carry this"
            draggable={false}
          >
            <span className="sticker__code">{s.code}</span>
            <span className="sticker__label">{s.label}</span>
            <span className="sticker__go" aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
