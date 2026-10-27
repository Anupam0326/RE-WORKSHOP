export const legalEntity: string | null = "Resoilfy Agro Farms Pvt. Ltd.";

export const intro = {
  welcome: "Welcome to Re Workshop!",
  headline: "We don’t just sell organic food. We restore life.",
  belief: "We began our journey with a singular, powerful belief: to truly nourish our bodies, we must first heal our earth.",
  conscious: "We are a conscious space dedicated to fixing what has gone wrong with modern lifestyles, human bodies, and agricultural practices.",
  ownership: (entity: string) => `Re Workshop is a premium lifestyle brand proudly owned, registered, and operated under our corporate entity, ${entity.replace(/\.$/, "")}.`,
};

export type JourneyStep = {
  label: string;
  tagline: string;
  description: string;
};

export const journey: JourneyStep[] = [
  {
    label: "Soil",
    tagline: "Regenerative organic farming",
    description:
      "We begin by restoring carbon-rich soil using Amrit Krishi, India’s ancient regenerative farming method. Desi cow dung, cow urine, and farm biomass revive microbial life, creating chemical-free, nutrient-dense earth.",
  },
  {
    label: "Seeds",
    tagline: "Heritage and ancestral seeds",
    description:
      "Only unhybridized, native ancestral seeds are sown: nutrient-dense ancient grains like Kodo, Kutki and Jowar millets, ancient wheats like Khapli and Sharbati, and traditional rice varieties like Kali Banga.",
  },
  {
    label: "Grains",
    tagline: "Naturally grown organic grains",
    description:
      "Nurtured in living soil without pesticides or chemicals, our grains grow to full nutrient potential, delivering higher mineral density and authentic taste from farm to harvest.",
  },
  {
    label: "Processing",
    tagline: "Stone-milled and wood-pressed",
    description:
      "We protect raw nutrition with heritage processing: stone-milling (Chakki), hand-pounding and wood-pressing (Kacchi Ghani). No heat damage, no chemical refining, no nutrient loss.",
  },
  {
    label: "Kitchen",
    tagline: "Transparent open-kitchen café",
    description:
      "Our open-kitchen wellness café lets you witness farm-fresh organic millets and grains transform into steaming, wholesome meals, cooked to our No-Compromise Code.",
  },
  {
    label: "Plate",
    tagline: "Nutrient-dense millet meals",
    description:
      "From Millet Idli and Kodo Pasta to Ragi Bao Pockets and healthy sattu coolers, every dish is crafted for taste and nutrition: ready-to-eat meals that nourish your body naturally.",
  },
  {
    label: "Health",
    tagline: "Cellular health and wellness",
    description:
      "The result: restored cellular health, improved gut wellness, and a sustainable lifestyle rooted in India’s ancient food wisdom. Eat organic, live better, heal from within.",
  },
];

export const meaning = {
  heading: "Our name is our roadmap to a better future.",
  re: {
    lead: "“Re” represents our commitment to:",
    points: [
      "Restoring dead soil",
      "Repairing cellular health",
      "Returning to our ancient sustainable roots",
      "Regaining lost nutrition on our plates",
      "Reviving the wisdom of the traditional Indian kitchen",
    ],
  },
  workshop: {
    lead: "A workshop is where broken things are carefully mended, not thrown away. Ours is a food workshop.",
    body: "Modern food has been broken by chemicals, over-processing and shortcuts, and so has our health. In our workshop, food is rebuilt from the soil up, so what reaches your plate helps repair your body instead of wearing it down.",
    facets: [
      { label: "Raw material", value: "Nutrient-dense ancient grains from living soil" },
      { label: "Tools", value: "Chakki stone mills and Kacchi Ghani wood presses" },
      { label: "Craft", value: "Slow, traditional recipes in an open kitchen" },
      { label: "The repair", value: "Real nutrition, back on your plate" },
    ],
  },
};

