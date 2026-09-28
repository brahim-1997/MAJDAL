// THE MAJDAL OLIVE TREE — a traditional engraving, generated once, committed.
//
// An old olive tree drawn the way nineteenth-century line engravings drew
// them: a broad, billowing crown shaded by hatching and cross-hatching, leaf
// strokes along its edge, a short twisted trunk split around a hollow,
// exposed roots, and the ground's shadow in horizontal strokes. Light comes
// from the upper left. One ink, black lines only.
//
// It carries no assigned meaning. Seeded, so it is the same tree every time.
//
//   node scripts/draw-olive.mjs          → public/olive/olive-engraved.svg, olive-mark.svg
//   OUT=dir node scripts/draw-olive.mjs --png   → also renders review sheets

import { writeFileSync, mkdirSync } from "node:fs";

const SEED = 48;
const W = 1000;
const H = 820;
const GROUND = 736;

// ---------- seeded random ----------
let s = SEED >>> 0;
const rand = () => {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rr = (a, b) => a + (b - a) * rand();
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
const line = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");

// ---------- the crown: billows ----------
// [cx, cy, r] — later billows sit in front of earlier ones.
const LOBES = [
  [430, 175, 118], [580, 170, 120], [300, 235, 112], [705, 230, 112],
  [505, 245, 138], [200, 320, 96], [800, 318, 92], [360, 330, 124],
  [640, 330, 126], [505, 360, 118], [250, 405, 80], [760, 405, 78],
  [410, 430, 86], [600, 432, 90],
];
// Each billow's edge wobbles, so the crown is irregular, not a string of circles.
const lobes = LOBES.map(([cx, cy, r]) => {
  const k = Array.from({ length: 9 }, () => rr(-1, 1));
  const edge = (th) => {
    const x = ((th / (Math.PI * 2)) % 1 + 1) % 1 * 9;
    const i = Math.floor(x), t = x - i, u = t * t * (3 - 2 * t);
    return r * (1 + 0.07 * (k[i % 9] + (k[(i + 1) % 9] - k[i % 9]) * u));
  };
  return { cx, cy, r, edge };
});
const inLobe = (p, L) => {
  const d = sub(p, [L.cx, L.cy]);
  return len(d) < L.edge(Math.atan2(d[1], d[0]));
};
const inCrown = (p) => lobes.some((L) => inLobe(p, L));

// Light from the upper left, towards the viewer.
const LIGHT = (() => { const v = [-0.55, -0.7, 0.45]; const l = Math.hypot(...v); return v.map((x) => x / l); })();
function darkness(p) {
  let front = null;
  for (const L of lobes) if (inLobe(p, L)) front = L; // last = in front
  if (!front) return -1;
  const dx = (p[0] - front.cx) / front.r, dy = (p[1] - front.cy) / front.r;
  const nz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy));
  const lit = Math.max(0, dx * LIGHT[0] + dy * LIGHT[1] + nz * LIGHT[2]);
  // the underside of the whole crown sits in shade
  const under = Math.max(0, (p[1] - 330) / 160) * 0.35;
  return Math.min(1, 1 - lit + under);
}

// ---------- hatching ----------
function hatchFamily(angleDeg, spacing, threshold, wave = 1.2) {
  const a = (angleDeg * Math.PI) / 180;
  const dir = [Math.cos(a), Math.sin(a)];
  const nrm = perp(dir);
  const c = [W / 2, 330];
  const out = [];
  const reach = 620;
  for (let k = -reach; k <= reach; k += spacing) {
    const phase = rand() * 10;
    let run = [];
    for (let t = -reach; t <= reach; t += 4) {
      const base = add(add(c, mul(nrm, k)), mul(dir, t));
      const p = add(base, mul(nrm, Math.sin(t * 0.045 + phase) * wave));
      const d = darkness(p);
      const on = d >= threshold + (rand() - 0.5) * 0.06;
      if (on) run.push(p);
      else {
        if (run.length > 2) out.push(line(run));
        run = [];
      }
    }
    if (run.length > 2) out.push(line(run));
  }
  return out;
}
const hatchA = hatchFamily(28, 5.2, 0.34);
const hatchB = hatchFamily(-38, 5.6, 0.56);
const hatchC = hatchFamily(0, 6.2, 0.8, 0.8);

