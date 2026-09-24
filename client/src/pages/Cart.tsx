/** Basket — orders are placed only through WhatsApp: the basket becomes a short pre-filled message to the store. */

import { ArrowLeft, ArrowRight, MessageCircle, Minus, Phone, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { ProductImage } from "@/components/ProductImage";
import { formatInr, storeInfo } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buildOrderMessage, whatsappOrderUrl, whatsappReady } from "@/lib/whatsapp";

export default function Cart() {
  usePageMeta("Your basket");
  const { lines, itemCount, subtotal, updateQuantity, removeProduct, clearCart } = useCart();
  const message = buildOrderMessage(lines, subtotal);

  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main" className="cart-page">
        <div className="rw-wrap">
          <Link href="/shop" className="text-link cart-page__back">
            <ArrowLeft size={16} aria-hidden="true" /> Continue shopping
          </Link>
          <SectionLabel>Basket · order on WhatsApp</SectionLabel>
          <h1>{lines.length ? "Your basket" : "Your basket is empty."}</h1>
          <p className="cart-page__lead">
            {lines.length
              ? "Review your items, then tap “Order through WhatsApp”. Your list opens as a ready-to-send message to the Re Workshop team, who confirm availability, pickup or delivery and the final total. No payment is taken on this site."
              : "Start with a heritage grain, a stone-milled aata or a quick healthy meal premix."}
          </p>

          {lines.length ? (
            <div className="cart-page__layout">
              <ul className="cart-lines">
                {lines.map((line) => (
                  <li className="cart-line" key={line.product.id}>
                    <Link href={`/product/${line.product.slug}`} className="cart-line__media" tabIndex={-1} aria-hidden="true">
                      <ProductImage product={line.product} sizes="88px" />
                    </Link>
                    <div className="cart-line__info">
                      <Link href={`/product/${line.product.slug}`} className="cart-line__name">
                        {line.product.name}
                      </Link>
                      <p>
                        {line.product.packSize} · {formatInr(line.product.priceInr)}
                      </p>
                      <div className="quantity-control" role="group" aria-label={`Quantity of ${line.product.name}`}>
                        <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity - 1)} aria-label={`Decrease ${line.product.name}`}>
                          <Minus size={16} />
                        </button>
                        <span>{line.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(line.product.id, line.quantity + 1)} aria-label={`Increase ${line.product.name}`}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-line__end">
                      <strong>{formatInr(line.product.priceInr * line.quantity)}</strong>
                      <button type="button" className="icon-button icon-button--muted" onClick={() => removeProduct(line.product.id)} aria-label={`Remove ${line.product.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="cart-summary" aria-label="Order summary">
                <SectionLabel tone="dark">Order summary</SectionLabel>
                <div className="cart-summary__total">
                  <span>
                    {itemCount} {itemCount === 1 ? "item" : "items"} · estimated total
                  </span>
                  <strong>{formatInr(subtotal)}</strong>
                </div>

                <details className="wa-preview">
                  <summary>Preview the WhatsApp message</summary>
                  <pre>{message}</pre>
                </details>

                {whatsappReady ? (
                  <a href={whatsappOrderUrl(message)} target="_blank" rel="noopener noreferrer" className="button button--whatsapp button--full">
                    <MessageCircle size={20} aria-hidden="true" /> Order through WhatsApp <ArrowRight size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <>
                    <button type="button" className="button button--whatsapp button--full" disabled aria-describedby="wa-pending">
                      <MessageCircle size={20} aria-hidden="true" /> Order through WhatsApp
                    </button>
                    <p id="wa-pending" className="cart-summary__pending">
                      WhatsApp ordering is being set up. Meanwhile, call the store to place your order.
                    </p>
                  </>
                )}
                <a href={`tel:${storeInfo.phones[0].tel}`} className="button button--ghost-light button--full">
                  <Phone size={18} aria-hidden="true" /> Call {storeInfo.phones[0].display}
                </a>
                <p>Prices are from our catalogue; the store confirms the final total, pickup or Jabalpur delivery on WhatsApp.</p>
                <button type="button" className="cart-summary__clear" onClick={clearCart}>
                  Clear basket
                </button>
              </aside>
            </div>
          ) : (
            <div className="cart-empty">
              <ShoppingBag size={32} strokeWidth={1.3} aria-hidden="true" />
              <Link href="/shop" className="button button--forest">
                Visit the store <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </main>
      {lines.length > 0 && (
        <div className="wa-bar" role="region" aria-label="Checkout">
          <div className="wa-bar__total">
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <strong>{formatInr(subtotal)}</strong>
          </div>
          {whatsappReady ? (
            <a href={whatsappOrderUrl(message)} target="_blank" rel="noopener noreferrer" className="button button--whatsapp">
              <MessageCircle size={18} aria-hidden="true" /> Order on WhatsApp
            </a>
          ) : (
            <button type="button" className="button button--whatsapp" disabled>
              <MessageCircle size={18} aria-hidden="true" /> Order on WhatsApp
            </button>
          )}
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
