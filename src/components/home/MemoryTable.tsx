"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";

/**
 * 03 — THE MEMORY. Documents spread across a table.
 *
 * Photographs, records, a map cutting, a pencilled note — laid out the way a
 * box of material gets tipped onto a table: overlapping, a little rotated.
 * On a mouse they can be pushed aside; a drag never opens a record, a click
 * does. The DOM order is the reading order, so keyboard and screen readers
 * get a plain list. On touch it becomes a strip you swipe along.
 */

export type TableItem = {
  key: string;
  href?: string;
  label?: string;
  node: ReactNode;
  at: { l: number; t: number; w: number; r: number };
};

export function MemoryTable({ items, label }: { items: TableItem[]; label: string }) {
  const z = useRef(10);

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    const sx = e.clientX;
    const sy = e.clientY;
    const base = el.dataset.dx ? [Number(el.dataset.dx), Number(el.dataset.dy)] : [0, 0];
    let moved = false;
    el.style.zIndex = String(++z.current);

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      el.dataset.dragging = "1";
      el.style.translate = `${base[0]! + dx}px ${base[1]! + dy}px`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (moved) {
        el.dataset.dx = String(base[0]! + (ev.clientX - sx));
        el.dataset.dy = String(base[1]! + (ev.clientY - sy));
        // Swallow the click that ends a drag, so moving a record never opens it.
        const block = (c: MouseEvent) => {
          c.preventDefault();
          c.stopPropagation();
        };
        el.addEventListener("click", block, { capture: true, once: true });
        window.setTimeout(() => delete el.dataset.dragging, 0);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    // Keep text from being selected mid-drag.
    e.preventDefault();
  };

  return (
    <ol className="mtable" aria-label={label}>
      {items.map((it) => (
        <li
          key={it.key}
          className="mtable__slot"
          style={
            {
              "--l": `${it.at.l}%`,
              "--t": `${it.at.t}%`,
              "--w": `${it.at.w}%`,
              "--r": `${it.at.r}deg`,
            } as React.CSSProperties
          }
        >
          {it.href ? (
            <Link href={it.href} className="mtable__item" onPointerDown={onDown} draggable={false} aria-label={it.label}>
              {it.node}
            </Link>
          ) : (
            <div className="mtable__item" onPointerDown={onDown}>
              {it.node}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
