/** The Organic Grocery Store — searchable, filterable catalogue. Category is part of the URL (/shop/:category). */

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { SectionLink } from "@/components/SectionLink";
import { ProductGrid } from "@/components/ProductGrid";
import { categories, getCategoryBySlug, products, type Product } from "@/data/catalog";
import { experience, groceryStore } from "@/data/brand";
import { usePageMeta } from "@/hooks/usePageMeta";

function groupBy(list: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const product of list) groups.set(product.group, [...(groups.get(product.group) ?? []), product]);
  return Array.from(groups.entries());
}

export default function Shop() {
  const [, params] = useRoute("/shop/:category");
  const [, navigate] = useLocation();
  const category = getCategoryBySlug(params?.category);
  const active = category?.slug ?? "all";
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  usePageMeta(category ? category.name : "The Organic Grocery Store", category ? `${category.name} at Re Workshop, Jabalpur — ${category.description}` : undefined);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        if (active !== "all" && product.categorySlug !== active) return false;
        if (!deferredQuery) return true;
        return `${product.name} ${product.group} ${product.details.join(" ")}`.toLowerCase().includes(deferredQuery);
      }),
    [active, deferredQuery],
  );

  const showShelves = !deferredQuery;

  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <section className="page-intro">
          <div className="rw-wrap">
            <SectionLabel>Re Workshop · Store</SectionLabel>
            <h1>{category ? category.name : groceryStore.heading}</h1>
            <p className="page-intro__lead">{category ? category.description : groceryStore.lines[1]}</p>
          </div>
        </section>

        <section className="shop" aria-label="Products">
          <div className="rw-wrap">
            <div className="shop__tools">
              <label className="search-field">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Search products</span>
                <input type="search" inputMode="search" enterKeyHint="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search kodo, aata, ghee…" autoComplete="off" />
                {query && (
                  <button type="button" className="search-field__clear" onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={18} />
                  </button>
                )}
              </label>
              <p className="shop__count" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </p>
            </div>

            <nav className="filter-rail" aria-label="Shelves">
              <button type="button" className={active === "all" ? "filter-pill is-active" : "filter-pill"} aria-pressed={active === "all"} onClick={() => navigate("/shop")}>
                All
              </button>
              {categories.map((item) => (
                <button key={item.slug} type="button" className={active === item.slug ? "filter-pill is-active" : "filter-pill"} aria-pressed={active === item.slug} onClick={() => navigate(`/shop/${item.slug}`)}>
                  {item.shortName}
                </button>
              ))}
            </nav>

            {showShelves ? (
              <div className="catalog">
                {(active === "all" ? categories : categories.filter((item) => item.slug === active)).map((item) => {
                  const inCategory = filtered.filter((product) => product.categorySlug === item.slug);
                  return (
                    <section key={item.slug} className="catalog__section" aria-labelledby={active === "all" ? `cat-${item.slug}` : undefined} aria-label={active === "all" ? undefined : item.name}>
                      {active === "all" && (
                        <header className="catalog__head">
                          <h2 id={`cat-${item.slug}`}>{item.name}</h2>
                          <p>{item.eyebrow}</p>
                        </header>
                      )}
                      {groupBy(inCategory).map(([group, list]) => (
                        <div key={group} className="catalog__group">
                          <h3 className="catalog__group-title">
                            {group} <span>{list.length}</span>
                          </h3>
                          <ProductGrid products={list} />
                        </div>
                      ))}
                    </section>
                  );
                })}
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </section>

        <section className="shop-note section section--forest">
          <div className="rw-wrap shop-note__inner">
            <div>
              <SectionLabel tone="dark">The Re Workshop experience</SectionLabel>
              <h2>{experience.heading}</h2>
            </div>
            <SectionLink id="cafe" className="button button--ochre">
              See the café <ArrowRight size={18} aria-hidden="true" />
            </SectionLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