// ---------- leaves ----------
function leaf(at, angle, L, Wd) {
  const d = [Math.cos(angle), Math.sin(angle)];
  const n = perp(d);
  const tip = add(at, mul(d, L));
  const c1 = add(add(at, mul(d, L * 0.5)), mul(n, Wd));
  const c2 = add(add(at, mul(d, L * 0.5)), mul(n, -Wd));
  return `M${f(at[0])} ${f(at[1])}Q${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])}Q${f(c2[0])} ${f(c2[1])} ${f(at[0])} ${f(at[1])}Z`;
}
const leaves = [];
// fringe: along each billow's visible edge, pointing out and a little down
for (const L of lobes) {
  for (let th = 0; th < Math.PI * 2; th += 0.055 + rand() * 0.03) {
    const r = L.edge(th);
    const p = [L.cx + Math.cos(th) * r, L.cy + Math.sin(th) * r];
    if (lobes.some((M) => M !== L && inLobe(p, M))) continue;
    const out = Math.atan2(Math.sin(th), Math.cos(th));
    const dark = darkness(add(p, [-Math.cos(th) * 6, -Math.sin(th) * 6]));
    if (rand() > 0.55 + dark * 0.4) continue;
    let a = out + rr(-0.6, 0.6);
    a += (Math.PI / 2 - a) * 0.18; // olive leaves hang
    leaves.push(leaf(add(p, [-Math.cos(th) * 4, -Math.sin(th) * 4]), a, rr(11, 17), rr(1.8, 2.6)));
  }
}
// inside: sparse leaf touches, more where the light falls
for (let i = 0; i < 2600; i++) {
  const p = [rr(90, 910), rr(40, 520)];
  const d = darkness(p);
  if (d < 0 || rand() > (1 - d) * 0.5) continue;
  leaves.push(leaf(p, rr(0, Math.PI * 2), rr(7, 11), rr(1.3, 1.9)));
}

// ---------- trunk: twisted strands around a hollow ----------
const strands = [
  { c: [[400, 742], [414, 690], [396, 640], [410, 590], [444, 548], [454, 508]], w: [112, 84, 88, 66, 58, 50], side: -1 },
  { c: [[590, 742], [572, 694], [592, 644], [572, 596], [546, 556], [558, 512]], w: [104, 78, 82, 62, 54, 46], side: 1 },
  { c: [[486, 738], [516, 694], [488, 650], [504, 606], [500, 570]], w: [52, 40, 42, 34, 30], side: 0 },
];
const trunkLines = [];
const trunkFill = [];
const hollow = [];
for (const st of strands) {
  const pts = chaikin(st.c, 3);
  const widths = pts.map((_, i) => {
    const k = (i / (pts.length - 1)) * (st.w.length - 1);
    const j = Math.min(st.w.length - 2, Math.floor(k));
    return st.w[j] + (st.w[j + 1] - st.w[j]) * (k - j);
  });
  const Lft = [], Rgt = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const n = norm(perp(sub(b, a)));
    Lft.push(add(p, mul(n, widths[i] / 2 + rr(-1.5, 1.5))));
    Rgt.push(add(p, mul(n, -widths[i] / 2 + rr(-1.5, 1.5))));
  });
  trunkFill.push("M" + [...Lft, ...Rgt.slice().reverse()].map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z");
  trunkLines.push(line(Lft), line(Rgt));
  // grain: lines following the twist, denser toward the shaded (right) side
  const count = Math.round(widths[0] / 7);
  for (let q = 0; q < count; q++) {
    const off = (q + 0.5) / count - 0.5; // -0.5 left .. 0.5 right
    const shade = off + 0.5; // 0 lit .. 1 dark
    if (rand() > 0.25 + shade * 0.8) continue;
    const twist = rr(-0.16, 0.16);
    const a0 = Math.floor(rr(0, pts.length * 0.15));
    const a1 = Math.floor(rr(pts.length * 0.7, pts.length - 1));
    const g = [];
    for (let i = a0; i <= a1; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const n = norm(perp(sub(b, a)));
      const t = (i - a0) / Math.max(1, a1 - a0);
      g.push(add(pts[i], mul(n, (off + twist * t + Math.sin(t * 7 + q) * 0.03) * widths[i] * 0.9)));
    }
    trunkLines.push(line(chaikin(g, 1)));
  }
  // cross-contour hatching across the shaded third
  for (let i = 2; i < pts.length - 2; i += 2) {
    const a = pts[i - 1], b = pts[i + 1];
    const n = norm(perp(sub(b, a)));
    const w = widths[i];
    const p0 = add(pts[i], mul(n, w * 0.12));
    const p1 = add(pts[i], mul(n, w * 0.48));
    const bow = mul(norm(sub(b, a)), 3);
    trunkLines.push(line([p0, add(mul(add(p0, p1), 0.5), bow), p1]));
  }
}
// the hollow between the strands: deep shade, cross-hatched, clipped to the
// gap the two strands leave
const edgeOf = (st, sideSign) => {
  const pts = chaikin(st.c, 3);
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const n = norm(perp(sub(b, a)));
    const k = (i / (pts.length - 1)) * (st.w.length - 1);
    const j = Math.min(st.w.length - 2, Math.floor(k));
    const w = st.w[j] + (st.w[j + 1] - st.w[j]) * (k - j);
    return add(p, mul(n, (sideSign * w) / 2));
  });
};
const hollowPoly = [...edgeOf(strands[0], 1), ...edgeOf(strands[1], -1).reverse()];
const hollowClip = "M" + hollowPoly.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
for (let k = -200; k < 200; k += 4.2) hollow.push(`M${f(400 + k)} 520L${f(640 + k)} 745`);
for (let k = -200; k < 200; k += 5.5) hollow.push(`M${f(640 + k)} 520L${f(400 + k)} 745`);

