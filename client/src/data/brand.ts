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
      "Only unhybridized, native/indigenous heritage seeds in complete alignment of Amrit Krishi methodology are sown: nutrient-dense ancient grains like Kodo, Kutki and Jowar millets, ancient wheats like Khapli and Sharbati, and traditional rice varieties like Kali Banga.",
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
  /** Home page name panel. On Our story the section's heading is `whyHeading` (client copy, 28 Oct 2026). */
  heading: "Our name is our roadmap to a better future.",
  whyHeading: "Why ReWorkshop",
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
    body: "modern food is ultra processed, chemically laden, dead food. In our workshop, food is rebuilt from the soil up, so what reaches your plate helps repair your body instead of wearing it down.",
    facets: [
      { label: "Raw material", value: "Nutrient-dense ancient grains from living soil" },
      { label: "Tools", value: "Chakki stone mills and Kacchi Ghani wood presses" },
      { label: "Craft", value: "traditional processing and slow cooking" },
      { label: "The repair", value: "nutrient dense food back to the plate" },
    ],
  },
};

export const loop = {
  heading: "The soil to plate to pantry loop",
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
      paragraphs: ["In this thriving soil, we exclusively sow and protect unhybridized, native/indigenous heritage seeds in complete alignment of Amrit Krishi methodology."],
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
        "We then craft them into delicious, ready-to-eat and ready-to-cook everyday foods, choosing the ingredients mindfully to bring nutrient dense food back to the plate without compromising on taste.",
    },
  ],
};

/**
 * "How it began", for the Our story page. 23 Oct 2026: Anupam gave the origin: Dr. Swati reversed her own health
 * issues with proper diet, then wanted the same for everyone else, and that is why Re Workshop exists. Written only
 * from that and the client's own words (her bio: a sustainable, organic, plant-based diet; her conditions, sent
 * 23 Oct). Nothing else is added (no dates, places or other founders' roles); the client should approve the wording
 * and can replace it with the founders' own. `note` is the safety note that goes wherever her health story appears.
 * 28 Oct 2026 (Anupam): one continuous story: she faced the health problems, reversed them by changing her daily
 * food, and the client's approved line follows on from it ("And " joins it; the line itself is unchanged). Kept from
 * the client's own words: "hypothyroidism" (not hyper-) and "reversed" (not "cured"). "Without medication" dropped,
 * as in Anupam's telling; it sat badly beside "don't stop or change any medicine".
 */
export const origin: { heading: string; paragraphs: string[]; note: string } | null = {
  heading: "How Re Workshop began",
  paragraphs: [
    "Re Workshop began when one of its founders, Dr. (Mrs.) Swati Chhajed, faced several health problems: hypothyroidism, photosensitive dermatitis, neuralgia and more. She reversed all of them by changing the food she ate every day to a sustainable, organic, plant-based diet. And having seen what clean food did to her is why reworkshop came into existence.",
  ],
  note: "Please don’t stop or change any medicine without your doctor.",
};

export const brandStatement = "We understand your need to eat healthy in spite of your busy routine!";

/**
 * Client copy changes, 28 Oct 2026 ("ReWorkshop Website: Exact Copy Updates"): approved phrases are used verbatim,
 * including their lower-case starts and punctuation, and must not be "corrected". This disclaimer sits right after
 * Dr. Swati's own health story wherever it appears beside the free consultation (home, Our story origin, her card).
 */
export const personalExperienceDisclaimer = "this is her own experience and she does not promise the same results";

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
  note: "This is a lifestyle and nutrition chat, not medical treatment; please don’t stop or change any medicine without your doctor.",
  cta: "Chat with Dr. Swati on WhatsApp",
  /** Pre-filled first message; the visitor can edit it in WhatsApp before sending. */
  message: "Hello Dr. Swati, I found you on the Re Workshop website and would like a free consultation about my lifestyle and health.",
  nav: "Free consultation",
  navShort: "Free consult",
  founderLink: "Free consultation with Dr. Swati",
  /** Accessible name and tooltip of the call button beside her name on her founder card. */
  callLabel: "Call Dr. Swati for a free consultation",
};

/**
 * For farmers (client, 31 Oct 2026): Re Workshop as a meeting point for farmers who want to farm this way. The client has
 * not said yet what a farmer who joins gets (training, seeds, buying the harvest), so this page promises nothing: it says
 * how Re Workshop farms, in the words of the seven-step journey above, and asks the farmer to get in touch. Enquiries go
 * to the store's WhatsApp (Anupam's choice). When the client decides the offer, add it here, in both languages.
 *
 * In English and Hindi (31 Oct 2026, Anupam: "the farmers might not know English"). The Hindi is written for the page,
 * plain and spoken, not machine translated; the client should read it before it goes live. Both versions must keep the
 * same shape (TypeScript checks it), and the WhatsApp message goes out in the language the farmer is reading.
 */
