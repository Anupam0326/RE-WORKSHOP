/**
 * The café menu (supplied 22 Oct 2026: 8 categories, 65 dishes and drinks, whole-rupee prices).
 * Source of truth: content/cafe-menu/reworkshop_cafe_menu.json, which also holds the editor's review notes.
 * cafeMenu.json is the customer copy made from it by `node scripts/cafe-menu.mjs` (review notes removed).
 * Never retype dishes or prices into components; never add descriptions, dietary labels or nutrition the menu
 * doesn't state.
 */

import type { ProductPhoto } from "@/data/catalog";
import { formatInr } from "@/data/catalog";
import { sitePhoto, type SitePhotoName } from "@/data/sitePhotos";
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
 * Each appears once (23 Oct 2026: one photo, one place). 15 Nov 2026 (the reviewer's brief: a swipeable strip of photos
 * at the top of the café page, some of them food): three dishes are in that strip and three stay in the row above the
 * menu. The Besan Cheela photo is on the home first screen instead (components/home/Hero.tsx).
 */
const stripDishIds = ["ragi-bread-sandwich", "creamy-millet-pasta", "millet-dhokla-chaat"] as const;
const rowDishIds = ["millet-moong-roasty", "10-minute-millet-maggi", "raagi-mahua-rab-halwa"] as const;

const photographed = new Set<string>([...stripDishIds, ...rowDishIds]);

export function dishPhoto(id: string): ProductPhoto | null {
  return photographed.has(id) ? sitePhoto(`dish-${id}` as SitePhotoName) : null;
}

const onMenu = (ids: readonly string[]) => ids.map((id) => menuItem(id)).filter((item): item is MenuItem => Boolean(item));

/** Dishes shown in the photo strip at the top of the café page (skips any dish no longer on the menu). */
export function stripDishes() {
  return onMenu(stripDishIds);
}

/** Dishes pictured in the row above the menu: a full row of three, or none (grid rule: rows are always full). */
export function rowDishes() {
  const dishes = onMenu(rowDishIds);
  return dishes.length >= 3 ? dishes.slice(0, 3) : [];
}

/** The menu section a dish belongs to. */
export function categoryOf(itemId: string) {
  return cafeMenu.categories.find((category) => category.items.some((item) => item.id === itemId));
}
