"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeroMap } from "@/components/home/HeroMap";
import { places } from "@/content/places";

/**
 * THE LAND — document, then land, then memory. Driven by scroll.
 *
 *  01 DOCUMENT  The land as a printed sheet: woven lines in ink on bone paper,
 *               lying flat. Coast from Natural Earth, public domain.
 *  -- cut --    Hard. Paper to night in one frame.
 *  02 LAND      The sheet tilts back and relief rises out of it.
 *  03 MEMORY    Six places light. THE THREAD runs north from al-Majdal, draped
 *               over the relief, and each place is named as the thread reaches it.
 *
 * The relief is SCHEMATIC — coastal plain, a central highland ridge, the fall
 * toward the Jordan valley — derived from distance inland of the coast. It is
 * not surveyed elevation, and the section says so on screen.
 *
 * Progressive enhancement: three.js loads only on a fine pointer, without
 * reduced motion, with WebGL. Otherwise the static drawn map stays, and the
 * accessible register is one link away. Nothing is gated behind the canvas.
 */

const SOUTH_TO_NORTH = [...places].sort((a, b) => a.coordinates.lat - b.coordinates.lat);

/** Haifa and Akka are ~10 km apart: at this scale their names collide unless
    they sit on opposite sides of their points. */
const LABEL_SIDE: Record<string, "l" | "r" | "u"> = { haifa: "l", akka: "u", yafa: "l" };

