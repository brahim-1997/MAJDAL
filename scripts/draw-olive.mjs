// THE MAJDAL OLIVE TREE — an original drawing, generated once, committed.
//
// Not a symbol with an assigned meaning: a drawing of the structure of an old
// olive tree. A short trunk split into twisted strands with a hollow between
// them, exposed roots, low wide limbs, and a crown of separate leaf masses
// with flat undersides and daylight between them. Cut like a woodcut: one
// ink, with leaves carved out of the masses and inked along their edges.
//
// Seeded, so it is the same tree every time.
//
//   node scripts/draw-olive.mjs          → public/olive/*.svg + geometry
//   OUT=dir node scripts/draw-olive.mjs --png   → also renders review sheets

import { writeFileSync, mkdirSync } from "node:fs";

const SEED = 48;
const GROUND = 772;

// ---------- seeded random + smooth noise ----------
let s = SEED >>> 0;
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rr = (a, b) => a + (b - a) * rand();
/** 1D periodic value noise for outlines: returns -1..1 */
function loopNoise(freq) {
  const k = Array.from({ length: freq }, () => rr(-1, 1));
  return (t) => {
    const x = (((t % 1) + 1) % 1) * freq;
    const i = Math.floor(x), fr = x - i;
    const a = k[i % freq], b = k[(i + 1) % freq];
    const u = fr * fr * (3 - 2 * fr);
    return a + (b - a) * u;
  };
}

// ---------- geometry helpers ----------
const f = (n) => Math.round(n).toString();
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
const perp = (a) => [-a[1], a[0]];

