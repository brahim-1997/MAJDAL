import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LAND_GRID } from "@/content/land";
import { places } from "@/content/places";

/**
 * THE LAND — the whole land of Palestine as an engraved relief.
 *
 * Real elevation (public/land/land.png, see scripts/build-land.mjs), vertical
 * scale exaggerated ×EXAG and labelled as such. Printed, not rendered: light
 * posterised to four tones, contours every 100 m, engraved hatching in shadow
 * fixed to the ground, the sea black and water-lined. The land is paper-white;
 * its neighbours are dark and sink to ink at the frame, so the land reads as
 * the object.
 */

export const EXAG = 7;
/** Sea surface, in metres, drawn just below the shore. */
const SEA = -80;
const KM_X = LAND_GRID.step * 111.32 * Math.cos((31.4 * Math.PI) / 180);
const KM_Z = LAND_GRID.step * 111.32;

export const COLORS = {
  ink: new THREE.Color("#0a0a0a"),
  paper: new THREE.Color("#f4f2ec"),
  red: new THREE.Color("#d2161e"),
};

export type Grid = { w: number; h: number; elev: Float32Array; cls: Uint8Array };

export async function loadGrid(): Promise<Grid> {
  const res = await fetch("/land/land.png");
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const cv = document.createElement("canvas");
  cv.width = bmp.width;
  cv.height = bmp.height;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0);
  const { data } = ctx.getImageData(0, 0, bmp.width, bmp.height);
  const n = bmp.width * bmp.height;
  const elev = new Float32Array(n);
  const cls = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    elev[i] = data[i * 4]! * 256 + data[i * 4 + 1]! - LAND_GRID.offset;
    cls[i] = data[i * 4 + 2]!;
  }
  return { w: bmp.width, h: bmp.height, elev, cls };
}

/** Grid cell (fractional) for a latitude/longitude. */
export const cellOf = (lat: number, lon: number) => ({
  c: (lon - LAND_GRID.lon0) / LAND_GRID.step,
  r: (LAND_GRID.lat1 - lat) / LAND_GRID.step,
});

export function worldXZ(g: Grid, c: number, r: number) {
  return { x: (c - (g.w - 1) / 2) * KM_X, z: (r - (g.h - 1) / 2) * KM_Z };
}

export function heightAt(g: Grid, c: number, r: number) {
  const c0 = Math.max(0, Math.min(g.w - 2, Math.floor(c)));
  const r0 = Math.max(0, Math.min(g.h - 2, Math.floor(r)));
  const u = Math.min(1, Math.max(0, c - c0));
  const v = Math.min(1, Math.max(0, r - r0));
  const e = (cc: number, rr: number) => {
    const i = rr * g.w + cc;
    return g.cls[i] === 0 ? SEA : g.elev[i]!;
  };
  return (
    e(c0, r0) * (1 - u) * (1 - v) + e(c0 + 1, r0) * u * (1 - v) + e(c0, r0 + 1) * (1 - u) * v + e(c0 + 1, r0 + 1) * u * v
  );
}

/**
 * Distance from the land, in km, for every cell (two-pass chamfer). The sea
 * and the neighbouring relief are drawn only near the land and sink to ink
 * beyond it, so the frame of the data never shows.
 */
function distanceFromLand(g: Grid) {
  const d = new Float32Array(g.w * g.h);
  for (let i = 0; i < d.length; i++) d[i] = g.cls[i]! >= 2 ? 0 : 1e9;
  const dd = Math.hypot(KM_X, KM_Z);
  const pass = (r: number, c: number, dr: number, dc: number, w: number) => {
    const rr = r + dr, cc = c + dc;
    if (rr < 0 || rr >= g.h || cc < 0 || cc >= g.w) return;
    const i = r * g.w + c, j = rr * g.w + cc;
    if (d[j]! + w < d[i]!) d[i] = d[j]! + w;
  };
  for (let r = 0; r < g.h; r++)
    for (let c = 0; c < g.w; c++) {
      pass(r, c, 0, -1, KM_X); pass(r, c, -1, 0, KM_Z); pass(r, c, -1, -1, dd); pass(r, c, -1, 1, dd);
    }
  for (let r = g.h - 1; r >= 0; r--)
    for (let c = g.w - 1; c >= 0; c--) {
      pass(r, c, 0, 1, KM_X); pass(r, c, 1, 0, KM_Z); pass(r, c, 1, 1, dd); pass(r, c, 1, -1, dd);
    }
  return d;
}