export const loop = {
  heading: "The Soil-to-Plate Loop",
  intro: "We bridge the gap between ancient heritage wisdom and your busy modern lifestyle through a short, tightly controlled sustainable cycle.",
  /**
   * "Track your grain" (22 Oct 2026; it replaced "pick a plate"): pick a grain from the shelves and dig down from the
   * pack to the seed. Logic and the truth rule live in data/grainTrack.ts.
   */
  trace: {
    question: "Where did your grain come from?",
    prompt: "Most food stops at the label. Pick a grain from our shelves and dig down from the pack to the seed it grew from.",
    pickLabel: "Pick a grain",
    specificTag: "This grain",
    generalTag: "How we work",
    legend: "Lime marks facts recorded for this grain. The rest is how Re Workshop farms and processes.",
    layers: {
      shelf: { depth: "On our shelf" },
      mill: { depth: "Mill", question: "How was it processed?" },
      harvest: { depth: "Harvest", question: "When was it sown and harvested?" },
      farm: { depth: "Farm", question: "Where was it grown, and how?" },
      seed: { depth: "Seed", question: "Which seed did it grow from?" },
    },
    closing: "The loop starts in the soil and ends in your kitchen.",
    closingBody: "Desi cow dung, cow urine and farm biomass go back into the fields as Amrit Mitti, ready for the next harvest.",
    ask: "Ask about this batch",
    again: "Track another grain",
    productTitle: "Where this grain comes from",
    productLead: "Dig down from this pack to the seed it grew from.",
    productLink: "Track this grain",
  },
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
        { label: "Nutrient-dense ancient grains", value: "Kodo, Kutki, Jowar" },
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
};

/**
 * "How it began", for the Our story page. 23 Oct 2026: Anupam gave the origin: Dr. Swati reversed her own health
 * issues with proper diet, then wanted the same for everyone else, and that is why Re Workshop exists. Written only
 * from that and the client's own words (her bio: a sustainable, organic, plant-based diet; her conditions, sent
 * 23 Oct). Nothing else is added (no dates, places or other founders' roles); the client should approve the wording
 * and can replace it with the founders' own. `note` is the safety note that goes wherever her health story appears.
 */
export const origin: { heading: string; paragraphs: string[]; note: string } | null = {
  heading: "How Re Workshop began",
  paragraphs: [
    "Re Workshop began with one founder’s own health. Dr. (Mrs.) Swati Chhajed reversed her hypothyroidism, photosensitive dermatitis and neuralgia without medication, by changing the way she ate: a sustainable, organic, plant-based diet.",
    "Having seen what proper food did for her, she wanted the same for everyone else. That wish is why Re Workshop exists: a store and an open-kitchen café built so that anyone can eat the way that helped her.",
  ],
  note: "Her own experience, not a promise of the same result. Please don’t stop or change any medicine without your doctor.",
};

export const brandStatement = "We understand your need to eat healthy in spite of your busy routine!";

/**
 * Free consultation with Dr. (Mrs.) Swati Chhajed (client, 23 Oct 2026). Her qualifications and her own story are the
 * client's words (case and "etc." tidied). The story sits beside a safety note on purpose (Anupam's choice): it is
 * her experience, not a promise, and nobody should stop medicine because of it. Keep the note whenever the story shows.
 */
export const consultation = {
  title: "Free consultation",
  topic: "on reversal of lifestyle issues.",
  name: "Dr. (Mrs.) Swati Chhajed",
  role: "Founder Director, Re Workshop",
  qualifications: ["Veterinary Pathologist", "Certified Nutritionist", "Working in the field of wellness for more than a decade"],
  story: "She reversed her own hypothyroidism, photosensitive dermatitis, neuralgia and more without medication.",
  note: "Her own experience, not a promise of the same result. This is a lifestyle and nutrition chat, not medical treatment; please don’t stop or change any medicine without your doctor.",
  cta: "Chat with Dr. Swati on WhatsApp",
  /** Pre-filled first message; the visitor can edit it in WhatsApp before sending. */
  message: "Hello Dr. Swati, I found you on the Re Workshop website and would like a free consultation about my lifestyle and health.",
  nav: "Free consultation",
  navShort: "Free consult",
  founderLink: "Free consultation with Dr. Swati",
};

