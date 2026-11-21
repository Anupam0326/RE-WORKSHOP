/**
 * Swappable site photos (not product photos). The store team replaces them in /admin → Site photos;
 * until then each slot shows its default below, or a branded placeholder when it has none.
 * Only real Re Workshop photos should go here — no stock or AI images.
 */

import type { ProductPhoto } from "@/data/catalog";
import { sitePhoto } from "@/data/sitePhotos";

// The client asked for photos of the farm, the café, the store and every founder, so those slots exist even before
// the photos do (branded placeholder).
// 3 Nov 2026 (reviewer: "too cluttered"; Anupam: a standard hero): the home page opens on the shop front at night,
// then the café and the store side by side, then the farm. The menu-board hero, the farm's second photo and the
// café spread's dish photo are gone, so their slots are too (no uploads were lost: only story-today had one).
// 15 Nov 2026 (the reviewer's brief): the home first screen is a strip of photos the visitor swipes through, one idea
// each: the shop front, inside, the open kitchen, a dish, the shelves, the farm. The kitchen and the shelves have no
// photo yet, so those two are left out of the strip until the store uploads one here. The café page opens on a strip
// too (the room, the kitchen, something from the kitchen, then three dishes from the menu).
// 23 Oct 2026 (Anupam): one photo, one place. No slot is shown in two places and no photo is the default of two
// slots; farm photos show seed work only (sowing, soil, grain and oilseed crops, harvest), never vegetables.
export type MediaSlotKey =
  | "home-hero"
  | "home-cafe"
  | "home-kitchen"
  | "home-dish"
  | "home-shelves"
  | "home-watch"
  | "home-farm"
  | "cafe-intro"
  | "farm"
  | "farm-3"
  | "story-intro"
  | "story-today"
  | "cafe-shelf"
  | "cafe-kitchen"
  | "consult-portrait"
  | "founder-swati"
  | "founder-anshumala"
  | "founder-samay";

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
    key: "home-hero",
    label: "Home · first screen · photo 1: the shop front",
    hint: "The place as a visitor arrives: the shop front, ideally at dusk with the sign lit. Wide (16:10), at least 2000 px wide; the headline sits over its lower left, so keep that part calm.",
    fallback: sitePhoto("hero-store"),
    caption: "Re Workshop on Ridge Road, Jabalpur",
  },
  {
    key: "home-cafe",
    label: "Home · first screen · photo 2: inside",
    hint: "Inside, so a visitor sees both halves at once: the café tables and the store's shelves. Wide (16:10) works best; phones show the middle of it.",
    fallback: sitePhoto("hero-inside"),
    caption: "Inside Re Workshop: the café tables and the store's shelves",
  },
  {
    key: "home-kitchen",
    label: "Home · first screen · photo 3: the open kitchen (shown once you add a photo)",
    hint: "The open kitchen at work: someone cooking, seen from the café side. Wide (16:10). There is no kitchen photo yet, so this photo is skipped on the site until you upload one.",
    fallback: null,
    caption: "The open kitchen",
  },
  {
    key: "home-dish",
    label: "Home · first screen · photo 4: a dish",
    hint: "One dish from the kitchen, close up. Write the dish's name as the caption: it is shown under the headline while this photo is on screen.",
    fallback: sitePhoto("hero-dish"),
    caption: "Besan Cheela from our kitchen",
  },
  {
    key: "home-shelves",
    label: "Home · first screen · photo 5: the store's shelves (shown once you add a photo)",
    hint: "The store's shelves with the packs facing the camera, no other shop's products in view. Wide (16:10). Skipped on the site until you upload one.",
    fallback: null,
    caption: "The store's shelves",
  },
  {
    key: "home-watch",
    label: "Home · An Open kitchen panel · the kitchen",
    hint: "The open kitchen: the counter, the stove, someone cooking. Landscape (4:3). Shown at the top of the dark \"An Open kitchen\" panel, above \"Watch it cooking\".",
    fallback: sitePhoto("kitchen-counter"),
    caption: "Our open kitchen",
  },
  {
    key: "home-farm",
    label: "Home · first screen · photo 6: the farm",
    hint: "Seed work on the farm: a grain or oilseed crop, sowing, the harvest. No vegetables.",
    fallback: sitePhoto("hero-farm"),
    caption: "Mustard in flower on the farm",
  },
  {
    key: "cafe-intro",
    label: "Café page · photos · 1: the room",
    hint: "The café as a guest walks in: the room, the tables. Landscape (4:3) works best.",
    fallback: sitePhoto("cafe-inside"),
    caption: "The café on Ridge Road",
  },
  {
    key: "farm",
    label: "Home · the farm, full width",
    hint: "Seed work on the farm: sowing, tilled soil, a grain field, the harvest. No vegetables. Wide (16:9 or wider), shown edge to edge.",
    fallback: sitePhoto("seed-sowing-hand"),
    caption: "Sowing seed by hand",
  },
  {
    key: "farm-3",
    label: "Our story · Track your grain · farm",
    hint: "Shown in the farm layer of the grain tracker: sowing, the soil, a grain field. No vegetables. Landscape (16:10) works best.",
    fallback: sitePhoto("seed-furrows"),
    caption: "Sowing seed into furrows",
  },
  {
    key: "story-intro",
    label: "Our story · first screen",
    hint: "The farm at its best moment: the harvest, a ripe grain field. No vegetables. Wide (16:9 or wider) works best.",
    fallback: sitePhoto("seed-harvest"),
    caption: "Bringing in the harvest by hand",
  },
  {
    key: "story-today",
    label: "Our story · Re Workshop today",
    hint: "Today at Re Workshop: the store, the café or a dish from the kitchen. Landscape (4:3) works best.",
    fallback: sitePhoto("kitchen-bao-pocket"),
    caption: "Bao pockets from our kitchen",
  },
  {
    key: "cafe-shelf",
    label: "Café page · photos · 3: from the kitchen",
    hint: "Something made in the kitchen: bread out of the oven, grains in the pan, a dish being plated. Landscape (4:3) works best.",
    fallback: sitePhoto("cafe-ragi-bread"),
    caption: "Ragi bread from our kitchen",
  },
  {
    key: "cafe-kitchen",
    label: "Café page · photos · 2: the open kitchen",
    hint: "The open kitchen at work. Until there is a kitchen photo this shows a table in the café. Landscape (4:3) works best.",
    fallback: sitePhoto("cafe-corner"),
    caption: "A table in the café",
  },
  {
    key: "consult-portrait",
    label: "Home · free consultation · Dr. Swati",
    hint: "A second photo of Dr. Swati for the consultation card, different from her founder portrait on Our story (each photo appears in one place). Square, face clearly visible. Until one is uploaded the card shows the Re seal.",
    fallback: null,
    caption: "Dr. (Mrs.) Swati Chhajed",
  },
  ...(
    [
      ["founder-swati", "Dr. (Mrs.) Swati Chhajed"],
      ["founder-anshumala", "Mrs. Anshumala Dhagat"],
      ["founder-samay", "Mr. Samay Srivastava"],
    ] as const
  ).map(([key, name]) => ({
    key,
    label: `Our story · founders · ${name}`,
    hint: "A portrait, head and shoulders, in natural light: at the farm, in the kitchen or in the store. Square works best.",
    // Portraits of all three founders: Mrs. Anshumala and Mr. Samay (22 Oct 2026), Dr. Swati (26 Oct 2026).
    fallback: sitePhoto(key),
    caption: name,
  })),
];

export const mediaSlotIndex = new Map(mediaSlots.map((slot) => [slot.key, slot]));

/** An uploaded site photo (one row of public.site_media). */
export type SiteMedia = { key: string; url: string; urlSmall: string | null; alt: string; caption: string };
