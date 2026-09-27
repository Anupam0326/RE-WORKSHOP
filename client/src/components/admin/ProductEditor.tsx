/** Add / edit a product: details, visibility and up to 5 photos (compressed in the browser before upload). */

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  MAX_IMAGES,
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  explainError,
  reorderImages,
  uniqueSlug,
  updateProduct,
  type AdminCategory,
  type AdminImage,
  type AdminProduct,
} from "@/lib/adminApi";

type Photo = { key: string; kind: "existing"; image: AdminImage } | { key: string; kind: "new"; file: File; preview: string };

type Props = {
  product: AdminProduct | null;
  products: AdminProduct[];
  categories: AdminCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

const MAX_UPLOAD_MB = 20;

export function ProductEditor({ product, products, categories, defaultCategoryId, onClose, onSaved }: Props) {
  const isNew = !product;
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? "");
  const [group, setGroup] = useState(product?.group_label ?? "");
  const [packSize, setPackSize] = useState(product?.pack_size ?? "");
  const [price, setPrice] = useState(product ? String(product.price_inr) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [tags, setTags] = useState((product?.details ?? []).join(", "));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [visible, setVisible] = useState(product?.is_active ?? true);
  const [photos, setPhotos] = useState<Photo[]>(() => (product?.product_images ?? []).map((image) => ({ key: image.id, kind: "existing", image })));
  const [removed, setRemoved] = useState<AdminImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [dirty, setDirty] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const groupSuggestions = useMemo(
    () => Array.from(new Set(products.filter((item) => item.category_id === categoryId && item.group_label).map((item) => item.group_label))),
    [products, categoryId],
  );

  // Focus, Escape to close, scroll lock.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  useEffect(() => () => photos.forEach((photo) => photo.kind === "new" && URL.revokeObjectURL(photo.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function requestClose() {
    if (busy) return;
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    onClose();
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function touch<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const room = MAX_IMAGES - photos.length;
    if (room <= 0) {
      toast.error(`A product can have at most ${MAX_IMAGES} photos.`);
      return;
    }
    const accepted: Photo[] = [];
    for (const file of files.slice(0, room)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`“${file.name}” isn’t an image.`);
        continue;
      }
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast.error(`“${file.name}” is larger than ${MAX_UPLOAD_MB} MB.`);
        continue;
      }
      accepted.push({ key: crypto.randomUUID(), kind: "new", file, preview: URL.createObjectURL(file) });
    }
    if (files.length > room) toast.message(`Only ${room} more photo${room === 1 ? "" : "s"} could be added (max ${MAX_IMAGES}).`);
    if (accepted.length) {
      setPhotos((current) => [...current, ...accepted]);
      setDirty(true);
    }
  }

  function movePhoto(index: number, delta: number) {
    setPhotos((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const photo = current[index];
      if (photo.kind === "existing") setRemoved((list) => [...list, photo.image]);
      else URL.revokeObjectURL(photo.preview);
      return current.filter((_, i) => i !== index);
    });
    setDirty(true);
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter the product name.";
    if (!categoryId) next.category = "Choose a category.";
    if (!packSize.trim()) next.packSize = "Enter the quantity or pack size, e.g. 500 g.";
    const priceNumber = Number(price);
    if (price.trim() === "" || Number.isNaN(priceNumber) || priceNumber < 0) next.price = "Enter a price of 0 or more.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Once errors are showing, re-check as the fields change so fixed fields clear immediately.
  useEffect(() => {
    if (Object.keys(errors).length) validate();
  }, [name, categoryId, packSize, price]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!validate()) {
      dialogRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    const input = {
      name: name.trim(),
      category_id: categoryId,
      group_label: group.trim(),
      pack_size: packSize.trim(),
      price_inr: Math.round(Number(price) * 100) / 100,
      description: description.trim(),
      details: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 6),
      featured,
      is_active: visible,
    };
    let createdId: string | undefined;
    try {
      setBusy("Saving details…");
      let productId = product?.id;
      if (isNew) {
        const inCategory = products.filter((item) => item.category_id === categoryId);
        const created = await createProduct({
          ...input,
          slug: uniqueSlug(input.name, products.map((item) => item.slug)),
          sort_order: inCategory.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1,
        });
        productId = created.id;
        createdId = created.id;
      } else {
        await updateProduct(product.id, input);
      }
      for (const image of removed) {
        setBusy("Removing photos…");
        await deleteProductImage(image);
      }
      const finalIds: string[] = [];
      const newCount = photos.filter((photo) => photo.kind === "new").length;
      let uploaded = 0;
      for (let index = 0; index < photos.length; index += 1) {
        const photo = photos[index];
        if (photo.kind === "existing") {
          finalIds.push(photo.image.id);
          continue;
        }
        uploaded += 1;
        setBusy(`Uploading photo ${uploaded} of ${newCount}…`);
        const row = await addProductImage(productId!, photo.file, index + 1);
        finalIds.push(row.id);
      }
      if (finalIds.length) await reorderImages(finalIds);
      toast.success(isNew ? `${input.name} added to the store` : `${input.name} updated`);
      setDirty(false);
      await onSaved();
    } catch (error) {
      if (createdId) {
        // The product exists now — close so a retry can't create a duplicate.
        toast.error(`“${input.name}” was saved, but a photo failed: ${explainError(error)} Open the product to add it again.`);
        await onSaved();
        return;
      }
      toast.error(explainError(error));
      setBusy("");
    }
  }

  async function remove() {
    if (!product) return;
    if (!window.confirm(`Delete “${product.name}” and its photos? This can’t be undone.`)) return;
    try {
      setBusy("Deleting…");
      await deleteProduct(product);
      toast.success(`${product.name} deleted`);
      await onSaved();
    } catch (error) {
      toast.error(explainError(error));
      setBusy("");
    }
  }

  return (
    <div className="admin-sheet" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && requestClose()}>
      <div ref={dialogRef} className="admin-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <form onSubmit={save} noValidate>
          <header className="admin-sheet__head">
            <h2 id="editor-title">{isNew ? "Add product" : "Edit product"}</h2>
            <button type="button" className="admin-icon-btn" onClick={requestClose} aria-label="Close" disabled={Boolean(busy)}>
              <X size={20} />
            </button>
          </header>

          <div className="admin-sheet__body">
            <label className="admin-field">
              <span>Product name *</span>
              <input value={name} onChange={(event) => touch(setName)(event.target.value)} maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "err-name" : undefined} />
              {errors.name && <small id="err-name" className="admin-field__error">{errors.name}</small>}
            </label>

            <div className="admin-grid-2">
              <label className="admin-field">
                <span>Category *</span>
                <select value={categoryId} onChange={(event) => touch(setCategoryId)(event.target.value)} aria-invalid={Boolean(errors.category)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <small className="admin-field__error">{errors.category}</small>}
              </label>
              <label className="admin-field">
                <span>Shelf / sub-group</span>
                <input value={group} onChange={(event) => touch(setGroup)(event.target.value)} list="group-suggestions" maxLength={60} placeholder="e.g. Ancient millets" />
                <datalist id="group-suggestions">
                  {groupSuggestions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </label>
            </div>

            <div className="admin-grid-2">
              <label className="admin-field">
                <span>Quantity / pack size *</span>
                <input value={packSize} onChange={(event) => touch(setPackSize)(event.target.value)} maxLength={40} placeholder="e.g. 500 g, 1 L, 1 pc" aria-invalid={Boolean(errors.packSize)} />
                {errors.packSize && <small className="admin-field__error">{errors.packSize}</small>}
              </label>
              <label className="admin-field">
                <span>Price (₹) *</span>
                <input value={price} onChange={(event) => touch(setPrice)(event.target.value)} inputMode="decimal" type="number" min="0" step="0.01" placeholder="e.g. 120" aria-invalid={Boolean(errors.price)} />
                {errors.price && <small className="admin-field__error">{errors.price}</small>}
              </label>
            </div>

            <label className="admin-field">
              <span>Description</span>
              <textarea value={description} onChange={(event) => touch(setDescription)(event.target.value)} rows={5} maxLength={2000} placeholder="What it is, how it’s made, how to use it." />
              <small className="admin-field__hint">{description.length}/2000 · Leave a blank line between paragraphs.</small>
            </label>

            <label className="admin-field">
              <span>Labels</span>
              <input value={tags} onChange={(event) => touch(setTags)(event.target.value)} placeholder="e.g. Organic, Stone milled" />
              <small className="admin-field__hint">Separate with commas. The first label shows on the product card.</small>
            </label>

            <fieldset className="admin-field admin-photos">
              <legend>
                Photos <span className="admin-muted">({photos.length}/{MAX_IMAGES}) · the first photo is the cover</span>
              </legend>
              <div className="admin-photos__grid">
                {photos.map((photo, index) => (
                  <div key={photo.key} className="admin-photo">
                    <img src={photo.kind === "existing" ? photo.image.url_small ?? photo.image.url : photo.preview} alt={`Photo ${index + 1}`} />
                    {index === 0 && <span className="admin-photo__cover">Cover</span>}
                    {photo.kind === "new" && <span className="admin-photo__new">New</span>}
                    <div className="admin-photo__actions">
                      <button type="button" onClick={() => movePhoto(index, -1)} disabled={index === 0} aria-label={`Move photo ${index + 1} earlier`}>
                        <ArrowLeft size={16} />
                      </button>
                      <button type="button" onClick={() => removePhoto(index)} aria-label={`Remove photo ${index + 1}`}>
                        <Trash2 size={16} />
                      </button>
                      <button type="button" onClick={() => movePhoto(index, 1)} disabled={index === photos.length - 1} aria-label={`Move photo ${index + 1} later`}>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {photos.length < MAX_IMAGES && (
                  <button type="button" className="admin-photo admin-photo--add" onClick={() => fileRef.current?.click()}>
                    <ImagePlus size={26} aria-hidden="true" />
                    <span>Add photos</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addFiles} />
              <small className="admin-field__hint">JPG, PNG or WebP. Photos are resized automatically before upload.</small>
            </fieldset>

            <div className="admin-toggles">
              <label className="admin-check">
                <input type="checkbox" checked={visible} onChange={(event) => touch(setVisible)(event.target.checked)} />
                <span>
                  <strong>Show on website</strong>
                  <small>Untick to hide it without deleting.</small>
                </span>
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={featured} onChange={(event) => touch(setFeatured)(event.target.checked)} />
                <span>
                  <strong>Feature on home page</strong>
                  <small>Shows in “Staples to start with”.</small>
                </span>
              </label>
            </div>
          </div>

          <footer className="admin-sheet__foot">
            {!isNew && (
              <button type="button" className="admin-btn admin-btn--danger" onClick={remove} disabled={Boolean(busy)}>
                <Trash2 size={16} aria-hidden="true" /> Delete
              </button>
            )}
            <span className="admin-sheet__status" aria-live="polite">
              {busy}
            </span>
            <button type="button" className="admin-btn" onClick={requestClose} disabled={Boolean(busy)}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={Boolean(busy)}>
              {busy ? "Saving…" : isNew ? "Add product" : "Save changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
