/** Admin data access. Every write is enforced server-side by RLS (admins table), not by this code. */

import { compressImage } from "@/lib/imageCompress";
import { deleteImages, rest, rpc, uploadImage } from "@/lib/supabase";

export type AdminCategory = { id: string; slug: string; name: string; short_name: string; eyebrow: string; description: string; sort_order: number };
export type AdminImage = { id: string; url: string; url_small: string | null; storage_paths: string[]; sort_order: number };
export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  group_label: string;
  pack_size: string;
  /** null = "price on request". */
  price_inr: number | null;
  /** Short badge such as "Winter only"; empty when always available. */
  availability_note: string;
  description: string;
  details: string[];
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  product_images: AdminImage[];
};
export type ProductInput = Pick<
  AdminProduct,
  "name" | "category_id" | "group_label" | "pack_size" | "price_inr" | "availability_note" | "description" | "details" | "featured" | "is_active"
>;
export type AdminMedia = { key: string; url: string; url_small: string | null; storage_paths: string[]; alt: string; caption: string };
export type CategoryInput = Pick<AdminCategory, "name" | "short_name" | "eyebrow" | "description">;

export const MAX_IMAGES = 5;

export function slugify(text: string) {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "item"
  );
}

export function uniqueSlug(name: string, taken: Iterable<string>) {
  const used = new Set(taken);
  const base = slugify(name);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** True when the signed-in user is listed in public.admins (the table is only readable by admins). */
export async function checkIsAdmin() {
  const rows = await rest<{ email: string }[]>("admins?select=email&limit=1");
  return rows.length > 0;
}

export function listCategories() {
  return rest<AdminCategory[]>("categories?select=*&order=sort_order.asc,name.asc");
}

export async function listProducts() {
  const rows = await rest<AdminProduct[]>(
    "products?select=id,slug,name,category_id,group_label,pack_size,price_inr,availability_note,description,details,featured,is_active,sort_order,product_images(id,url,url_small,storage_paths,sort_order)&order=sort_order.asc,name.asc",
  );
  return rows.map((row) => ({
    ...row,
    price_inr: row.price_inr == null ? null : Number(row.price_inr),
    availability_note: row.availability_note ?? "",
    product_images: [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function createProduct(input: ProductInput & { slug: string; sort_order: number }) {
  const [row] = await rest<AdminProduct[]>("products", { method: "POST", body: input });
  return row;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await rest(`products?id=eq.${id}`, { method: "PATCH", body: input });
}

export async function deleteProduct(product: AdminProduct) {
  await deleteImages(product.product_images.flatMap((image) => image.storage_paths));
  await rest(`products?id=eq.${product.id}`, { method: "DELETE" });
}

/** Delete multiple products and all their images in one go. */
export async function deleteProducts(productList: AdminProduct[]) {
  for (const product of productList) {
    await deleteImages(product.product_images.flatMap((image) => image.storage_paths));
    await rest(`products?id=eq.${product.id}`, { method: "DELETE" });
  }
}

/** Compress a photo to a large (1400 px) and small (600 px) copy and upload both under `folder`. */
async function uploadPhotoPair(folder: string, file: File) {
  const [large, small] = await Promise.all([compressImage(file, 1400, 0.82), compressImage(file, 600, 0.8)]);
  const id = crypto.randomUUID();
  const largePath = `${folder}/${id}-1400.${large.type === "image/webp" ? "webp" : "jpg"}`;
  const smallPath = `${folder}/${id}-600.${small.type === "image/webp" ? "webp" : "jpg"}`;
  const [url, urlSmall] = await Promise.all([uploadImage(largePath, large), uploadImage(smallPath, small)]);
  return { url, urlSmall, largePath, smallPath };
}

/** Compress, upload (large + small) and attach one photo to a product. */
export async function addProductImage(productId: string, file: File, sortOrder: number) {
  const { url, urlSmall, largePath, smallPath } = await uploadPhotoPair(productId, file);
  try {
    const [row] = await rest<AdminImage[]>("product_images", {
      method: "POST",
      body: { product_id: productId, url, url_small: urlSmall, storage_paths: [largePath, smallPath], sort_order: sortOrder },
    });
    return row;
  } catch (error) {
    await deleteImages([largePath, smallPath]).catch(() => undefined);
    throw error;
  }
}

export async function deleteProductImage(image: AdminImage) {
  await rest(`product_images?id=eq.${image.id}`, { method: "DELETE" });
  await deleteImages(image.storage_paths).catch(() => undefined);
}

/* ---------------- Site photos (hero, café, farm) ---------------- */

export function listSiteMedia() {
  return rest<AdminMedia[]>("site_media?select=key,url,url_small,storage_paths,alt,caption");
}

/** Upload a new photo for a slot (replacing any previous one) and save its caption / alt text. */
export async function saveSiteMediaPhoto(key: string, file: File, text: { caption: string; alt: string }, previous?: AdminMedia) {
  const { url, urlSmall, largePath, smallPath } = await uploadPhotoPair(`site/${key}`, file);
  try {
    await rest("site_media?on_conflict=key", {
      method: "POST",
      body: { key, url, url_small: urlSmall, storage_paths: [largePath, smallPath], caption: text.caption, alt: text.alt },
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    });
  } catch (error) {
    await deleteImages([largePath, smallPath]).catch(() => undefined);
    throw error;
  }
  if (previous?.storage_paths.length) await deleteImages(previous.storage_paths).catch(() => undefined);
}

export async function updateSiteMediaText(key: string, text: { caption: string; alt: string }) {
  await rest(`site_media?key=eq.${encodeURIComponent(key)}`, { method: "PATCH", body: text });
}

/** Remove the uploaded photo so the slot goes back to its default. */
export async function removeSiteMedia(media: AdminMedia) {
  await rest(`site_media?key=eq.${encodeURIComponent(media.key)}`, { method: "DELETE" });
  await deleteImages(media.storage_paths).catch(() => undefined);
}

export const reorderProducts = (ids: string[]) => rpc("reorder_products", { p_ids: ids });
export const reorderImages = (ids: string[]) => rpc("reorder_product_images", { p_ids: ids });
export const reorderCategories = (ids: string[]) => rpc("reorder_categories", { p_ids: ids });

export async function createCategory(input: CategoryInput & { slug: string; sort_order: number }) {
  const [row] = await rest<AdminCategory[]>("categories", { method: "POST", body: input });
  return row;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  await rest(`categories?id=eq.${id}`, { method: "PATCH", body: input });
}

export async function deleteCategory(id: string) {
  await rest(`categories?id=eq.${id}`, { method: "DELETE" });
}

/** Friendly wording for common database errors. */
export function explainError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/at most 5 images/i.test(message)) return "A product can have at most 5 photos.";
  if (/foreign key|violates.*categories/i.test(message)) return "This category still has products. Move or delete them first.";
  if (/duplicate key.*slug/i.test(message)) return "Another item already uses this name. Please change it slightly.";
  if (/row-level security|not allowed|42501|permission/i.test(message)) return "Your account isn’t allowed to make changes. Ask the site owner to add you as an admin.";
  if (/jwt|token/i.test(message)) return "Your session expired. Please sign in again.";
  if (/failed to fetch|network/i.test(message)) return "No connection. Check your internet and try again.";
  if (/rate limit|too many/i.test(message)) return "Too many attempts. Please wait a few minutes and try again.";
  return message;
}
