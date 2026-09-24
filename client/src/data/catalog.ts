/**
 * Re Workshop product catalogue.
 * Source of truth: "RE WORKSHOP ORGANIC FOOD STORE AND CAFE PRODUCT CATALOG" (client PDF).
 * Names, pack sizes, prices and descriptors are taken from that catalogue — do not add claims here.
 * Photos in /public/products were cropped from the same catalogue.
 */

export type CategorySlug = "grains-flours" | "spices-staples" | "snacks-premixes" | "pickles-honey";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Short label used on filter pills. */
  shortName: string;
  eyebrow: string;
  description: string;
  /** Product slug whose photo represents the shelf. */
  coverSlug: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  /** Sub-shelf inside a category, e.g. "Millets", "Aata". */
  group: string;
  packSize: string;
  priceInr: number;
  /** Descriptors printed in the client catalogue, e.g. "Stone milled", "Organic". */
  details: string[];
  /** false when the catalogue has no usable photo for this product. */
  hasImage: boolean;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    slug: "grains-flours",
    name: "The Grains & Flours",
    shortName: "Grains & flours",
    eyebrow: "Stone-milled ancestral wheats and millets",
    description: "Ancient millets, ancestral wheat aata, traditional rice, whole pulses and seeds.",
    coverSlug: "kodo-millet",
  },
  {
    slug: "spices-staples",
    name: "The Spices",
    shortName: "Spices, dals & oils",
    eyebrow: "Pounded, pressed and traditionally processed",
    description:
      "Unpolished dals, hand-pounded masalas, room-temperature wood-pressed oils, jaggery varieties, Himalayan pink salt and Adanshilpa poha.",
    coverSlug: "chai-masala",
  },
  {
    slug: "snacks-premixes",
    name: "Guilt-Free Snacks & Premixes",
    shortName: "Snacks & premixes",
    eyebrow: "Tea-time companions and quick healthy meals",
    description: "Mindfully baked tea-time companions, millet noodles and pasta, and quick healthy meal premixes.",
    coverSlug: "thekua",
  },
  {
    slug: "pickles-honey",
    name: "Pickles, Honey & Handmade",
    shortName: "Pickles & handmade",
    eyebrow: "From the same shelves",
    description: "Pickles, chatni, jungle honey, handmade soap and eco-friendly décor.",
    coverSlug: "mango-pickle",
  },
];

/** Old category URLs (/shop/<slug>) that must keep working. */
const legacyCategorySlugs: Record<string, CategorySlug> = {
  "grains-seeds": "grains-flours",
  "millets-flours": "grains-flours",
  "value-added": "snacks-premixes",
  "oils-spices": "spices-staples",
};

type Row = [slug: string, name: string, group: string, packSize: string, priceInr: number, details: string[], extra?: Partial<Product>];

