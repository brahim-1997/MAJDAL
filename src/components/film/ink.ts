/**
 * INK — a cover that dissolves the way ink soaks into paper.
 *
 * A low-resolution threshold of seeded value noise, biased so the reveal
 * starts at a chosen point (the place the memory returns from). Drawn into
 * a small canvas and scaled up by CSS, so the edges come out soft and
 * blotted rather than pixel-sharp. Cheap: ~40k pixels per frame.
 */

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fractal value noise on a w×h grid, 0..1. */
function fieldNoise(w: number, h: number, seed = 48): Float32Array {
  const rand = seeded(seed);
  const out = new Float32Array(w * h);
  let amp = 1;
  let total = 0;
  for (const cell of [24, 11, 5, 2.5]) {
    const gw = Math.ceil(w / cell) + 2;
    const gh = Math.ceil(h / cell) + 2;
    const g = new Float32Array(gw * gh).map(() => rand());
    for (let y = 0; y < h; y++) {
      const fy = y / cell;
      const iy = Math.floor(fy);
      const ty = fy - iy;
      const sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < w; x++) {
        const fx = x / cell;
        const ix = Math.floor(fx);
        const tx = fx - ix;
        const sx = tx * tx * (3 - 2 * tx);
        const a = g[iy * gw + ix]!, b = g[iy * gw + ix + 1]!;
        const c = g[(iy + 1) * gw + ix]!, d = g[(iy + 1) * gw + ix + 1]!;
        out[y * w + x]! += amp * ((a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy);
      }
    }
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] = out[i]! / total;
  return out;
}

export type InkCover = {
  /** 0 = fully covered, 1 = fully revealed. */
  draw: (t: number) => void;
  resize: () => void;
  setOrigin: (x: number, y: number) => void;
};

export function createInk(canvas: HTMLCanvasElement, color: [number, number, number], seed = 48): InkCover {
  const ctx = canvas.getContext("2d");
  const DOWN = 5;
  let w = 0, h = 0;
  let noise: Float32Array = new Float32Array(0);
  let img: ImageData | null = null;
  let ox = 0.5, oy = 0.5;
  let last = -1;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = Math.max(8, Math.round(r.width / DOWN));
    h = Math.max(8, Math.round(r.height / DOWN));
    canvas.width = w;
    canvas.height = h;
    noise = fieldNoise(w, h, seed);
    img = ctx ? ctx.createImageData(w, h) : null;
    last = -1;
  };

  const draw = (t: number) => {
    if (!ctx || !img) return;
    const k = Math.round(t * 1000) / 1000;
    if (k === last) return;
    last = k;
    const data = img.data;
    const diag = Math.hypot(w, h);
    // threshold rises from -0.35 to 1.35 so both ends are clean
    const th = -0.35 + k * 1.7;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const dist = Math.hypot(x - ox * w, y - oy * h) / diag;
        const v = noise[i]! * 0.62 + dist * 0.9;
        // steep ramp: the edge of a blot, not a gradient
        const a = Math.max(0, Math.min(1, (v - th) * 14));
        const o = i * 4;
        data[o] = color[0];
        data[o + 1] = color[1];
        data[o + 2] = color[2];
        data[o + 3] = Math.round(a * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  resize();
  return {
    draw,
    resize,
    setOrigin: (x, y) => {
      ox = x;
      oy = y;
      last = -1;
    },
  };
}
