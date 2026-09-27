/**
 * Live catalogue from Supabase with an instant first paint:
 * 1) last good copy from localStorage, else the bundled PDF catalogue; 2) fresh data from the database.
 * The public site always reads anonymously, so products hidden by the admin never leak to shoppers.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fallbackCategories, fallbackProducts, legacyCategorySlugs, type Category, type Product } from "@/data/catalog";
import { rest } from "@/lib/supabase";

type Status = "fallback" | "cached" | "live" | "error";
type CatalogData = { categories: Category[]; products: Product[] };
type CatalogValue = CatalogData & {
  status: Status;
  featured: Product[];
  getProduct: (slug?: string) => Product | undefined;
  getCategory: (slug?: string) => Category | undefined;
  refresh: () => Promise<void>;
};

const CACHE_KEY = "rw-catalog-v1";
const CatalogContext = createContext<CatalogValue | null>(null);

type CategoryRow = { id: string; slug: string; name: string; short_name: string; eyebrow: string; description: string };
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  group_label: string;
  pack_size: string;
  price_inr: number | string;
  description: string;
  details: string[] | null;
  featured: boolean;
  category: { slug: string } | null;
  product_images: { url: string; url_small: string | null; sort_order: number }[] | null;
};

export async function fetchCatalog(): Promise<CatalogData> {
  const [categoryRows, productRows] = await Promise.all([
    rest<CategoryRow[]>("categories?select=id,slug,name,short_name,eyebrow,description&order=sort_order.asc,name.asc", { anonymous: true }),
    rest<ProductRow[]>(
      "products?select=id,slug,name,group_label,pack_size,price_inr,description,details,featured,category:categories(slug),product_images(url,url_small,sort_order)&is_active=eq.true&order=sort_order.asc,name.asc",
      { anonymous: true },
    ),
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
      priceInr: Number(row.price_inr),
      description: row.description ?? "",
      details: row.details ?? [],
      featured: row.featured,
      images: (row.product_images ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => ({ url: image.url, urlSmall: image.url_small })),
    }))
    .sort((a, b) => (categoryOrder.get(a.categorySlug) ?? 99) - (categoryOrder.get(b.categorySlug) ?? 99));
  return { categories, products };
}

function readCache(): CatalogData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogData;
    return Array.isArray(parsed.products) && Array.isArray(parsed.categories) ? parsed : null;
  } catch {
    return null;
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ data: CatalogData; status: Status }>(() => {
    const cached = typeof window !== "undefined" ? readCache() : null;
    return cached ? { data: cached, status: "cached" } : { data: { categories: fallbackCategories, products: fallbackProducts }, status: "fallback" };
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
    const { categories, products } = state.data;
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
