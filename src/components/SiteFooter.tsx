import Link from "next/link";
import { nav, secondaryNav, site } from "@/content/site";

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

          {secondaryNav.map((group) => (
            <nav key={group.group} aria-label={group.group}>
              <p className="meta ftr__heading">{group.group}</p>
              <ul className="ftr__links">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ftr__note">
          <p className="muted">
            {site.impactPercent}% of eligible product sales is committed to
            supporting people in Palestine. Public reporting begins once
            verified transfers are made.
          </p>
          <p className="meta faint" style={{ paddingTop: "var(--s-3)" }}>
            The one real address for MAJDAL is {site.url.replace("https://", "")}.
            We will never ask for payment anywhere else.
          </p>
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
