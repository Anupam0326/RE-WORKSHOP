/**
 * Plain-HTML copies of every page, for readers that don't run the site's script (18 Nov 2026, for AI assistants and
 * answer engines: ChatGPT's, Claude's and Perplexity's crawlers read the HTML the server sends and nothing else).
 *
 * scripts/seo-build.mjs bundles this file at build time, calls prerenderPage() for each page and puts the result inside
 * <div id="root">. In a browser the inline script in index.html marks <html class="js"> before anything shows, a rule
 * there hides `.prerender`, and React replaces the whole block as soon as it starts. Google renders the script, so it
 * sees the real page. Without the script (or if it fails) a visitor still gets readable text and working links.
 *
 * The words are the site's own: data/brand.ts, the live catalogue, data/popularDishes.json and data/faq.ts. Nothing
 * here may say more than the real page does. No prices: they change in /admin between deploys.
 */

import { consultation, experience, farmersCopy, founders, groceryStore, hero, intro, journey, legalEntity, loop, meaning, noCompromise, origin } from "@/data/brand";
import { faqItems, type FaqCategory } from "@/data/faq";
import popular from "@/data/popularDishes.json";

export type PrerenderCategory = FaqCategory & { shortName?: string };
export type PrerenderProduct = { slug: string; name: string; packSize: string; description: string; categorySlug: string };
export type PrerenderCatalog = { categories: PrerenderCategory[]; products: PrerenderProduct[] };

const STORE = {
  name: "Re Workshop",
  address: ["Shop No. 1-2, opposite Chief Engineer Office", "Ridge Road, South Civil Lines", "Jabalpur 482001, Madhya Pradesh"],
  phones: [
    { display: "96915 55728", tel: "+919691555728" },
    { display: "93730 05077", tel: "+919373005077" },
  ],
  email: "kalgodimahilasamooh@gmail.com",
  instagram: "https://www.instagram.com/re.workshop_organic/",
  map: "https://maps.app.goo.gl/4bGAHXvCBMfjsaHMA",
};

const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const p = (text: string) => `<p>${esc(text)}</p>`;
const a = (href: string, label: string) => `<a href="${esc(href)}">${esc(label)}</a>`;
const ul = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const plain = (name: string) => name.replace(/^The\s+/, "");

const nav = `<nav aria-label="Main">${ul([a("/", "Home"), a("/shop", "Shop"), a("/cafe", "Café"), a("/our-story", "Our story"), a("/farmers", "For farmers"), a("/faq", "Questions")])}</nav>`;

