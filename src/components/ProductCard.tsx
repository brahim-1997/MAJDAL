import Link from "next/link";
import { GarmentFlat } from "@/components/product/GarmentFlat";
import { getChapter } from "@/content/chapters";
import { formatPrice, type Product } from "@/content/products";

const statusLabel: Record<Product["status"], string> = {
  coming: "Not open",
  available: "Available",
  "sold-out": "Sold out",
  closed: "Chapter closed",
};

/** A garment as an object from the archive: a drawing on paper, then its label. */
export function ProductCard({ product }: { product: Product }) {
  const chapter = getChapter(product.chapterSlug);
  return (
    <article className="pcard">
      <Link href={`/shop/${product.slug}`} className="pcard__link">
        <span className="pcard__frame">
          <GarmentFlat product={product} />
        </span>
        <span className="pcard__label">
          <span className="pcard__no">
            OBJECT {product.object}
            {chapter ? ` · CHAPTER ${chapter.number} · 48 / ${chapter.name}` : ""}
          </span>
          <h3 className="display pcard__name">{product.name}</h3>
          <span className="pcard__cw">{product.colourway.name}</span>
          <span className="pcard__foot">
            <span>{formatPrice(product.priceCents, product.currency)}</span>
            <span>{statusLabel[product.status]}</span>
          </span>
        </span>
      </Link>
    </article>
  );
}
