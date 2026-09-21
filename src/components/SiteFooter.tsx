import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <p className="display d3 ftr__wordmark">
            {site.name}
            {" "}
            <span className="arabic ftr__ar">{site.nameArabic}</span>
          </p>
          <p className="meta">{site.philosophy}</p>
        </div>

        <div className="ftr__grid">
          <nav aria-label="Footer">
            <p className="meta ftr__heading">Index</p>
            <ul className="ftr__links">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="meta ftr__heading">Impact</p>
            <p className="muted ftr__text">
              {site.impactPercent}% of every eligible product sale is committed to
              supporting people in Palestine, published to the piece in a public
              ledger.
            </p>
            <Link href="/impact" className="link">
              Read the ledger
            </Link>
          </div>

          <div>
            <p className="meta ftr__heading">The Roots</p>
            <p className="muted ftr__text">
              The community comes before the shop. Free, and earned by
              participation rather than purchase.
            </p>
            <Link href="/roots" className="link">
              Join THE ROOTS
            </Link>
          </div>

          <div>
            <p className="meta ftr__heading">Sources</p>
            <p className="muted ftr__text">
              Every cultural claim on this site is tiered and sourced. Where the
              record is unresolved, we say so.
            </p>
            <Link href="/archive" className="link">
              The Archive
            </Link>
          </div>
        </div>

        <div className="ftr__base">
          <p className="meta">
            {site.code} — 1948, and everyone who has carried this since
          </p>
          <p className="meta faint">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
