/**
 * "Track your grain" (22 Oct 2026): pick a grain from the shelves and dig down from the pack to the seed it grew from.
 * It replaced the dish tracer ("pick a plate") so Our story tells the soil-to-plate journey once, per real product.
 *
 * Truth rule: product-specific facts come only from the store team (products.origin, edited in /admin → Products →
 * "Seed and origin") or from the product's own label data. Everything else shown is the brief's description of how
 * Re Workshop farms and processes, and the page labels it as such ("How we work"). Never invent a farm, village,
 * season or seed source here.
 */

import type { Product } from "@/data/catalog";

/** Keys stored in products.origin (jsonb). All optional, plain text. */
export type OriginKey = "seed_variety" | "seed_source" | "grown_at" | "farming" | "season" | "processing" | "note";
export type ProductOrigin = Partial<Record<OriginKey, string>>;

/** The admin form: one field per key, in the order a visitor reads them (seed first, as the store team thinks of it). */
/** `label` and `hint` are for the admin form; `shown` is the short label on the product page. */
export const originFields: { key: OriginKey; label: string; shown: string; hint: string; max: number }[] = [
  { key: "seed_variety", shown: "Seed variety", label: "Seed variety", hint: "The variety of seed, e.g. “Desi kodo, a native unhybridized variety”.", max: 160 },
  { key: "seed_source", shown: "Seed from", label: "Where the seed came from", hint: "e.g. “Saved from our own last harvest” or “From a seed bank in …”.", max: 160 },
  { key: "grown_at", shown: "Grown at", label: "Where it was grown", hint: "Farm or village and district, e.g. “Our farm in … village, Jabalpur district”.", max: 160 },
  { key: "farming", shown: "Grown with", label: "How it was grown", hint: "e.g. “Amrit Krishi, fed with Amrit Mitti, no chemicals”.", max: 160 },
  { key: "season", shown: "Sown and harvested", label: "When it was sown and harvested", hint: "e.g. “Sown in July, harvested in October 2026”.", max: 160 },
  { key: "processing", shown: "Processed", label: "How it was processed", hint: "e.g. “Sun-dried, stone-cleaned, unpolished” or “Stone-milled on a chakki”.", max: 160 },
  { key: "note", shown: "Note", label: "Anything else worth knowing", hint: "A short note shown at the end of the track.", max: 300 },
];

/** Reads products.origin from the database, keeping only known keys with text in them. */
export function readOrigin(value: unknown): ProductOrigin {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const origin: ProductOrigin = {};
  for (const { key } of originFields) {
    const text = (value as Record<string, unknown>)[key];
    if (typeof text === "string" && text.trim()) origin[key] = text.trim();
  }
  return origin;
}

export function hasOrigin(product: Pick<Product, "origin">) {
  return Boolean(product.origin && Object.keys(product.origin).length);
}

/**
 * Track your grain offers exactly these three options (client, 28 Oct 2026), with these labels. "Moong" is Whole
 * Moong (sabut-moong, Anupam). Everywhere the tracker is offered (the tracker's picker, the home "Pick a grain" row,
 * a product page's "Track this grain") reads this list; no other product can be tracked.
 */
export const trackOptions: { slug: string; label: string }[] = [
  { slug: "khapli-gehu-aata", label: "Khapli Gehu Aata" },
  { slug: "kodo-millet", label: "Kodo" },
  { slug: "sabut-moong", label: "Moong" },
];

const trackSlugs = new Set(trackOptions.map((option) => option.slug));

export function isTrackable(product: Pick<Product, "slug">) {
  return trackSlugs.has(product.slug);
}

/** The pack's own label says how it was processed (e.g. "Stone milled"); used when the store team has not. */
export function labelProcessing(product: Product) {
  const stoneMilled = product.details.some((label) => /stone[- ]milled/i.test(label));
  return stoneMilled ? "Stone-milled, as its label says." : "";
}

/* A product page can ask Our story to open the tracker on its grain. */
let pending: string | null = null;

export function requestTrack(slug: string) {
  pending = slug;
}

export function takeTrackRequest() {
  const slug = pending;
  pending = null;
  return slug;
}
