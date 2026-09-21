"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll behind the overlay, and restore on unmount.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="hdr">
      <div className="hdr__bar shell">
        <Link href="/" className="hdr__mark" aria-label={`${site.name} — home`}>
          <span className="hdr__latin">{site.name}</span>
          <span className="hdr__ar arabic" aria-hidden="true">
            {site.nameArabic}
          </span>
        </Link>

        <nav className="hdr__nav" aria-label="Primary">
          <ul>
            {nav
              .filter((item) => item.href !== "/")
              .map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      data-active={active}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <button
          type="button"
          className="hdr__toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="mobile-nav" className="hdr__overlay" data-open={open} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span className="hdr__overlay-index">{item.index}</span>
                  <span className="display d4">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="meta hdr__overlay-foot">
          {site.code} — {site.philosophy}
        </p>
      </div>
    </header>
  );
}
