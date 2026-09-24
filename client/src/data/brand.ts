/**
 * Re Workshop brand content — from the client's "Website Content Update Brief".
 * Keep wording as supplied; only obvious typos were corrected for presentation.
 * Product and variety spellings follow the client product catalogue / packaging.
 */

/**
 * Corporate entity. The brief wrote "Reolify" and asked for verification; the client's own
 * product packaging prints "Powered by: Resoilfy Agro Farms Pvt. Ltd." — used here.
 * Set to null to hide the line everywhere.
 */
export const legalEntity: string | null = "Resoilfy Agro Farms Pvt. Ltd.";

export const intro = {
  welcome: "Welcome to Re Workshop!",
  headline: "We don’t just sell organic food — we restore life.",
  belief: "We began our journey with a singular, powerful belief: to truly nourish our bodies, we must first heal our earth.",
  conscious: "We are a conscious space dedicated to fixing what has gone wrong with modern lifestyles, human bodies, and agricultural practices.",
  ownership: (entity: string) => `Re Workshop is a premium lifestyle brand proudly owned, registered, and operated under our corporate entity, ${entity}.`,
};

/** SOIL → SEEDS → GRAINS → PROCESSING → KITCHEN → PLATE → HEALTH */
export const journey = ["Soil", "Seeds", "Grains", "Processing", "Kitchen", "Plate", "Health"];

export const meaning = {
  heading: "Our name is our roadmap to a better future.",
  re: {
    lead: "“Re” represents our commitment to:",
    points: [
      "Restoring dead soil",
      "Repairing cellular health",
      "Returning to our ancient sustainable roots",
      "Shifting away from modern chemical shortcuts",
    ],
  },
  workshop: {
    lead: "“Workshop” represents a physical, hands-on space where things aren’t discarded when they are broken — they are carefully mended.",
    body: "From healing a sluggish body with nutrient-dense grains to nursing the earth back to life, this is where the repair work happens.",
  },
};

export const loop = {
  eyebrow: "Our 3-step ecosystem",
  heading: "The Soil-to-Plate Loop",
  intro: "We bridge the gap between ancient heritage wisdom and your busy modern lifestyle through a short, tightly controlled sustainable cycle.",
  steps: [
    {
      id: "soil",
      title: "The Carbon-Rich Soil",
      paragraphs: [
        "Applying Amrit Krishi methodology, we make Amrit Mitti by using desi cow dung, cow urine and farm biomass.",
        "We revive depleted fields, triggering a natural microbial explosion to feed the earth, thus restoring soil health.",
      ],
      tags: ["Amrit Krishi", "Amrit Mitti", "Desi cow dung", "Cow urine", "Farm biomass"],
    },
    {
      id: "seeds",
      title: "The Heritage Seeds",
      paragraphs: ["In this thriving soil, we exclusively sow and protect native, unhybridized ancestral seeds."],
      focus: [
        { label: "Nutrient-dense millets", value: "Kodo, Kutki, Jowar" },
        { label: "Ancient wheat varieties", value: "Khapli & Sharbati" },
        { label: "Traditional rice", value: "Kali Banga" },
        { label: "Ancestral legume varieties", value: "" },
      ],
    },
    {
      id: "plate",
      title: "Traditional Processing & Mindful Plate",
      paragraphs: ["We protect this raw nutrition using slow, non-destructive heritage methods:"],
      methods: ["Stone-milled (Chakki)", "Hand-pounding", "Wood-pressed (Kacchi Ghani)"],
      closing:
        "We then craft them into delicious, ready-to-eat and ready-to-cook everyday foods, choosing the ingredients mindfully to bring nutrition back to the plate without compromising on taste.",
    },
  ],
  philosophyLead: "Our food philosophy ensures:",
  philosophy: ["Maida", "Refined Oil", "Processed Sugar", "Corn Starch"],
};

export const brandStatement = "We understand your need to eat healthy in spite of your busy routine!";

export type Founder = {
  initials: string;
  name: string;
  role: string;
  credentials: string[];
  lead: string;
  bio: string;
};

export const founders = {
  eyebrow: "Founder Directors",
  heading: "The faces behind Re Workshop",
  intro:
    "Our vision is steered by three passionate Founder Directors who combine cellular science, lifelong traditional intuition, and technology to lead India’s organic renaissance.",
  people: [
    {
      initials: "SC",
      name: "Dr. (Mrs.) Swati Chhajed",
      role: "Founder Director",
      credentials: ["Veterinary Pathologist", "Certified Nutritionist", "Environmentalist"],
      lead: "Dr. Swati understands health at a cellular level across the entire living ecosystem.",
      bio: "After successfully reversing her own chronic health issues by shifting to a sustainable, organic, plant-based diet, she directs the scientific and nutritional vision of Re Workshop, ensuring every recipe serves as true, functional medicine.",
    },
    {
      initials: "AB",
      name: "Mrs. Anshumala Bhagat",
      role: "Founder Director",
      credentials: ["Graduate", "Devoted Organic Farmer & Soil Custodian", "75 Years Young"],
      lead: "The living heartbeat of our agricultural fields.",
      bio: "Mrs. Anshumala brings the invaluable gifts of patience, traditional intuition, and maternal care to physically nurse depleted land back into thriving, chemical-free earth.",
    },
    {
      initials: "SS",
      name: "Mr. Samay Srivastava",
      role: "Founder Director",
      credentials: ["Master of Computer Management (BU)", "IT Specialist", "Amrit Organic Farmer"],
      lead: "Mr. Samay applies an architect’s precision to nature.",
      bio: "Working directly on the ground, he builds data-driven structures and frameworks to mentor local farming communities in scientifically transforming fields using the Amrit Mitti methodology.",
    },
  ] satisfies Founder[],
};

