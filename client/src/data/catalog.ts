/**
 * Re Workshop catalogue — types, helpers and the bundled fallback catalogue.
 *
 * Live products and categories are managed by the store team in Supabase (see /admin) and loaded by
 * CatalogProvider. The data below mirrors the database at the last content update; it is used only as an
 * instant first paint and as a fallback when the database can't be reached. Nothing on the site reads a
 * hard-coded product list — shelves, filters, search and featured items all come from the catalogue.
 */

export type CategorySlug = string;

export type Category = {
  id?: string;
  slug: CategorySlug;
  name: string;
  /** Short label used on filter pills. */
  shortName: string;
  eyebrow: string;
  description: string;
  /** Optional product slug whose photo represents the shelf (fallback catalogue only). */
  coverSlug?: string;
};

export type ProductPhoto = { url: string; urlSmall?: string | null };

export type Product = {
  /** Database id (uuid) for live products, slug for the bundled fallback. */
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  /** Sub-shelf inside a category, e.g. "Nutrient-dense ancient grains". */
  group: string;
  /** Quantity / pack size, e.g. "500 g". Empty when not confirmed yet. */
  packSize: string;
  /** Price in rupees, or null for "price on request" (newly listed items without a confirmed price). */
  priceInr: number | null;
  description: string;
  /** Short labels, e.g. "Stone milled", "Organic". */
  details: string[];
  /** Up to 5 photos; the first is the cover. */
  images: ProductPhoto[];
  featured?: boolean;
  /** Short availability badge, e.g. "Winter only". Empty when always available. */
  availabilityNote?: string;
};

/**
 * Bundled copy of the store catalogue (mirrors the Supabase data at the last update).
 * Live data always wins; this is only the instant first paint and the offline fallback.
 */
export const fallbackCategories: Category[] = [
  {
    slug: "grains-flours",
    name: "The Grains & Flours",
    shortName: "Grains & flours",
    eyebrow: "Nutrient-dense ancient grains, stone-milled the slow way",
    description: "Nutrient-dense ancient grains, stone-milled aata and sattu, traditional rice, whole pulses and seeds.",
    coverSlug: "kodo-millet",
  },
  {
    slug: "spices-staples",
    name: "Dals, Oils & Pantry Staples",
    shortName: "Dals, oils & staples",
    eyebrow: "Unpolished, wood-pressed and traditionally processed",
    description:
      "Unpolished dals, Haldi (turmeric), desi ghee, room-temperature wood-pressed oils, Jaggery Granules, Khandasari, Himalayan pink salt and Adanshilpa poha.",
    coverSlug: "arhar-dal",
  },
  {
    slug: "snacks-premixes",
    name: "Guilt-Free Snacks & Premixes",
    shortName: "Snacks & premixes",
    eyebrow: "Tea-time companions and quick healthy meals",
    description: "Mindfully baked tea-time companions and quick healthy meal premixes.",
    coverSlug: "thekua",
  },
  {
    slug: "noodles-pasta",
    name: "Millet Noodles & Pasta",
    shortName: "Noodles & pasta",
    eyebrow: "Everyday comfort food, made with millets",
    description: "Millet noodles, millet pasta and gluten-free spaghetti, made with kodo or foxtail millet.",
    coverSlug: "millet-noodles",
  },
  {
    slug: "pickles-honey",
    name: "Pickles, Honey & Handmade Soaps",
    shortName: "Pickles, honey & soaps",
    eyebrow: "From the same shelves",
    description: "Pickles and chatni, Jungle Honey, handmade soaps and eco-friendly décor.",
    coverSlug: "jungle-honey",
  },
];

/** Old category URLs (/shop/<slug>) that must keep working. */
export const legacyCategorySlugs: Record<string, CategorySlug> = {
  "grains-seeds": "grains-flours",
  "millets-flours": "grains-flours",
  "value-added": "snacks-premixes",
  "oils-spices": "spices-staples",
  spices: "spices-staples",
  noodles: "noodles-pasta",
};

