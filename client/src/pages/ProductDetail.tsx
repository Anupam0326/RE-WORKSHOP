/** Product detail — catalogue facts only (name, pack, price, printed descriptors), plus the brand's processing note. */

import { useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { SectionLink } from "@/components/SectionLink";
import { formatInr, getCategoryBySlug, getProductBySlug, products } from "@/data/catalog";
import { loop } from "@/data/brand";
import { useCart } from "@/contexts/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const product = getProductBySlug(params?.slug);
  const category = product ? getCategoryBySlug(product.categorySlug) : undefined;
  const { addProduct } = useCart();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);

  usePageMeta(
    product?.name ?? "Product not found",
    product ? `${product.name} (${product.packSize}) — ${formatInr(product.priceInr)} at Re Workshop Organic Food Store & Café, Jabalpur.` : undefined,
  );

  if (!product || !category) {
    return (
      <div className="app-shell">
        <SiteHeader />
        <main id="main" className="not-found rw-wrap">
          <SectionLabel>Not on this shelf</SectionLabel>
          <h1>We couldn’t find that product.</h1>
          <Link href="/shop" className="button button--forest">
            Back to the store <ArrowRight size={18} />
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const selected = product;
  const related = products.filter((item) => item.group === selected.group && item.id !== selected.id).slice(0, 4);

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
              <div className="product__media">
                <ProductImage product={selected} sizes="(min-width: 860px) 46vw, 100vw" eager />
              </div>
              <div className="product__copy">
                <SectionLabel>{selected.group}</SectionLabel>
                <h1>{selected.name}</h1>
                <p className="product__price">
                  {formatInr(selected.priceInr)} <span>/ {selected.packSize}</span>
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
                <p className="product__availability">Add to basket, then order through WhatsApp — the store confirms availability, pickup or Jabalpur delivery and the final total.</p>
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
                  <h2 id="related-title">{selected.group}</h2>
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
