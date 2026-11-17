// Runs after `vite build` (vercel.json, package.json). 18 Nov 2026.
//
// The site is one page app: the server sends the same index.html for every address and the script draws the page.
// Google runs scripts, but most other crawlers, WhatsApp and Facebook link previews, and AI assistants read only the HTML
// the server sends. So this writes, into dist/public:
//   - <page>/index.html for every real page (home, shop, each shelf, each product, café, our story, for farmers), a copy
//     of index.html with that page's own <title>, description, canonical and share tags (words from
//     client/src/data/seo.json, the same file the pages use);
//   - sitemap.xml listing those pages;
//   - llms.txt, a plain summary of the store and every product for AI assistants (llmstxt.org).
// 18 Nov 2026 (AEO/GEO): each of those pages also gets a plain-HTML copy of its content inside <div id="root">
// (client/src/lib/prerender.ts, bundled here with esbuild), so AI crawlers that don't run scripts read the real words;
// the Questions page (/faq) also gets its FAQPage structured data in the HTML, and llms.txt gets the questions.
// Shelves and products come from the live catalogue in Supabase (public read, the same key the site uses). If it can't
// be reached, the static pages are still written and the build goes on, with a warning.
//
// Test offline: SEO_CATALOG_FILE=catalog.json node scripts/seo-build.mjs  ({ "categories": [...], "products": [...] })

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "dist/public");
const seo = JSON.parse(readFileSync(join(root, "client/src/data/seo.json"), "utf8"));
const SITE = seo.site;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://gzrrwncbouybfitcvkqw.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_eHq3jJOF_y-QqmSx9qIBYw_fSEx92LN";

