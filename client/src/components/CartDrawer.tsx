/** Slide-in basket (not currently mounted; kept compatible with the catalogue model). */

import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { formatInr, formatPrice } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, unpricedCount, updateQuantity, removeProduct } = useCart();
  if (!open) return null;
  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Your basket">
      <button className="cart-overlay__scrim" onClick={onClose} aria-label="Close basket" />
      <aside className="cart-drawer">
        <div className="cart-drawer__top">
          <div>
            <p className="badge badge--light"><span>Your basket</span></p>
            <h2>Your order request</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close basket">
            <X size={20} />
          </button>
        </div>
        {lines.length ? (
          <>
            <div className="cart-drawer__lines">
              {lines.map((line) => (
                <div className="cart-line" key={line.product.id}>
                  <ProductImage product={line.product} sizes="64px" className="cart-line__img" />
                  <div className="cart-line__info">
                    <strong>{line.product.name}</strong>
                    <span>{[line.product.packSize, formatPrice(line.product.priceInr)].filter(Boolean).join(" · ")}</span>
                    <div className="qty">
                      <button onClick={() => updateQuantity(line.product.id, line.quantity - 1)} aria-label={`Decrease ${line.product.name}`}>
                        <Minus size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button onClick={() => updateQuantity(line.product.id, line.quantity + 1)} aria-label={`Increase ${line.product.name}`}>
                        <Plus size={14} />
                      </button>
                      <button className="cart-line__remove" onClick={() => removeProduct(line.product.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-drawer__bottom">
              <div className="cart-total">
                <span>{unpricedCount > 0 ? "Subtotal (excl. price on request)" : "Subtotal"}</span>
                <strong>{formatInr(subtotal)}</strong>
              </div>
              <Link href="/cart" onClick={onClose} className="btn btn--dark btn--full">
                Order on WhatsApp <ShoppingBag size={16} />
              </Link>
            </div>
          </>
        ) : (
          <div className="cart-drawer__empty">
            <ShoppingBag size={28} strokeWidth={1.3} />
            <h3>Your basket is empty.</h3>
            <Link href="/shop" onClick={onClose} className="btn btn--ghost">
              Shop the store
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
