"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoSrc } from "@/components/brand/Logo";
import { nav, site } from "@/content/site";

/**
 * The header is a strip of labels stuck over the page. It reads the ground
 * underneath and changes ink to match: bone logo on night, green and olive
 * and red; ink logo on paper. Reading the ground is always legible — a blend
 * mode is not (difference measured 2.09:1 over olive in the last system).
 */
type Ground = "night" | "paper" | "green" | "olive" | "red";

const GROUNDS: [string, Ground][] = [
  ["paper", "paper"],
  ["green-ground", "green"],
  ["deep-ground", "green"],
  ["olive-ground", "green"],
  ["red-ground", "red"],
];

function groundAt(y: number): Ground {
  const cands = document.querySelectorAll<HTMLElement>(
    ".paper, .green-ground, .deep-ground, .olive-ground, .red-ground, [data-ground]",
  );
  let best: HTMLElement | null = null;
  let bestH = Infinity;
  for (const el of cands) {
    if (el.closest(".hdr, .navover")) continue;
    const r = el.getBoundingClientRect();
    if (!r.height || r.top > y || r.bottom < y || r.left > 40 || r.right < 40) continue;
    // The most specific ground wins: a paper record on a night page is paper.
    if (r.height < bestH) {
      best = el;
      bestH = r.height;
    }
  }
  if (!best) return "night";
  const g = best.dataset.ground as Ground | undefined;
  if (g) return g;
  for (const [cls, ground] of GROUNDS) if (best.classList.contains(cls)) return ground;
  return "night";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ground, setGround] = useState<Ground>("night");

  useEffect(() => {
    let raf = 0;
    const probe = () => setGround(groundAt(30));
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    // The film changes its own ground without scrolling past a boundary.
    window.addEventListener("majdal:ground", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      window.removeEventListener("majdal:ground", on);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const tone = ground === "paper" ? "ink" : "bone";
  const primary = nav.filter((n) => n.href !== "/");

  return (
    <>
      <header className="hdr" data-ground={ground}>
        <Link href="/" className="hdr__mark" aria-label={`${site.name} ${site.nameArabic} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc("stacked", tone)} width={267} height={229} alt="" className="hdr__logo" />
        </Link>

        <nav className="hdr__nav" aria-label="Primary">
          <ol>
            {primary.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hdr__link" aria-current={isActive(item.href) ? "page" : undefined}>
                  <span className="hdr__n" aria-hidden="true">{item.index}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <p className="hdr__code" aria-hidden="true">/48</p>

        <button
          type="button"
          className="hdr__toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Index"}
        </button>
      </header>

      <div id="mobile-nav" className="navover" hidden={!open}>
        <nav aria-label="Menu">
          <ol>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="navover__link" aria-current={isActive(item.href) ? "page" : undefined}>
                  <span className="navover__n">{item.index}</span>
                  <span className="display navover__label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <p className="navover__foot meta">
          {site.tagline} — 0048 — {site.origin.label}
        </p>
        <button type="button" className="btn navover__close" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
}
