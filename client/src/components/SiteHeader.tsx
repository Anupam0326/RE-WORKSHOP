/** Sticky header: brand seal, primary navigation, basket. Mobile gets a full-screen menu with scroll lock + Escape. */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Menu, ShoppingBag, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { useCart } from "@/contexts/CartContext";
import { storeInfo } from "@/data/catalog";

type NavItem = { label: string; section?: string; href?: string };
export const navItems: NavItem[] = [
  { label: "Our story", section: "story" },
  { label: "Soil to plate", section: "loop" },
  { label: "Café", section: "cafe" },
  { label: "Founders", section: "founders" },
  { label: "Shop", href: "/shop" },
  { label: "Visit", section: "visit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="site-header__brand" aria-label="Re Workshop — home">
            <BrandMark compact />
          </Link>
          <nav className="site-header__nav" aria-label="Primary">
            {navItems.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className={location.startsWith(item.href) ? "site-header__link is-active" : "site-header__link"}>
                  {item.label}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} className="site-header__link">
                  {item.label}
                </SectionLink>
              ),
            )}
          </nav>
          <div className="site-header__actions">
            <Link href="/cart" className="cart-trigger" aria-label={`Basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}>
              <ShoppingBag size={20} strokeWidth={1.8} />
              {itemCount > 0 && <span className="cart-trigger__count">{itemCount}</span>}
            </Link>
            <button ref={menuButtonRef} type="button" className="icon-button site-header__menu" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu">
              <Menu size={22} />
            </button>
          </div>
          <span className="scroll-progress" aria-hidden="true" />
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu__top">
            <BrandMark compact />
            <button ref={closeRef} type="button" className="icon-button" onClick={close} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="mobile-menu__nav" aria-label="Mobile">
            {navItems.map((item, index) => {
              const inner = (
                <>
                  <span className="mobile-menu__index">0{index + 1}</span>
                  {item.label}
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              );
              return item.href ? (
                <Link key={item.label} href={item.href} onClick={close} className="mobile-menu__link">
                  {inner}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} onNavigate={close} className="mobile-menu__link">
                  {inner}
                </SectionLink>
              );
            })}
            <Link href="/cart" onClick={close} className="mobile-menu__link mobile-menu__link--accent">
              <span className="mobile-menu__index">0{navItems.length + 1}</span>
              Basket{itemCount > 0 ? ` (${itemCount})` : ""}
              <ShoppingBag size={18} aria-hidden="true" />
            </Link>
          </nav>
          <div className="mobile-menu__foot">
            <a href={`tel:${storeInfo.phones[0].tel}`}>Call {storeInfo.phones[0].display}</a>
            <p>{storeInfo.address}</p>
          </div>
        </div>
      )}
    </>
  );
}
