import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { formatPrice, getProduct, products } from "@/content/products";
import { getChapter } from "@/content/chapters";
import { site } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.line} ${product.colourway.name} — ${product.colourway.documentedMeaning}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const chapter = getChapter(product.chapterSlug);
  const blocked = !product.colourway.clearedForProduction;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.line,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: product.currency,
      // Honest availability: nothing is purchasable yet.
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <section className="section">
      <div className="shell">
        <Link href="/shop" className="backlink">
          ← Shop
        </Link>

        <div className="pdp">
          {/* --- Images --- */}
          <div className="pdp__frames">
            {Array.from({ length: product.imageCount }).map((_, i) => (
              <div className="pdp__frame" key={i}>
                <span className="meta">
                  Image {i + 1} of {product.imageCount} — pending
                </span>
              </div>
            ))}
          </div>

          {/* --- Info --- */}
          <div className="pdp__info">
            <Reveal>
              <p className="meta">
                {chapter ? `Chapter ${chapter.number} — ${chapter.name}` : "MAJDAL"}
              </p>
              <h1 className="display d4" style={{ paddingTop: "var(--s-3)" }}>
                {product.name}
              </h1>
              <p className="lead muted" style={{ paddingTop: "var(--s-4)" }}>
                {product.line}
              </p>
              <p className="display d5" style={{ paddingTop: "var(--s-5)" }}>
                {formatPrice(product.priceCents, product.currency)}
              </p>

              {/* --- Colourway: the naming system doing its job --- */}
              <div className="callout" style={{ marginTop: "var(--s-6)" }}>
                <p className="callout__h">
                  Colourway — {product.colourway.name}
                  {product.colourway.arabic ? (
                    <>
                      {" "}
                      <span className="arabic">{product.colourway.arabic}</span>
                    </>
                  ) : null}
                </p>
                <p className="muted">{product.colourway.documentedMeaning}</p>
                <p style={{ paddingTop: "var(--s-3)" }}>{product.colourway.appliedAs}</p>
                {blocked ? (
                  <p className="meta" style={{ paddingTop: "var(--s-3)", textTransform: "none" }}>
                    This name is blocked from production pending external cultural
                    review.
                  </p>
                ) : null}
              </div>

              {/* --- Spec --- */}
              <div className="factlist" style={{ marginTop: "var(--s-6)" }}>
                {product.spec.map((row) => (
                  <div className="factlist__row" key={row.label}>
                    <span className="factlist__k">{row.label}</span>
                    <span className="factlist__v">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* --- Sizes --- */}
              <p className="meta" style={{ paddingTop: "var(--s-6)", paddingBottom: "var(--s-3)" }}>
                Sizes
              </p>
              <div className="pdp__sizes">
                {product.sizes.map((size) => (
                  <span className="pdp__size" key={size}>
                    {size}
                  </span>
                ))}
              </div>

              {/* --- Purchase: honestly disabled --- */}
              <p style={{ paddingTop: "var(--s-7)" }}>
                <button type="button" className="btn" disabled aria-disabled="true">
                  Not open yet
                </button>
              </p>
              <p className="meta" style={{ paddingTop: "var(--s-3)", textTransform: "none", letterSpacing: "0.02em" }}>
                Chapter {chapter?.number ?? "001"} has not opened. No checkout is
                connected and no date has been announced.{" "}
                <Link href="/roots" className="link">
                  THE ROOTS
                </Link>{" "}
                gets the access window first.
              </p>

              {/* --- Impact --- */}
              <div className="callout callout--verified" style={{ marginTop: "var(--s-7)" }}>
                <p className="callout__h">Impact</p>
                <p className="muted">
                  {product.impactEligible
                    ? `${site.impactPercent}% of this product's sale price is committed to supporting people in Palestine, recorded per period in a public ledger.`
                    : "This product is not part of the impact commitment."}
                </p>
                <p style={{ paddingTop: "var(--s-3)" }}>
                  <Link href="/impact" className="link">
                    The ledger
                  </Link>
                </p>
              </div>

              {/* --- Notes --- */}
              {product.notes.length > 0 ? (
                <div style={{ paddingTop: "var(--s-7)" }}>
                  <hr className="rule" />
                  <p className="meta" style={{ paddingTop: "var(--s-4)" }}>
                    Notes
                  </p>
                  <ul className="srclist">
                    {product.notes.map((note) => (
                      <li key={note.slice(0, 24)} style={{ textTransform: "none", letterSpacing: "0.02em", lineHeight: 1.6 }}>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Reveal>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </section>
  );
}
