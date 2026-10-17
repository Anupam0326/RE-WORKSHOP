/** Product list grouped by category, with search, reordering, layout toggle, inline delete and bulk delete. */

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, CalendarDays, EyeOff, Grid3X3, ImageOff, List, Plus, Search, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { deleteProduct, deleteProducts, explainError, reorderProducts, type AdminCategory, type AdminProduct } from "@/lib/adminApi";
import { formatPrice } from "@/data/catalog";

type Props = {
  products: AdminProduct[];
  categories: AdminCategory[];
  onChanged: () => Promise<void>;
  setProducts: Dispatch<SetStateAction<AdminProduct[]>>;
};

type Layout = "list" | "grid";

export function ProductsPanel({ products, categories, onChanged, setProducts }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [layout, setLayout] = useState<Layout>("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [missingPhotos, setMissingPhotos] = useState(false);

  const q = query.trim().toLowerCase();
  const sections = useMemo(
    () =>
      categories
        .filter((category) => filter === "all" || category.id === filter)
        .map((category) => ({
          category,
          items: products
            .filter((product) => product.category_id === category.id)
            .filter((product) => !missingPhotos || product.product_images.length === 0)
            .filter((product) => !q || `${product.name} ${product.group_label} ${product.pack_size} ${product.availability_note}`.toLowerCase().includes(q)),
        })),
    [categories, products, filter, q, missingPhotos],
  );

  const allVisibleIds = useMemo(() => sections.flatMap((s) => s.items.map((i) => i.id)), [sections]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allVisibleIds));
    }
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function bulkDelete() {
    const toDelete = products.filter((p) => selected.has(p.id));
    if (!toDelete.length) return;
    if (!window.confirm(`Delete ${toDelete.length} product${toDelete.length === 1 ? "" : "s"} and all their photos? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProducts(toDelete);
      toast.success(`${toDelete.length} product${toDelete.length === 1 ? "" : "s"} deleted`);
      setSelected(new Set());
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    } finally {
      setDeleting(false);
    }
  }

  async function inlineDelete(product: AdminProduct) {
    if (!window.confirm(`Delete "${product.name}" and its photos? This can't be undone.`)) return;
    setBusyId(product.id);
    try {
      await deleteProduct(product);
      toast.success(`${product.name} deleted`);
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    } finally {
      setBusyId(null);
    }
  }

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
        <div className="admin-layout-toggle">
          <button
            type="button"
            className={`admin-icon-btn ${layout === "list" ? "is-active" : ""}`}
            onClick={() => setLayout("list")}
            aria-label="List view"
            title="List view"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            className={`admin-icon-btn ${layout === "grid" ? "is-active" : ""}`}
            onClick={() => setLayout("grid")}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid3X3 size={18} />
          </button>
        </div>
      </div>

      {/* Bulk-action bar */}
      {selected.size > 0 && (
        <div className="admin-bulk-bar">
          <label className="admin-bulk-bar__select-all">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            <span>{selected.size} selected</span>
          </label>
          <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={bulkDelete} disabled={deleting}>
            <Trash2 size={16} aria-hidden="true" /> {deleting ? "Deleting…" : `Delete ${selected.size}`}
          </button>
          <button type="button" className="admin-icon-btn" onClick={clearSelection} aria-label="Clear selection" title="Clear selection">
            <X size={18} />
          </button>
        </div>
      )}

      <label className="admin-filter-check">
        <input type="checkbox" checked={missingPhotos} onChange={(event) => setMissingPhotos(event.target.checked)} />
        <span>
          Only products without photos <span className="admin-muted">({products.filter((product) => product.product_images.length === 0).length})</span>
        </span>
      </label>

      {(q || missingPhotos) && <p className="admin-muted admin-note">Reordering is paused while searching or filtering.</p>}

      {sections.map(({ category, items }) => (
        <div key={category.id} className="admin-section">
          <h2>
            {category.name} <span>{items.length}</span>
          </h2>
          {items.length === 0 ? (
            <p className="admin-muted admin-empty">{q ? "No matches in this category." : "No products yet."}</p>
          ) : layout === "list" ? (
            /* ───── LIST VIEW ───── */
            <ul className="admin-list">
              {items.map((product, index) => {
                const cover = product.product_images[0];
                return (
                  <li key={product.id} className={product.is_active ? "admin-row" : "admin-row is-hidden"}>
                    <label className="admin-row__check" title={`Select ${product.name}`}>
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </label>
                    <button type="button" className="admin-row__main" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}>
                      <span className="admin-thumb">{cover ? <img src={cover.url_small ?? cover.url} alt="" width={56} height={56} loading="lazy" /> : <ImageOff size={18} aria-hidden="true" />}</span>
                      <span className="admin-row__text">
                        <strong>{product.name}</strong>
                        <span>
                          {[product.pack_size, formatPrice(product.price_inr), product.group_label].filter(Boolean).join(" · ")}
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
                          {product.availability_note && (
                            <span className="admin-badge">
                              <CalendarDays size={12} aria-hidden="true" /> {product.availability_note}
                            </span>
                          )}
                          {product.product_images.length === 0 ? (
                            <span className="admin-badge admin-badge--warn">
                              <ImageOff size={12} aria-hidden="true" /> No photo
                            </span>
                          ) : (
                            <span className="admin-badge admin-badge--muted">{product.product_images.length}/5 photos</span>
                          )}
                        </span>
                      </span>
                    </button>
                    <span className="admin-row__order">
                      <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => inlineDelete(product)} disabled={busyId !== null} aria-label={`Delete ${product.name}`} title="Delete">
                        <Trash2 size={17} />
                      </button>
                      {!q && !missingPhotos && (
                        <>
                          <button type="button" className="admin-icon-btn" onClick={() => move(items, index, -1)} disabled={index === 0 || busyId !== null} aria-label={`Move ${product.name} up`}>
                            <ArrowUp size={18} />
                          </button>
                          <button type="button" className="admin-icon-btn" onClick={() => move(items, index, 1)} disabled={index === items.length - 1 || busyId !== null} aria-label={`Move ${product.name} down`}>
                            <ArrowDown size={18} />
                          </button>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            /* ───── GRID VIEW ───── */
            <div className="admin-grid-products">
              {items.map((product) => {
                const cover = product.product_images[0];
                return (
                  <div key={product.id} className={`admin-grid-card ${product.is_active ? "" : "is-hidden"}`}>
                    <div className="admin-grid-card__top">
                      <label className="admin-grid-card__check" title={`Select ${product.name}`}>
                        <input
                          type="checkbox"
                          checked={selected.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger admin-grid-card__del"
                        onClick={() => inlineDelete(product)}
                        disabled={busyId !== null}
                        aria-label={`Delete ${product.name}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <button type="button" className="admin-grid-card__body" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}>
                      <span className="admin-grid-card__media">
                        {cover ? <img src={cover.url_small ?? cover.url} alt="" loading="lazy" /> : <ImageOff size={18} aria-hidden="true" />}
                      </span>
                      <span className="admin-grid-card__info">
                        <strong>{product.name}</strong>
                        <span>{[product.pack_size, formatPrice(product.price_inr)].filter(Boolean).join(" · ")}</span>
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
                          {product.availability_note && (
                            <span className="admin-badge">
                              <CalendarDays size={12} aria-hidden="true" /> {product.availability_note}
                            </span>
                          )}
                          {product.product_images.length === 0 && (
                            <span className="admin-badge admin-badge--warn">
                              <ImageOff size={12} aria-hidden="true" /> No photo
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
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
