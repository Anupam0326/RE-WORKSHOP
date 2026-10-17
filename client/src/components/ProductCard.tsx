/** Product card: whole card links to the product; the add button is a sibling (never nested inside the link). */

import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, type Product } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";

export const PRODUCT_CARD_SIZES = "(min-width: 1200px) 280px, (min-width: 860px) 30vw, (min-width: 560px) 45vw, 48vw";

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const [, navigate] = useLocation();
  // A second angle (the bowl shot when there is one) fades in on mouse hover; it only loads after the first hover.
  const altIndex = product.images.length > 2 ? 2 : product.images.length > 1 ? 1 : -1;
  const [showAlt, setShowAlt] = useState(false);
  function handleAdd() {
    addProduct(product);
    toast.success(`${product.name} added to your basket`, { action: { label: "View basket", onClick: () => navigate("/cart") } });
  }
  return (
    <article className="pcard" onPointerEnter={(event) => event.pointerType === "mouse" && altIndex > 0 && setShowAlt(true)}>
      <Link href={`/product/${product.slug}`} className="pcard__link">
        <div className="pcard__media">
          <ProductImage product={product} sizes={PRODUCT_CARD_SIZES} />
          {showAlt && (
            <span className="pcard__alt" aria-hidden="true">
              <ProductImage product={product} index={altIndex} sizes={PRODUCT_CARD_SIZES} />
            </span>
          )}
        </div>
        <div className="pcard__body">
          {product.group && <p className="pcard__group">{product.group}</p>}
          <h3 className="pcard__name">{product.name}</h3>
          {product.details[0] && <p className="pcard__tag">{product.details[0]}</p>}
          {product.availabilityNote && (
            <p className="pcard__season">
              <CalendarDays size={14} aria-hidden="true" /> {product.availabilityNote}
            </p>
          )}
          <p className="pcard__meta">
            <strong className={product.priceInr == null ? "is-on-request" : undefined}>{formatPrice(product.priceInr)}</strong>
            {product.packSize && <span>{product.packSize}</span>}
          </p>
        </div>
      </Link>
      <button type="button" className="pcard__add" onClick={handleAdd} aria-label={`Add ${product.name} to basket`}>
        <Plus size={20} strokeWidth={2.2} />
      </button>
    </article>
  );
}