const footer = `<footer><h2>Visit Re Workshop</h2><address>${STORE.address.map(esc).join("<br>")}</address>${ul([
  a(STORE.map, "Get directions"),
  ...STORE.phones.map((phone) => a(`tel:${phone.tel}`, `Call ${phone.display}`)),
  a(`https://wa.me/919691555728`, "WhatsApp 96915 55728"),
  a(`mailto:${STORE.email}`, STORE.email),
  a(STORE.instagram, "Instagram"),
])}${legalEntity ? p(intro.ownership(legalEntity)) : ""}</footer>`;

function productList(products: PrerenderProduct[]) {
  return ul(products.map((product) => `${a(`/product/${product.slug}`, product.name)}${product.packSize ? `, ${esc(product.packSize)}` : ""}`));
}

function cafePointers() {
  const { pointers } = experience;
  return ul([pointers.watch, pointers.menu, pointers.code, pointers.home].map((pointer) => `<strong>${esc(pointer.title)}</strong>: ${esc(pointer.body)}`));
}

function codeBlock() {
  return `<h2>${esc(noCompromise.kicker)} ${esc(noCompromise.heading)}</h2>${p(noCompromise.intro)}${ul(noCompromise.rules.map((item) => `Zero ${esc(item)}`))}`;
}

function main(path: string, catalog: PrerenderCatalog): string | null {
  const shelves = catalog.categories.filter((category) => catalog.products.some((product) => product.categorySlug === category.slug));
  const inShelf = (slug: string) => catalog.products.filter((product) => product.categorySlug === slug);

  if (path === "/") {
    return [
      `<h1>${esc(hero.lead)} ${esc(hero.main)}</h1>`,
      p(hero.captions.front),
      `<h2>${esc(experience.heading)}</h2>`,
      cafePointers(),
      `<p>${a("/cafe", "See the café")}</p>`,
      `<h2>${esc(groceryStore.heading)}</h2>`,
      p(groceryStore.plain),
      ul(shelves.map((category) => a(`/shop/${category.slug}`, plain(category.name)))),
      `<p>${a("/shop", groceryStore.cta)}</p>`,
      codeBlock(),
      `<h2>${esc(journey[0].tagline)}</h2>`,
      p(loop.steps[0].paragraphs[1]),
      `<p>${a("/our-story", "Our story")} · ${a("/farmers", "For farmers: farm with us")}</p>`,
      `<h2>${esc(consultation.title)} ${esc(consultation.topic)}</h2>`,
      p(consultation.story),
      p(`${consultation.name}: ${consultation.qualifications.join(", ")}.`),
    ].join("");
  }
  if (path === "/shop") {
    return [
      `<h1>${esc(groceryStore.heading)}</h1>`,
      p(groceryStore.lines[1]),
      ...shelves.map((category) => `<section><h2>${a(`/shop/${category.slug}`, plain(category.name))}</h2>${p(category.description)}${productList(inShelf(category.slug))}</section>`),
      p("Order through WhatsApp from the basket on this website, or buy at the store on Ridge Road, Jabalpur."),
    ].join("");
  }
  if (path.startsWith("/shop/")) {
    const category = shelves.find((item) => `/shop/${item.slug}` === path);
    if (!category) return null;
    return [`<h1>${esc(category.name)}</h1>`, p(category.description), productList(inShelf(category.slug)), `<p>${a("/shop", "All products")}</p>`].join("");
  }
  if (path.startsWith("/product/")) {
    const product = catalog.products.find((item) => `/product/${item.slug}` === path);
    if (!product) return null;
    const category = catalog.categories.find((item) => item.slug === product.categorySlug);
    return [
      `<h1>${esc(product.name)}</h1>`,
      product.packSize ? p(`Pack: ${product.packSize}`) : "",
      product.description ? p(product.description) : "",
      category ? `<p>Shelf: ${a(`/shop/${category.slug}`, plain(category.name))}</p>` : "",
      p("Price on the website. Order through WhatsApp from the basket, or buy it at Re Workshop on Ridge Road, Jabalpur."),
    ].join("");
  }
  if (path === "/cafe") {
    return [
      `<h1>${esc(experience.heading)}</h1>`,
      cafePointers(),
      `<h2>Our popular options</h2>`,
      p("Made fresh in our open kitchen."),
      ul(popular.map((dish) => esc(dish.name))),
      codeBlock(),
    ].join("");
  }
  if (path === "/our-story") {
    return [
      `<h1>${esc(intro.belief)}</h1>`,
      p(intro.conscious),
      origin ? `<h2>${esc(origin.heading)}</h2>${origin.paragraphs.map(p).join("")}` : "",
      `<h2>${esc(founders.heading)}</h2>`,
      p(founders.intro),
      ...founders.people.map((person) => `<section><h3>${esc(person.name)}, ${esc(person.role)}</h3>${p(person.credentials.flat().join(" · "))}${p(person.lead)}${p(person.bio)}</section>`),
      `<h2>${esc(meaning.whyHeading)}</h2>`,
      p(meaning.re.lead),
      ul(meaning.re.points.map(esc)),
      p(meaning.workshop.lead),
      `<h2>From soil to health</h2>`,
      ul(journey.map((step) => `<strong>${esc(step.label)}: ${esc(step.tagline)}</strong>. ${esc(step.description)}`)),
      `<h2>${esc(loop.heading)}</h2>`,
      p(loop.intro),
    ].join("");
  }
  if (path === "/farmers") {
    const t = farmersCopy.en;
    return [
      `<h1>${esc(t.quiet)} ${esc(t.title)}</h1>`,
      p(t.lead),
      p(t.body),
      `<h2>${esc(t.whoHeading)}</h2>`,
      ul(t.who.map((item) => `<strong>${esc(item.title)}</strong>: ${esc(item.body)}`)),
      `<h2>${esc(t.howHeading)}</h2>`,
      ul(t.how.map((item) => `<strong>${esc(item.title)}</strong>: ${esc(item.body)}`)),
      p("Tell us about your farm on WhatsApp: 96915 55728."),
    ].join("");
  }
  if (path === "/faq") {
    const items = faqItems(catalog.categories, catalog.products);
    return [
      `<h1>Questions people ask</h1>`,
      p("About Re Workshop, the organic food store and café on Ridge Road, Jabalpur."),
      ...items.map((item) => `<section id="${item.id}"><h2>${esc(item.question)}</h2>${p(item.answer)}${item.link ? `<p>${a(item.link.href, item.link.label)}</p>` : ""}</section>`),
    ].join("");
  }
  return null;
}

/** The plain copy of one page, or null for a page without one. */
export function prerenderPage(path: string, catalog: PrerenderCatalog): string | null {
  const body = main(path, catalog);
  return body ? `<div class="prerender">${nav}<main>${body}</main>${footer}</div>` : null;
}

export { faqItems };
