"use client";

import { useRef } from "react";
import Link from "next/link";
import type { ArchiveEntry } from "@/content/archive";
import { track } from "@/lib/analytics";

/**
 * OPEN THE BOX — archive records as loose documents on a table.
 *
 * On a fine pointer the records can be dragged aside; underneath is the
 * floor of the box, and what is written there. A drag never navigates; a
 * click does. Every record is a real link in DOM order, so the keyboard and
 * screen-reader path is a plain list. On touch it becomes a swipeable strip.
 */

const LAYOUT = [
  { l: 2, t: 4, w: 30, r: -3 },
  { l: 34, t: 0, w: 26, r: 2.5 },
  { l: 62, t: 6, w: 34, r: -1.5 },
  { l: 8, t: 46, w: 28, r: 3 },
  { l: 40, t: 42, w: 30, r: -4 },
  { l: 70, t: 50, w: 27, r: 1.5 },
];

export function ArchiveBox({ entries, total }: { entries: ArchiveEntry[]; total: number }) {
  const z = useRef(10);

  const onDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const card = e.currentTarget;
    const sx = e.clientX;
    const sy = e.clientY;
    const base = card.dataset.dx ? [Number(card.dataset.dx), Number(card.dataset.dy)] : [0, 0];
    let moved = false;
    card.style.zIndex = String(++z.current);

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      card.dataset.dragging = "1";
      card.style.translate = `${base[0]! + dx}px ${base[1]! + dy}px`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (moved) {
        card.dataset.dx = String(base[0]! + (ev.clientX - sx));
        card.dataset.dy = String(base[1]! + (ev.clientY - sy));
        // Swallow the click that follows a drag, so moving a record never opens it.
        const block = (c: MouseEvent) => {
          c.preventDefault();
          c.stopPropagation();
        };
        card.addEventListener("click", block, { capture: true, once: true });
        window.setTimeout(() => delete card.dataset.dragging, 0);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="abox">
      <div className="abox__floor" aria-hidden="true">
        <p className="display abox__floorline">The archive is never complete.</p>
        <p className="hand abox__floornote">
          {total} records held. What is under here is yours to add.
        </p>
      </div>

      <ol className="abox__cards" aria-label="Records from the archive">
        {entries.map((e, i) => {
          const L = LAYOUT[i % LAYOUT.length]!;
          return (
            <li
              key={e.slug}
              className="abox__slot"
              style={
                {
                  "--l": `${L.l}%`,
                  "--t": `${L.t}%`,
                  "--w": `${L.w}%`,
                  "--r": `${L.r}deg`,
                } as React.CSSProperties
              }
            >
              <Link
                href={`/archive/${e.slug}`}
                className="abox__card taped"
                data-tier={e.tier}
                onPointerDown={onDown}
                onClick={() => track("archive_open", { id: e.index, from: "home" })}
                draggable={false}
              >
                <span className="abox__id">{e.index}</span>
                <span className="display abox__title">{e.title}</span>
                <span className="abox__meta">
                  {e.category} · {e.location}
                </span>
                <span className="abox__sum">{e.summary}</span>
                <span className={`stamp abox__stamp ${e.tier === "CONTESTED" ? "stamp--red-sm" : "stamp--blue"}`}>
                  {e.tier}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