function chaikin(pts, iters = 2) {
  let p = pts;
  for (let k = 0; k < iters; k++) {
    const out = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      out.push(add(mul(a, 0.75), mul(b, 0.25)), add(mul(a, 0.25), mul(b, 0.75)));
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
}
// Every filled shape is wound the same way, so overlapping shapes union
// under the nonzero rule instead of cancelling into holes.
const area = (ring) => ring.reduce((a, p, i) => { const q = ring[(i + 1) % ring.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
const poly = (ring) => {
  const r = area(ring) < 0 ? ring.slice().reverse() : ring;
  return "M" + r.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
};
const line = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");

/** Tapered ribbon around a centreline; widths[i] is full width at pts[i]. */
function ribbon(pts, widths, wobble = 0) {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const n = norm(perp(sub(b, a)));
    const w = widths[i] / 2;
    L.push(add(pts[i], mul(n, w + (wobble ? rr(-wobble, wobble) : 0))));
    R.push(add(pts[i], mul(n, -(w + (wobble ? rr(-wobble, wobble) : 0)))));
  }
  return poly([...L, ...R.reverse()]);
}
const taper = (n, a, b, curve = 1) =>
  Array.from({ length: n }, (_, i) => a + (b - a) * Math.pow(i / (n - 1), curve));

function inside(p, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// ---------- 1. trunk: twisted strands with a hollow ----------
const strands = [
  { c: [[396, 778], [410, 716], [390, 660], [404, 606], [436, 566], [446, 528]], w: [128, 92, 96, 70, 62, 54] },
  { c: [[572, 778], [556, 722], [578, 668], [560, 618], [532, 578], [548, 534]], w: [120, 84, 90, 66, 58, 50] },
  // the front strand that twists across the hollow
  { c: [[474, 774], [506, 724], [478, 674], [494, 628], [492, 590]], w: [58, 44, 46, 36, 32] },
];
const trunk = [];
const furrows = [];
for (const st of strands) {
  const pts = chaikin(st.c, 3);
  const widths = pts.map((_, i) => {
    const k = (i / (pts.length - 1)) * (st.w.length - 1);
    const j = Math.min(st.w.length - 2, Math.floor(k));
    return st.w[j] + (st.w[j + 1] - st.w[j]) * (k - j);
  });
  trunk.push(ribbon(pts, widths, 2.2));
  const count = Math.round(widths[0] / 17);
  for (let q = 0; q < count; q++) {
    const off = (q + 0.5) / count - 0.5;
    const twist = rr(-0.2, 0.2);
    const a0 = Math.floor(rr(0, pts.length * 0.2));
    const a1 = Math.floor(rr(pts.length * 0.62, pts.length - 2));
    const fl = [];
    for (let i = a0; i <= a1; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const n = norm(perp(sub(b, a)));
      const t = (i - a0) / Math.max(1, a1 - a0);
      fl.push(add(pts[i], mul(n, (off + twist * t + Math.sin(t * 6 + q) * 0.04) * widths[i] * 0.84)));
    }
    if (fl.length > 3) furrows.push(line(chaikin(fl, 1)));
  }
}

// ---------- 2. roots ----------
const roots = [];
for (const [x0, dir, reach, drop] of [
  [372, -1, 160, 40], [394, -1, 96, 16], [432, -1, 62, 30],
  [592, 1, 176, 34], [568, 1, 100, 14], [522, 1, 70, 32], [472, 1, 40, 36],
]) {
  const pts = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    pts.push([x0 + dir * reach * t + rr(-4, 4), GROUND - 10 - Math.sin(t * Math.PI) * 6 + drop * Math.pow(t, 1.6) + rr(-2, 2)]);
  }
  const sm = chaikin(pts, 2);
  roots.push(ribbon(sm, taper(sm.length, rr(28, 40), 2, 0.7), 1.2));
}

// ---------- 3. the crown: leaf masses ----------
// [cx, cy, rx, ry, carving angle]. Flat undersides, daylight between.
const MASSES = [
  [196, 402, 118, 60, -0.5],
  [318, 300, 136, 84, -0.35],
  [488, 238, 140, 86, -0.15],
  [668, 236, 140, 84, 0.2],
  [812, 330, 124, 70, 0.4],
  [902, 422, 88, 44, 0.55],
  [566, 370, 98, 44, 0.1],
  [396, 402, 86, 42, -0.25],
];
const masses = MASSES.map(([cx, cy, rx, ry, ang]) => {
  const n1 = loopNoise(7), n2 = loopNoise(17), n3 = loopNoise(41);
  const ring = [];
  const N = 180;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const th = t * Math.PI * 2;
    const bump = 1 + 0.18 * n1(t) + 0.09 * n2(t) + 0.04 * n3(t);
    const under = Math.sin(th) > 0 ? 0.62 + 0.38 * (1 - Math.sin(th)) : 1; // flatter below
    ring.push([cx + Math.cos(th) * rx * bump, cy + Math.sin(th) * ry * bump * under]);
  }
  return { ring, cx, cy, rx, ry, ang };
});
const inAnyMass = (p, except = -1) => masses.some((m, i) => i !== except && inside(p, m.ring));

// ---------- 4. limbs and branches ----------
const limbs = [];
const limbLines = [];
function limb(pts, w0, w1, curve = 0.8) {
  const sm = chaikin(pts, 3);
  const ws = taper(sm.length, w0, w1, curve);
  limbs.push(ribbon(sm, ws, 0.6));
  limbLines.push({ pts: sm, ws, w: w0 });
  return sm;
}
// collars: the swelling where limbs leave the trunk
for (const [cx, cy, rx, ry] of [[444, 532, 34, 26], [550, 538, 32, 24], [492, 594, 20, 16]]) {
  const ring = [];
  for (let i = 0; i < 40; i++) {
    const th = (i / 40) * Math.PI * 2;
    ring.push([cx + Math.cos(th) * rx * rr(0.94, 1.04), cy + Math.sin(th) * ry * rr(0.94, 1.04)]);
  }
  limbs.push(poly(ring));
}
const L1 = limb([[446, 528], [392, 478], [310, 448], [214, 418]], 46, 9);
const L2 = limb([[446, 528], [430, 446], [384, 360], [336, 300]], 42, 9);
const L3 = limb([[492, 590], [486, 506], [470, 408], [470, 300]], 30, 7);
const L4 = limb([[548, 534], [568, 452], [562, 350], [594, 236]], 42, 9);
const L5 = limb([[548, 534], [622, 482], [702, 420], [752, 318]], 40, 9);
const L6 = limb([[548, 534], [660, 522], [776, 484], [874, 420]], 36, 8);
// Secondary branches leave a limb and cross the daylight between masses.
function branchFrom(src, at, to, w0, bend) {
  const p0 = src[Math.floor(src.length * at)];
  const mid = add(mul(add(p0, to), 0.5), bend);
  limb([p0, mid, to], w0, 2.2, 0.9);
}
branchFrom(L1, 0.55, [150, 396], 9, [0, -18]);
branchFrom(L1, 0.4, [262, 356], 8, [-10, 6]);
branchFrom(L2, 0.55, [258, 286], 8, [8, -14]);
branchFrom(L2, 0.7, [404, 262], 7, [-6, -10]);
branchFrom(L3, 0.6, [420, 334], 6, [6, 8]);
branchFrom(L4, 0.5, [512, 226], 8, [-6, 10]);
branchFrom(L4, 0.72, [668, 180], 7, [-4, -6]);
branchFrom(L5, 0.55, [818, 268], 8, [0, -10]);
branchFrom(L5, 0.4, [652, 352], 7, [4, 10]);
branchFrom(L6, 0.6, [930, 398], 7, [0, -8]);
branchFrom(L6, 0.4, [720, 440], 6, [-6, 8]);
// hanging twigs under the masses, where the leaves thin out
const twigPts = [];
for (const m of masses) {
  const count = Math.round(m.rx / 40);
  for (let i = 0; i < count; i++) {
    const x = m.cx + rr(-0.7, 0.7) * m.rx;
    const top = [x, m.cy + m.ry * rr(0.1, 0.3)];
    const end = [x + rr(-14, 14), top[1] + rr(16, 34)];
    twigPts.push(chaikin([top, add(mul(add(top, end), 0.5), [rr(-5, 5), 0]), end], 2));
  }
}
const twigs = twigPts.map(line);

// ---------- 5. leaves ----------
function leaf(at, angle, L, Wd) {
  const d = [Math.cos(angle), Math.sin(angle)];
  const n = perp(d);
  const tip = add(at, mul(d, L));
  const c1 = add(add(at, mul(d, L * 0.52)), mul(n, Wd));
  const c2 = add(add(at, mul(d, L * 0.52)), mul(n, -Wd));
  return { d: `M${f(at[0])} ${f(at[1])}Q${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])}Q${f(c2[0])} ${f(c2[1])} ${f(at[0])} ${f(at[1])}Z`, at, tip };
}
const hang = (a, k) => a + (Math.PI / 2 - a) * k; // olive leaves hang
const edgeLeaves = [];
masses.forEach((m, mi) => {
  const ring = m.ring;
  let acc = 0;
  let gap = rr(9, 13);
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    acc += len(sub(b, a));
    if (acc < gap) continue;
    acc = 0;
    gap = rr(9, 13);
    if (inAnyMass(a, mi)) continue;
    const outward = norm(sub(a, [m.cx, m.cy]));
    let ang = Math.atan2(outward[1], outward[0]) + rr(-0.55, 0.55);
    ang = hang(ang, outward[1] > 0 ? 0.5 : 0.28);
    const base = add(a, mul(outward, -rr(3, 7)));
    edgeLeaves.push(leaf(base, ang, rr(17, 27), rr(2.8, 3.8)));
    if (rand() < 0.35) edgeLeaves.push(leaf(base, hang(ang + rr(0.5, 0.9) * (rand() < 0.5 ? -1 : 1), 0.2), rr(14, 20), rr(2.4, 3.2)));
  }
});
// leaves along the hanging twigs
for (const pts of twigPts) {
  for (let i = 2; i < pts.length; i += 2) {
    const dir = norm(sub(pts[i], pts[i - 1]));
    const base = Math.atan2(dir[1], dir[0]);
    for (const side of [-1, 1]) edgeLeaves.push(leaf(pts[i], hang(base + side * rr(0.6, 1), 0.2), rr(12, 17), rr(2.2, 2.9)));
  }
}
// carving: leaf-shaped cuts inside the masses, running in each mass's grain
const carved = [];
masses.forEach((m, mi) => {
  for (let y = m.cy - m.ry; y < m.cy + m.ry; y += 13) {
    for (let x = m.cx - m.rx; x < m.cx + m.rx; x += 17) {
      const p = [x + rr(-6, 6) + (Math.round(y / 13) % 2) * 8, y + rr(-4, 4)];
      if (!inside(p, m.ring)) continue;
      // keep cuts off the edge so the silhouette holds
      const held = [0, 1, 2, 3, 4, 5].every((k) => {
        const a = (k / 6) * Math.PI * 2;
        const q = add(p, [Math.cos(a) * 13, Math.sin(a) * 11]);
        return inside(q, m.ring) || inAnyMass(q, mi);
      });
      if (!held || rand() > 0.72) continue;
      // the lower part of each mass is in shadow: fewer cuts
      const shade = (p[1] - (m.cy - m.ry)) / (2 * m.ry);
      if (rand() < shade * 0.75) continue;
      carved.push(leaf(p, m.ang + rr(-0.35, 0.35) + (rand() < 0.5 ? Math.PI : 0), rr(9, 14), rr(1.6, 2.3)));
    }
  }
});
// highlights carved along the upper side of the big limbs, only where the
// limb is in daylight (inside a mass it is hidden by leaves)
const limbCuts = [];
for (const l of limbLines.filter((q) => q.w > 20)) {
  const from = 3, to = Math.floor(l.pts.length * 0.55);
  const seg = l.pts.slice(from, to);
  let run = [];
  seg.forEach((p, i) => {
    const a = seg[Math.max(0, i - 1)], b = seg[Math.min(seg.length - 1, i + 1)];
    const n = norm(perp(sub(b, a)));
    const q = add(p, mul(n, -l.ws[from + i] * 0.24));
    if (inAnyMass(q)) { if (run.length > 3) limbCuts.push(line(run)); run = []; }
    else run.push(q);
  });
  if (run.length > 3) limbCuts.push(line(run));
}

// ---------- 6. ground ----------
const groundSegs = [];
for (let x = 150; x < 860; ) {
  const w = rr(26, 90);
  groundSegs.push(`M${f(x)} ${f(GROUND + rr(-1.5, 1.5))}L${f(Math.min(860, x + w))} ${f(GROUND + rr(-1.5, 1.5))}`);
  x += w + rr(6, 18);
}

// ---------- output ----------
const allX = [...masses.flatMap((m) => m.ring.map((p) => p[0])), ...edgeLeaves.flatMap((l) => [l.at[0], l.tip[0]]), 140, 870];
const allY = [...masses.flatMap((m) => m.ring.map((p) => p[1])), ...edgeLeaves.flatMap((l) => [l.at[1], l.tip[1]])];
const LEFT = Math.floor(Math.min(...allX) - 6), RIGHT = Math.ceil(Math.max(...allX) + 6);
const TOP = Math.floor(Math.min(...allY) - 6), BOTTOM = GROUND + 34;
const VW = RIGHT - LEFT, VH = BOTTOM - TOP;
const svg = (body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LEFT} ${TOP} ${VW} ${VH}">${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>\n`;

const massPaths = masses.map((m) => poly(m.ring)).join("");
const woodcut = svg(
  `<g mask="url(#c)"><path d="${roots.join("")}${trunk.join("")}${limbs.join("")}${massPaths}"/></g>` +
    `<path d="${edgeLeaves.map((l) => l.d).join("")}"/>` +
    `<path d="${twigs.join("")}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="${groundSegs.join("")}" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/>`,
  `<mask id="c" maskUnits="userSpaceOnUse" x="${LEFT}" y="${TOP}" width="${VW}" height="${VH}">` +
    `<rect x="${LEFT}" y="${TOP}" width="${VW}" height="${VH}" fill="#fff"/>` +
    `<path d="${furrows.join("")}${limbCuts.join("")}" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="${carved.map((l) => l.d).join("")}"/></mask>`,
);

// PENCIL — how a hand draws the same tree on a map: outlines, single strokes.
// Limbs are hidden where they pass behind the leaf masses.
const pencil = svg(
  `<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="${roots.join("")}${trunk.join("")}" stroke-width="2"/>` +
    `<path d="${limbs.join("")}" stroke-width="2" mask="url(#m)"/>` +
    `<path d="${furrows.join("")}" stroke-width="1.1"/>` +
    `<path d="${massPaths}" stroke-width="2"/>` +
    `<path d="${twigs.join("")}" stroke-width="1.4"/>` +
    `<path d="${carved.filter((_, i) => i % 2 === 0).map((l) => `M${f(l.at[0])} ${f(l.at[1])}L${f(l.tip[0])} ${f(l.tip[1])}`).join("")}" stroke-width="1.4"/>` +
    `<path d="${edgeLeaves.filter((_, i) => i % 3 === 0).map((l) => `M${f(l.at[0])} ${f(l.at[1])}L${f(l.tip[0])} ${f(l.tip[1])}`).join("")}" stroke-width="1.6"/>` +
    `<path d="${groundSegs.join("")}" stroke-width="2.4"/></g>`,
  `<mask id="m" maskUnits="userSpaceOnUse" x="${LEFT}" y="${TOP}" width="${VW}" height="${VH}">` +
    `<rect x="${LEFT}" y="${TOP}" width="${VW}" height="${VH}" fill="#fff"/><path d="${massPaths}"/></mask>`,
);

// MARK — for 16–64px: silhouette, no carving, no loose leaves.
const mark = svg(`<path d="${roots.join("")}${trunk.join("")}${limbs.join("")}${massPaths}"/>`);

mkdirSync("public/olive", { recursive: true });
writeFileSync("public/olive/olive-woodcut.svg", woodcut);
writeFileSync("public/olive/olive-pencil.svg", pencil);
writeFileSync("public/olive/olive-mark.svg", mark);

mkdirSync("src/components/olive", { recursive: true });
writeFileSync(
  "src/components/olive/olive-geometry.ts",
  `// GENERATED by scripts/draw-olive.mjs (seed ${SEED}). Do not edit by hand.
export const OLIVE_GEOMETRY = {
  width: ${VW},
  height: ${VH},
  /** Where the trunk meets the ground, as a fraction of width and height. */
  root: [${((484 - LEFT) / VW).toFixed(4)}, ${((GROUND - TOP) / VH).toFixed(4)}],
} as const;
`,
);
const kb = (x) => (Buffer.byteLength(x) / 1024).toFixed(1) + "KB";
console.log("edge leaves", edgeLeaves.length, "carved", carved.length, "| woodcut", kb(woodcut), "pencil", kb(pencil), "mark", kb(mark), "| viewBox", LEFT, TOP, VW, VH);

if (process.argv.includes("--png")) {
  const sharp = (await import("sharp")).default;
  const dir = process.env.OUT || ".";
  // Review exactly as the site uses it: the SVG's alpha as a mask over a colour.
  const tint = async (src, ink, ground, name, width = 1100) => {
    const { data, info } = await sharp(Buffer.from(src), { density: 150 }).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = Buffer.alloc(info.width * info.height);
    for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
    const inkLayer = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: ink } })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
    await sharp({ create: { width: info.width + 80, height: info.height + 80, channels: 3, background: ground } })
      .composite([{ input: inkLayer, left: 40, top: 40 }]).png().toFile(`${dir}/${name}.png`);
  };
  await tint(woodcut, "#173F2A", "#E9E4D8", "olive-woodcut");
  await tint(pencil, "#E9E4D8", "#080808", "olive-pencil");
  await tint(mark, "#E9E4D8", "#0D2419", "olive-mark", 200);
  console.log("review sheets written to", dir);
}
