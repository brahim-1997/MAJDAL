import Link from "next/link";
import { formatPrice, type Product } from "@/content/products";

const statusLabel: Record<Product["status"], string> = {
  coming: "Coming",
  available: "Available",
  "sold-out": "Sold out",
  closed: "Chapter closed",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="pcard">
      <Link href={`/shop/${product.slug}`} className="pcard__link">
        {/* Placeholder frame. Real photography replaces this — see
            brand/DESIGN-SYSTEM.md §5. No stock imagery, ever. */}
        <div className="pcard__frame" data-colourway={product.colourway.name}>
          <span className="pcard__ph meta">
            {product.imageCount} images pending
          </span>
        </div>
        <div className="pcard__meta">
          <h3 className="display d5 pcard__name">{product.name}</h3>
          <p className="meta pcard__cw">{product.colourway.name}</p>
          <p className="pcard__foot meta">
            <span>{formatPrice(product.priceCents, product.currency)}</span>
            <span className="faint">{statusLabel[product.status]}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
