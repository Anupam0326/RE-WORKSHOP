/** Product detail — live catalogue data: photos (up to 5), name, pack, price, description and labels. */

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { SectionLink } from "@/components/SectionLink";
import { formatInr, type Product } from "@/data/catalog";
import { loop } from "@/data/brand";
import { useCart } from "@/contexts/CartContext";
import { useCatalog } from "@/contexts/CatalogContext";
import { usePageMeta } from "@/hooks/usePageMeta";

function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [product.slug]);
  const count = product.images.length;
  const go = (delta: number) => setActive((current) => (current + delta + count) % count);
  return (
    <div className="gallery">
      <div className="product__media">
        <ProductImage product={product} index={active} sizes="(min-width: 860px) 46vw, 100vw" eager={active === 0} />
        {count > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Next photo">
              <ChevronRight size={22} />
            </button>
            <span className="gallery__count" aria-live="polite">
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Product photos">
          {product.images.map((photo, index) => (
            <button
              key={photo.url + index}
              type="button"
              className={index === active ? "gallery__thumb is-active" : "gallery__thumb"}
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}>
              <img src={photo.urlSmall ?? photo.url} alt="" width={80} height={67} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const { getProduct, getCategory, products, status } = useCatalog();
  const product = getProduct(params?.slug);
  const category = product ? getCategory(product.categorySlug) : undefined;
  const { addProduct } = useCart();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);

  usePageMeta(
    product?.name ?? "Product",
    product
      ? `${product.name} (${product.packSize}) — ${formatInr(product.priceInr)} at Re Workshop Organic Food Store & Café, Jabalpur.${product.description ? " " + product.description.slice(0, 120) : ""}`
      : undefined,
  );

  if (!product || !category) {
    // A newly added product may not be in the saved copy yet — wait for the live catalogue before saying "not found".
    const stillLoading = status === "cached" || status === "fallback";
    return (
      <div className="app-shell">
        <SiteHeader />
        <main id="main" className="not-found rw-wrap" aria-busy={stillLoading}>
          {stillLoading ? (
            <>
              <SectionLabel>Loading</SectionLabel>
              <h1>Fetching this product…</h1>
            </>
          ) : (
            <>
              <SectionLabel>Not on this shelf</SectionLabel>
              <h1>We couldn’t find that product.</h1>
              <Link href="/shop" className="button button--forest">
                Back to the store <ArrowRight size={18} />
              </Link>
            </>
          )}
        </main>
        <SiteFooter />
      </div>
    );
  }

  const selected = product;
  const sameGroup = products.filter((item) => item.categorySlug === selected.categorySlug && item.group === selected.group && item.id !== selected.id);
  const related = (sameGroup.length ? sameGroup : products.filter((item) => item.categorySlug === selected.categorySlug && item.id !== selected.id)).slice(0, 4);

  function addToBasket() {
    addProduct(selected, quantity);
    toast.success(`${selected.name} × ${quantity} added to your basket`, { action: { label: "View basket", onClick: () => navigate("/cart") } });
  }

  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <section className="product">
          <div className="rw-wrap">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/shop">Store</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/shop/${category.slug}`}>{category.shortName}</Link>
            </nav>
            <div className="product__layout">
              <Gallery product={selected} />
              <div className="product__copy">
                {selected.group && <SectionLabel>{selected.group}</SectionLabel>}
                <h1>{selected.name}</h1>
                <p className="product__price">
                  {formatInr(selected.priceInr)} {selected.packSize && <span>/ {selected.packSize}</span>}
                </p>
                {selected.details.length > 0 && (
                  <ul className="chip-list product__details" aria-label="Product details">
                    {selected.details.map((detail) => (
                      <li key={detail} className="chip">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
                {selected.description && (
                  <div className="product__description">
                    {selected.description.split(/\n{2,}/).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                <div className="product__purchase">
                  <div className="quantity-control quantity-control--large" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" disabled={quantity <= 1}>
                      <Minus size={18} />
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                      <Plus size={18} />
                    </button>
                  </div>
                  <button type="button" className="button button--forest product__add" onClick={addToBasket}>
                    Add to basket <ShoppingBag size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="product__note">
                  <p className="eyebrow">How Re Workshop works</p>
                  <p>{loop.intro}</p>
                  <SectionLink id="loop" className="text-link">
                    The Soil-to-Plate Loop <ArrowRight size={16} aria-hidden="true" />
                  </SectionLink>
                </div>
                <Link href={`/shop/${category.slug}`} className="text-link">
                  <ArrowLeft size={16} aria-hidden="true" /> Back to {category.shortName.toLowerCase()}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="related section section--sage" aria-labelledby="related-title">
            <div className="rw-wrap">
              <header className="section-head section-head--row">
                <div>
                  <SectionLabel>From the same shelf</SectionLabel>
                  <h2 id="related-title">{selected.group || category.name}</h2>
                </div>
                <Link href={`/shop/${category.slug}`} className="text-link">
                  All {category.shortName.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </header>
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
