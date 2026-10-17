/**
 * The organic grocery store: the shelves at a glance, a card per shelf with its sub-shelves, and staples to start with.
 * Grid rule for the whole site: rows are always full (1 per row on phones, 2 on tablets, 3 on desktop), so each
 * shelf grid ends with a whole-store card that brings the count to a multiple of the row.
 */

import { ArrowRight, MessageCircle, ShoppingBasket } from "lucide-react";
import { Link } from "wouter";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { SectionLabel } from "@/components/SectionLabel";
import { fallbackCategories, formatPrice, getStaticProduct, pickSix, shelfAnchor, type Category, type Product } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { groceryStore } from "@/data/brand";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

/**
 * The home page highlights everyday shopping only (client, 17 Oct 2026): a sub-shelf is shown when it has at least
 * this many products, and a shelf is shown when it has at least one such sub-shelf. One-off items (a single soap,
 * a single honey) stay in the shop and are mentioned on the whole-store card instead.
 */
const REGULAR_MIN = 3;
/** Product names shown under each sub-shelf row. */
const NAMES_PER_ROW = 3;
const askHello = encodeURIComponent("Hello Re Workshop, I have a question about your store.");

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

/** A moving shelf: two rows of real product photos sliding past in opposite directions. Pauses on hover/focus. */
function Conveyor({ products }: { products: Product[] }) {
  const stocked = products.filter((product) => product.images.length);
  if (stocked.length < 6) return null;
  const rows = [stocked.filter((_, index) => index % 2 === 0), stocked.filter((_, index) => index % 2 === 1)];
  const card = (product: Product, hidden: boolean) => (
    <li key={`${product.slug}-${hidden ? "b" : "a"}`} aria-hidden={hidden || undefined}>
      <Link href={`/product/${product.slug}`} className="belt-card" tabIndex={hidden ? -1 : undefined}>
        <span className="belt-card__media">
          <ProductImage product={product} sizes="128px" />
        </span>
        <span className="belt-card__name">{product.name}</span>
        <span className="belt-card__price">{formatPrice(product.priceInr)}</span>
      </Link>
    </li>
  );
  return (
    <div className="conveyor">
      <div className="conveyor__head">
        <p className="conveyor__title">Straight from our shelves</p>
        <Link href="/shop" className="text-link text-link--light">
          All {products.length} products <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      {rows.map((row, index) => (
        <div key={index} className={index ? "conveyor__row conveyor__row--reverse" : "conveyor__row"} style={{ "--count": row.length } as React.CSSProperties}>
          <ul className="conveyor__belt" aria-label={index ? undefined : "Products on our shelves"}>
            {row.map((product) => card(product, false))}
            {row.map((product) => card(product, true))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Dark panel near the top of the page: one tile per everyday shelf, 3 per row. When the shelf count does not fill
 * the last row, an all-products tile is added (and widens to fill it). Then the moving shelf of products.
 */
export function ShelvesPanel() {
  const { shelves, products } = useShelves();
  if (!shelves.length) return null;
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
                    <ProductImage product={shelfCover(category, items)} sizes="(min-width: 1024px) 340px, (min-width: 640px) 30vw, 76px" />
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
          <Conveyor products={products} />
        </div>
      </div>
    </section>
  );
}

export function GroceryStore() {
  const { shelves, others, products } = useShelves();
  return (
    <section id="store" className="section store" aria-labelledby="store-title">
      <div className="wrap">
        <header className="head head--split">
          <div>
            <SectionLabel icon={ShoppingBasket}>On our shelves</SectionLabel>
            <h2 id="store-title">{groceryStore.heading}</h2>
          </div>
          <div className="head__side">
            {groceryStore.lines.map((line) => (
              <p key={line} className="head__intro">
                {line}
              </p>
            ))}
          </div>
        </header>

        <ul className="store-grid">
          {shelves.map(({ category, items, regular }) => (
            <li key={category.slug} className="store-card" data-reveal>
              <div className="store-card__head">
                <span className="store-card__thumb" aria-hidden="true">
                  <ProductImage product={shelfCover(category, items)} sizes="64px" />
                </span>
                <div>
                  <h3>
                    <Link href={`/shop/${category.slug}`}>{category.name}</Link>
                  </h3>
                  <p className="store-card__count">
                    {items.length} {items.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>
              {category.eyebrow && <p className="store-card__note">{category.eyebrow}</p>}
              <ul className="store-card__rows" aria-label={`${category.name}, everyday sub-shelves`}>
                {regular.map(([group, list]) => (
                  <li key={group}>
                    <Link href={`/shop/${category.slug}#${shelfAnchor(category.slug, group)}`} className="store-row">
                      <span className="store-row__text">
                        <span className="store-row__label">{group}</span>
                        <span className="store-row__names">{list.slice(0, NAMES_PER_ROW).map((product) => product.name).join(", ")}</span>
                      </span>
                      <span className="store-row__count">{list.length}</span>
                      <ArrowRight size={15} aria-hidden="true" className="store-row__arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/shop/${category.slug}`} className="text-link store-card__cta">
                Shop {category.shortName.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
          <li className="store-card store-card--all grain" data-reveal>
            <div className="store-all__main">
              <p className="store-all__label">The whole store</p>
              <p className="store-all__figure">
                <strong>{products.length}</strong>
                <span>products in the store</span>
              </p>
            </div>
            <div className="store-all__body">
              <p className="store-all__text">Browse everything in one place, or ask us on WhatsApp before you visit.</p>
              {others.length > 0 && <p className="store-all__also">Also in the store: {others.map(({ category }) => category.name).join(", ")}.</p>}
            </div>
            <div className="store-all__actions">
              <Link href="/shop" className="btn btn--lime">
                Browse all products <ArrowRight size={17} aria-hidden="true" />
              </Link>
              {whatsappReady && (
                <a href={`https://wa.me/${whatsappDigits}?text=${askHello}`} target="_blank" rel="noopener noreferrer" className="text-link text-link--light">
                  <MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp
                </a>
              )}
            </div>
          </li>
        </ul>
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