const template = readFileSync(join(OUT, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error('seo-build: <div id="root"></div> not found in index.html');

// The page builder and the questions are TypeScript in client/src; bundle them once for Node.
const bundled = join(root, "dist/.seo-prerender.mjs");
await build({
  entryPoints: [join(root, "client/src/lib/prerender.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: bundled,
  alias: { "@": join(root, "client/src") },
  logLevel: "warning",
});
const { prerenderPage, faqItems } = await import(pathToFileURL(bundled).href);
rmSync(bundled, { force: true });

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
const plainName = (name) => name.replace(/^The\s+/, "");

// Same rules as client/src/lib/seo.ts.
const categoryMeta = (category) => {
  const own = seo.categories[category.slug] ?? {};
  const values = { name: plainName(category.name), description: (category.description ?? "").trim() };
  return { title: own.title ?? fill(seo.category.title, values), description: own.description ?? fill(seo.category.description, values) };
};
const productMeta = (product) => {
  const about = product.description?.trim() ? ` ${product.description.trim().slice(0, 140)}` : "";
  const values = { name: product.name, pack: product.pack_size ? ` (${product.pack_size})` : "", about };
  return { title: fill(seo.product.title, values), description: fill(seo.product.description, values) };
};

function swap(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`seo-build: could not find ${what} in index.html`);
  return html.replace(pattern, replacement);
}

function pageHtml(path, { title, description }, body, jsonLd) {
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  let html = template;
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, "<title>");
  html = swap(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${d}" />`, "meta description");
  html = swap(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, "canonical");
  html = swap(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, "og:url");
  html = swap(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}" />`, "og:title");
  html = swap(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}" />`, "og:description");
  if (body) html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  // Same id the page's script uses, so it replaces this copy instead of adding a second one.
  if (jsonLd) html = html.replace("</head>", `<script type="application/ld+json" id="page-jsonld">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>\n  </head>`);
  return html;
}

async function loadCatalog() {
  if (process.env.SEO_CATALOG_FILE) return JSON.parse(readFileSync(process.env.SEO_CATALOG_FILE, "utf8"));
  const get = async (query) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  };
  const [categories, products] = await Promise.all([
    get("categories?select=slug,name,short_name,description&order=sort_order.asc,name.asc"),
    get("products?select=slug,name,pack_size,description,updated_at,category:categories(slug)&is_active=eq.true&order=sort_order.asc,name.asc"),
  ]);
  return { categories, products };
}

let catalog = { categories: [], products: [] };
try {
  catalog = await loadCatalog();
} catch (error) {
  console.warn(`seo-build: catalogue not reachable (${error.message}); writing the static pages only.`);
}
// Shelves without products are hidden on the site, so they stay out of the sitemap too.
const categories = catalog.categories.filter((category) => catalog.products.some((product) => product.category?.slug === category.slug));
const products = catalog.products;

// The catalogue in the shape the page builder and the questions use.
const prerenderCatalog = {
  categories: categories.map((category) => ({ slug: category.slug, name: category.name, shortName: category.short_name, description: category.description ?? "" })),
  products: products.map((product) => ({ slug: product.slug, name: product.name, packSize: product.pack_size ?? "", description: product.description ?? "", categorySlug: product.category?.slug ?? "" })),
};
const faq = faqItems(prerenderCatalog.categories, prerenderCatalog.products);
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${SITE}/faq`,
  mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

const pages = [
  ...Object.entries(seo.pages).map(([path, meta]) => ({ path, meta })),
  ...categories.map((category) => ({ path: `/shop/${category.slug}`, meta: categoryMeta(category) })),
  ...products.map((product) => ({ path: `/product/${product.slug}`, meta: productMeta(product), lastmod: product.updated_at?.slice(0, 10) })),
];

for (const page of pages) {
  const file = page.path === "/" ? join(OUT, "index.html") : join(OUT, page.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pageHtml(page.path, page.meta, prerenderPage(page.path, prerenderCatalog), page.path === "/faq" ? faqJsonLd : null));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${SITE}${page.path === "/" ? "/" : page.path}</loc>${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
writeFileSync(join(OUT, "sitemap.xml"), sitemap);

const line = (text) => text.replace(/\s+/g, " ").trim();
const llms = `# Re Workshop

> Organic food store and open-kitchen millet café on Ridge Road, South Civil Lines, Jabalpur, Madhya Pradesh, India. The store sells millets, stone-milled flours, unpolished dals, wood-pressed oils, desi ghee, jaggery, millet snacks and meal premixes; the café cooks millet dishes in an open kitchen, with no maida, refined oil, processed white sugar or corn starch in anything it cooks.

- Address: Shop No. 1-2, opposite Chief Engineer Office, Ridge Road, South Civil Lines, Jabalpur 482001, Madhya Pradesh, India
- Phone and WhatsApp: +91 96915 55728, +91 93730 05077
- Ordering: add products to the basket on the website and send the order on WhatsApp, or buy at the store
- Instagram: https://www.instagram.com/re.workshop_organic/
- Map: https://maps.app.goo.gl/4bGAHXvCBMfjsaHMA

## Pages

${Object.entries(seo.pages).map(([path, meta]) => `- [${line(meta.title.split(" | ")[0])}](${SITE}${path}): ${line(meta.description)}`).join("\n")}

## Shelves

${categories.map((category) => `- [${line(plainName(category.name))}](${SITE}/shop/${category.slug}): ${line(category.description ?? "")}`).join("\n")}

## Questions

${faq.map((item) => `### ${line(item.question)}\n\n${line(item.answer)}${item.link ? ` ${item.link.href.startsWith("http") ? item.link.href : SITE + item.link.href}` : ""}`).join("\n\n")}

## Products

${products.map((product) => `- [${line(product.name)}](${SITE}/product/${product.slug})${product.pack_size ? `: ${line(product.pack_size)}` : ""}`).join("\n")}
`;
writeFileSync(join(OUT, "llms.txt"), llms);

console.log(`seo-build: ${pages.length} pages with their own head (${categories.length} shelves, ${products.length} products), sitemap.xml, llms.txt.`);
if (!existsSync(join(OUT, "robots.txt"))) console.warn("seo-build: robots.txt is missing from dist/public (it lives in client/public).");
