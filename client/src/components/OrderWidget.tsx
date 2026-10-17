/**
 * Floating "Order now" card (bottom right). With items in the basket it opens the basket; otherwise it starts a
 * WhatsApp chat with the store. Appears once the visitor scrolls past the first screen, so it never covers the
 * hero buttons. Hidden on the basket page (it has its own order bar) and in the admin.
 */

import { useEffect, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SiteImage } from "@/components/SiteImage";
import { useCart } from "@/contexts/CartContext";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > px);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [px]);
  return past;
}

const greeting = encodeURIComponent("Hello Re Workshop, I would like to place an order.");

export function OrderWidget() {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const past = useScrolledPast(420);
  if (!past || location.startsWith("/cart") || location.startsWith("/admin")) return null;

  if (itemCount > 0) {
    return (
      <aside className="order-widget" aria-label="Your basket">
        <div className="order-widget__media" aria-hidden="true">
          <SiteImage slot="hero-main" sizes="72px" />
        </div>
        <p className="order-widget__title">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your basket
        </p>
        <Link href="/cart" className="order-widget__btn order-widget__btn--dark">
          <ShoppingBag size={17} aria-hidden="true" /> <span>Review and order</span>
        </Link>
      </aside>
    );
  }

  if (!whatsappReady) return null;
  return (
    <aside className="order-widget" aria-label="Order on WhatsApp">
      <div className="order-widget__media" aria-hidden="true">
        <SiteImage slot="hero-main" sizes="72px" />
      </div>
      <p className="order-widget__title">Order now</p>
      <a href={`https://wa.me/${whatsappDigits}?text=${greeting}`} target="_blank" rel="noopener noreferrer" className="order-widget__btn">
        <MessageCircle size={17} aria-hidden="true" /> <span>WhatsApp</span>
      </a>
    </aside>
  );
}
