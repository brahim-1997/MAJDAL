import Link from "next/link";
import { GarmentFlat } from "@/components/product/GarmentFlat";
import { formatPrice, type Product } from "@/content/products";

const statusLabel: Record<Product["status"], string> = {
  coming: "Not open",
  available: "Available",
  "sold-out": "Sold out",
  closed: "Chapter closed",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="pcard">
      <Link href={`/shop/${product.slug}`} className="pcard__link">
        <span className="pcard__no">Object {product.object}</span>
        <span className="pcard__frame">
          <GarmentFlat product={product} />
        </span>
        <h3 className="display pcard__name">{product.name}</h3>
        <span className="pcard__cw">{product.colourway.name}</span>
        <span className="pcard__foot">
          <span>{formatPrice(product.priceCents, product.currency)}</span>
          <span>{statusLabel[product.status]}</span>
        </span>
      </Link>
    </article>
  );
}
