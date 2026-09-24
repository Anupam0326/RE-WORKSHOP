import type { Product } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products, emptyMessage = "Nothing on this shelf matches your search." }: { products: Product[]; emptyMessage?: string }) {
  if (!products.length) {
    return (
      <div className="empty-state" role="status">
        <p className="eyebrow">A quiet shelf</p>
        <h3>{emptyMessage}</h3>
        <p>Try another shelf or clear your search.</p>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
