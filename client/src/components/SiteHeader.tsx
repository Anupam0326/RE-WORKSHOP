/** Floating pill navigation: brand, section links, admin + basket, shop button. Mobile gets a full-screen menu (scroll lock + Escape). */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Phone, ShoppingBag, Store, UserRound, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { useCart } from "@/contexts/CartContext";
import { storeInfo } from "@/data/catalog";
import { peekSession } from "@/lib/supabase";

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
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(peekSession()));
    sync();
    window.addEventListener("rw-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rw-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const basketLabel = `Basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className={scrolled ? "nav-wrap is-scrolled" : "nav-wrap"}>
        <div className="nav">
          <Link href="/" className="nav__brand" aria-label="Re Workshop home">
            <BrandMark compact />
          </Link>
          <nav className="nav__links" aria-label="Primary">
            {navItems.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className={location.startsWith(item.href) ? "nav__link is-active" : "nav__link"}>
                  {item.label}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} className="nav__link">
                  {item.label}
                </SectionLink>
              ),
            )}
          </nav>
          <div className="nav__actions">
            <Link href="/admin" className={signedIn ? "nav__icon is-signed-in" : "nav__icon"} aria-label={signedIn ? "Store admin (signed in)" : "Store admin login"} title={signedIn ? "Store admin" : "Admin login"}>
              <UserRound size={19} strokeWidth={1.8} />
              {signedIn && <span className="nav__dot" aria-hidden="true" />}
            </Link>
            <Link href="/cart" className="nav__icon" aria-label={basketLabel}>
              <ShoppingBag size={19} strokeWidth={1.8} />
              {itemCount > 0 && <span className="nav__count">{itemCount}</span>}
            </Link>
            <Link href="/shop" className="btn btn--lime btn--sm nav__cta">
              <Store size={17} aria-hidden="true" /> Shop the store
            </Link>
            <button ref={menuButtonRef} type="button" className="nav__icon nav__menu" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu">
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu-sheet__top">
            <BrandMark compact />
            <button ref={closeRef} type="button" className="nav__icon" onClick={close} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="menu-sheet__nav" aria-label="Mobile">
            {navItems.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} onClick={close} className="menu-sheet__link">
                  {item.label}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} onNavigate={close} className="menu-sheet__link">
                  {item.label}
                </SectionLink>
              ),
            )}
          </nav>
          <div className="menu-sheet__foot">
            <Link href="/cart" onClick={close} className="btn btn--lime btn--full">
              <ShoppingBag size={18} aria-hidden="true" /> Basket{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
            <a href={`tel:${storeInfo.phones[0].tel}`} className="btn btn--ghost-light btn--full">
              <Phone size={18} aria-hidden="true" /> Call {storeInfo.phones[0].display}
            </a>
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="menu-sheet__address">
              {storeInfo.address} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