export function TheLand() {
  const section = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const labels = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"pending" | "live" | "unavailable">("pending");
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sec = section.current;
    const el = stage.current;
    if (!sec || !el) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
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
        setStatus("unavailable");
        return;
      }
      if (disposed) return;
      const { SELVEDGE, VIEW_W, VIEW_H } = await import("@/content/coastline");
      const { project } = await import("@/lib/geo");

      const W0 = el.clientWidth;
      const H0 = el.clientHeight;
      if (!W0 || !H0) {
        setStatus("unavailable");
        return;
      }

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
      } catch {
        setStatus("unavailable");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W0, H0);
      renderer.domElement.className = "land__canvas";
      el.prepend(renderer.domElement);

      const BONE = new THREE.Color("#f1ede2");
      const BLACK = new THREE.Color("#050505");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, W0 / H0, 0.1, 100);
      const Z_DOC = 17.2;
      camera.position.set(0, 0, Z_DOC);

      const cloth = new THREE.Group();
      scene.add(cloth);

      const SCALE = 9 / VIEW_H;
      const LIFT = 1.15; // world units at full relief
      const ROWS = SELVEDGE.length;
      const WARPS = 96;
      const rowY = (r: number) => (VIEW_H / (ROWS - 1)) * r;
      const edge = (y: number) => {
        const r = Math.max(0, Math.min(ROWS - 1, Math.round((y / VIEW_H) * (ROWS - 1))));
        return SELVEDGE[r] ?? 0;
      };
      const smooth = (a: number, b: number, x: number) => {
        const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };
      // Schematic relief: plain at the coast, a ridge inland, a fall eastward.
      const height = (x: number, y: number) => {
        const sx = edge(y);
        if (x < sx) return 0;
        const dn = (x - sx) / Math.max(1, VIEW_W - sx);
        const ridge = smooth(0.04, 0.42, dn) * (1 - 0.6 * smooth(0.6, 0.93, dn));
        const ripple = 0.07 * Math.sin(x * 0.045) * Math.cos(y * 0.028);
        return Math.max(0, ridge + ripple);
      };
      const toWorld = (x: number, y: number): [number, number] => [
        (x - VIEW_W / 2) * SCALE,
        -(y - VIEW_H / 2) * SCALE,
      ];

      const weft: number[] = [];
      const weftH: number[] = [];
      for (let r = 0; r < ROWS; r++) {
        const y = rowY(r);
        const x0 = edge(y);
        const segs = 30;
        for (let s = 0; s < segs; s++) {
          const xa = x0 + ((VIEW_W - x0) * s) / segs;
          const xb = x0 + ((VIEW_W - x0) * (s + 1)) / segs;
          const [ax, ay] = toWorld(xa, y);
          const [bx, by] = toWorld(xb, y);
          weft.push(ax, ay, 0, bx, by, 0);
          weftH.push(height(xa, y), height(xb, y));
        }
      }
      const warp: number[] = [];
      const warpH: number[] = [];
      for (let w = 0; w < WARPS; w++) {
        const x = (VIEW_W / (WARPS - 1)) * w;
        for (let r = 0; r < ROWS - 1; r++) {
          const y0 = rowY(r);
          const y1 = rowY(r + 1);
          if (x < edge(y0) || x < edge(y1)) continue;
          const [ax, ay] = toWorld(x, y0);
          const [bx, by] = toWorld(x, y1);
          warp.push(ax, ay, 0, bx, by, 0);
          warpH.push(height(x, y0), height(x, y1));
        }
      }

      const lineMat = (color: string, opacity: number) =>
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          uniforms: {
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: opacity },
            uRelief: { value: 0 },
            uLift: { value: LIFT },
          },
          vertexShader: `
            attribute float aH;
            uniform float uRelief;
            uniform float uLift;
            void main() {
              vec3 p = position;
              p.z += aH * uRelief * uLift;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }`,
          fragmentShader: `
            uniform vec3 uColor;
            uniform float uOpacity;
            void main() { gl_FragColor = vec4(uColor, uOpacity); }`,
        });

      const mkLines = (pts: number[], hs: number[], mat: import("three").ShaderMaterial) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        g.setAttribute("aH", new THREE.Float32BufferAttribute(hs, 1));
        return new THREE.LineSegments(g, mat);
      };
      const weftMat = lineMat("#050505", 0.62);
      const warpMat = lineMat("#050505", 0.3);
      const weftLines = mkLines(weft, weftH, weftMat);
      const warpLines = mkLines(warp, warpH, warpMat);
      cloth.add(warpLines, weftLines);

      // --- Places, and THE THREAD draped over the relief ---------------------
      const pts = SOUTH_TO_NORTH.map((p) => {
        const v = project(p.coordinates.lat, p.coordinates.lon);
        return { ...v, h: height(v.x, v.y) };
      });
      const knotPos: number[] = [];
      for (const p of pts) {
        const [x, y] = toWorld(p.x, p.y);
        knotPos.push(x, y, p.h * LIFT + 0.05);
      }
      const knotGeo = new THREE.BufferGeometry();
      knotGeo.setAttribute("position", new THREE.Float32BufferAttribute(knotPos, 3));
      const knotMat = new THREE.PointsMaterial({
        color: 0xe3261a,
        size: 0.26,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const knots = new THREE.Points(knotGeo, knotMat);
      cloth.add(knots);

      const dense: import("three").Vector3[] = [];
      const anchors: number[] = []; // index into dense where each place sits
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]!;
        const b = pts[i + 1]!;
        const n = 36;
        for (let s = 0; s < n; s++) {
          const t = s / n;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          if (s === 0) anchors.push(dense.length);
          const [wx, wy] = toWorld(x, y);
          dense.push(new THREE.Vector3(wx, wy, height(x, y) * LIFT + 0.07));
        }
      }
      const last = pts.at(-1)!;
      const [lx, ly] = toWorld(last.x, last.y);
      anchors.push(dense.length);
      dense.push(new THREE.Vector3(lx, ly, last.h * LIFT + 0.07));

      const curve = new THREE.CatmullRomCurve3(dense);
      const TUBE_SEG = dense.length * 2;
      const tubeGeo = new THREE.TubeGeometry(curve, TUBE_SEG, 0.032, 6, false);
      const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xe3261a }));
      tubeGeo.setDrawRange(0, 0);
      cloth.add(tube);
      const indexCount = tubeGeo.index?.count ?? 0;
      const anchorT = anchors.map((i) => i / (dense.length - 1));

      // Centre on the woven extent, not the frame: the frame's west is sea.
      weftLines.geometry.computeBoundingBox();
      const bb = weftLines.geometry.boundingBox;
      const centre = new THREE.Vector3();
      if (bb) bb.getCenter(centre);
      const inner = new THREE.Group();
      scene.remove(cloth);
      inner.add(cloth);
      cloth.position.set(-centre.x, -centre.y, 0);
      scene.add(inner);

      // --- Scroll drives everything ------------------------------------------
      const labelEls = labels.current
        ? [...labels.current.querySelectorAll<HTMLElement>("[data-i]")]
        : [];
      const tmp = new THREE.Vector3();
      let progress = 0;
      let lastStep = -1;
      let px = 0;
      const clamp = (v: number) => Math.max(0, Math.min(1, v));
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      const measure = () => {
        const r = sec.getBoundingClientRect();
        const run = r.height - window.innerHeight;
        progress = run > 0 ? clamp(-r.top / run) : 0;
      };
      measure();
      const onScroll = () => measure();
      window.addEventListener("scroll", onScroll, { passive: true });

      const onMove = (e: PointerEvent) => {
        px = e.clientX / window.innerWidth - 0.5;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e?.isIntersecting ?? true;
      });
      io.observe(sec);

      const CUT = 0.3;
      const LAND_END = 0.64;
      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const p = progress;
        const s = p < CUT ? 0 : p < LAND_END ? 1 : 2;
        if (s !== lastStep) {
          // The cut: no tween between paper and night.
          const doc = s === 0;
          scene.background = doc ? BONE : BLACK;
          weftMat.uniforms.uColor!.value.set(doc ? "#050505" : "#f1ede2");
          weftMat.uniforms.uOpacity!.value = doc ? 0.62 : 0.5;
          warpMat.uniforms.uColor!.value.set(doc ? "#050505" : "#596044");
          warpMat.uniforms.uOpacity!.value = doc ? 0.3 : 0.95;
          // One flash, only when crossing forward from paper into night.
          if (lastStep === 0 && s === 1) {
            sec.classList.add("is-cut");
            window.setTimeout(() => sec.classList.remove("is-cut"), 110);
          }
          lastStep = s;
          setStep(s);
        }

        const t = ease(clamp((p - CUT) / (LAND_END - CUT)));
        const m = clamp((p - LAND_END) / 0.3);
        weftMat.uniforms.uRelief!.value = t;
        warpMat.uniforms.uRelief!.value = t;
        inner.rotation.x = -1.02 * t;
        inner.rotation.z = -0.12 * m;
        inner.rotation.y += (px * 0.18 * m - inner.rotation.y) * 0.06;
        inner.position.y = -0.9 * t;
        camera.position.z = Z_DOC - 4.4 * t;

        const drawn = Math.floor((indexCount * m) / 6) * 6;
        tubeGeo.setDrawRange(0, drawn);
        knotMat.opacity = clamp(m * 4);

        const w = el.clientWidth;
        const h = el.clientHeight;
        for (let i = 0; i < labelEls.length; i++) {
          const lbl = labelEls[i]!;
          const reached = m > 0 && m >= (anchorT[i] ?? 1) - 0.01;
          lbl.dataset.on = reached ? "1" : "0";
          if (!reached) continue;
          tmp.fromArray(knotPos, i * 3);
          cloth.localToWorld(tmp);
          tmp.project(camera);
          lbl.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px)`;
        }
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);
      setStatus("live");

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        for (const o of [weftLines, warpLines]) o.geometry.dispose();
        weftMat.dispose();
        warpMat.dispose();
        knotGeo.dispose();
        knotMat.dispose();
        tubeGeo.dispose();
        (tube.material as import("three").Material).dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const steps = [
    ["Document", "A place, recorded. The land as a printed sheet, lying flat."],
    ["Land", "The sheet lifts. Relief is schematic — coastal plain, highland ridge, the fall east — not surveyed elevation."],
    ["Memory", "Six places. The thread runs north from al-Majdal, the town this brand is named after."],
  ] as const;

  return (
    <section
      id="the-land"
      ref={section}
      className="land"
      data-status={status}
      data-step={step}
      data-ground={status === "live" && step === 0 ? "paper" : "night"}
      aria-labelledby="land-title"
    >
      <div className="land__sticky">
        <div className="land__stage" ref={stage}>
          <div className="land__static paper">
            <HeroMap variant="tall" id="hml" />
          </div>
          <div className="land__paper" aria-hidden="true" />
          <div className="land__flash" aria-hidden="true" />
          <div className="land__labels" ref={labels} aria-hidden="true">
            {SOUTH_TO_NORTH.map((p, i) => (
              <span key={p.id} data-i={i} data-on="0" data-side={LABEL_SIDE[p.slug] ?? "r"} className="land__label">
                <b>{p.name}</b>
                <i className="arabic">{p.nameArabic}</i>
              </span>
            ))}
          </div>
        </div>

        <div className="land__head">
          <h2 id="land-title" className="display land__title">
            The land
          </h2>
          <ol className="land__steps">
            {steps.map(([name, text], i) => (
              <li key={name} data-active={step === i}>
                <span className="land__stepname">
                  0{i + 1} {name}
                </span>
                <span className="land__steptext">{text}</span>
              </li>
            ))}
          </ol>
          <Link href="/map" className="btn btn--ghost land__open">
            Open the register
          </Link>
        </div>
      </div>
    </section>
  );
}
