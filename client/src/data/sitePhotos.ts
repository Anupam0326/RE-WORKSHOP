/**
 * The client's own photos of the store, café and farm (Reworkshop Image Bank on Drive, received 22 Oct 2026) and two
 * founder portraits (sent by Anupam 22 Oct 2026: Mrs. Anshumala Dhagat and Mr. Samay Srivastava) and the café's dish
 * photos (the "NEW CAFE" folder, 22 Oct 2026), bundled
 * in client/public/site/ as <name>-1600.webp and <name>-800.webp (cropped, watermark trimmed; real widths below because
 * some originals are smaller than 1600 px). They are the defaults of the site photo slots (data/media.ts); the store
 * team can replace any of them in /admin → Site photos. Never put stock or generated images here.
 * 23 Oct 2026 (Anupam): each photo appears in one place on the whole site, and farm photos show seed work only
 * (sowing, soil, grain and oilseed crops, harvest), never vegetables or the gaushala.
 */

import type { ProductPhoto } from "@/data/catalog";

const widths: Record<string, [number, number]> = {
  // Café and store (Store Images); one photo per place.
  "cafe-corner": [1560, 800],
  "cafe-inside": [1560, 800],
  "cafe-ragi-bread": [958, 800],
  "cafe-room": [1158, 800],
  "kitchen-bao-pocket": [1200, 800],
  "store-front": [1600, 800],
  // The farm (Farm Images, 23 Oct 2026): seed work only, no vegetables.
  "seed-furrows": [1280, 800],
  "seed-grain-field": [960, 800],
  "seed-harvest": [1600, 800],
  "seed-mustard": [960, 800],
  "seed-sowing": [768, 768],
  "seed-sowing-hand": [1280, 800],
  "seed-young-crop": [768, 768],
  // Founders (Our story only). Dr. Swati's received 26 Oct 2026, cropped head and shoulders like the other two.
  "founder-swati": [720, 600],
  "founder-anshumala": [1200, 600],
  "founder-samay": [1200, 600],
  // Café dishes (data/cafeMenu.ts), square crops of the café's own photos.
  "dish-10-minute-millet-maggi": [960, 480],
  "dish-besan-cheela": [960, 480],
  "dish-creamy-millet-pasta": [960, 480],
  "dish-millet-dhokla-chaat": [960, 480],
  "dish-millet-moong-roasty": [960, 480],
  "dish-raagi-mahua-rab-halwa": [719, 480],
  "dish-ragi-bread-sandwich": [960, 480],
};

export type SitePhotoName = keyof typeof widths;

export function sitePhoto(name: SitePhotoName): ProductPhoto {
  const [width, widthSmall] = widths[name];
  return { url: `/site/${name}-1600.webp`, urlSmall: `/site/${name}-800.webp`, width, widthSmall };
}
