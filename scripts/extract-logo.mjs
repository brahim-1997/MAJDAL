// Extracts the official MAJDAL lockups from the founder's logo sheet.
//
// Nothing is redrawn. Each lockup is cropped from the supplied artwork and
// its black ground is turned into transparency: alpha comes from brightness,
// colour is un-premultiplied against the black ground, so composited on
// black the result is pixel-identical to the sheet. The ink version keeps
// the same alpha (and so the same print texture) in black, for paper grounds.
//
// The coordinates line under the primary lockup is NOT extracted — it points
// ~70 km north of al-Majdal (see brand/IDENTITY-LOGO.md §1.1).
//
//   node scripts/extract-logo.mjs

import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "brand/assets/majdal-logo-sheet.jpg";
const OUT = "public/brand";
const INK = [8, 8, 8]; // --black
const FULL = 200; // luminance at which the artwork is fully opaque
const PAD = 6;

// Boxes measured on the 1254×1254 sheet: [left, top, right, bottom], inclusive.
const LOCKUPS = {
  primary: [322, 93, 936, 565], // mark + ™ / MAJDAL ® / مجدل
  stacked: [77, 809, 331, 1025], // small lockup: mark / MAJDAL / مجدل
  mark: null, // derived below from the primary: tower + star + olive, no ™
};

mkdirSync(OUT, { recursive: true });

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const lum = (x, y) => {
  const i = (y * W + x) * 3;
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
};

// The mark: rows 93–383 of the primary, excluding the ™ at the right.
{
  let x0 = 1e9, x1 = -1;
  for (let y = 93; y <= 383; y++)
    for (let x = 322; x <= 820; x++) if (lum(x, y) > 70) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  LOCKUPS.mark = [x0, 93, x1, 383];
}

async function write(name, [l, t, r, b], tone) {
  const w = r - l + 1 + PAD * 2;
  const h = b - t + 1 + PAD * 2;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = l - PAD + x, sy = t - PAD + y;
      const o = (y * w + x) * 4;
      if (sx < 0 || sy < 0 || sx >= W || sy >= info.height) continue;
      const i = (sy * W + sx) * 3;
      const L = lum(sx, sy);
      const a = Math.max(0, Math.min(1, (L - 6) / (FULL - 6)));
      if (a === 0) continue;
      if (tone === "ink") {
        out[o] = INK[0]; out[o + 1] = INK[1]; out[o + 2] = INK[2];
      } else {
        out[o] = Math.min(255, Math.round(data[i] / a));
        out[o + 1] = Math.min(255, Math.round(data[i + 1] / a));
        out[o + 2] = Math.min(255, Math.round(data[i + 2] / a));
      }
      out[o + 3] = Math.round(a * 255);
    }
  }
  const file = `${OUT}/majdal-${name}${tone === "ink" ? "-ink" : ""}.webp`;
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
    .toFile(file);
  console.log(file, `${w}×${h}`);
  return { out, w, h };
}

let markBone;
for (const [name, box] of Object.entries(LOCKUPS)) {
  const bone = await write(name, box, "bone");
  await write(name, box, "ink");
  if (name === "mark") markBone = bone;
}

// App icons: the mark, bone on black, centred with clear space.
const mark = await sharp(markBone.out, { raw: { width: markBone.w, height: markBone.h, channels: 4 } }).png().toBuffer();
for (const [file, size] of [["src/app/icon.png", 192], ["src/app/apple-icon.png", 180]]) {
  const inner = Math.round(size * 0.78);
  const scaled = await sharp(mark).resize({ width: inner, height: inner, fit: "inside" }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#080808" } })
    .composite([{ input: scaled, gravity: "center" }])
    .png()
    .toFile(file);
  console.log(file, `${size}×${size}`);
}