const rows: Record<CategorySlug, Row[]> = {
  "grains-flours": [
    ["kodo-millet", "Kodo Millet", "Ancient millets", "500 g", 100, ["Organic"], { featured: true }],
    ["kutki-millet", "Kutki Millet", "Ancient millets", "500 g", 100, ["Organic"]],
    ["sama-millet", "Sama Millet", "Ancient millets", "500 g", 110, ["Organic"]],
    ["kangani-millet", "Kangani Millet", "Ancient millets", "500 g", 100, ["Organic"]],
    ["ragi-millet", "Ragi Millet", "Ancient millets", "500 g", 75, []],
    ["browntop-millet", "Browntop Millet", "Ancient millets", "250 g", 65, []],
    ["khapli-gehu-aata", "Khapli Gehu Aata", "Stone-milled aata", "1.3 kg", 260, ["Stone milled", "Organic"]],
    ["sharbati-gehu-aata", "Sharbati Gehu Aata", "Stone-milled aata", "1.3 kg", 124, ["Stone milled", "Organic"]],
    ["jwar-millet-aata", "Jwar Millet Aata", "Stone-milled aata", "500 g", 75, ["Stone milled"]],
    ["ragi-millet-aata", "Ragi Millet Aata", "Stone-milled aata", "500 g", 80, ["Stone milled"]],
    ["bajra-millet-aata", "Bajra Millet Aata", "Stone-milled aata", "500 g", 75, ["Stone milled"]],
    ["rajgira-aata", "Rajgira Aata", "Stone-milled aata", "250 g", 80, ["Stone milled"]],
    ["kuttu-aata", "Kuttu Aata", "Stone-milled aata", "250 g", 100, ["Stone milled"]],
    ["desi-chana-besan", "Desi Chana Besan", "Stone-milled aata", "500 g", 125, ["Stone milled", "Organic"]],
    ["desi-makka-aata", "Desi Makka Aata", "Stone-milled aata", "500 g", 50, ["Organic"]],
    ["kali-banga-tukda-rice", "Kali Banga Tukda Rice", "Traditional rice", "500 g", 90, ["Organic"], { hasImage: false }],
    ["desi-chana", "Desi Chana", "Whole grains & seeds", "500 g", 80, ["Organic"]],
    ["sabut-moong", "Sabut Moong", "Whole grains & seeds", "500 g", 120, ["Organic"]],
    ["sabut-kuttu", "Sabut Kuttu", "Whole grains & seeds", "250 g", 90, ["Organic"]],
    ["chia-seeds", "Chia Seeds", "Whole grains & seeds", "100 g", 80, []],
  ],
  "spices-staples": [
    ["arhar-dal", "Arhar Dal", "Unpolished dals", "500 g", 125, ["Stone milled", "Organic"], { featured: true }],
    ["moong-dal-chhilka", "Moong Dal Chhilka", "Unpolished dals", "500 g", 140, ["Stone milled", "Organic"]],
    ["chana-dal", "Chana Dal", "Unpolished dals", "500 g", 120, ["Stone milled", "Organic"]],
    ["haldi-powder", "Haldi Powder", "Hand-pounded masalas", "100 g", 80, ["Pounded masale"], { featured: true }],
    ["chat-masala", "Chat Masala", "Hand-pounded masalas", "100 g", 75, ["Pounded masale"]],
    ["biryani-masala", "Biryani Masala", "Hand-pounded masalas", "100 g", 125, ["Pounded masale"]],
    ["chai-masala", "Chai Masala", "Hand-pounded masalas", "100 g", 125, ["Pounded masale"]],
    ["desi-ghee", "Desi Ghee", "Ghee & wood-pressed oils", "500 ml", 1000, ["Desi cow’s bilona ghee"], { featured: true }],
    ["wood-pressed-mustard-oil", "Wood-Pressed Mustard Oil", "Ghee & wood-pressed oils", "1 L", 440, ["Wood pressed"]],
    ["wood-pressed-groundnut-oil", "Wood-Pressed Groundnut Oil", "Ghee & wood-pressed oils", "1 L", 465, ["Wood pressed"]],
    ["wood-pressed-sesame-oil", "Wood-Pressed Sesame Oil", "Ghee & wood-pressed oils", "500 ml", 440, ["Wood pressed"], { hasImage: false }],
    ["wood-pressed-coconut-oil", "Wood-Pressed Coconut Oil", "Ghee & wood-pressed oils", "500 ml", 450, ["Wood pressed"]],
    ["wood-pressed-castor-oil", "Wood-Pressed Castor Oil", "Ghee & wood-pressed oils", "500 ml", 450, ["Wood pressed"]],
    ["jaggery-granules", "Jaggery Granules", "Jaggery, salt & poha", "500 g", 90, ["Made with organic sugarcane"]],
    ["khandsari", "Khandsari", "Jaggery, salt & poha", "500 g", 100, ["Made with organic sugarcane"]],
    ["himalayan-pink-salt", "Himalayan Pink Salt", "Jaggery, salt & poha", "500 g", 70, []],
    ["adanshilpa-poha", "Adanshilpa Poha", "Jaggery, salt & poha", "200 g", 50, ["Product of Jharkhand"]],
  ],
  "snacks-premixes": [
    ["thekua", "Thekua – The Indian Cookies", "Tea-time companions", "100 g", 100, ["Made with khapli aata, jaggery & desi ghee"], { featured: true }],
    ["jwar-kodo-salty", "Jwar Kodo Salty", "Tea-time companions", "90 g", 75, ["Made with jwar, whole wheat & kodo"], { featured: true }],
    ["peri-cori-bite", "Peri-Cori Bite", "Tea-time companions", "100 g", 85, []],
    ["rose-awla-marbles", "Rose Awla Marbles", "Tea-time companions", "100 g", 100, []],
    ["marzipan-square", "Marzipan Square", "Tea-time companions", "500 g", 350, []],
    ["bajra-gond-laddu", "Bajra Gond Laddu", "Tea-time companions", "350 g", 350, []],
    ["millet-noodles", "Millet Noodles", "Millet noodles & pasta", "175 g", 120, ["Made with 50% kodo & 50% whole wheat"], { featured: true }],
    ["millet-pasta", "Millet Pasta", "Millet noodles & pasta", "175 g", 120, ["Made with 50% kodo & 50% whole wheat"]],
    ["gluten-free-spaghetti-noodles", "Gluten-Free Spaghetti / Noodles", "Millet noodles & pasta", "200 g", 130, ["Made with foxtail millet & rice"]],
    ["kodo-upma-premix", "Kodo Upma Premix", "Quick meal premixes", "150 g", 170, [], { featured: true }],
    ["kodo-masala-idly-premix", "Kodo Masala Idly Premix", "Quick meal premixes", "150 g", 150, []],
    ["kodo-halva-premix", "Kodo Halva Premix", "Quick meal premixes", "150 g", 150, []],
    ["adanshilpa-poha-premix", "Adanshilpa Poha Premix", "Quick meal premixes", "150 g", 75, []],
    ["masala-sattu-cooler-premix", "Masala Sattu Cooler Premix", "Quick meal premixes", "150 g", 150, []],
    ["jau-chana-sattu", "Jau Chana Sattu", "Quick meal premixes", "500 g", 150, ["Made with organic desi chana & barley"]],
  ],
  "pickles-honey": [
    ["mango-pickle", "Mango Pickle", "Pickles & chatni", "500 g", 350, []],
    ["lemon-pickle", "Lemon Pickle", "Pickles & chatni", "500 g", 350, []],
    ["nimbu-ki-khatti-mithi-chatni", "Nimbu Ki Khatti Mithi Chatni", "Pickles & chatni", "600 g", 380, []],
    ["jungle-honey", "Jungle Honey", "Honey & handmade", "250 g", 250, []],
    ["handmade-soap", "Handmade Soap", "Honey & handmade", "100 g", 100, []],
    ["ecofriendly-wall-decor", "Eco-Friendly Wall Décor", "Honey & handmade", "1 pc", 650, []],
  ],
};

