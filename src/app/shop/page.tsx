import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/content/products";
import { currentChapter } from "@/content/chapters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Chapter 001 — ROOTS. Heavyweight garments, colourways named after documented al-Majdal fabrics.",
};

export default function ShopPage() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">SHOP</h1>
          <p className="lead muted phead__lead">
            Chapter {currentChapter.number} — {currentChapter.name}.{" "}
            {currentChapter.runSize} pieces. Every colourway is named after a
            documented al-Majdal fabric, and every product page says which one and
            what it meant.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="callout">
              <p className="callout__h">Not open yet</p>
              <p className="muted">
                Chapter 001 has not opened and there is no checkout wired up. Nothing
                here can be bought today, and no date has been announced — we would
                rather show an empty shop than run a countdown to a date we have not
                committed to.
              </p>
            </div>
          </Reveal>

          <h2 className="visually-hidden">Chapter 001 garments</h2>

          <div className="pgrid" style={{ paddingTop: "var(--s-8)" }}>
            {products.map((product, i) => (
              <Reveal as="div" key={product.slug} delay={i * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