const VERT = /* glsl */ `
  attribute float aH;
  attribute float aCls;
  attribute float aNear;
  uniform float uRise;
  uniform vec2 uHalf;
  varying float vH;
  varying float vCls;
  varying float vEdge;
  varying float vNear;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vH = aH;
    vCls = aCls;
    vNear = aNear;
    // the frame's border sinks to sea level and fades to ink: no cut edge
    vec2 d = uHalf - abs(position.xz);
    vEdge = smoothstep(0.0, 22.0, min(d.x, d.y));
    vec3 p = position;
    p.y *= uRise * vEdge;
    // the normal of a surface scaled in y by s is (nx·s, ny, nz·s)
    float s = max(uRise * vEdge, 0.02);
    vNormal = normalize(vec3(normal.x * s, normal.y, normal.z * s));
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uLight;
  uniform float uInk;
  uniform vec3 cInk;
  uniform vec3 cPaper;
  uniform vec3 cShade;
  uniform vec3 cNeighLo;
  uniform vec3 cNeighHi;
  uniform vec3 cWater;
  varying float vH;
  varying float vCls;
  varying float vEdge;
  varying float vNear;
  varying vec3 vWorld;
  varying vec3 vNormal;

  float lineAA(float v, float width) {
    float fw = max(fwidth(v), 1e-4);
    float d = abs(fract(v + 0.5) - 0.5) / fw;
    return 1.0 - smoothstep(width, width + 1.0, d);
  }
  // 1 where lines of this density can be drawn without aliasing
  float room(float v) { return 1.0 - smoothstep(0.3, 0.55, fwidth(v)); }

  // engraved lines fixed to the ground; the density steps with distance,
  // so the burin cut reads the same at every zoom
  float hatch(vec2 xz, vec2 dir, float width) {
    float a = dot(xz, dir);
    float fine = a * 1.4, mid = a * 0.35, far = a * 0.09;
    float rf = room(fine), rm = room(mid);
    return max(lineAA(fine, width) * rf, max(lineAA(mid, width) * rm * (1.0 - rf), lineAA(far, width) * room(far) * (1.0 - rm)));
  }

  void main() {
    vec3 n = normalize(vNormal);
    float lam = clamp(dot(n, uLight), 0.0, 1.0);
    // flat ground sits mid-band, so it prints as clean paper, not blotches
    float tone = min(1.0, floor(lam * 4.0 + 1.73) / 4.0);

    float land = smoothstep(1.55, 1.95, vCls) * (1.0 - smoothstep(2.05, 2.45, vCls));
    float lake = smoothstep(2.55, 2.95, vCls);
    float sea = 1.0 - smoothstep(0.15, 0.6, vCls);
    float neigh = clamp(1.0 - land - lake - sea, 0.0, 1.0);

    float h1 = hatch(vWorld.xz, vec2(0.7071, -0.7071), 0.3) * (1.0 - smoothstep(0.5, 0.62, lam));
    float h2 = hatch(vWorld.xz, vec2(0.7071, 0.7071), 0.25) * (1.0 - smoothstep(0.22, 0.34, lam));

    // contours: 100 m, heavier every 500 m
    float c1 = lineAA(vH / 100.0, 0.15) * room(vH / 100.0);
    float c5 = lineAA(vH / 500.0, 0.45);

    vec3 landCol = mix(cShade, cPaper, tone);
    float ink = max(max(h1, h2) * 0.72, max(c1 * 0.26, c5 * 0.6)) * uInk;
    landCol = mix(landCol, cInk, ink);

    vec3 neighCol = mix(cNeighLo, cNeighHi, tone);
    neighCol = mix(neighCol, cNeighHi * 1.4, lineAA(vH / 200.0, 0.15) * room(vH / 200.0) * 0.5 * uInk);

    float wv = vWorld.z * 0.8;
    float water = lineAA(wv, 0.2) * room(wv);
    vec3 seaCol = mix(cInk, cWater, water * 0.9 * uInk);

    vec3 col = land * landCol + (neigh * neighCol + (sea + lake) * seaCol);
    // the land itself never fades; what surrounds it sinks to ink
    col = mix(cInk, col, max(land, vEdge * vNear));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export type PlaceMark = { slug: string; name: string; nameArabic: string; world: THREE.Vector3; origin: boolean };

/** A camera stop. `shift` slides the picture sideways (a fraction of the
 *  width, + moves the land right) so type and land can share a wide frame;
 *  it eases to nothing on a portrait screen. */
export type Stop = { target: [number, number]; dist: number; polar: number; azimuth: number; shift?: number };

export type LandScene = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  places: PlaceMark[];
  grid: Grid;
  /** Film: set everything from one progress value. */
  setUniforms: (u: { rise?: number; ink?: number; thread?: number; olive?: number }) => void;
  setCamera: (s: Stop) => void;
  project: (v: THREE.Vector3) => { x: number; y: number; visible: boolean };
  render: () => void;
  resize: () => void;
  controls?: OrbitControls;
  dispose: () => void;
  focusOn: (slug: string) => void;
};

/** Order in which the thread visits the register: back and forth, like a
 *  shuttle across a loom. A graphic layer — not a road, not a route. */
const THREAD_ORDER = ["al-majdal", "al-quds", "yafa", "nablus", "haifa", "akka"];

export async function createLand(
  canvas: HTMLCanvasElement,
  opts: { mode: "film" | "explore"; mobile: boolean; oliveSrc: string },
): Promise<LandScene> {
  const grid = await loadGrid();
  const stride = opts.mobile ? 2 : 1;
  const gw = Math.floor((grid.w - 1) / stride) + 1;
  const gh = Math.floor((grid.h - 1) / stride) + 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 1.75));
  renderer.setClearColor(COLORS.ink, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 4000);

  // ---- terrain ----
  // Heights are real metres ×EXAG/1000 in world km; the sea sits just below 0.
  const pos = new Float32Array(gw * gh * 3);
  const aH = new Float32Array(gw * gh);
  const aCls = new Float32Array(gw * gh);
  const aNear = new Float32Array(gw * gh);
  const dist = distanceFromLand(grid);
  const NEAR_KM = 38;
  for (let r = 0, k = 0; r < gh; r++) {
    for (let c = 0; c < gw; c++, k++) {
      const gc = c * stride, gr = r * stride;
      const { x, z } = worldXZ(grid, gc, gr);
      const i = gr * grid.w + gc;
      const cls = grid.cls[i]!;
      pos[k * 3] = x;
      pos[k * 3 + 1] = ((cls === 0 ? SEA : grid.elev[i]!) / 1000) * EXAG;
      pos[k * 3 + 2] = z;
      aH[k] = grid.elev[i]!;
      aCls[k] = cls;
      const t = Math.min(1, dist[i]! / NEAR_KM);
      aNear[k] = 1 - t * t * (3 - 2 * t);
    }
  }
  const idx = new Uint32Array((gw - 1) * (gh - 1) * 6);
  for (let r = 0, j = 0; r < gh - 1; r++) {
    for (let c = 0; c < gw - 1; c++) {
      const a = r * gw + c, b = a + 1, d = a + gw, e = d + 1;
      idx[j++] = a; idx[j++] = d; idx[j++] = b;
      idx[j++] = b; idx[j++] = d; idx[j++] = e;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aH", new THREE.BufferAttribute(aH, 1));
  geo.setAttribute("aCls", new THREE.BufferAttribute(aCls, 1));
  geo.setAttribute("aNear", new THREE.BufferAttribute(aNear, 1));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();

  const uniforms = {
    uRise: { value: 1 },
    uHalf: { value: new THREE.Vector2(((grid.w - 1) / 2) * KM_X, ((grid.h - 1) / 2) * KM_Z) },
    uInk: { value: 1 },
    uLight: { value: new THREE.Vector3(-1, 1.5, -1.2).normalize() },
    cInk: { value: COLORS.ink },
    cPaper: { value: COLORS.paper },
    cShade: { value: new THREE.Color("#c9c5bb") },
    cNeighLo: { value: new THREE.Color("#121211") },
    cNeighHi: { value: new THREE.Color("#2b2a27") },
    cWater: { value: new THREE.Color("#2a2927") },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
  const terrain = new THREE.Mesh(geo, mat);
  scene.add(terrain);

  // ---- places ----
  const y = (c: number, r: number) => (heightAt(grid, c, r) / 1000) * EXAG;
  const marks: PlaceMark[] = places.map((p) => {
    const { c, r } = cellOf(p.coordinates.lat, p.coordinates.lon);
    const { x, z } = worldXZ(grid, c, r);
    return { slug: p.slug, name: p.name, nameArabic: p.nameArabic, world: new THREE.Vector3(x, y(c, r), z), origin: p.slug === "al-majdal" };
  });
  const pinMat = new THREE.MeshBasicMaterial({ color: COLORS.ink });
  const redMat = new THREE.MeshBasicMaterial({ color: COLORS.red });
  for (const m of marks) {
    const hgt = m.origin ? 9 : 5;
    const pin = new THREE.Mesh(new THREE.BoxGeometry(m.origin ? 0.7 : 0.45, hgt, m.origin ? 0.7 : 0.45), m.origin ? redMat : pinMat);
    pin.position.set(m.world.x, m.world.y + hgt / 2, m.world.z);
    scene.add(pin);
    m.world = new THREE.Vector3(m.world.x, m.world.y + hgt, m.world.z);
  }

  // ---- the thread, draped over the land ----
  const byslug = (s: string) => marks.find((m) => m.slug === s)!;
  const knots2d = [
    new THREE.Vector2(byslug("al-majdal").world.x - 40, byslug("al-majdal").world.z + 60),
    ...THREAD_ORDER.map((s) => new THREE.Vector2(byslug(s).world.x, byslug(s).world.z)),
    new THREE.Vector2(byslug("akka").world.x + 30, byslug("akka").world.z - 60),
  ];
  const spline2 = new THREE.SplineCurve(knots2d);
  const draped: THREE.Vector3[] = [];
  for (let i = 0; i <= 600; i++) {
    const p = spline2.getPoint(i / 600);
    const c = p.x / KM_X + (grid.w - 1) / 2;
    const r = p.y / KM_Z + (grid.h - 1) / 2;
    draped.push(new THREE.Vector3(p.x, Math.max(0, y(c, r)) + 1.1, p.y));
  }
  const threadGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(draped), 900, 0.32, 6, false);
  const thread = new THREE.Mesh(threadGeo, redMat);
  const threadCount = threadGeo.index!.count;
  threadGeo.setDrawRange(0, threadCount);
  scene.add(thread);

  // ---- the olive tree at al-Majdal: our engraving, standing on the land ----
  const oliveTex = await new Promise<THREE.Texture>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      const W = 1024;
      cv.width = W;
      cv.height = Math.round((W * img.height) / img.width);
      const ctx = cv.getContext("2d")!;
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      resolve(t);
    };
    img.onerror = () => resolve(new THREE.Texture());
    img.src = opts.oliveSrc;
  });
  const oliveMat = new THREE.SpriteMaterial({ map: oliveTex, color: COLORS.ink, transparent: true, depthWrite: false });
  const olive = new THREE.Sprite(oliveMat);
  const oImg = oliveTex.image as HTMLCanvasElement | undefined;
  const aspect = oImg && oImg.height ? oImg.width / oImg.height : 1.4;
  const majdal = byslug("al-majdal");
  olive.center.set(0.5, 0.02);
  olive.position.set(majdal.world.x + 11, majdal.world.y - 9, majdal.world.z - 3);
  const OLIVE_H = 24;
  olive.scale.set(OLIVE_H * aspect, OLIVE_H, 1);
  scene.add(olive);

  // ---- camera rig ----
  const setCamera = (s: Stop) => {
    const [tx, tz] = s.target;
    const pol = (s.polar * Math.PI) / 180;
    const az = (s.azimuth * Math.PI) / 180;
    const ty = 0;
    camera.position.set(tx + s.dist * Math.sin(pol) * Math.sin(az), ty + s.dist * Math.cos(pol), tz + s.dist * Math.sin(pol) * Math.cos(az));
    camera.lookAt(tx, ty, tz);
    shift = s.shift ?? 0;
    applyShift();
  };
  let shift = 0;
  const applyShift = () => {
    const { x: w, y: h } = size;
    const k = shift * Math.min(1, Math.max(0, (w / h - 1) / 0.5));
    if (Math.abs(k) < 1e-4) camera.clearViewOffset();
    else camera.setViewOffset(w, h, -k * w, 0, w, h);
  };

  let controls: OrbitControls | undefined;
  if (opts.mode === "explore") {
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 40;
    controls.maxDistance = 900;
    controls.maxPolarAngle = (78 * Math.PI) / 180;
    controls.screenSpacePanning = false;
    controls.target.set(0, 0, 20);
  }

  const size = new THREE.Vector2();
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    size.set(w, h);
    applyShift();
    camera.updateProjectionMatrix();
  };

  const v = new THREE.Vector3();
  const project = (p: THREE.Vector3) => {
    v.copy(p).project(camera);
    return { x: (v.x * 0.5 + 0.5) * size.x, y: (-v.y * 0.5 + 0.5) * size.y, visible: v.z < 1 && v.z > -1 };
  };

  const setUniforms = (u: { rise?: number; ink?: number; thread?: number; olive?: number }) => {
    if (u.rise !== undefined) uniforms.uRise.value = Math.max(0.02, u.rise);
    if (u.ink !== undefined) uniforms.uInk.value = u.ink;
    if (u.thread !== undefined) {
      const n = Math.floor((threadCount / 3) * Math.max(0, Math.min(1, u.thread))) * 3;
      threadGeo.setDrawRange(0, n);
      thread.visible = n > 0;
    }
    if (u.olive !== undefined) {
      const k = Math.max(0.0001, Math.min(1, u.olive));
      olive.scale.set(OLIVE_H * aspect * k, OLIVE_H * k, 1);
      olive.visible = u.olive > 0.001;
    }
  };

  const focusOn = (slug: string) => {
    const m = byslug(slug);
    if (!controls || !m) return;
    controls.target.set(m.world.x, 0, m.world.z);
  };

  resize();

  return {
    renderer,
    camera,
    places: marks,
    grid,
    setUniforms,
    setCamera,
    project,
    render: () => renderer.render(scene, camera),
    resize,
    controls,
    focusOn,
    dispose: () => {
      controls?.dispose();
      geo.dispose();
      mat.dispose();
      threadGeo.dispose();
      oliveTex.dispose();
      renderer.dispose();
    },
  };
}
