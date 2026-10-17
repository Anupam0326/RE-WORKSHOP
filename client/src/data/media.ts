/**
 * Swappable site photos (not product photos). The store team replaces them in /admin → Site photos;
 * until then each slot shows its default below, or a branded placeholder when it has none.
 * Only real Re Workshop photos should go here — no stock or AI images.
 */

import { staticPhoto, studioPhoto, type ProductPhoto } from "@/data/catalog";

export type MediaSlotKey = "hero-main" | "hero-shelf" | "hero-plate" | "hero-glass" | "hero-grain" | "cafe-shelf" | "cafe-plate" | "menu-photo" | "farm";

export type MediaSlot = {
  key: MediaSlotKey;
  /** Where the photo appears (admin only). */
  label: string;
  /** What kind of photo works best (admin only). */
  hint: string;
  /** Default photo until the store uploads one; null shows the branded placeholder. */
  fallback: ProductPhoto | null;
  /** Short caption shown with the photo; the store can change it with the photo. */
  caption: string;
};

export const mediaSlots: MediaSlot[] = [
  {
    key: "hero-main",
    label: "Home · top · centre product",
    hint: "One product on a plain white background, shown large in the middle. Square works best.",
    fallback: studioPhoto("kodo-millet", 1),
    caption: "Kodo millet",
  },
  {
    key: "hero-shelf",
    label: "Home · top · tilted photo, top left",
    hint: "A grocery staple from the shelf. Square works best.",
    fallback: studioPhoto("kodo-millet", 3),
    caption: "Kodo millet",
  },
  {
    key: "hero-plate",
    label: "Home · top · tilted photo, top right",
    hint: "A café dish or a premix. Square works best.",
    fallback: studioPhoto("kodo-halva-premix", 3),
    caption: "Kodo halva premix",
  },
  {
    key: "hero-glass",
    label: "Home · top · tilted photo, bottom right",
    hint: "A drink from the café. Square works best.",
    fallback: staticPhoto("masala-sattu-cooler-premix"),
    caption: "Masala sattu cooler",
  },
  {
    key: "hero-grain",
    label: "Home · top · tilted photo, bottom left",
    hint: "Another staple from the shelf. Square works best.",
    fallback: studioPhoto("jaggery-granules", 3),
    caption: "Jaggery granules",
  },
  {
    key: "farm",
    label: "Home · Soil-to-Plate · the farm",
    hint: "Your own farm: the fields, desi cows, Amrit Mitti being made. Landscape (16:10) works best.",
    fallback: null,
    caption: "Our Amrit Krishi farm",
  },
  {
    key: "cafe-shelf",
    label: "Home · Café · open kitchen",
    hint: "Grains on the shelf or in the kitchen before cooking. Square works best.",
    fallback: studioPhoto("kutki-millet", 3),
    caption: "Nutrient-dense ancient grains",
  },
  {
    key: "cafe-plate",
    label: "Home · Café · live transformation",
    hint: "A freshly cooked café dish, e.g. masala idli. Square works best.",
    fallback: studioPhoto("kodo-upma-premix", 3),
    caption: "Fresh, steaming, nutritious meals",
  },
  {
    key: "menu-photo",
    label: "Home · Café · millet menu",
    hint: "A dish or drink from the millet menu. Square works best.",
    fallback: staticPhoto("masala-sattu-cooler-premix"),
    caption: "Masala sattu cooler",
  },
];

export const mediaSlotIndex = new Map(mediaSlots.map((slot) => [slot.key, slot]));

/** An uploaded site photo (one row of public.site_media). */
export type SiteMedia = { key: string; url: string; urlSmall: string | null; alt: string; caption: string };
