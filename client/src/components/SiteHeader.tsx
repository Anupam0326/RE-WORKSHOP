/**
 * Floating pill navigation: brand, Shop, Café, Our story, Track your grain (a jump into Our story), For farmers, Visit us,
 * admin + basket.
 * Client feedback 18 Oct 2026: getting to the shop, the café and the products was confusing, so every item is now a
 * page of its own except "Visit us", which scrolls to the visit panel in the footer of whichever page is open.
 * Mobile gets a full-screen menu (scroll lock + Escape).
 * 23 Oct 2026: one lime action, "Free consultation" (Dr. Swati Chhajed), on every page and at every width; it leads to
 * the consultation section on the home page, where the chat starts.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, MessageCircle, Phone, ShoppingBag, UserRound, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { useCart } from "@/contexts/CartContext";
import { consultation } from "@/data/brand";
import { storeInfo } from "@/data/catalog";
import { peekSession } from "@/lib/supabase";

type NavItem = { label: string; href?: string; match?: string[]; section?: string; page?: string };
export const navItems: NavItem[] = [
  { label: "Shop", href: "/shop", match: ["/shop", "/product", "/cart"] },
  { label: "Café", href: "/cafe" },
  { label: "Our story", href: "/our-story" },
  // 22 Oct 2026: a direct way to the grain tracker on Our story.
  { label: "Track your grain", section: "trace", page: "/our-story" },
  // 31 Oct 2026 (client): farmers who want to farm this way can get in touch (pages/Farmers.tsx).
  { label: "For farmers", href: "/farmers" },
  { label: "Visit us", section: "visit" },
];

const isCurrent = (item: NavItem, location: string) => (item.match ?? [item.href!]).some((path) => location.startsWith(path));

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
                <Link key={item.label} href={item.href} className={isCurrent(item, location) ? "nav__link is-active" : "nav__link"} aria-current={isCurrent(item, location) ? "page" : undefined}>
                  {item.label}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} page={item.page} here={!item.page} className="nav__link">
                  {item.label}
                </SectionLink>
              ),
            )}
          </nav>
          <div className="nav__actions">
            <SectionLink id="consult" className="nav__consult" aria-label={`${consultation.nav} with ${consultation.name}`}>
              <MessageCircle size={16} aria-hidden="true" />
              <span className="nav__consult-long">{consultation.nav}</span>
              <span className="nav__consult-short" aria-hidden="true">
                {consultation.navShort}
              </span>
            </SectionLink>
            <Link href="/admin" className={signedIn ? "nav__icon nav__admin is-signed-in" : "nav__icon nav__admin"} aria-label={signedIn ? "Store admin (signed in)" : "Store admin login"} title={signedIn ? "Store admin" : "Admin login"}>
              <UserRound size={19} strokeWidth={1.8} />
              {signedIn && <span className="nav__dot" aria-hidden="true" />}
            </Link>
            <Link href="/cart" className="nav__icon" aria-label={basketLabel}>
              <ShoppingBag size={19} strokeWidth={1.8} />
              {itemCount > 0 && <span className="nav__count">{itemCount}</span>}
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
                <Link key={item.label} href={item.href} onClick={close} className={isCurrent(item, location) ? "menu-sheet__link is-active" : "menu-sheet__link"} aria-current={isCurrent(item, location) ? "page" : undefined}>
                  {item.label}
                </Link>
              ) : (
                <SectionLink key={item.label} id={item.section!} page={item.page} here={!item.page} onNavigate={close} className="menu-sheet__link">
                  {item.label}
                </SectionLink>
              ),
            )}
          </nav>
          <div className="menu-sheet__foot">
            <SectionLink id="consult" onNavigate={close} className="btn btn--lime btn--full">
              <MessageCircle size={18} aria-hidden="true" /> {consultation.nav} with Dr. Swati
            </SectionLink>
            <Link href="/cart" onClick={close} className="btn btn--ghost-light btn--full">
              <ShoppingBag size={18} aria-hidden="true" /> Basket{itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
            <a href={`tel:${storeInfo.phones[0].tel}`} className="btn btn--ghost-light btn--full">
              <Phone size={18} aria-hidden="true" /> Call {storeInfo.phones[0].display}
            </a>
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="menu-sheet__address">
              {storeInfo.address} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            {/* Phones: the admin icon leaves the bar to make room for the consultation button, so it lives here. */}
            <Link href="/admin" onClick={close} className="menu-sheet__admin">
              <UserRound size={16} aria-hidden="true" /> {signedIn ? "Store admin" : "Store admin login"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
