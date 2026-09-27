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
  price_inr: number;
  description: string;
  details: string[];
  featured: boolean;
  is_active: boolean;
  sort_order: number;
  product_images: AdminImage[];
};
export type ProductInput = Pick<AdminProduct, "name" | "category_id" | "group_label" | "pack_size" | "price_inr" | "description" | "details" | "featured" | "is_active">;
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
    "products?select=id,slug,name,category_id,group_label,pack_size,price_inr,description,details,featured,is_active,sort_order,product_images(id,url,url_small,storage_paths,sort_order)&order=sort_order.asc,name.asc",
  );
  return rows.map((row) => ({
    ...row,
    price_inr: Number(row.price_inr),
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

/** Compress, upload (large + small) and attach one photo to a product. */
export async function addProductImage(productId: string, file: File, sortOrder: number) {
  const [large, small] = await Promise.all([compressImage(file, 1400, 0.82), compressImage(file, 600, 0.8)]);
  const id = crypto.randomUUID();
  const ext = large.type === "image/webp" ? "webp" : "jpg";
  const largePath = `${productId}/${id}-1400.${ext}`;
  const smallPath = `${productId}/${id}-600.${small.type === "image/webp" ? "webp" : "jpg"}`;
  const [url, urlSmall] = await Promise.all([uploadImage(largePath, large), uploadImage(smallPath, small)]);
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
