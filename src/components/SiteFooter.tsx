import Link from "next/link";
import { Barcode } from "@/components/brut/Barcode";
import { nav, secondaryNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="ftr__giant display" aria-hidden="true">
        {site.name}
      </div>

      <div className="shell ftr__body">
        <div className="ftr__card">
          <p className="ftr__head meta">Index</p>
          <ul className="ftr__links">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ftr__link">
                  <span className="ftr__n">{item.index}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {secondaryNav.map((group) => (
          <nav key={group.group} className="ftr__card" aria-label={group.group}>
            <p className="ftr__head meta">{group.group}</p>
            <ul className="ftr__links">
              {group.items.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="ftr__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="ftr__card ftr__card--code">
          <p className="ftr__head meta">Code</p>
          <Barcode value="MAJDAL-48" />
          <p className="ftr__ar arabic">{site.nameArabic}</p>
        </div>
      </div>

      <div className="shell ftr__base">
        <p className="ftr__statement">
          {site.impactPercent}% of eligible product sales is intended to support people
          in Palestine. Public reporting begins once verified transfers are made.
        </p>
        <p className="meta">
          The one real address is {site.url.replace("https://", "")}. MAJDAL will never
          ask for payment anywhere else.
        </p>
        <p className="meta">
          {site.philosophy} — © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
