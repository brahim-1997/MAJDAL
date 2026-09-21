import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.philosophy}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "MAJDAL",
    "Palestinian streetwear",
    "Majdalawi weaving",
    "al-Majdal",
    "heavyweight streetwear",
    "THE ROOTS",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.philosophy}`,
    description: site.description,
    url: site.url,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.philosophy}`,
    description: site.description,
  },
  robots: {
    // Flip to true once the real domain and content are live.
    index: false,
    follow: false,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: site.nameArabic,
    url: site.url,
    description: site.description,
    slogan: site.philosophy,
  };

  return (
    <html lang="en">
      <body>
        {/* Without JS the IntersectionObserver never fires, so revealed
            content would stay at opacity 0. Content is never gated on motion. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Static, hand-built object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
