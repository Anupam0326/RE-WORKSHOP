/**
 * The store on the home page, in one place (client feedback 18 Oct 2026: products appeared in three places and
 * the site felt confusing): a tile per everyday shelf, then six staples to start with and a link to every product.
 * Grid rule for the whole site: rows are always full (1 per row on phones, 2 on tablets, 3 on desktop).
 */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { fallbackCategories, getStaticProduct, pickSix, type Category, type Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";

/**
 * The home page highlights everyday shopping only (client, 17 Oct 2026): a sub-shelf is shown when it has at least
 * this many products, and a shelf is shown when it has at least one such sub-shelf. One-off items (a single soap,
 * a single honey) stay in the shop.
 */
const REGULAR_MIN = 3;

function useShelves() {
  const { categories, products } = useCatalog();
  const all = categories
    .map((category) => {
      const items = products.filter((product) => product.categorySlug === category.slug);
      const regular = bySubShelf(items).filter(([, list]) => list.length >= REGULAR_MIN);
      return { category, items, regular };
    })
    .filter((shelf) => shelf.items.length);
  const shelves = all.filter((shelf) => shelf.regular.length);
  const others = all.filter((shelf) => !shelf.regular.length);
  return { shelves, others, products };
}

/**
 * Shelf cover: a product with a photo that is not among the six staples below (23 Oct 2026: no photo twice on a
 * page), else any product with a photo, else the bundled cover.
 */
function shelfCover(category: Category, items: Product[], staples: Set<string>): Pick<Product, "name" | "images"> {
  const withPhoto = items.filter((product) => product.images.length);
  const bundled = fallbackCategories.find((item) => item.slug === category.slug)?.coverSlug;
  return withPhoto.find((product) => !staples.has(product.id)) ?? withPhoto[0] ?? (bundled ? getStaticProduct(bundled) : undefined) ?? { name: category.name, images: [] };
}

function bySubShelf(items: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const product of items) groups.set(product.group, [...(groups.get(product.group) ?? []), product]);
  return Array.from(groups.entries());
}

/**
 * Dark panel near the top of the page: one tile per everyday shelf, 3 per row. When the shelf count does not fill
 * the last row, an all-products tile is added (and widens to fill it). Then the moving shelf of products.
 */
export function ShelvesPanel() {
  const { shelves, products } = useShelves();
  const { featured } = useCatalog();
  if (!shelves.length) return null;
  const staples = new Set(pickSix(featured, products).map((product) => product.id));
  const needsAll = shelves.length % 3 !== 0;
  return (
    <section className="section shelves" aria-labelledby="shelves-title">
      <div className="wrap">
        <div className="panel panel--dark shelves__panel">
          <div className="panel__title">
            <h2 id="shelves-title">Shop by shelf</h2>
          </div>
          <ul className="shelf-tiles">
            {shelves.map(({ category, items }) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} className="shelf-tile">
                  <span className="shelf-tile__media">
                    <ProductImage product={shelfCover(category, items, staples)} sizes="(min-width: 1024px) 340px, (min-width: 640px) 30vw, 76px" />
                  </span>
                  <span className="shelf-tile__name">{category.shortName}</span>
                  <span className="shelf-tile__count">
                    {items.length} {items.length === 1 ? "product" : "products"}
                  </span>
                </Link>
              </li>
            ))}
            {needsAll && (
              <li className="shelf-tiles__all">
                <Link href="/shop" className="shelf-tile shelf-tile--all">
                  <span className="shelf-tile__media shelf-tile__media--all" aria-hidden="true">
                    <strong>{products.length}</strong>
                    <ArrowRight size={22} />
                  </span>
                  <span className="shelf-tile__name">All products</span>
                  <span className="shelf-tile__count">Every shelf in one place</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const { featured, products } = useCatalog();
  if (!featured.length) return null;
  return (
    <section className="section section--flush-top featured" aria-labelledby="featured-title">
      <div className="wrap">
        <header className="head head--row">
          <h2 id="featured-title">
            <span className="tone-mute">Not sure where to begin?</span> Staples to start with.
          </h2>
          <Link href="/shop" className="btn btn--dark">
            All {products.length} products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <ProductGrid products={pickSix(featured, products)} />
      </div>
    </section>
  );
}