const farmersEn = {
  lang: "en",
  metaTitle: "For farmers",
  metaDescription:
    "Farm with Re Workshop, Jabalpur: living soil, native seeds and Amrit Krishi. If you farm without chemicals, want to switch, or keep native seed varieties, tell us about your farm on WhatsApp.",
  /** The language switch shows the other language, written in that language. */
  switchTo: "हिंदी में पढ़ें",
  switchLang: "hi",
  quiet: "For farmers.",
  title: "Farm with us.",
  lead: "Our grains come from living soil, native seeds and Amrit Krishi. If you farm this way, or want to start, we would like to hear from you.",
  body: "Tell us about your land and what you grow, and we will get in touch.",
  call: "Call",
  whoHeading: "Who we would like to hear from",
  who: [
    { title: "You already farm without chemicals", body: "Organic or natural, on any size of land. Tell us what you grow and where." },
    { title: "You want to make the switch", body: "You farm with chemicals today and want to move to living soil. Start the conversation here." },
    { title: "You keep native seeds", body: "Old varieties of millets, wheat or rice that have been grown in your family for years. We would like to know about them." },
  ],
  howHeading: "How we farm",
  how: [
    { title: "Living soil", body: "Amrit Krishi, India’s ancient regenerative method: desi cow dung, cow urine and farm biomass bring the soil back to life." },
    { title: "Native seeds", body: "Only unhybridized, native/indigenous heritage seeds: millets like Kodo, Kutki and Jowar, wheats like Khapli, rice like Kali Banga." },
    { title: "No chemicals", body: "Grown in living soil without pesticides or chemicals, from the seed to the harvest." },
  ],
  howMore: "See all seven steps, from soil to health",
  formHeading: "Tell us about your farm",
  formIntro: "Fill in what you can. Only your name and your village are needed.",
  callLine: "Prefer to talk?",
  fields: {
    name: "Your name",
    place: "Village or town, and district",
    placeExample: "e.g. Shahpura, Jabalpur",
    land: "Land, in acres",
    crops: "What you grow now",
    cropsExample: "e.g. wheat, kodo, gram",
    practice: "How you farm today",
    note: "Anything else",
    optional: "(optional)",
  },
  errors: { name: "Please write your name.", place: "Please write your village or town." },
  practices: ["Organic or natural already", "With chemicals, want to switch", "Just starting out"],
  submit: "Send on WhatsApp",
  formNote: "WhatsApp opens with your details filled in. Check them and press send; nothing is saved on this website.",
  sent: { before: "WhatsApp should be open with your message. If it did not open,", link: "open it here" },
  /** The first WhatsApp message to the store, line by line. */
  message: {
    hello: "Namaste Re Workshop, I am a farmer and I would like to connect with you about farming.",
    name: "Name",
    place: "Village / district",
    land: "Land",
    acres: "acres",
    crops: "Growing now",
    practice: "Farming today",
    note: "Message",
  },
};

export type FarmersCopy = Omit<typeof farmersEn, "lang" | "switchLang"> & { lang: "en" | "hi"; switchLang: "en" | "hi" };

