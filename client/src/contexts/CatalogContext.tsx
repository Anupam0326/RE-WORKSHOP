/**
 * Live catalogue from Supabase with an instant first paint:
 * 1) last good copy from localStorage, else the bundled PDF catalogue; 2) fresh data from the database.
 * The public site always reads anonymously, so products hidden by the admin never leak to shoppers.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fallbackCategories, fallbackProducts, legacyCategorySlugs, studioPhoto, studioPhotoCount, type Category, type Product } from "@/data/catalog";
import type { SiteMedia } from "@/data/media";
import { rest } from "@/lib/supabase";

type Status = "fallback" | "cached" | "live" | "error";

/**
 * Dev-only preview of the Oct 2026 studio photos. The dev server and the live site share one database, so the
 * studio-photo SQL can't be tried locally without changing the live store. With VITE_PREVIEW_STUDIO_PHOTOS=1 in
 * .env.development.local, the storefront shows the bundled studio photos instead of the database's. It is never
 * active in a production build. While it is on, the admin still shows (and edits) the database photos.
 * Delete this, and the .env line, after supabase/2026-10-17-studio-photos.sql has been run.
 */
const PREVIEW_STUDIO_PHOTOS = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_STUDIO_PHOTOS === "1";

function previewStudioPhotos(slug: string): Product["images"] | null {
  const count = PREVIEW_STUDIO_PHOTOS ? studioPhotoCount[slug] : 0;
  return count ? Array.from({ length: count }, (_, index) => studioPhoto(slug, index + 1)) : null;
}
type CatalogData = { categories: Category[]; products: Product[]; media: Record<string, SiteMedia> };
type CatalogValue = CatalogData & {
  status: Status;
  featured: Product[];
  getProduct: (slug?: string) => Product | undefined;
  getCategory: (slug?: string) => Category | undefined;
  getMedia: (key: string) => SiteMedia | undefined;
  refresh: () => Promise<void>;
};

const CACHE_KEY = "rw-catalog-v2";
const CatalogContext = createContext<CatalogValue | null>(null);

type CategoryRow = { id: string; slug: string; name: string; short_name: string; eyebrow: string; description: string };
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  group_label: string;
  pack_size: string;
  price_inr: number | string | null;
  availability_note: string | null;
  description: string;
  details: string[] | null;
  featured: boolean;
  category: { slug: string } | null;
  product_images: { url: string; url_small: string | null; sort_order: number }[] | null;
};
type MediaRow = { key: string; url: string; url_small: string | null; alt: string; caption: string };

/** Site photos are optional: if they can't be loaded the slots simply show their defaults. */
async function fetchMedia(): Promise<Record<string, SiteMedia>> {
  try {
    const rows = await rest<MediaRow[]>("site_media?select=key,url,url_small,alt,caption", { anonymous: true });
    return Object.fromEntries(rows.map((row) => [row.key, { key: row.key, url: row.url, urlSmall: row.url_small, alt: row.alt, caption: row.caption }]));
  } catch {
    return {};
  }
}

export async function fetchCatalog(): Promise<CatalogData> {
  const [categoryRows, productRows, media] = await Promise.all([
    rest<CategoryRow[]>("categories?select=id,slug,name,short_name,eyebrow,description&order=sort_order.asc,name.asc", { anonymous: true }),
    rest<ProductRow[]>(
      "products?select=id,slug,name,group_label,pack_size,price_inr,availability_note,description,details,featured,category:categories(slug),product_images(url,url_small,sort_order)&is_active=eq.true&order=sort_order.asc,name.asc",
      { anonymous: true },
    ),
    fetchMedia(),
  ]);
  const categories: Category[] = categoryRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name || row.name,
    eyebrow: row.eyebrow,
    description: row.description,
  }));
  const categoryOrder = new Map(categories.map((category, index) => [category.slug, index]));
  const products: Product[] = productRows
    .filter((row) => row.category)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      categorySlug: row.category!.slug,
      group: row.group_label,
      packSize: row.pack_size,
      priceInr: row.price_inr == null || row.price_inr === "" ? null : Number(row.price_inr),
      availabilityNote: row.availability_note ?? "",
      description: row.description ?? "",
      details: row.details ?? [],
      featured: row.featured,
      images:
        previewStudioPhotos(row.slug) ??
        (row.product_images ?? [])
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => ({ url: image.url, urlSmall: image.url_small })),
    }))
    .sort((a, b) => (categoryOrder.get(a.categorySlug) ?? 99) - (categoryOrder.get(b.categorySlug) ?? 99));
  // The storefront never shows a shelf without products (e.g. the emptied Millet Noodles & Pasta shelf, kept in the
  // database until it is removed in /admin). The admin loads its own full list, so it still sees and manages it.
  const stocked = categories.filter((category) => products.some((product) => product.categorySlug === category.slug));
  return { categories: stocked, products, media };
}

function readCache(): CatalogData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogData;
    return Array.isArray(parsed.products) && Array.isArray(parsed.categories) ? { ...parsed, media: parsed.media ?? {} } : null;
  } catch {
    return null;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ data: CatalogData; status: Status }>(() => {
    const cached = typeof window !== "undefined" ? readCache() : null;
    return cached ? { data: cached, status: "cached" } : { data: { categories: fallbackCategories, products: fallbackProducts, media: {} }, status: "fallback" };
  });

  const refresh = useCallback(async () => {
    try {
      const data = await fetchCatalog();
      setState({ data, status: "live" });
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        /* storage full or unavailable */
      }
    } catch {
      setState((current) => ({ ...current, status: current.status === "live" ? "live" : "error" }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<CatalogValue>(() => {
    const { categories, products, media } = state.data;
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    return {
      ...state.data,
      status: state.status,
      featured: products.filter((product) => product.featured),
      getProduct: (slug) => (slug ? bySlug.get(slug) : undefined),
      getCategory: (slug) => {
        if (!slug) return undefined;
        return categories.find((category) => category.slug === slug) ?? categories.find((category) => category.slug === legacyCategorySlugs[slug]);
      },
      getMedia: (key) => media[key],
      refresh,
    };
  }, [state, refresh]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}
