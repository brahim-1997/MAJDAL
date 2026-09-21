"use client";

import { useEffect, useRef, useState } from "react";
import { placed } from "@/lib/geo";

/**
 * THE LOOM — the land, woven.
 *
 * Al-Majdal was a weaving town, so its land is not drawn here, it is woven:
 * warp threads running north to south, weft crossing east to west, and the
 * coastline as the selvedge — the finished self-edge a woven piece has, which
 * is exactly what a coastline is.
 *
 * The loom runs south to north, starting at al-Majdal, so the cloth is always
 * still being made. The documented Majdalawi palette is literal here: black
 * and indigo cotton ground, fuchsia and turquoise silk at the crossings.
 *
 * Progressive enhancement. The SVG register beneath is the real, accessible,
 * indexable map; this is a layer on top that never gates content. It loads
 * only after mount, only with WebGL, and never under prefers-reduced-motion.
 */
export function Loom() {
  const mount = useRef<HTMLDivElement | null>(null);
  /**
   * pending  — measuring, stage holds its height so it can be measured
   * live     — weaving
   * unavailable — no WebGL, reduced motion, or a phone: stage collapses
   *
   * Three states, not a boolean: collapsing the stage on "not yet live" would
   * zero its height before the loom could measure it, which blocks the very
   * thing the fallback exists for.
   */
  const [status, setStatus] = useState<"pending" | "live" | "unavailable">(
    "pending",
  );

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      // Coarse pointers are usually phones: skip the GPU cost entirely.
      window.matchMedia("(pointer: coarse)").matches
    ) {
      setStatus("unavailable");
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        setStatus("unavailable"); // No loom. The register below still works.
        return;
      }
      if (disposed) return;

      const { SELVEDGE, VIEW_W, VIEW_H } = await import("@/content/coastline");

      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) {
        setStatus("unavailable");
        return;
      }

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
      camera.position.set(0, 0, 13.4);

      const cloth = new THREE.Group();
      // Tilt: the cloth lies on the loom, seen at a raking angle.
      cloth.rotation.x = -0.34;
      cloth.rotation.z = 0.05;
      scene.add(cloth);

      // --- Map the projected sheet into world units -------------------------
      const SCALE = 9.4 / VIEW_H;
      const toWorld = (x: number, y: number): [number, number] => [
        (x - VIEW_W / 2) * SCALE,
        -(y - VIEW_H / 2) * SCALE,
      ];

      const ROWS = SELVEDGE.length;
      const WARPS = 104;

      // Gentle cloth relief so it reads as fabric on a loom, not a flat grid.
      const drape = (x: number, y: number) =>
        Math.sin(x * 0.55) * 0.12 + Math.cos(y * 0.4) * 0.1;

      const warpPts: number[] = [];
      const weftPts: number[] = [];
      // Row index at which each vertex appears, so the loom can reveal in order.
      const warpRow: number[] = [];
      const weftRow: number[] = [];

      const rowY = (r: number) => (VIEW_H / (ROWS - 1)) * r;
      const startX = (r: number) => {
        const s = SELVEDGE[r];
        return s === undefined || s < 0 ? 0 : s;
      };

      // Weft: east-west, one per row. The thread the loom lays down.
      for (let r = 0; r < ROWS; r++) {
        const y = rowY(r);
        const x0 = startX(r);
        const [wx0, wy0] = toWorld(x0, y);
        const [wx1, wy1] = toWorld(VIEW_W, y);
        const segs = 26;
        for (let s = 0; s < segs; s++) {
          const a = s / segs;
          const b = (s + 1) / segs;
          const ax = wx0 + (wx1 - wx0) * a;
          const bx = wx0 + (wx1 - wx0) * b;
          weftPts.push(ax, wy0, drape(ax, wy0), bx, wy1, drape(bx, wy1));
          // Reveal south (high row index) first: the loom starts at al-Majdal.
          weftRow.push(ROWS - 1 - r, ROWS - 1 - r);
        }
      }

      // Warp: north-south, held under tension before the weft crosses it.
      for (let w = 0; w < WARPS; w++) {
        const x = (VIEW_W / (WARPS - 1)) * w;
        for (let r = 0; r < ROWS - 1; r++) {
          if (x < startX(r) || x < startX(r + 1)) continue;
          const [ax, ay] = toWorld(x, rowY(r));
          const [bx, by] = toWorld(x, rowY(r + 1));
          warpPts.push(ax, ay, drape(ax, ay), bx, by, drape(bx, by));
          warpRow.push(ROWS - 1 - r, ROWS - 1 - (r + 1));
        }
      }

      const makeThreads = (
        pts: number[],
        rows: number[],
        color: number,
        opacity: number,
      ) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        g.setAttribute("aRow", new THREE.Float32BufferAttribute(rows, 1));
        const m = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          uniforms: {
            uProgress: { value: 0 },
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: opacity },
            uRows: { value: ROWS },
          },
          vertexShader: `
            attribute float aRow;
            varying float vShown;
            uniform float uProgress;
            uniform float uRows;
            void main() {
              // A thread exists once the loom has reached its row.
              vShown = smoothstep(aRow - 6.0, aRow, uProgress * uRows);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragmentShader: `
            varying float vShown;
            uniform vec3 uColor;
            uniform float uOpacity;
            void main() {
              if (vShown <= 0.01) discard;
              gl_FragColor = vec4(uColor, uOpacity * vShown);
            }`,
        });
        return new THREE.LineSegments(g, m);
      };

      // Documented ground: black and indigo cotton. The weft — the thread the
      // loom lays down — carries the light; the warp sits behind it.
      const warp = makeThreads(warpPts, warpRow, 0x55689a, 0.4);
      const weft = makeThreads(weftPts, weftRow, 0x8093bd, 0.62);
      cloth.add(warp, weft);

      // --- The places: where the silk crosses ------------------------------
      const knots = placed();
      const knotGeo = new THREE.BufferGeometry();
      const kPos: number[] = [];
      const kRow: number[] = [];
      for (const k of knots) {
        const [x, y] = toWorld(k.x, k.y);
        kPos.push(x, y, drape(x, y) + 0.04);
        kRow.push(ROWS - 1 - Math.round((k.y / VIEW_H) * (ROWS - 1)));
      }
      knotGeo.setAttribute("position", new THREE.Float32BufferAttribute(kPos, 3));
      knotGeo.setAttribute("aRow", new THREE.Float32BufferAttribute(kRow, 1));
      const knotMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uProgress: { value: 0 },
          uRows: { value: ROWS },
          uSize: { value: Math.min(W, H) * 0.035 },
        },
        vertexShader: `
          attribute float aRow;
          varying float vShown;
          uniform float uProgress;
          uniform float uRows;
          uniform float uSize;
          void main() {
            vShown = smoothstep(aRow - 3.0, aRow + 3.0, uProgress * uRows);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * vShown * (12.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying float vShown;
          void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float d = length(c);
            if (d > 0.5) discard;
            // Turquoise core into fuchsia edge: the two documented silks.
            vec3 col = mix(vec3(0.12, 0.54, 0.55), vec3(0.71, 0.15, 0.42),
                           smoothstep(0.1, 0.5, d));
            gl_FragColor = vec4(col, (1.0 - d * 1.7) * vShown);
          }`,
      });
      const knotPoints = new THREE.Points(knotGeo, knotMat);
      cloth.add(knotPoints);

      // The frame's western half is open sea, so centring on the frame would
      // push the cloth off to the right. Centre on the woven extent instead.
      weft.geometry.computeBoundingBox();
      const bb = weft.geometry.boundingBox;
      if (bb) {
        cloth.position.x = -(bb.min.x + bb.max.x) / 2;
        cloth.position.y = -(bb.min.y + bb.max.y) / 2;
      }

      // --- Parallax: the cloth turns slightly toward the viewer ------------
      let tx = 0;
      let ty = 0;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 0.16;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 0.1;
      };
      el.addEventListener("pointermove", onMove);

      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // Pause when off-screen: no GPU burn on a page nobody is looking at.
      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? true;
        },
        { threshold: 0.05 },
      );
      io.observe(el);

      const started = performance.now();
      const WEAVE_MS = 5200;
      let raf = 0;

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;

        const p = Math.min(1, (now - started) / WEAVE_MS);
        // Ease so the loom settles rather than stopping dead.
        const eased = 1 - Math.pow(1 - p, 2.2);
        for (const o of [warp, weft]) {
          (o.material as import("three").ShaderMaterial).uniforms.uProgress!.value = eased;
        }
        knotMat.uniforms.uProgress!.value = eased;

        cloth.rotation.y += (tx - cloth.rotation.y) * 0.04;
        cloth.rotation.x += (-0.34 + ty - cloth.rotation.x) * 0.04;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);
      setStatus("live");

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        el.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        warp.geometry.dispose();
        weft.geometry.dispose();
        knotGeo.dispose();
        (warp.material as import("three").Material).dispose();
        (weft.material as import("three").Material).dispose();
        knotMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="loom" data-status={status}>
      <div className="loom__stage" ref={mount} aria-hidden="true" />
      <div className="loom__caption">
        <p className="loom__line">The land, woven.</p>
        <p className="loom__note">
          Al-Majdal wove cloth in eight-metre lengths. Here the coastline is the
          selvedge — a woven piece&apos;s finished edge — and the loom runs north
          from al-Majdal. The threads are the colours the weavers used: black and
          indigo cotton, crossed with fuchsia and turquoise silk.
        </p>
      </div>
    </div>
  );
}
