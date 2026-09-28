/**
 * THE LOOM — a watermelon woven into black cloth, live.
 *
 * Every cell of the canvas is one crossing of warp (vertical) and weft
 * (horizontal) thread. Where the coloured weft is on top you see red, white or
 * green; where the black warp is on top you see black. An ordered dither
 * decides which thread is up — so the picture is made of the same decision a
 * weaver makes at every crossing. The watermelon is not printed on the cloth.
 * It is in it.
 *
 * On arrival the cloth is woven in, pick by pick, with the shuttle running
 * ahead of the fell. The pointer is a lamp held over the cloth. Scroll turns
 * the slice. Reduced motion: the finished cloth, lit from the middle.
 */

export type Loom = {
  resize: () => void;
  /** 0 at rest, 1 when the hero has scrolled away. */
  setScroll: (p: number) => void;
  /** Pointer in CSS px relative to the canvas, or null when it leaves. */
  setPointer: (x: number | null, y?: number) => void;
  setActive: (on: boolean) => void;
  dispose: () => void;
};

type Rgb = [number, number, number];

const INK = {
  ground: "#050505",
  warp: "#171716",
  warpHi: "#262624",
  black: "#0f0f0e",
  red: "#d2161e",
  white: "#f4f2ec",
  green: "#0a6b39",
  stripe: "#06401f",
} as const;

// colour index per cell
const C_BLACK = 0, C_RED = 1, C_WHITE = 2, C_GREEN = 3, C_STRIPE = 4;
const WEFT_COLOURS = [INK.black, INK.red, INK.white, INK.green, INK.stripe];

// 4×4 Bayer matrix, thresholds in (0,1)
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const hex = (h: string): Rgb => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const shade = (c: Rgb, k: number) => `rgb(${c.map((v) => Math.round(Math.min(255, Math.max(0, v * k)))).join(",")})`;

/** One thread segment, drawn once per colour and orientation, stamped per cell. */
function threadSprite(size: number, colour: string, weft: boolean): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d")!;
  const base = hex(colour);
  g.fillStyle = INK.ground;
  g.fillRect(0, 0, size, size);
  const t = Math.max(1, Math.round(size * 0.8)); // thread thickness
  const o = Math.floor((size - t) / 2);
  const r = t / 2;
  g.beginPath();
  if (weft) g.roundRect(0, o, size, t, r * 0.5);
  else g.roundRect(o, 0, t, size, r * 0.5);
  // the thread is round: dark at its edges, lit along its crown
  const grad = weft ? g.createLinearGradient(0, o, 0, o + t) : g.createLinearGradient(o, 0, o + t, 0);
  grad.addColorStop(0, shade(base, 0.55));
  grad.addColorStop(0.35, shade(base, 1.12));
  grad.addColorStop(0.6, shade(base, 1));
  grad.addColorStop(1, shade(base, 0.5));
  g.fillStyle = grad;
  g.fill();
  // a twist in the yarn
  g.strokeStyle = shade(base, 0.7);
  g.lineWidth = Math.max(1, size / 14);
  g.beginPath();
  if (weft) {
    g.moveTo(size * 0.2, o + t);
    g.lineTo(size * 0.55, o);
  } else {
    g.moveTo(o, size * 0.2);
    g.lineTo(o + t, size * 0.55);
  }
  g.stroke();
  return cv;
}

