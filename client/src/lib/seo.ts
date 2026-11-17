/**
 * Page titles and descriptions for search (18 Nov 2026: written for Jabalpur searches about organic food).
 * The words live in data/seo.json, which scripts/seo-build.mjs also reads at build time to give every page its own
 * <title>, description, canonical and share tags in the HTML the server sends, plus sitemap.xml and llms.txt.
 * Change a title there, not here.
 */

import seo from "@/data/seo.json";

type Meta = { title: string; description: string };
type StaticPath = keyof typeof seo.pages;

export const SITE_URL = seo.site;

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");

/** "The Grains & Flours" → "Grains & Flours" for titles. */
const plainName = (name: string) => name.replace(/^The\s+/, "");

export function pageMeta(path: StaticPath): Meta {
  return seo.pages[path];
}

export function categoryMeta(category: { slug: string; name: string; description: string }): Meta {
  const own = (seo.categories as Record<string, { title?: string; description?: string }>)[category.slug] ?? {};
  const values = { name: plainName(category.name), description: category.description.trim() };
  return { title: own.title ?? fill(seo.category.title, values), description: own.description ?? fill(seo.category.description, values) };
}

export function productMeta(product: { name: string; packSize?: string | null; description?: string | null }): Meta {
  const about = product.description?.trim() ? ` ${product.description.trim().slice(0, 140)}` : "";
  const values = { name: product.name, pack: product.packSize ? ` (${product.packSize})` : "", about };
  return { title: fill(seo.product.title, values), description: fill(seo.product.description, values) };
}