export type Founder = {
  initials: string;
  /** Site photo slot for the portrait (data/media.ts); the monogram shows until a photo is uploaded. */
  photoSlot: string;
  name: string;
  role: string;
  credentials: string[];
  lead: string;
  bio: string;
  /** Offers the free lifestyle consultation (her card links to it). */
  consults?: boolean;
};

export const founders = {
  eyebrow: "Founder directors",
  heading: "The faces behind Re Workshop",
  intro:
    "Our vision is steered by three passionate Founder Directors who combine cellular science, lifelong traditional intuition, and technology to lead India’s organic renaissance.",
  people: [
    {
      initials: "SC",
      photoSlot: "founder-swati",
      consults: true,
      name: "Dr. (Mrs.) Swati Chhajed",
      role: "Founder Director",
      credentials: ["Veterinary Pathologist", "Certified Nutritionist", "Environmentalist"],
      lead: "Dr. Swati understands health at a cellular level across the entire living ecosystem.",
      bio: "After successfully reversing her own chronic health issues by shifting to a sustainable, organic, plant-based diet, she directs the scientific and nutritional vision of Re Workshop, ensuring every recipe serves as true, functional medicine.",
    },
    {
      initials: "AD",
      photoSlot: "founder-anshumala",
      name: "Mrs. Anshumala Dhagat",
      role: "Founder Director",
      credentials: ["Graduate", "Devoted Organic Farmer & Soil Custodian", "75 Years Young"],
      lead: "The living heartbeat of our agricultural fields.",
      bio: "Mrs. Anshumala brings the invaluable gifts of patience, traditional intuition, and maternal care to physically nurse depleted land back into thriving, chemical-free earth.",
    },
    {
      initials: "SS",
      photoSlot: "founder-samay",
      name: "Mr. Samay Srivastava",
      role: "Founder Director",
      credentials: ["Master of Computer Management (BU)", "IT Specialist", "Amrit Organic Farmer"],
      lead: "Mr. Samay applies an architect’s precision to nature.",
      bio: "Working directly on the ground, he builds data-driven structures and frameworks to mentor local farming communities in scientifically transforming fields using the Amrit Mitti methodology.",
    },
  ] satisfies Founder[],
};

export const experience = {
  eyebrow: "The Re Workshop experience: our store and open-kitchen café",
  heading: "A kitchen that resets your body.",
  invite: "We invite you to step inside a space where conscious living comes to life.",
  concept:
    "Re Workshop is a unique, conceptual destination that blends a premium grocery store with a mindful, live wellness café designed entirely around transparency.",
  openKitchen: {
    title: "The transparent open-kitchen café",
    body: "Take a seat at our wellness café and watch your health reset in real-time.",
  },
  live: {
    title: "Live transformation",
    body: "Watch the same nutrient-dense ancient grains from our grocery shelves turn into fresh, steaming, nutritious meals right before your eyes.",
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
    "Ragi Bao Pockets",
    "Ragi Bread Sandwiches",
    "A host of healthy drinks",
  ],
};

/** The one place the "zero maida" code appears, for the café and the foods we make. */
export const noCompromise = {
  heading: "The No-Compromise Code",
  intro: "True to our word, everything we cook in our live café and craft for your kitchen follows a strict code of health:",
  rules: ["Maida", "Refined Oil", "Processed White Sugar", "Corn Starch"],
};

export const groceryStore = {
  heading: "The Organic Grocery Store",
  lines: [
    "After experiencing a reset at our café, walk through our retail shelves to take that lifestyle change home.",
    "Shop our carefully chosen, traditionally processed staples to recreate conscious wellness in your own kitchen.",
  ],
};

export const finalMessage = [
  "Come for your weekly or monthly groceries,",
  "stay for a hot bowl of mindful nutrition,",
  "and witness how a kitchen can completely reset your body.",
];