type Row = [slug: string, name: string, group: string, packSize: string, priceInr: number | null, details: string[], extra?: { featured?: boolean; availability?: string }];

/**
 * Products with no real photo yet: they show the branded placeholder until the store uploads one in /admin.
 * Pickles and masala idli: the client asked for new photos. Flours, dals and castor oil: stock-looking images retired.
 */
const withoutPhoto = new Set([
  "kali-banga-tukda-rice",
  "black-whole-moong",
  "flax-seeds",
  "haldi-powder",
  "wood-pressed-sesame-oil",
  "mango-pickle",
  "lemon-pickle",
  "nimbu-ki-khatti-mithi-chatni",
  "kodo-masala-idly-premix",
  "bajra-millet-aata",
  "chana-dal",
  "desi-chana-besan",
  "jwar-millet-aata",
  "khapli-gehu-aata",
  "kuttu-aata",
  "moong-dal-chhilka",
  "ragi-millet-aata",
  "rajgira-aata",
  "sharbati-gehu-aata",
  "wood-pressed-castor-oil",
]);

const rows: Record<string, Row[]> = {
  "grains-flours": [
    ["kodo-millet", "Kodo Millet", "Nutrient-dense ancient grains", "500g", 270, []],
    ["ragi-millet", "Ragi Millet", "Nutrient-dense ancient grains", "500 g", 75, []],
    ["kutki-millet", "Kutki Millet", "Nutrient-dense ancient grains", "500 g", 100, ["Organic"]],
    ["sama-millet", "Sama Millet", "Nutrient-dense ancient grains", "500 g", 110, ["Organic"]],
    ["kangani-millet", "Kangani Millet", "Nutrient-dense ancient grains", "500 g", 100, ["Organic"]],
    ["sharbati-gehu-aata", "Sharbati Gehu Aata", "Stone-milled aata", "1.3 kg", 124, ["Stone milled", "Organic"]],
    ["browntop-millet", "Browntop Millet", "Nutrient-dense ancient grains", "250 g", 65, []],
    ["khapli-gehu-aata", "Khapli Gehu Aata", "Stone-milled aata", "1.3 kg", 260, ["Stone milled", "Organic"]],
    ["jwar-millet-aata", "Jwar Millet Aata", "Stone-milled aata", "500 g", 75, ["Stone milled"]],
    ["ragi-millet-aata", "Ragi Millet Aata", "Stone-milled aata", "500 g", 80, ["Stone milled"]],
    ["bajra-millet-aata", "Bajra Millet Aata", "Stone-milled aata", "500 g", 75, ["Stone milled"]],
    ["rajgira-aata", "Rajgira Aata", "Stone-milled aata", "250 g", 80, ["Stone milled"]],
    ["kuttu-aata", "Kuttu Aata", "Stone-milled aata", "250 g", 100, ["Stone milled"]],
    ["desi-chana-besan", "Desi Chana Besan", "Stone-milled aata", "500 g", 125, ["Stone milled", "Organic"]],
    ["desi-makka-aata", "Desi Makka Aata", "Stone-milled aata", "500 g", 50, ["Organic"]],
    ["jau-chana-sattu", "Jau Chana Sattu", "Sattu", "500 g", 150, ["Made with organic desi chana & barley"]],
    ["kali-banga-tukda-rice", "Kali Banga Tukda Rice", "Traditional rice", "500 g", 90, ["Organic"]],
    ["desi-chana", "Desi Chana", "Whole pulses", "500 g", 80, ["Organic"]],
    ["sabut-moong", "Whole Moong", "Whole pulses", "500 g", 120, ["Organic"]],
    ["black-whole-moong", "Black Whole Moong", "Whole pulses", "", null, []],
    ["chia-seeds", "Chia Seeds", "Seeds", "100 g", 80, []],
    ["flax-seeds", "Flax Seeds", "Seeds", "", null, []],
    ["sabut-kuttu", "Sabut Kuttu", "Nutrient-dense ancient grains", "250 g", 90, ["Organic"]],
  ],
  "spices-staples": [
    ["arhar-dal", "Arhar Dal", "Unpolished dals", "500 g", 125, ["Stone milled", "Organic"], { featured: true }],
    ["moong-dal-chhilka", "Moong Dal Chhilka", "Unpolished dals", "500 g", 140, ["Stone milled", "Organic"]],
    ["chana-dal", "Chana Dal", "Unpolished dals", "500 g", 120, ["Stone milled", "Organic"]],
    ["haldi-powder", "Haldi (Turmeric) Powder", "Haldi (turmeric)", "100 g", 80, []],
    ["desi-ghee", "Desi Ghee", "Ghee & wood-pressed oils", "500 ml", 1000, ["Desi cow’s bilona ghee"], { featured: true }],
    ["wood-pressed-mustard-oil", "Wood-Pressed Mustard Oil", "Ghee & wood-pressed oils", "1 L", 440, ["Wood pressed"]],
    ["wood-pressed-groundnut-oil", "Wood-Pressed Groundnut Oil", "Ghee & wood-pressed oils", "1 L", 465, ["Wood pressed"]],
    ["wood-pressed-sesame-oil", "Wood-Pressed Sesame Oil", "Ghee & wood-pressed oils", "500 ml", 440, ["Wood pressed"]],
    ["wood-pressed-coconut-oil", "Wood-Pressed Coconut Oil", "Ghee & wood-pressed oils", "500 ml", 450, ["Wood pressed"]],
    ["wood-pressed-castor-oil", "Wood-Pressed Castor Oil", "Ghee & wood-pressed oils", "500 ml", 450, ["Wood pressed"]],
    ["jaggery-granules", "Jaggery Granules", "Jaggery & Khandasari", "500 g", 90, ["Made with organic sugarcane"]],
    ["khandsari", "Khandasari", "Jaggery & Khandasari", "500 g", 100, ["Made with organic sugarcane"]],
    ["himalayan-pink-salt", "Himalayan Pink Salt", "Salt & poha", "500 g", 70, []],
    ["adanshilpa-poha", "Adanshilpa Poha", "Salt & poha", "200 g", 50, ["Product of Jharkhand"]],
  ],
  "snacks-premixes": [
    ["thekua", "Baked Thekuas – The Indian Cookies", "Tea-time companions", "100 g", 100, ["Baked, not fried", "Made with khapli aata, jaggery & desi ghee"], { featured: true }],
    ["jwar-kodo-salty", "Jwar Kodo Salty", "Tea-time companions", "90 g", 75, ["Made with jwar, whole wheat & kodo"], { featured: true }],
    ["peri-cori-bite", "Peri-Cori Bite", "Tea-time companions", "100 g", 85, []],
    ["rose-awla-marbles", "Rose Awla Marbles", "Tea-time companions", "100 g", 100, []],
    ["marzipan-square", "Marzipan Square", "Tea-time companions", "500 g", 350, []],
    ["bajra-gond-laddu", "Bajra Gond Laddu", "Tea-time companions", "350 g", 350, [], { availability: "Winter only" }],
    ["kodo-upma-premix", "Kodo Upma Premix", "Quick meal premixes", "150 g", 170, [], { featured: true }],
    ["kodo-masala-idly-premix", "Kodo Masala Idly Premix", "Quick meal premixes", "150 g", 150, []],
    ["kodo-halva-premix", "Kodo Halva Premix", "Quick meal premixes", "150 g", 150, []],
    ["adanshilpa-poha-premix", "Adanshilpa Poha Premix", "Quick meal premixes", "150 g", 75, []],
    ["masala-sattu-cooler-premix", "Masala Sattu Cooler Premix", "Quick meal premixes", "150 g", 150, []],
  ],
  "noodles-pasta": [
    ["millet-noodles", "Millet Noodles", "Millet noodles & pasta", "175 g", 120, ["Made with 50% kodo & 50% whole wheat"], { featured: true }],
    ["millet-pasta", "Millet Pasta", "Millet noodles & pasta", "175 g", 120, ["Made with 50% kodo & 50% whole wheat"]],
    ["gluten-free-spaghetti-noodles", "Gluten-Free Spaghetti / Noodles", "Millet noodles & pasta", "200 g", 130, ["Made with foxtail millet & rice"]],
  ],
  "pickles-honey": [
    ["mango-pickle", "Mango Pickle", "Pickles & chatni", "500 g", 350, []],
    ["lemon-pickle", "Lemon Pickle", "Pickles & chatni", "500 g", 350, []],
    ["nimbu-ki-khatti-mithi-chatni", "Nimbu Ki Khatti Mithi Chatni", "Pickles & chatni", "600 g", 380, []],
    ["jungle-honey", "Jungle Honey", "Honey", "250 g", 250, []],
    ["handmade-soap", "Handmade Soap", "Handmade soaps", "100 g", 100, []],
    ["ecofriendly-wall-decor", "Eco-Friendly Wall Décor", "Eco-friendly décor", "1 pc", 650, []],
  ],
};