export const products: Product[] = (Object.keys(rows) as CategorySlug[]).flatMap((categorySlug) =>
  rows[categorySlug].map(([slug, name, group, packSize, priceInr, details, extra]) => ({
    id: slug,
    slug,
    name,
    categorySlug,
    group,
    packSize,
    priceInr,
    details,
    hasImage: true,
    ...extra,
  })),
);

export const featuredProducts = products.filter((product) => product.featured);

const productIndex = new Map(products.map((product) => [product.slug, product]));

export function getProductBySlug(slug?: string) {
  return slug ? productIndex.get(slug) : undefined;
}

export function getCategoryBySlug(slug?: string) {
  if (!slug) return undefined;
  const resolved = (legacyCategorySlugs[slug] ?? slug) as CategorySlug;
  return categories.find((category) => category.slug === resolved);
}

export function getCategoryName(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug)?.shortName ?? "";
}

/** Responsive photo sources for a product, or null when the catalogue has no usable photo. */
export function productImage(product: Pick<Product, "slug" | "hasImage">) {
  if (!product.hasImage) return null;
  const base = `/products/${product.slug}`;
  return { src: `${base}-480.webp`, srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w`, width: 480, height: 400 };
}

export function formatInr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
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
  mapUrl: "https://maps.google.com/?q=Shop+No+1-2+opposite+Chief+Engineer+Office+Ridge+Road+South+Civil+Lines+Jabalpur+482001",
};
