/** Categories: rename, describe, reorder, add, and delete when empty. */

import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  explainError,
  reorderCategories,
  uniqueSlug,
  updateCategory,
  type AdminCategory,
  type AdminProduct,
  type CategoryInput,
} from "@/lib/adminApi";

type Props = {
  categories: AdminCategory[];
  products: AdminProduct[];
  onChanged: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<AdminCategory[]>>;
};

const empty: CategoryInput = { name: "", short_name: "", eyebrow: "", description: "" };

function CategoryForm({ initial, onSubmit, onCancel, submitLabel }: { initial: CategoryInput; onSubmit: (input: CategoryInput) => Promise<void>; onCancel: () => void; submitLabel: string }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof CategoryInput) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Enter a category name.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ name: form.name.trim(), short_name: form.short_name.trim(), eyebrow: form.eyebrow.trim(), description: form.description.trim() });
    } catch (err) {
      toast.error(explainError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-cat-form" onSubmit={submit} noValidate>
      <div className="admin-grid-2">
        <label className="admin-field">
          <span>Name *</span>
          <input value={form.name} onChange={(event) => set("name")(event.target.value)} maxLength={80} aria-invalid={Boolean(error)} autoFocus />
          {error && <small className="admin-field__error">{error}</small>}
        </label>
        <label className="admin-field">
          <span>Short name (filter button)</span>
          <input value={form.short_name} onChange={(event) => set("short_name")(event.target.value)} maxLength={40} placeholder="Defaults to the name" />
        </label>
      </div>
      <label className="admin-field">
        <span>One-line tagline</span>
        <input value={form.eyebrow} onChange={(event) => set("eyebrow")(event.target.value)} maxLength={120} />
      </label>
      <label className="admin-field">
        <span>Description</span>
        <textarea value={form.description} onChange={(event) => set("description")(event.target.value)} rows={2} maxLength={400} />
      </label>
      <div className="admin-cat-form__actions">
        <button type="button" className="admin-btn" onClick={onCancel} disabled={busy}>
          <X size={16} aria-hidden="true" /> Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
          <Check size={16} aria-hidden="true" /> {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function CategoriesPanel({ categories, products, onChanged, setCategories }: Props) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const countFor = (id: string) => products.filter((product) => product.category_id === id).length;

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    setBusy(true);
    try {
      await reorderCategories(next.map((category) => category.id));
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
      await onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: AdminCategory) {
    if (countFor(category.id) > 0) {
      toast.error("This category still has products. Move or delete them first.");
      return;
    }
    if (!window.confirm(`Delete the category “${category.name}”?`)) return;
    try {
      await deleteCategory(category.id);
      toast.success(`${category.name} deleted`);
      await onChanged();
    } catch (error) {
      toast.error(explainError(error));
    }
  }

  return (
    <section aria-labelledby="categories-title">
      <div className="admin-head">
        <div>
          <h1 id="categories-title">Categories</h1>
          <p className="admin-muted">These are the shelves on the store page, in this order.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => setEditingId("new")} disabled={editingId === "new"}>
          <Plus size={18} aria-hidden="true" /> Add category
        </button>
      </div>

      {editingId === "new" && (
        <div className="admin-card">
          <CategoryForm
            initial={empty}
            submitLabel="Add category"
            onCancel={() => setEditingId(null)}
            onSubmit={async (input) => {
              await createCategory({
                ...input,
                short_name: input.short_name || input.name,
                slug: uniqueSlug(input.name, categories.map((category) => category.slug)),
                sort_order: categories.length + 1,
              });
              toast.success(`${input.name} added`);
              setEditingId(null);
              await onChanged();
            }}
          />
        </div>
      )}

      <ul className="admin-list">
        {categories.map((category, index) => (
          <li key={category.id} className="admin-row admin-row--category">
            {editingId === category.id ? (
              <div className="admin-card admin-card--inline">
                <CategoryForm
                  initial={{ name: category.name, short_name: category.short_name, eyebrow: category.eyebrow, description: category.description }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (input) => {
                    await updateCategory(category.id, { ...input, short_name: input.short_name || input.name });
                    toast.success(`${input.name} updated`);
                    setEditingId(null);
                    await onChanged();
                  }}
                />
              </div>
            ) : (
              <>
                <div className="admin-row__text admin-row__text--pad">
                  <strong>{category.name}</strong>
                  <span>
                    {countFor(category.id)} products{category.eyebrow ? ` · ${category.eyebrow}` : ""}
                  </span>
                </div>
                <span className="admin-row__order">
                  <button type="button" className="admin-icon-btn" onClick={() => setEditingId(category.id)} aria-label={`Edit ${category.name}`}>
                    <Pencil size={17} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(index, -1)} disabled={index === 0 || busy} aria-label={`Move ${category.name} up`}>
                    <ArrowUp size={18} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(index, 1)} disabled={index === categories.length - 1 || busy} aria-label={`Move ${category.name} down`}>
                    <ArrowDown size={18} />
                  </button>
                  <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => remove(category)} aria-label={`Delete ${category.name}`}>
                    <Trash2 size={17} />
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
