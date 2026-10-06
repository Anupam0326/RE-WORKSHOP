/** The organic grocery store: one shelf per live category, built from the catalogue, plus featured products. */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { SectionLabel } from "@/components/SectionLabel";
import { fallbackCategories, getStaticProduct, type Category, type Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { groceryStore } from "@/data/brand";

/** Products shown per sub-shelf on the home page; the rest are a tap away in the store. */
const CHIPS_PER_GROUP = 5;

/** Shelf cover: a featured product with a photo, else any product with a photo, else the bundled cover. */
function shelfCover(category: Category, items: Product[]): Pick<Product, "name" | "images"> {
  const withPhoto = items.filter((product) => product.images.length);
  const bundled = fallbackCategories.find((item) => item.slug === category.slug)?.coverSlug;
  return withPhoto.find((product) => product.featured) ?? withPhoto[0] ?? (bundled ? getStaticProduct(bundled) : undefined) ?? { name: category.name, images: [] };
}

function bySubShelf(items: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const product of items) groups.set(product.group, [...(groups.get(product.group) ?? []), product]);
  return Array.from(groups.entries());
}

export function GroceryStore() {
  const { categories, products } = useCatalog();
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
          {categories.map((category, index) => {
            const items = products.filter((product) => product.categorySlug === category.slug);
            if (!items.length) return null;
            return (
              <article key={category.slug} className="shelf-card" data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
                <Link href={`/shop/${category.slug}`} className="shelf-card__media" tabIndex={-1} aria-hidden="true">
                  <ProductImage product={shelfCover(category, items)} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" />
                </Link>
                <div className="shelf-card__body">
                  <h3>{category.name}</h3>
                  {category.eyebrow && <p className="shelf-card__note">{category.eyebrow}</p>}
                  {bySubShelf(items).map(([group, list], _, groups) => (
                    <div key={group || "all"} className="shelf-card__group">
                      {group && groups.length > 1 && <p className="shelf-card__label">{group}</p>}
                      <ul className="chip-list">
                        {list.slice(0, CHIPS_PER_GROUP).map((product) => (
                          <li key={product.slug}>
                            <Link href={`/product/${product.slug}`} className="chip chip--link">
                              {product.name}
                              {product.availabilityNote && <span className="chip__note">{product.availabilityNote}</span>}
                            </Link>
                          </li>
                        ))}
                        {list.length > CHIPS_PER_GROUP && (
                          <li>
                            <Link href={`/shop/${category.slug}`} className="chip chip--link chip--more" aria-label={`${list.length - CHIPS_PER_GROUP} more in ${group || category.name}`}>
                              +{list.length - CHIPS_PER_GROUP} more
                            </Link>
                          </li>
                        )}
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
