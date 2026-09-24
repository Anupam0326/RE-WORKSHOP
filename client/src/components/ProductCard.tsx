/** Product card: whole card links to the product; the add button is a sibling (never nested inside the link). */

import { Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";
import { formatInr, type Product } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";

export const PRODUCT_CARD_SIZES = "(min-width: 1200px) 280px, (min-width: 860px) 30vw, (min-width: 560px) 45vw, 48vw";

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const [, navigate] = useLocation();
  function handleAdd() {
    addProduct(product);
    toast.success(`${product.name} added to your basket`, { action: { label: "View basket", onClick: () => navigate("/cart") } });
  }
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__media">
          <ProductImage product={product} sizes={PRODUCT_CARD_SIZES} />
          {product.details[0] && <span className="product-card__tag">{product.details[0]}</span>}
        </div>
        <div className="product-card__body">
          <p className="product-card__group">{product.group}</p>
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__meta">
            <span>{product.packSize}</span>
            <strong>{formatInr(product.priceInr)}</strong>
          </p>
        </div>
      </Link>
      <button type="button" className="product-card__add" onClick={handleAdd} aria-label={`Add ${product.name} to basket`}>
        <Plus size={20} strokeWidth={2} />
      </button>
    </article>
  );
}
