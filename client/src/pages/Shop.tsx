/** The Organic Grocery Store — searchable, filterable catalogue. Category is part of the URL (/shop/:category). */

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, Search, ShoppingBasket, UtensilsCrossed, X } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { SectionLink } from "@/components/SectionLink";
import { ProductGrid } from "@/components/ProductGrid";
import { shelfAnchor, type Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { experience, groceryStore } from "@/data/brand";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useHashScroll } from "@/hooks/useReveal";

function groupBy(list: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const product of list) groups.set(product.group, [...(groups.get(product.group) ?? []), product]);
  return Array.from(groups.entries());
}

export default function Shop() {
  const [, params] = useRoute("/shop/:category");
  const [, navigate] = useLocation();
  const { categories, products, getCategory, status } = useCatalog();
  const category = getCategory(params?.category);
  const active = category?.slug ?? "all";
  // Sub-shelf links on the home page (/shop/<shelf>#shelf-…) land on that sub-shelf.
  useHashScroll();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  usePageMeta(category ? category.name : "The Organic Grocery Store", category ? `${category.name} at Re Workshop, Jabalpur. ${category.description}` : undefined);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        if (active !== "all" && product.categorySlug !== active) return false;
        if (!deferredQuery) return true;
        const shelf = getCategory(product.categorySlug);
        return `${product.name} ${product.group} ${shelf?.name ?? ""} ${product.packSize} ${product.details.join(" ")} ${product.availabilityNote ?? ""} ${product.description}`
          .toLowerCase()
          .includes(deferredQuery);
      }),
    [products, active, deferredQuery, getCategory],
  );

  const showShelves = !deferredQuery && filtered.length > 0;

  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <section className="page-head">
          <div className="page-head__glow" aria-hidden="true" />
          <div className="wrap page-head__inner">
            <SectionLabel icon={ShoppingBasket}>{category ? "Organic grocery store" : "Order through WhatsApp"}</SectionLabel>
            <h1>{category ? category.name : groceryStore.heading}</h1>
            <p className="page-head__lead">{category ? category.description : groceryStore.lines[1]}</p>
          </div>
        </section>

        <section className="shop" aria-label="Products">
          <div className="shop__bar">
            <div className="wrap shop__tools">
              <label className="search">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Search products</span>
                <input type="search" inputMode="search" enterKeyHint="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search kodo, aata, ghee…" autoComplete="off" />
                {query && (
                  <button type="button" className="search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={18} />
                  </button>
                )}
              </label>
              <nav className="pill-rail" aria-label="Shelves">
                <button type="button" className={active === "all" ? "pill is-active" : "pill"} aria-pressed={active === "all"} onClick={() => navigate("/shop")}>
                  All
                </button>
                {categories.map((item) => (
                  <button key={item.slug} type="button" className={active === item.slug ? "pill is-active" : "pill"} aria-pressed={active === item.slug} onClick={() => navigate(`/shop/${item.slug}`)}>
                    {item.shortName}
                  </button>
                ))}
              </nav>
              <p className="shop__count" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
                {status === "error" && <span className="shop__offline">, showing the saved catalogue</span>}
              </p>
            </div>
          </div>

          <div className="wrap">
            {showShelves ? (
              <div className="catalog">
                {(active === "all" ? categories : categories.filter((item) => item.slug === active)).map((item) => {
                  const inCategory = filtered.filter((product) => product.categorySlug === item.slug);
                  if (!inCategory.length && active === "all") return null;
                  return (
                    <section key={item.slug} className="catalog__section" aria-labelledby={active === "all" ? `cat-${item.slug}` : undefined} aria-label={active === "all" ? undefined : item.name}>
                      {active === "all" && (
                        <header className="catalog__head">
                          <h2 id={`cat-${item.slug}`}>{item.name}</h2>
                          {item.eyebrow && <p>{item.eyebrow}</p>}
                        </header>
                      )}
                      {groupBy(inCategory).map(([group, list]) => (
                        <div key={group} id={group ? shelfAnchor(item.slug, group) : undefined} className="catalog__group">
                          {group && (
                            <h3 className="catalog__group-title">
                              {group} <span>{list.length}</span>
                            </h3>
                          )}
                          <ProductGrid products={list} />
                        </div>
                      ))}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="catalog">
                <ProductGrid products={filtered} />
              </div>
            )}
          </div>
        </section>

        <section className="section section--flush-top">
          <div className="wrap">
            <div className="panel panel--dark cta-panel">
              <h2>{experience.heading}</h2>
              <p>{experience.live.body}</p>
              <SectionLink id="cafe" className="btn btn--lime">
                <UtensilsCrossed size={18} aria-hidden="true" /> Visit the café <ArrowRight size={18} aria-hidden="true" />
              </SectionLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
