#!/usr/bin/env node
/**
 * THE LAND — real elevation for the whole land of Palestine, river to sea,
 * Galilee to the Naqab, for the 3D relief.
 *
 * Elevation: Terrain Tiles on AWS Open Data (Tilezen / Mapzen "terrarium"
 * encoding), built from public-domain NASA SRTM and NOAA ETOPO1 in this
 * region. Outline: Natural Earth 1:10m admin-0 polygons (public domain) —
 * the land is the union of the polygons Natural Earth names Palestine and
 * Israel. Lakes: Natural Earth 1:50m.
 *
 * Output: public/land/land.png — one lossless PNG the browser decodes:
 *   R,G = elevation + 1000, as a 16-bit number (metres)
 *   B   = class: 0 sea · 1 neighbouring land · 2 the land · 3 lake
 * and src/content/land.ts with the grid's geographic frame.
 *
 *   node scripts/build-land.mjs          (tiles cached in node_modules/.cache)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { feature } from "topojson-client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(root, "node_modules/.cache/majdal-land");
mkdirSync(CACHE, { recursive: true });

// Frame: the whole land plus a margin of its neighbours and the sea.
const FRAME = { lon0: 33.95, lon1: 36.25, lat0: 29.25, lat1: 33.55 };
const STEP = 0.009; // degrees per cell (~1 km)
const Z = 9;

const W = Math.round((FRAME.lon1 - FRAME.lon0) / STEP) + 1;
const H = Math.round((FRAME.lat1 - FRAME.lat0) / STEP) + 1;

// ---------- tiles ----------
const n = 2 ** Z;
const tx = (lon) => ((lon + 180) / 360) * n;
const ty = (lat) => ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n;
const X0 = Math.floor(tx(FRAME.lon0)), X1 = Math.floor(tx(FRAME.lon1));
const Y0 = Math.floor(ty(FRAME.lat1)), Y1 = Math.floor(ty(FRAME.lat0));

const tiles = new Map();
for (let x = X0; x <= X1; x++) {
  for (let y = Y0; y <= Y1; y++) {
    const file = join(CACHE, `${Z}-${x}-${y}.png`);
    if (!existsSync(file)) {
      const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`;
      execFileSync("curl", ["-sS", "--fail", "-m", "60", "-o", file, url]);
    }
    const { data } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const elev = new Float32Array(256 * 256);
    for (let i = 0; i < elev.length; i++) elev[i] = data[i * 3] * 256 + data[i * 3 + 1] + data[i * 3 + 2] / 256 - 32768;
    tiles.set(`${x}/${y}`, elev);
  }
}
console.log(`tiles z${Z}: x ${X0}-${X1}, y ${Y0}-${Y1} (${tiles.size})`);

function elevAt(lon, lat) {
  const fx = tx(lon) * 256, fy = ty(lat) * 256;
  const px = Math.floor(fx - 0.5), py = Math.floor(fy - 0.5);
  const u = fx - 0.5 - px, v = fy - 0.5 - py;
  const s = (X, Y) => {
    const t = tiles.get(`${Math.floor(X / 256)}/${Math.floor(Y / 256)}`);
    return t ? t[(Y % 256) * 256 + (X % 256)] : 0;
  };
  return (
    s(px, py) * (1 - u) * (1 - v) + s(px + 1, py) * u * (1 - v) + s(px, py + 1) * (1 - u) * v + s(px + 1, py + 1) * u * v
  );
}

// ---------- outlines ----------
const countries = JSON.parse(readFileSync(join(root, "node_modules/world-atlas/countries-10m.json"), "utf8"));
const fc = feature(countries, countries.objects.countries);
const ringsOf = (names) =>
  fc.features
    .filter((f) => names.includes(f.properties.name))
    .flatMap((f) => (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates));
const LAND = ringsOf(["Palestine", "Israel"]);
const NEIGHBOURS = ringsOf(["Egypt", "Jordan", "Lebanon", "Syria", "Saudi Arabia"]);

const lakesTopo = JSON.parse(readFileSync(join(root, "node_modules/sane-topojson/dist/asia_50m.json"), "utf8"));
const LAKES = feature(lakesTopo, lakesTopo.objects.lakes).features.flatMap((f) =>
  f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates,
);

function inRing(lon, lat, ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// Natural Earth's Israel polygon includes the Golan Heights: Syrian territory,
// occupied since 1967, never part of Mandate Palestine. It is excluded here,
// east of the upper Jordan and the lake's eastern shore. Approximate by
// design: this is the edge of a drawn relief, not a border claim.
const inGolan = (lon, lat) => (lat > 32.7 && lon > 35.655) || (lat > 32.62 && lat <= 32.7 && lon > 35.6);

const inPolys = (lon, lat, polys) =>
  polys.some((poly) => inRing(lon, lat, poly[0]) && !poly.slice(1).some((hole) => inRing(lon, lat, hole)));

// ---------- grid ----------
const out = Buffer.alloc(W * H * 3);
let landCells = 0, minH = Infinity, maxH = -Infinity;
let bbox = [Infinity, Infinity, -Infinity, -Infinity];
for (let r = 0; r < H; r++) {
  const lat = FRAME.lat1 - r * STEP; // row 0 is north
  for (let c = 0; c < W; c++) {
    const lon = FRAME.lon0 + c * STEP;
    let h = elevAt(lon, lat);
    let cls;
    if (inPolys(lon, lat, LAKES)) cls = 3;
    else if (inPolys(lon, lat, LAND) && !inGolan(lon, lat)) cls = 2;
    else if (inGolan(lon, lat) && inPolys(lon, lat, LAND)) cls = 1;
    else if (inPolys(lon, lat, NEIGHBOURS)) cls = 1;
    else cls = h > 2 ? 1 : 0;
    if (cls === 0) h = Math.min(h, 0);
    if (cls === 2) {
      landCells++;
      minH = Math.min(minH, h);
      maxH = Math.max(maxH, h);
      bbox = [Math.min(bbox[0], lon), Math.min(bbox[1], lat), Math.max(bbox[2], lon), Math.max(bbox[3], lat)];
    }
    const v = Math.max(0, Math.min(65535, Math.round(h + 1000)));
    const o = (r * W + c) * 3;
    out[o] = v >> 8;
    out[o + 1] = v & 255;
    out[o + 2] = cls;
  }
}

mkdirSync(join(root, "public/land"), { recursive: true });
await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toFile(join(root, "public/land/land.png"));

writeFileSync(
  join(root, "src/content/land.ts"),
  `// GENERATED by scripts/build-land.mjs — do not edit.
//
// Grid frame for public/land/land.png. Row 0 is the north edge.
// Elevation: Terrain Tiles on AWS Open Data (terrarium), from NASA SRTM and
// NOAA ETOPO1 (public domain). Outline: Natural Earth 1:10m (public domain),
// the union of the polygons it names Palestine and Israel, with the Syrian
// Golan excluded (never part of Mandate Palestine). Lakes: Natural Earth 1:50m.

export const LAND_GRID = {
  width: ${W},
  height: ${H},
  lon0: ${FRAME.lon0},
  lat1: ${FRAME.lat1},
  step: ${STEP},
  /** Offset added to elevation (metres) before 16-bit encoding. */
  offset: 1000,
  /** Lowest and highest elevation inside the land, metres. */
  landMin: ${Math.round(minH)},
  landMax: ${Math.round(maxH)},
  /** The land's extent: [west, south, east, north]. */
  landBox: [${bbox.map((v) => v.toFixed(3)).join(", ")}],
} as const;

export const LAND_SOURCES = [
  "Elevation: Terrain Tiles, AWS Open Data (Tilezen) — from NASA SRTM and NOAA ETOPO1, public domain",
  "Outline: Natural Earth 1:10m admin-0 (public domain) — union of the polygons named Palestine and Israel, with the Syrian Golan excluded",
  "Lakes: Natural Earth 1:50m (public domain)",
] as const;
`,
);
console.log(`grid ${W}×${H}, land cells ${landCells}, land ${Math.round(minH)}…${Math.round(maxH)} m, box ${bbox.map((v) => v.toFixed(2))}`);