const farmersHi: FarmersCopy = {
  lang: "hi",
  metaTitle: "किसानों के लिए",
  metaDescription:
    "Re Workshop, जबलपुर के साथ खेती करें: जीवित मिट्टी, देसी बीज और अमृत कृषि। अगर आप बिना रसायन के खेती करते हैं, बदलना चाहते हैं, या आपके पास देसी बीज हैं, तो WhatsApp पर अपने खेत के बारे में बताइए।",
  switchTo: "Read in English",
  switchLang: "en",
  quiet: "किसानों के लिए।",
  title: "हमारे साथ खेती करें।",
  lead: "हमारा अनाज जीवित मिट्टी, देसी बीज और अमृत कृषि से आता है। अगर आप इसी तरह खेती करते हैं, या शुरू करना चाहते हैं, तो हम आपसे बात करना चाहेंगे।",
  body: "अपनी ज़मीन और फ़सल के बारे में बताइए, हम आपसे संपर्क करेंगे।",
  call: "कॉल करें",
  whoHeading: "हम किनसे बात करना चाहते हैं",
  who: [
    { title: "आप पहले से बिना रसायन के खेती करते हैं", body: "जैविक हो या प्राकृतिक, ज़मीन छोटी हो या बड़ी। बताइए आप क्या उगाते हैं और कहाँ।" },
    { title: "आप बदलाव करना चाहते हैं", body: "अभी आप रसायन से खेती करते हैं और जीवित मिट्टी की ओर बढ़ना चाहते हैं। बात यहीं से शुरू कीजिए।" },
    { title: "आपके पास देसी बीज हैं", body: "मोटे अनाज, गेहूँ या धान की पुरानी किस्में, जो आपके परिवार में बरसों से उगाई जा रही हैं। हम उनके बारे में जानना चाहेंगे।" },
  ],
  howHeading: "हम खेती कैसे करते हैं",
  how: [
    { title: "जीवित मिट्टी", body: "अमृत कृषि, मिट्टी को फिर से उपजाऊ बनाने की भारत की प्राचीन पद्धति: देसी गाय का गोबर, गोमूत्र और खेत के जैविक अवशेष मिट्टी में फिर से जान डालते हैं।" },
    { title: "देसी बीज", body: "सिर्फ़ बिना हाइब्रिड वाले, देसी पारंपरिक बीज: कोदो, कुटकी और ज्वार जैसे मोटे अनाज, खपली जैसा गेहूँ, काली बंगा जैसा धान।" },
    { title: "कोई रसायन नहीं", body: "बीज से कटाई तक, जीवित मिट्टी में, बिना कीटनाशक या रसायन के।" },
  ],
  howMore: "मिट्टी से सेहत तक, सातों चरण देखें (अंग्रेज़ी में)",
  formHeading: "अपने खेत के बारे में बताइए",
  formIntro: "जितना हो सके भरिए। सिर्फ़ आपका नाम और गाँव ज़रूरी है।",
  callLine: "बात करना चाहते हैं?",
  fields: {
    name: "आपका नाम",
    place: "गाँव या कस्बा, और ज़िला",
    placeExample: "जैसे: शाहपुरा, जबलपुर",
    land: "ज़मीन (एकड़ में)",
    crops: "अभी आप क्या उगाते हैं",
    cropsExample: "जैसे: गेहूँ, कोदो, चना",
    practice: "अभी आप खेती कैसे करते हैं",
    note: "और कुछ बताना हो तो",
    optional: "(ज़रूरी नहीं)",
  },
  errors: { name: "कृपया अपना नाम लिखिए।", place: "कृपया अपना गाँव या कस्बा लिखिए।" },
  practices: ["पहले से जैविक या प्राकृतिक", "रसायन से, बदलना चाहते हैं", "अभी शुरुआत कर रहे हैं"],
  submit: "WhatsApp पर भेजें",
  formNote: "WhatsApp आपकी जानकारी भरकर खुलेगा। एक बार देख लीजिए और भेजें दबाइए; इस वेबसाइट पर कुछ भी सेव नहीं होता।",
  sent: { before: "WhatsApp आपके संदेश के साथ खुल गया होगा। अगर नहीं खुला, तो", link: "यहाँ खोलिए" },
  message: {
    hello: "नमस्ते Re Workshop, मैं किसान हूँ। खेती के बारे में आपसे बात करनी है।",
    name: "नाम",
    place: "गाँव / ज़िला",
    land: "ज़मीन",
    acres: "एकड़",
    crops: "अभी की फ़सल",
    practice: "अभी की खेती",
    note: "संदेश",
  },
};

export const farmersCopy: Record<"en" | "hi", FarmersCopy> = { en: farmersEn as FarmersCopy, hi: farmersHi };

export type Founder = {
  initials: string;
  /** Site photo slot for the portrait (data/media.ts); the monogram shows until a photo is uploaded. */
  photoSlot: string;
  name: string;
  role: string;
  /**
   * Credential chips, one inner list per line. Every founder has the same shape (client, 28 Oct 2026: one common
   * two-line grid for all three): the main credential alone on top, two short ones side by side below. The longest
   * line is 266px wide, so two lines hold on cards 266px wide or more (three columns from 1100px, phones from 360px).
   */
  credentials: [string[], string[]];
  lead: string;
  bio: string;
  /** Offers the free lifestyle consultation: a call button sits beside the name on her Our story card. */
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
      credentials: [["Veterinary Pathologist"], ["Certified Nutritionist", "Environmentalist"]],
      lead: "Dr. Swati understands health at a cellular level across the entire living ecosystem.",
      bio: "After successfully reversing her own chronic health issues by shifting to a sustainable, organic, plant-based diet, she directs the scientific and nutritional vision of Re Workshop, ensuring every recipe serves as true, functional medicine.",
    },
    {
      initials: "AD",
      photoSlot: "founder-anshumala",
      name: "Mrs. Anshumala Dhagat",
      role: "Founder Director",
      credentials: [["Devoted Organic Farmer & Soil Custodian"], ["Graduate", "75 Years Young"]],
      lead: "The living heartbeat of our agricultural fields.",
      bio: "Mrs. Anshumala brings the invaluable gifts of patience, traditional intuition, and maternal care to physically nurse depleted land back into thriving, chemical-free earth.",
    },
    {
      initials: "SS",
      photoSlot: "founder-samay",
      name: "Mr. Samay Srivastava",
      role: "Founder Director",
      credentials: [["Master of Computer Management (BU)"], ["IT Specialist", "Amrit Krishi farmer"]],
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
