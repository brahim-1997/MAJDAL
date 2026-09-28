/**
 * Place name labels pinned to projected points without piling up. Each label
 * hangs above-right of its pin; when two collide, the later one drops below
 * the one it hit. Greedy, top to bottom — six to a dozen labels, every frame.
 */
export type Pinned = { el: HTMLElement; x: number; y: number };

const GAP = 3;

export function placeLabels(items: Pinned[]) {
  const boxes: { l: number; t: number; r: number; b: number }[] = [];
  items.sort((a, b) => a.y - b.y);
  for (const { el, x, y } of items) {
    const w = el.offsetWidth, h = el.offsetHeight;
    const l = x + 8, r = l + w;
    let t = y - h;
    for (let tries = 0; tries < 4; tries++) {
      const hit = boxes.find((o) => l < o.r && r > o.l && t < o.b && t + h > o.t);
      if (!hit) break;
      t = hit.b + GAP;
    }
    boxes.push({ l, t, r, b: t + h });
    // CSS adds translate(8px, -100%): position the pin corner, the box follows.
    el.style.transform = `translate(${x.toFixed(1)}px, ${(t + h).toFixed(1)}px)`;
  }
}