// ---------- limbs rising into the crown ----------
const limbLines = [];
for (const [from, to, w0] of [
  [[454, 520], [330, 400], 34], [[454, 520], [410, 380], 26], [[500, 572], [505, 400], 24],
  [[556, 516], [620, 390], 28], [[556, 516], [700, 410], 30], [[556, 516], [560, 380], 22],
]) {
  const mid = add(mul(add(from, to), 0.5), [rr(-18, 18), rr(-10, 10)]);
  const pts = chaikin([from, mid, to], 3);
  const Lft = [], Rgt = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const n = norm(perp(sub(b, a)));
    const w = w0 * (1 - (i / pts.length) * 0.55);
    Lft.push(add(p, mul(n, w / 2)));
    Rgt.push(add(p, mul(n, -w / 2)));
  });
  // limbs disappear into the foliage
  const visible = (arr) => {
    const runs = [];
    let run = [];
    for (const p of arr) {
      if (darkness(p) < 0 || darkness(p) > 0.62) run.push(p);
      else { if (run.length > 1) runs.push(run); run = []; }
    }
    if (run.length > 1) runs.push(run);
    return runs.map(line);
  };
  limbLines.push(...visible(Lft), ...visible(Rgt));
  for (let q = 1; q < 4; q++) {
    const g = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const n = norm(perp(sub(b, a)));
      return add(p, mul(n, -(q / 4 - 0.5) * w0 * 0.7));
    });
    if (q > 1) limbLines.push(...visible(g));
  }
}

