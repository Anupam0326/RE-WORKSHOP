/** The organic grocery store: the three shelves from the brief, plus featured products from the catalogue. */

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { SectionLabel } from "@/components/SectionLabel";
import { getStaticProduct, type Category, type Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { groceryStore, shelves } from "@/data/brand";

/** Shelf cover: the brief's cover product if it's still listed, else the first product with a photo. */
function useShelfCover() {
  const { products, getProduct } = useCatalog();
  return (category: Category, fallbackSlug?: string): Pick<Product, "name" | "images"> => {
    const preferred = fallbackSlug ? getProduct(fallbackSlug) : undefined;
    if (preferred?.images.length) return preferred;
    const withPhoto = products.find((product) => product.categorySlug === category.slug && product.images.length);
    return withPhoto ?? (fallbackSlug ? getStaticProduct(fallbackSlug) : undefined) ?? { name: category.name, images: [] };
  };
}

const coverSlugs: Record<string, string> = {
  "grains-flours": "kodo-millet",
  "spices-staples": "chai-masala",
  "snacks-premixes": "thekua",
  "pickles-honey": "mango-pickle",
};

export function GroceryStore() {
  const { categories, getCategory, getProduct } = useCatalog();
  const coverFor = useShelfCover();
  const shelfSlugs = new Set(shelves.map((shelf) => shelf.categorySlug));
  const extras = categories.filter((category) => !shelfSlugs.has(category.slug));
  return (
    <section id="store" className="store section" aria-labelledby="store-title">
      <div className="rw-wrap">
        <header className="section-head">
          <SectionLabel>Take the lifestyle home</SectionLabel>
          <h2 id="store-title">{groceryStore.heading}</h2>
          {groceryStore.lines.map((line) => (
            <p key={line} className="section-head__intro">
              {line}
            </p>
          ))}
        </header>

        <div className="shelves">
          {shelves.map((shelf, index) => {
            const category = getCategory(shelf.categorySlug);
            if (!category) return null;
            const cover = coverFor(category, coverSlugs[category.slug]);
            return (
              <article key={shelf.title} className="shelf-card" data-reveal style={{ "--i": index } as React.CSSProperties}>
                <Link href={`/shop/${category.slug}`} className="shelf-card__media" tabIndex={-1} aria-hidden="true">
                  <ProductImage product={cover} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" />
                </Link>
                <div className="shelf-card__body">
                  <h3>{shelf.title}</h3>
                  {shelf.note && <p className="shelf-card__note">{shelf.note}</p>}
                  {shelf.groups.map((group) => (
                    <div key={group.label} className="shelf-card__group">
                      <p className="shelf-card__label">{group.label}</p>
                      <ul className="chip-list">
                        {group.items.map((item) => (
                          <li key={item.name}>
                            {item.slug && getProduct(item.slug) ? (
                              <Link href={`/product/${item.slug}`} className="chip chip--link">
                                {item.name}
                              </Link>
                            ) : (
                              <span className="chip">{item.name}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link href={`/shop/${category.slug}`} className="text-link">
                    Shop {category.shortName.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}

          {extras.map((extra) => (
            <Link key={extra.slug} href={`/shop/${extra.slug}`} className="shelf-mini" data-reveal>
              <span className="shelf-mini__media">
                <ProductImage product={coverFor(extra, coverSlugs[extra.slug])} sizes="96px" />
              </span>
              <span className="shelf-mini__copy">
                <span className="shelf-mini__label">Also on our shelves</span>
                <strong>{extra.name}</strong>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const { featured, products } = useCatalog();
  if (!featured.length) return null;
  return (
    <section className="featured section section--tight-top" aria-labelledby="featured-title">
      <div className="rw-wrap">
        <header className="section-head section-head--row">
          <div>
            <SectionLabel>From the shelves</SectionLabel>
            <h2 id="featured-title">Staples to start with.</h2>
          </div>
          <Link href="/shop" className="text-link">
            All {products.length} products <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <ProductGrid products={featured.slice(0, 8)} />
      </div>
    </section>
  );
}
