/**
 * Swappable site photos (not product photos). The store team replaces them in /admin → Site photos;
 * until then each slot shows its default below, or a branded placeholder when it has none.
 * Only real Re Workshop photos should go here — no stock or AI images.
 */

import { staticPhoto, type ProductPhoto } from "@/data/catalog";

export type MediaSlotKey = "hero-shelf" | "hero-plate" | "hero-glass" | "cafe-shelf" | "cafe-plate" | "menu-photo" | "farm";

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
    key: "hero-shelf",
    label: "Home · top, left photo",
    hint: "A grocery staple from the shelf. Portrait (4:5) works best.",
    fallback: staticPhoto("kodo-millet"),
    caption: "Kodo millet",
  },
  {
    key: "hero-plate",
    label: "Home · top, centre photo",
    hint: "A plated café dish, e.g. masala idli. Portrait (4:5) works best.",
    fallback: staticPhoto("kodo-halva-premix"),
    caption: "Kodo halwa",
  },
  {
    key: "hero-glass",
    label: "Home · top, right photo",
    hint: "A drink from the café. Portrait (4:5) works best.",
    fallback: staticPhoto("masala-sattu-cooler-premix"),
    caption: "Masala sattu cooler",
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
    label: "Home · Café · “from our grocery shelves”",
    hint: "Grains on the shelf or in the kitchen before cooking. Square works best.",
    fallback: staticPhoto("kodo-millet"),
    caption: "Nutrient-dense ancient grains",
  },
  {
    key: "cafe-plate",
    label: "Home · Café · “right before your eyes”",
    hint: "A freshly cooked café dish, e.g. masala idli. Square works best.",
    fallback: staticPhoto("kodo-upma-premix"),
    caption: "Fresh, steaming, nutritious meals",
  },
  {
    key: "menu-photo",
    label: "Home · Mindful Millet Menu",
    hint: "A dish or drink from the millet menu. Landscape (6:5) works best.",
    fallback: staticPhoto("masala-sattu-cooler-premix"),
    caption: "Masala sattu cooler",
  },
];

export const mediaSlotIndex = new Map(mediaSlots.map((slot) => [slot.key, slot]));

/** An uploaded site photo (one row of public.site_media). */
export type SiteMedia = { key: string; url: string; urlSmall: string | null; alt: string; caption: string };