// ---------- roots and the ground ----------
const roots = [];
for (const [x0, dir, reach, drop] of [
  [372, -1, 150, 34], [396, -1, 84, 14], [436, -1, 56, 26],
  [606, 1, 162, 30], [582, 1, 92, 12], [540, 1, 64, 26],
]) {
  const pts = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    pts.push([x0 + dir * reach * t, GROUND - 8 + drop * Math.pow(t, 1.5) + rr(-2, 2)]);
  }
  const sm = chaikin(pts, 2);
  const top = sm.map((p, i) => add(p, [0, -(1 - i / sm.length) * 12]));
  roots.push(line(top), line(sm));
  for (let i = 2; i < sm.length - 2; i += 3) roots.push(line([top[i], add(sm[i], [dir * 4, 0])]));
}
const ground = [];
for (let row = 0; row < 7; row++) {
  const y = GROUND + 6 + row * 6;
  const spread = 330 - row * 34;
  let x = W / 2 - spread;
  while (x < W / 2 + spread) {
    const wseg = rr(14, 46);
    if (rand() < 0.8 - row * 0.06) ground.push(`M${f(x)} ${f(y + rr(-1, 1))}L${f(x + wseg)} ${f(y + rr(-1, 1))}`);
    x += wseg + rr(4, 12);
  }
}

// ---------- output ----------
const VB = `60 20 880 780`;
const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="880" height="780">${body}</svg>\n`;

const engraved = svg(
  `<defs><clipPath id="hollow"><path d="${hollowClip}"/></clipPath></defs>` +
  `<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="${hatchA.join("")}" stroke-width="1.3"/>` +
    `<path d="${hatchB.join("")}" stroke-width="1.2"/>` +
    `<path d="${hatchC.join("")}" stroke-width="1.1"/>` +
    `<path d="${limbLines.join("")}" stroke-width="1.6"/>` +
    `<path d="${trunkLines.join("")}" stroke-width="1.5"/>` +
    `<path d="${hollow.join("")}" stroke-width="1.3" clip-path="url(#hollow)"/>` +
    `<path d="${roots.join("")}" stroke-width="1.6"/>` +
    `<path d="${ground.join("")}" stroke-width="1.5"/>` +
    `</g><path d="${leaves.join("")}"/>`,
);

// Silhouette for small sizes: billows, trunk, roots — filled.
const lobePath = lobes
  .map((L) => {
    const pts = [];
    for (let i = 0; i < 72; i++) {
      const th = (i / 72) * Math.PI * 2;
      const r = L.edge(th);
      pts.push([L.cx + Math.cos(th) * r, L.cy + Math.sin(th) * r]);
    }
    return "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  })
  .join("");
const mark = svg(`<path d="${lobePath}${trunkFill.join("")}"/><path d="${roots.join("")}" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round"/>`);

mkdirSync("public/olive", { recursive: true });
writeFileSync("public/olive/olive-engraved.svg", engraved);
writeFileSync("public/olive/olive-mark.svg", mark);

mkdirSync("src/components/olive", { recursive: true });
writeFileSync(
  "src/components/olive/olive-geometry.ts",
  `// GENERATED by scripts/draw-olive.mjs (seed ${SEED}). Do not edit by hand.
export const OLIVE_GEOMETRY = {
  width: 880,
  height: 780,
  /** Where the trunk meets the ground, as a fraction of width and height. */
  root: [${((495 - 60) / 880).toFixed(4)}, ${((GROUND - 20) / 780).toFixed(4)}],
} as const;
`,
);
const kb = (x) => (Buffer.byteLength(x) / 1024).toFixed(1) + "KB";
console.log("hatch", hatchA.length + hatchB.length + hatchC.length, "leaves", leaves.length, "| engraved", kb(engraved), "mark", kb(mark));

if (process.argv.includes("--png")) {
  const sharp = (await import("sharp")).default;
  const dir = process.env.OUT || ".";
  const tint = async (src, ink, ground, name, width = 1100) => {
    const { data, info } = await sharp(Buffer.from(src), { density: 150 }).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = Buffer.alloc(info.width * info.height);
    for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
    const inkLayer = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: ink } })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
    await sharp({ create: { width: info.width + 80, height: info.height + 80, channels: 3, background: ground } })
      .composite([{ input: inkLayer, left: 40, top: 40 }]).png().toFile(`${dir}/${name}.png`);
  };
  await tint(engraved, "#0a0a0a", "#f4f2ec", "olive-engraved");
  await tint(engraved, "#f4f2ec", "#0a6b39", "olive-engraved-green");
  await tint(mark, "#f4f2ec", "#0a0a0a", "olive-mark", 200);
  console.log("review sheets written to", dir);
}