export const experience = {
  eyebrow: "The Re Workshop experience · Our store & open kitchen café",
  heading: "A kitchen that resets your body.",
  invite: "We invite you to step inside a space where conscious living comes to life.",
  concept:
    "Re Workshop is a unique, conceptual destination that seamlessly blends a premium grocery store with a mindful, live wellness café designed entirely around transparency.",
  openKitchen: {
    title: "The transparent open-kitchen café",
    body: "Take a seat at our wellness café and watch your health reset in real-time.",
  },
  live: {
    title: "Live transformation",
    body: "Watch the exact ancient millets and heritage grains from our grocery shelves turn into fresh, steaming, nutritious meals right before your eyes.",
  },
};

export const milletMenu = {
  heading: "Mindful Millet Menu",
  intro: "Enjoy everything from soft, nutrient-dense traditional recipes like:",
  items: [
    "Millet Idlis",
    "Millet Dosa",
    "Millet Dhokla",
    "Kodo Pasta",
    "Kodo Noodles",
    "Ragi Bao Momos",
    "Ragi Bread Sandwiches",
    "A host of healthy drinks",
  ],
};

export const noCompromise = {
  heading: "The No-Compromise Code",
  intro: "True to our word, our live café operates under a strict code of health:",
  rules: ["Maida", "Refined Oil", "Processed White Sugar", "Corn Starch"],
};

export const groceryStore = {
  heading: "The Organic Grocery Store",
  lines: [
    "After experiencing a reset at our café, walk through our retail shelves to take that lifestyle change home.",
    "Shop our meticulously curated, traditionally processed staples to recreate conscious wellness in your own kitchen.",
  ],
};

export type ShelfGroup = { label: string; items: { name: string; slug?: string }[] };
export type Shelf = { title: string; categorySlug: string; note?: string; groups: ShelfGroup[] };

/** Shelf copy from the brief. `slug` links an item to its catalogue product when one exists. */
export const shelves: Shelf[] = [
  {
    title: "The Grains & Flours",
    categorySlug: "grains-flours",
    note: "Stone-milled ancestral wheats and millets.",
    groups: [
      {
        label: "Ancient millets",
        items: [
          { name: "Kodo", slug: "kodo-millet" },
          { name: "Kutki", slug: "kutki-millet" },
          { name: "Sama", slug: "sama-millet" },
          { name: "Jowar", slug: "jwar-millet-aata" },
          { name: "Kangani", slug: "kangani-millet" },
          { name: "Ragi", slug: "ragi-millet" },
          { name: "Browntop", slug: "browntop-millet" },
          { name: "Bajra", slug: "bajra-millet-aata" },
        ],
      },
      {
        label: "Ancient wheat varieties",
        items: [
          { name: "Khapli", slug: "khapli-gehu-aata" },
          { name: "Sharbati", slug: "sharbati-gehu-aata" },
        ],
      },
      { label: "Traditional rice", items: [{ name: "Kali Banga", slug: "kali-banga-tukda-rice" }] },
    ],
  },
  {
    title: "The Spices",
    categorySlug: "spices-staples",
    groups: [
      {
        label: "On the shelf",
        items: [
          { name: "Traditionally processed unpolished dals & legumes", slug: "arhar-dal" },
          { name: "Hand-pounded masalas", slug: "haldi-powder" },
          { name: "Room-temperature wood-pressed oils", slug: "wood-pressed-mustard-oil" },
          { name: "Jaggery varieties", slug: "jaggery-granules" },
          { name: "Himalayan pink salt", slug: "himalayan-pink-salt" },
          { name: "Traditionally processed, nutrient-dense Adanshilpa poha (red rice)", slug: "adanshilpa-poha" },
        ],
      },
    ],
  },
  {
    title: "Guilt-Free Snacks & Premixes",
    categorySlug: "snacks-premixes",
    groups: [
      {
        label: "Mindfully baked tea-time companions",
        items: [
          { name: "Kodo-Wheat Baked Thekua", slug: "thekua" },
          { name: "Kodo-Jowar Salty Triangles", slug: "jwar-kodo-salty" },
          { name: "Kodo Jaggery Biscuits" },
        ],
      },
      {
        label: "Quick healthy meal premixes",
        items: [
          { name: "Kodo Upma Premix", slug: "kodo-upma-premix" },
          { name: "Kodo Pava Khil Premix" },
          { name: "Kodo Ladoo Premix" },
          { name: "Adanshilpa Poha Premix", slug: "adanshilpa-poha-premix" },
          { name: "Healthy Kodo Millet Noodles", slug: "millet-noodles" },
          { name: "Pasta", slug: "millet-pasta" },
        ],
      },
    ],
  },
];

export const finalMessage = [
  "Come for your weekly or monthly groceries,",
  "stay for a hot bowl of mindful nutrition,",
  "and witness how a kitchen can completely reset your body.",
];
