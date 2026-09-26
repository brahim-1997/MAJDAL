"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentChapter } from "@/content/chapters";
import { nav, site } from "@/content/site";

/**
 * The header floats over the page as a set of stuck-on labels, and swaps its
 * own ink to match whatever ground is underneath: bone on night, ink on
 * paper, bone on olive, black tags on signal red.
 *
 * This replaced a mix-blend-mode: difference header. Difference inverts
 * perfectly over black and bone — 95% of the site — but over the olive
 * archive it rendered at 2.09:1, and over red it turned cyan, a colour that
 * is not in the palette. Reading the ground and choosing is always legible.
 */
type Ground = "night" | "paper" | "olive" | "red";

function groundAt(y: number): Ground {
  const cands = document.querySelectorAll<HTMLElement>(
    ".paper, .olive-ground, .joinsec, [data-ground]",
  );
  let best: HTMLElement | null = null;
  let bestH = Infinity;
  for (const el of cands) {
    if (el.closest(".hdr, .navover")) continue;
    const r = el.getBoundingClientRect();
    if (!r.height || r.top > y || r.bottom < y) continue;
    // The most specific ground wins: a receipt on a black section is paper.
    if (r.height < bestH) {
      best = el;
      bestH = r.height;
    }
  }
  if (!best) return "night";
  const g = best.dataset.ground as Ground | undefined;
  if (g) return g;
  if (best.classList.contains("paper")) return "paper";
  if (best.classList.contains("olive-ground")) return "olive";
  if (best.classList.contains("joinsec")) return "red";
  return "night";
}

const PRIMARY = [
  { href: "/map", label: "The land" },
  { href: "/archive", label: "Archive" },
  { href: "/roots", label: "Roots" },
  { href: `/chapters/${currentChapter.slug}`, label: `Chapter ${currentChapter.number}` },
  { href: "/shop", label: "Shop" },
  { href: "/impact", label: "Impact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ground, setGround] = useState<Ground>("night");

  useEffect(() => {
    let raf = 0;
    const probe = () => setGround(groundAt(36));
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
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

  return (
    <>
      <header className="hdr" data-ground={ground}>
        <Link href="/" className="hdr__mark" aria-label={`${site.name} — home`}>
          <span className="hdr__latin">{site.name}</span>
          <span className="hdr__ar arabic" aria-hidden="true">
            {site.nameArabic}
          </span>
        </Link>

        <nav className="hdr__nav" aria-label="Primary">
          <ul>
            {PRIMARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hdr__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span aria-hidden="true">[</span>
                  {item.label}
                  <span aria-hidden="true">]</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="hdr__toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          [{open ? "Close" : "Menu"}]
        </button>
      </header>

      <div id="mobile-nav" className="navover" hidden={!open}>
        <nav aria-label="Menu">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="navover__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="navover__n">{item.index}</span>
                  <span className="display navover__label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="navover__foot meta">
          {site.code} — {site.origin.label}
        </p>
        <button type="button" className="btn navover__close" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </>
  );
}