const descriptions: Record<string, string> = {
  "sabut-moong": "Sabut moong — whole green moong, not split.",
  "black-whole-moong": "Whole black moong, not split.",
};

/** The bundled /products/<slug>-960.webp photo pair. */
export function staticPhoto(slug: string): ProductPhoto {
  return { url: `/products/${slug}-960.webp`, urlSmall: `/products/${slug}-480.webp` };
}

export const fallbackProducts: Product[] = Object.keys(rows).flatMap((categorySlug) =>
  rows[categorySlug].map(([slug, name, group, packSize, priceInr, details, extra]) => ({
    id: slug,
    slug,
    name,
    categorySlug,
    group,
    packSize,
    priceInr,
    description: descriptions[slug] ?? "",
    details,
    images: withoutPhoto.has(slug) ? [] : [staticPhoto(slug)],
    featured: extra?.featured ?? false,
    availabilityNote: extra?.availability ?? "",
  })),
);

const fallbackIndex = new Map(fallbackProducts.map((product) => [product.slug, product]));

/** A product from the bundled catalogue (used for shelf covers when the live catalogue has no photo). */
export function getStaticProduct(slug: string) {
  return fallbackIndex.get(slug);
}

/** Responsive sources for one of a product's photos, or null when it has none. */
export function productImage(product: Pick<Product, "images">, index = 0) {
  const photo = product.images[index];
  if (!photo) return null;
  const srcSet = photo.urlSmall ? `${photo.urlSmall} 480w, ${photo.url} 960w` : undefined;
  return { src: photo.urlSmall ?? photo.url, srcSet, width: 480, height: 400 };
}

export function formatInr(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export const PRICE_ON_REQUEST = "Price on request";

/** Display price for a product: "₹120", or "Price on request" when no price is set. */
export function formatPrice(value: number | null | undefined) {
  return value == null ? PRICE_ON_REQUEST : formatInr(value);
}

export const storeInfo = {
  name: "Re Workshop",
  tagline: "Organic Food Store & Café",
  addressLines: ["Shop No. 1–2, opposite Chief Engineer Office", "Ridge Road, South Civil Lines", "Jabalpur 482001"],
  address: "Shop No. 1–2, opposite Chief Engineer Office, Ridge Road, South Civil Lines, Jabalpur 482001",
  phones: [
    { display: "96915 55728", tel: "+919691555728" },
    { display: "93730 05077", tel: "+919373005077" },
  ],
  phoneDisplay: "96915 55728 · 93730 05077",
  email: "kalgodimahilasamooh@gmail.com",
  instagram: "https://www.instagram.com/re.workshop_organic/",
  mapUrl: "https://maps.app.goo.gl/4bGAHXvCBMfjsaHMA?g_st=aw",
};
