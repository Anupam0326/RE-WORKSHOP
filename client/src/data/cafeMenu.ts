/**
 * The café menu (supplied 22 Oct 2026: 8 categories, 65 dishes and drinks, whole-rupee prices).
 * Source of truth: content/cafe-menu/reworkshop_cafe_menu.json, which also holds the editor's review notes.
 * cafeMenu.json is the customer copy made from it by `node scripts/cafe-menu.mjs` (review notes removed).
 * Never retype dishes or prices into components; never add descriptions, dietary labels or nutrition the menu
 * doesn't state.
 */

import type { ProductPhoto } from "@/data/catalog";
import { formatInr } from "@/data/catalog";
import { sitePhoto } from "@/data/sitePhotos";
import menu from "./cafeMenu.json";

export type MenuItem = { id: string; name: string; price: number; description: string | null };
export type MenuCategory = { id: string; name: string; parentSection?: string; items: MenuItem[] };

export const cafeMenu = menu as { name: string; currency: string; categories: MenuCategory[] };

const itemIndex = new Map(cafeMenu.categories.flatMap((category) => category.items.map((item) => [item.id, item] as const)));

export function menuItem(id: string) {
  return itemIndex.get(id);
}

/** "₹150": the menu's whole-rupee price, nothing added. */
export function menuPrice(price: number) {
  return formatInr(price);
}

/**
 * Dish photos: the café's own (the "NEW CAFE" folder, 22 Oct 2026). Named after their dish or matched by Anupam.
 * Photos from the older "Cafe" folder are not used: they are downloaded from recipe sites and stock libraries.
 * Each appears once, in the photo row on the café page (23 Oct 2026: one photo, one place), so the menu book itself
 * carries no thumbnails. The Besan Cheela photo is the home café spread's small photo (data/media.ts) instead.
 * Listed in the order the photo row shows them.
 */
const dishPhotoIds = [
  "millet-moong-roasty",
  "creamy-millet-pasta",
  "millet-dhokla-chaat",
  "ragi-bread-sandwich",
  "10-minute-millet-maggi",
  "raagi-mahua-rab-halwa",
] as const;

const photographed = new Set<string>(dishPhotoIds);

export function dishPhoto(id: string): ProductPhoto | null {
  return photographed.has(id) ? sitePhoto(`dish-${id}`) : null;
}

/** Dishes with a photo, in photo-row order (skips any dish no longer on the menu). */
export function photographedDishes() {
  return dishPhotoIds.map((id) => menuItem(id)).filter((item): item is MenuItem => Boolean(item));
}

/**
 * The eight dishes on the home page menu board, each with every grain its menu name or description names (where a
 * board would print a price). Only dishes that state their grain; a dish that leaves the menu drops off.
 */
const boardPicks: { id: string; grain: string }[] = [
  // The brief's highlights (idli, dosa, dhokla, kodo pasta, ragi bread sandwich, drinks) as they appear on the real
  // menu, plus two breakfasts; short names so each fits a line or two on the board, paired by length row by row.
  { id: "kodo-upma", grain: "kodo millet" },
  { id: "millet-thatte-idli", grain: "millet" },
  { id: "millet-dosa-roll", grain: "millet" },
  { id: "kuttu-khichdi", grain: "buckwheat" },
  { id: "creamy-millet-pasta", grain: "kodo millet, wheat" },
  { id: "ragi-bread-sandwich", grain: "ragi, wheat" },
  { id: "millet-dhokla-chaat", grain: "millet" },
  { id: "millet-ambli", grain: "millet" },
];

export function boardDishes() {
  return boardPicks.flatMap(({ id, grain }) => {
    const item = menuItem(id);
    return item ? [{ ...item, grain }] : [];
  });
}
