/**
 * Questions people ask (18 Nov 2026, for answer engines and AI assistants: Google's answers, ChatGPT, Perplexity).
 * Each answer leads with the fact, in a sentence that still makes sense when quoted on its own.
 *
 * Only facts the site already states: the address, the shelves and products (live catalogue), the café's popular
 * dishes, the No-Compromise Code, how ordering works, the founders, the consultation and the farmers page. Not
 * answered because nobody has told us: opening hours, home delivery, payment methods. Add them here once the client
 * confirms them.
 *
 * Used by the Questions page (pages/Faq.tsx, with FAQPage structured data), the plain-HTML copy of that page
 * (lib/prerender.ts) and llms.txt (scripts/seo-build.mjs).
 */

import popular from "@/data/popularDishes.json";

export type FaqCategory = { slug: string; name: string; description: string };
export type FaqProduct = { name: string; categorySlug: string };
export type FaqLink = { href: string; label: string };
export type FaqItem = { id: string; question: string; answer: string; link?: FaqLink };

const ADDRESS = "Shop No. 1-2, opposite Chief Engineer Office, Ridge Road, South Civil Lines, Jabalpur 482001, Madhya Pradesh";
const MAP = "https://maps.app.goo.gl/4bGAHXvCBMfjsaHMA";

/** "a, b and c" */
const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

export function faqItems(categories: FaqCategory[], products: FaqProduct[]): FaqItem[] {
  const named = (test: RegExp, category?: string) => products.filter((product) => test.test(product.name) && (!category || product.categorySlug === category)).map((product) => product.name);
  const millets = named(/millet/i, "grains-flours");
  const oils = named(/wood-pressed/i);
  const ghee = products.some((product) => /ghee/i.test(product.name));
  const dishes = popular.map((dish) => dish.name);

  const items: (FaqItem | null)[] = [
    {
      id: "where",
      question: "Where is Re Workshop in Jabalpur?",
      answer: `Re Workshop is at ${ADDRESS}. The organic food store and the open-kitchen café are in the same place.`,
      link: { href: MAP, label: "Get directions on Google Maps" },
    },
    {
      id: "what",
      question: "What does Re Workshop sell?",
      answer:
        "Re Workshop is an organic food store and millet café in Jabalpur. The store sells millets and other ancient grains, stone-milled aata, unpolished dals, wood-pressed oils, desi ghee, jaggery, honey, pickles, millet snacks and meal premixes.",
      link: { href: "/shop", label: "See all products" },
    },
    millets.length
      ? {
          id: "millets",
          question: "Which millets can I buy at Re Workshop in Jabalpur?",
          answer: `Re Workshop sells ${list(millets)}, along with other ancient grains, stone-milled aata and millet snacks.`,
          link: { href: "/shop/grains-flours", label: "Grains & flours" },
        }
      : null,
    oils.length
      ? {
          id: "oils",
          question: "Where can I buy wood-pressed oil in Jabalpur?",
          answer: `Re Workshop on Ridge Road sells ${list(oils)}, pressed in kacchi ghani wood presses${ghee ? ", as well as desi ghee" : ""}.`,
          link: { href: "/shop/spices-staples", label: "Dals, oils & staples" },
        }
      : null,
    {
      id: "grown",
      question: "How is Re Workshop's food grown and processed?",
      answer:
        "Re Workshop's grains are grown in living soil with Amrit Krishi, India's ancient regenerative farming method, from native, unhybridized seeds, without pesticides or chemicals. Flours are stone-milled in chakki mills and oils are pressed in kacchi ghani wood presses.",
      link: { href: "/our-story", label: "Our story" },
    },
    {
      id: "cafe",
      question: "What can I eat at the Re Workshop café?",
      answer: `The café cooks millet dishes and drinks in an open kitchen you can watch. Popular options include ${list(dishes)}.`,
      link: { href: "/cafe", label: "The café" },
    },
    {
      id: "code",
      question: "Does Re Workshop use maida or refined oil?",
      answer: "No. Everything Re Workshop cooks is made without maida, refined oil, processed white sugar or corn starch.",
    },
    {
      id: "order",
      question: "How do I order from Re Workshop?",
      answer:
        "Add products to the basket on the website and send the order on WhatsApp, call or WhatsApp +91 96915 55728, or buy at the store on Ridge Road, Jabalpur.",
      link: { href: "/shop", label: "Shop the store" },
    },
    {
      id: "founders",
      question: "Who runs Re Workshop?",
      answer:
        "Re Workshop is run by three founder directors: Dr. (Mrs.) Swati Chhajed, Mrs. Anshumala Dhagat and Mr. Samay Srivastava. It is operated under Resoilfy Agro Farms Pvt. Ltd.",
      link: { href: "/our-story#founders", label: "Meet the founders" },
    },
    {
      id: "consultation",
      question: "Does Re Workshop offer a free consultation?",
      answer:
        "Yes. Dr. (Mrs.) Swati Chhajed, a veterinary pathologist and certified nutritionist, offers a free chat about lifestyle and nutrition on WhatsApp.",
      link: { href: "/#consult", label: "Free consultation" },
    },
    {
      id: "farmers",
      question: "I am a farmer. Can I work with Re Workshop?",
      answer:
        "Yes. If you farm without chemicals, want to switch, or keep native seed varieties, tell Re Workshop about your farm on the For farmers page; it sends your details on WhatsApp.",
      link: { href: "/farmers", label: "For farmers" },
    },
    {
      id: "track",
      question: "Can I find out where my grain was grown?",
      answer: "Yes, for Khapli Gehu Aata, Kodo and Moong: Track your grain follows each one from the pack back to the farm and the seed.",
      link: { href: "/our-story#trace", label: "Track your grain" },
    },
  ];
  return items.filter((item): item is FaqItem => item !== null);
}

/** schema.org FAQPage for the Questions page. */
export function faqJsonLd(items: FaqItem[], site: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${site}/faq`,
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
}
