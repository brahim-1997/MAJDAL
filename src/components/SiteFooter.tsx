import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { nav, secondaryNav, site } from "@/content/site";

/**
 * The footer is the back of the sheet: the official logo, the index, the
 * sources of what you just read, and the one real address.
 */
export function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="shell ftr__top">
        <Logo lockup="primary" tone="bone" className="ftr__logo" />
        <div className="ftr__side">
          <p className="ftr__tagline ext">{site.story.join(" ")}</p>
          <p className="meta ftr__code">0048 · {site.origin.label}</p>
        </div>
      </div>

      <div className="shell ftr__body">
        <nav className="ftr__col" aria-label="Index">
          <p className="ftr__head meta">Index</p>
          <ol className="ftr__links">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ftr__link">
                  <span className="ftr__n" aria-hidden="true">{item.index}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        {secondaryNav.map((group) => (
          <nav key={group.group} className="ftr__col" aria-label={group.group}>
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
      </div>

      <div className="shell ftr__base">
        <p className="ftr__statement">
          {site.impactPercent}% of eligible product sales is intended to support people in Palestine.
          Nothing has been sold yet, so nothing has been sent. The ledger will say so until it can say more.
        </p>
        <p className="meta">
          The one real address is {site.url.replace("https://", "")}. MAJDAL will never ask for payment anywhere else.
        </p>
        <p className="meta">
          Archive photographs and map sheets are credited where they appear. The land: real elevation from NASA SRTM
          and NOAA ETOPO1 via AWS Terrain Tiles, outline from Natural Earth (public domain). The woven watermelon, the
          drawings and the olive tree: MAJDAL.
        </p>
        <p className="meta">
          {site.philosophy} — © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
