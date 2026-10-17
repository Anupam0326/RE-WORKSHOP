/**
 * "Every plate has roots": everyday dishes a visitor can trace from the plate back down to the soil.
 *
 * Every line here comes from the client brief or from product labels in the catalogue. Do not add
 * sourcing, nutrition or health claims the client has not confirmed. Products are referenced by slug and
 * resolved against the live catalogue, so a dish quietly drops a product that is no longer listed.
 */

export type TraceDish = {
  id: string;
  /** Short label on the dish picker. */
  label: string;
  /** Name shown on the plate. */
  name: string;
  plate: string;
  kitchen: string;
  mill: string;
  /** The brief processing method this dish uses, highlighted at the mill (must match loop.steps[2].methods). */
  method?: string;
  seed: string;
  /** The brief focus area this dish's grain belongs to, highlighted in the seed layer (must match a focus label). */
  focus: string;
  /** Optional extra line in the soil layer. */
  soil?: string;
  /** Catalogue slug whose photo sits on the plate. Without one, the plate shows the Re Workshop seal. */
  photo?: string;
  /** Catalogue slugs linked as "on our shelves". */
  products: string[];
};

const kodoMill = "Kodo is processed with slow, non-destructive heritage methods that protect its nutrition.";
const kodoSeed = "Kodo: a nutrient-dense ancient grain, grown from native, unhybridized seed.";

export const traceDishes: TraceDish[] = [
  {
    id: "roti",
    label: "Everyday roti",
    name: "Roti",
    plate: "The bread most of us eat every single day.",
    kitchen: "Kneaded in your own kitchen from Khapli or Sharbati Gehu Aata and water.",
    mill: "Ground slowly on a stone chakki. No heat damage, no chemical refining.",
    method: "Stone-milled (Chakki)",
    seed: "Khapli and Sharbati: ancient wheat varieties, grown from native, unhybridized seed.",
    focus: "Ancient wheat varieties",
    products: ["khapli-gehu-aata", "sharbati-gehu-aata"],
  },
  {
    id: "thekua",
    label: "Baked thekua",
    name: "Baked Thekua",
    plate: "A tea-time cookie, baked instead of fried.",
    kitchen: "Baked with khapli aata, jaggery and desi ghee.",
    mill: "The khapli is stone-milled. The jaggery is made from organic sugarcane. The ghee is desi cow bilona ghee.",
    method: "Stone-milled (Chakki)",
    seed: "Khapli: an ancient wheat variety, grown from native, unhybridized seed.",
    focus: "Ancient wheat varieties",
    soil: "The desi cow shows up twice in this cookie: in the bilona ghee, and in the Amrit Mitti that fed the wheat.",
    photo: "thekua",
    products: ["thekua", "khapli-gehu-aata", "jaggery-granules", "desi-ghee"],
  },
  {
    id: "noodles",
    label: "Millet noodles",
    name: "Millet Noodles",
    plate: "A bowl of noodles, made with millet.",
    kitchen: "Made with 50% kodo and 50% whole wheat, ready to cook at home.",
    mill: kodoMill,
    seed: kodoSeed,
    focus: "Nutrient-dense ancient grains",
    photo: "millet-noodles",
    products: ["millet-noodles", "kodo-millet"],
  },
  {
    id: "upma",
    label: "Kodo upma",
    name: "Kodo Upma",
    plate: "A quick breakfast, made with millet.",
    kitchen: "Cooked at home from Kodo Upma Premix, one of our quick healthy meal premixes.",
    mill: kodoMill,
    seed: kodoSeed,
    focus: "Nutrient-dense ancient grains",
    photo: "kodo-upma-premix",
    products: ["kodo-upma-premix", "kodo-millet"],
  },
];

export const traceDishIndex = new Map(traceDishes.map((dish) => [dish.id, dish]));

/** Dishes that use a given product, for "trace it back to the soil" links on product pages. */
export function dishesForProduct(slug: string) {
  return traceDishes.filter((dish) => dish.products.includes(slug));
}

/* A product page can ask the home page to open the dig on a specific dish. */
let pendingDish: string | null = null;

export function requestTrace(dishId: string) {
  pendingDish = dishId;
}

export function takeTraceRequest() {
  const id = pendingDish;
  pendingDish = null;
  return id && traceDishIndex.has(id) ? id : null;
}