export function createLoom(canvas: HTMLCanvasElement, opts: { reduced: boolean; cell: number }): Loom {
  const g = canvas.getContext("2d", { alpha: false })!;
  let dpr = 1, W = 0, H = 0, cellPx = 8, cols = 0, rows = 0;
  let weft: HTMLCanvasElement[] = [], warp: HTMLCanvasElement, bare: HTMLCanvasElement;
  let scroll = 0;
  let px: number | null = null, py = 0; // lamp, device px
  let lampX = 0, lampY = 0, lampOn = 0; // eased lamp
  let raf = 0, active = true;
  const born = performance.now();
  const WEAVE_MS = opts.reduced ? 0 : 1600;

  const buildSprites = () => {
    weft = WEFT_COLOURS.map((c) => threadSprite(cellPx, c, true));
    warp = threadSprite(cellPx, INK.warp, false);
    // unwoven warp: the thread alone, stretched, before any weft crosses it
    bare = document.createElement("canvas");
    bare.width = bare.height = cellPx;
    const b = bare.getContext("2d")!;
    b.fillStyle = INK.ground;
    b.fillRect(0, 0, cellPx, cellPx);
    b.fillStyle = INK.warpHi;
    const t = Math.max(1, Math.round(cellPx * 0.28));
    b.fillRect(Math.floor((cellPx - t) / 2), 0, t, cellPx);
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || 1, ch = canvas.clientHeight || 1;
    cellPx = Math.max(4, Math.round(opts.cell * dpr));
    cols = Math.ceil((cw * dpr) / cellPx);
    rows = Math.ceil((ch * dpr) / cellPx);
    W = canvas.width = cols * cellPx;
    H = canvas.height = rows * cellPx;
    canvas.style.width = `${(cols * cellPx) / dpr}px`;
    canvas.style.height = `${(rows * cellPx) / dpr}px`;
    buildSprites();
    request();
  };

  /** The slice: a half-moon, cut edge up, rind down. Local frame, R = 1. */
  const SEEDS: [number, number][] = [];
  for (const [ring, n, a0, a1] of [
    [0.72, 7, 0.16, 0.84],
    [0.5, 5, 0.24, 0.76],
  ] as const) {
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (a0 + ((a1 - a0) * i) / (n - 1));
      SEEDS.push([Math.cos(a) * ring, Math.sin(a) * ring]);
    }
  }

  const frame = () => {
    raf = 0;
    const now = performance.now();
    const woven = WEAVE_MS ? Math.min(1, (now - born) / WEAVE_MS) : 1;
    const fell = Math.floor(woven * (rows + 1)); // rows woven so far

    // the fruit, placed for the frame's shape
    const portrait = H > W * 1.1;
    const R = portrait ? W * 0.47 : Math.min(W * 0.36, H * 0.66);
    const cx = portrait ? W * 0.5 : W * 0.66;
    const cy = (portrait ? H * 0.2 : H * 0.2) - scroll * H * 0.12;
    const theta = -0.1 - scroll * 0.55; // radians; scroll turns the slice
    const cos = Math.cos(theta), sin = Math.sin(theta);

    // lamp: follows the pointer, rests at the heart of the fruit
    const tx = px ?? cx, ty = px === null ? cy + R * 0.45 : py;
    const k = opts.reduced ? 1 : 0.18;
    lampX += (tx - lampX) * k;
    lampY += (ty - lampY) * k;
    lampOn += ((px === null ? 0.55 : 1) - lampOn) * k;
    const sigma2 = (R * 0.55) ** 2;

    const redRow = Math.floor(rows * 0.9);

    for (let r = 0; r < rows; r++) {
      const y = r * cellPx;
      if (r > fell) {
        for (let c = 0; c < cols; c++) g.drawImage(bare, c * cellPx, y);
        continue;
      }
      for (let c = 0; c < cols; c++) {
        const x = c * cellPx;
        const mx = x + cellPx / 2 - cx, my = y + cellPx / 2 - cy;
        // into the slice's frame
        const u = (mx * cos + my * sin) / R;
        const v = (-mx * sin + my * cos) / R;
        const d = Math.hypot(u, v);
        let col = C_BLACK;
        let level = 0;
        if (v >= 0 && d <= 1) {
          if (d > 0.9) {
            // rind, striped along its length
            const a = Math.atan2(v, u);
            col = Math.sin(a * 46) > 0.25 ? C_STRIPE : C_GREEN;
            level = 0.86;
          } else if (d > 0.83) {
            col = C_WHITE;
            level = 0.9;
          } else {
            col = C_RED;
            level = 0.9 - d * 0.28;
            for (const [su, sv] of SEEDS) {
              // a seed: an ellipse pointing at the heart
              const du = u - su, dv = v - sv;
              const rl = Math.hypot(su, sv) || 1;
              const along = (du * su + dv * sv) / rl, across = (-du * sv + dv * su) / rl;
              if ((along / 0.052) ** 2 + (across / 0.028) ** 2 < 1) {
                col = C_BLACK;
                level = 0;
                break;
              }
            }
          }
          const lx = x - lampX, ly = y - lampY;
          level = Math.min(1, level * (0.62 + 0.38 * lampOn) + 0.35 * lampOn * Math.exp(-(lx * lx + ly * ly) / sigma2));
        } else if (r === redRow) {
          // the red thread, one pick running the width of the cloth
          col = C_RED;
          level = (c + r) % 2 ? 1 : 0.2;
        }
        const up = col !== C_BLACK && level > BAYER[(r & 3) * 4 + (c & 3)]!;
        // plain weave in the black ground: over, under
        const img = up ? weft[col]! : col === C_BLACK && (c + r) % 2 ? weft[C_BLACK]! : warp;
        g.drawImage(img, x, y);
      }
    }

    // the shuttle, riding the fell while the cloth is woven
    if (woven < 1) {
      const sy = Math.min(fell, rows - 1) * cellPx;
      const sx = ((now / 3) % (W + 200)) - 100;
      g.fillStyle = INK.red;
      g.fillRect(sx, sy + cellPx * 0.2, Math.max(60, cellPx * 9), cellPx * 0.6);
    }

    const settling = Math.abs(tx - lampX) + Math.abs(ty - lampY) > 1;
    if (active && (woven < 1 || settling)) request();
  };

  const request = () => {
    if (!raf && active) raf = requestAnimationFrame(frame);
  };

  lampX = 0;
  lampY = 0;
  resize();
  // start the lamp at rest so it does not sweep in from the corner
  lampX = W * 0.6;
  lampY = H * 0.4;

  return {
    resize,
    setScroll: (p) => {
      const q = Math.min(1, Math.max(0, p));
      if (Math.abs(q - scroll) > 0.002) {
        scroll = q;
        request();
      }
    },
    setPointer: (x, y) => {
      if (x === null) px = null;
      else {
        px = x * dpr;
        py = (y ?? 0) * dpr;
      }
      request();
    },
    setActive: (on) => {
      active = on;
      if (on) request();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose: () => {
      active = false;
      cancelAnimationFrame(raf);
    },
  };
}
