/** Product list grouped by category, with search, reordering and the add/edit sheet. */

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, EyeOff, Plus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { explainError, reorderProducts, type AdminCategory, type AdminProduct } from "@/lib/adminApi";
import { formatInr } from "@/data/catalog";

type Props = {
  products: AdminProduct[];
  categories: AdminCategory[];
  onChanged: () => Promise<void>;
  setProducts: Dispatch<SetStateAction<AdminProduct[]>>;
};

export function ProductsPanel({ products, categories, onChanged, setProducts }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const sections = useMemo(
    () =>
      categories
        .filter((category) => filter === "all" || category.id === filter)
        .map((category) => ({
          category,
          items: products
            .filter((product) => product.category_id === category.id)
            .filter((product) => !q || `${product.name} ${product.group_label} ${product.pack_size}`.toLowerCase().includes(q)),
        })),
    [categories, products, filter, q],
  );

  async function move(section: AdminProduct[], index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= section.length) return;
    const reordered = [...section];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const ids = reordered.map((item) => item.id);
    // Optimistic: update local order immediately.
    setProducts((current) => current.map((item) => (ids.includes(item.id) ? { ...item, sort_order: ids.indexOf(item.id) + 1 } : item)).sort((a, b) => a.sort_order - b.sort_order));
    setBusyId(section[index].id);
    try {
      await reorderProducts(ids);
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
      await onChanged();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section aria-labelledby="products-title">
      <div className="admin-head">
        <div>
          <h1 id="products-title">Products</h1>
          <p className="admin-muted">Changes appear on the website immediately. Use the arrows to set the order shoppers see.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setEditing("new")} disabled={!categories.length}>
          <Plus size={18} aria-hidden="true" /> Add product
        </button>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
        </label>
        <label className="admin-select">
          <span className="sr-only">Category</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {q && <p className="admin-muted admin-note">Reordering is paused while searching.</p>}

      {sections.map(({ category, items }) => (
        <div key={category.id} className="admin-section">
          <h2>
            {category.name} <span>{items.length}</span>
          </h2>
          {items.length === 0 ? (
            <p className="admin-muted admin-empty">{q ? "No matches in this category." : "No products yet."}</p>
          ) : (
            <ul className="admin-list">
              {items.map((product, index) => {
                const cover = product.product_images[0];
                return (
                  <li key={product.id} className={product.is_active ? "admin-row" : "admin-row is-hidden"}>
                    <button type="button" className="admin-row__main" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}>
                      <span className="admin-thumb">{cover ? <img src={cover.url_small ?? cover.url} alt="" width={56} height={56} loading="lazy" /> : <span aria-hidden="true">—</span>}</span>
                      <span className="admin-row__text">
                        <strong>{product.name}</strong>
                        <span>
                          {[product.pack_size, formatInr(product.price_inr), product.group_label].filter(Boolean).join(" · ")}
                        </span>
                        <span className="admin-badges">
                          {!product.is_active && (
                            <span className="admin-badge admin-badge--muted">
                              <EyeOff size={12} aria-hidden="true" /> Hidden
                            </span>
                          )}
                          {product.featured && (
                            <span className="admin-badge">
                              <Star size={12} aria-hidden="true" /> Featured
                            </span>
                          )}
                          <span className="admin-badge admin-badge--muted">{product.product_images.length}/5 photos</span>
                        </span>
                      </span>
                    </button>
                    {!q && (
                      <span className="admin-row__order">
                        <button type="button" className="admin-icon-btn" onClick={() => move(items, index, -1)} disabled={index === 0 || busyId !== null} aria-label={`Move ${product.name} up`}>
                          <ArrowUp size={18} />
                        </button>
                        <button type="button" className="admin-icon-btn" onClick={() => move(items, index, 1)} disabled={index === items.length - 1 || busyId !== null} aria-label={`Move ${product.name} down`}>
                          <ArrowDown size={18} />
                        </button>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          products={products}
          categories={categories}
          defaultCategoryId={filter !== "all" ? filter : categories[0]?.id}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await onChanged();
          }}
        />
      )}
    </section>
  );
}
