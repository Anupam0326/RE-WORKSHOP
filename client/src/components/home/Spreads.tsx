/**
 * Home sections below the hero.
 *
 * 15 Nov 2026 (the reviewer's change brief, approved by the client through Anupam):
 * - CafeAndStore now follows the hero directly (the consultation band moved to the end of the page). The café half is
 *   words, not another photo of the room (the hero strip already shows it): "An Open kitchen" set large, the rest of the
 *   client's line smaller, then three short pointers that say what a visitor can see, eat and take home, on the brand's
 *   dark green. The store half keeps its shelf of real packs, minus the bare noodle block (it read as instant noodles,
 *   the wrong signal for an organic store), with the heading on one line, the product count right under it, a plainer
 *   sentence and a button instead of a text link.
 * - FarmAndGrain: unchanged in shape. "Pick a grain" already sits inside the farm story (the brief asked for grain
 *   tracking not to stand alone); a second link now leads to the For farmers page, so the people who farm this way are
 *   one tap away from the farm photo.
 *
 * 3 Nov 2026: the home page went from eleven sections to six; each section says one thing and has one way on to the
 * page that holds the rest. Photos are site photo slots (data/media.ts): the client's own, never stock.
 */

import type { CSSProperties } from "react";
import { ArrowRight, Ban, Eye, UtensilsCrossed, Wheat } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SiteImage } from "@/components/SiteImage";
import { experience, groceryStore, journey, loop } from "@/data/brand";
// Three numbers from the menu (how many dishes, lowest and highest price), written by scripts/cafe-menu.mjs. The menu
// itself is not imported here: the home page must not carry all 65 dishes in the first script a visitor downloads.
import menuStats from "@/data/cafeMenuStats.json";
import { formatInr, pickSix, studioPhoto, studioPhotoCount, type Product } from "@/data/catalog";
import { requestTrack, trackOptions } from "@/data/grainTrack";
import { useCatalog } from "@/contexts/CatalogContext";

/** The pack-front studio shot is each product's second photo; products without one show their first photo. */
const PACK = 2;
/** The bowl shot is the third studio photo of each grain. */
const BOWL = 3;

/** Noodles and pasta are photographed out of the pack, so on the shelf they look like instant noodles: packs only. */
const hasPack = (product: Product) => (studioPhotoCount[product.slug] ?? 0) >= PACK && !/noodle|pasta/i.test(product.group);

function Pack({ product, index }: { product: Product; index: number }) {
  const photo = studioPhoto(product.slug, PACK);
  return (
    <li className="shelf__pack" style={{ "--i": index } as CSSProperties}>
      <Link href={`/product/${product.slug}`} className="shelf__link">
        <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} 480w, ${photo.url} 960w`} sizes="(min-width: 860px) 180px, 30vw" width={480} height={480} alt={product.name} loading="lazy" decoding="async" />
      </Link>
    </li>
  );
}

/** What a visitor can see, eat and take home at the café; `withCode` adds the food promise where the code itself is not on the page. */
export function CafePointers({ withCode = false, dark = false }: { withCode?: boolean; dark?: boolean }) {
  const { pointers } = experience;
  const items = [
    { icon: Eye, title: pointers.watch.title, body: pointers.watch.body },
    { icon: UtensilsCrossed, title: pointers.menu.title(menuStats.count), body: pointers.menu.body(formatInr(menuStats.low), formatInr(menuStats.high)) },
    ...(withCode ? [{ icon: Ban, title: pointers.code.title, body: pointers.code.body }] : []),
    { icon: Wheat, title: pointers.home.title, body: pointers.home.body },
  ];
  return (
    <ul className={dark ? "pointers pointers--dark" : "pointers"}>
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title}>
          <span className="pointers__icon" aria-hidden="true">
            <Icon size={18} />
          </span>
          <p>
            <strong>{title}</strong>
            <span>{body}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function CafeAndStore() {
  const { featured, products, categories } = useCatalog();
  const packs = pickSix(featured.filter(hasPack), products.filter(hasPack));
  // The everyday shelves (the ones with several products each); one-off items stay in the shop.
  const shelves = categories.filter((category) => products.filter((product) => product.categorySlug === category.slug).length >= 3);
  const [big, rest] = experience.headingParts;
  return (
    <section className="section ways" aria-label="The café and the store">
      <div className="wrap ways__grid">
        <article className="way kitchen grain" data-reveal>
          {/* 18 Nov 2026 (client): the real open kitchen, above "Watch it cooked". */}
          <div className="kitchen__photo">
            <SiteImage slot="home-watch" sizes="(min-width: 860px) 46vw, 92vw" />
          </div>
          <h2 className="kitchen__title">
            <span className="kitchen__big">{big}</span> <span className="kitchen__rest">{rest}</span>
          </h2>
          <CafePointers dark />
          <Link href="/cafe" className="btn btn--lime kitchen__go">
            See the café and the menu <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>

        <article className="way" data-reveal>
          {packs.length > 0 && (
            <div className="way__media shelf">
              <ul className="shelf__packs" aria-label="Staples to start with">
                {packs.map((product, index) => (
                  <Pack key={product.id} product={product} index={index} />
                ))}
              </ul>
            </div>
          )}
          <h2 className="way__title way__title--line">{groceryStore.heading}</h2>
          <p className="way__count">{groceryStore.count(products.length)}</p>
          <p className="way__text">{groceryStore.plain}</p>
          <p className="way__aisles">
            {shelves.map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`}>
                {category.shortName}
              </Link>
            ))}
          </p>
          <Link href="/shop" className="btn btn--dark way__go">
            {groceryStore.cta} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
      </div>
    </section>
  );
}

export function FarmAndGrain() {
  const soil = journey[0];
  const { getProduct } = useCatalog();
  const [, navigate] = useLocation();
  const grains = trackOptions
    .filter(({ slug }) => (studioPhotoCount[slug] ?? 0) >= BOWL && getProduct(slug))
    .map(({ slug, label }) => ({ slug, name: label }));
  const open = (slug: string) => {
    requestTrack(slug);
    navigate("/our-story#trace");
  };
  return (
    <section className="farm" aria-labelledby="farm-title">
      {/* 15 Nov 2026 (the reviewer's brief): the heading is written on the photo, over a soft dark fade at its foot. */}
      <div className="farm__photo">
        <SiteImage slot="farm" sizes="100vw" />
        <div className="wrap farm__over">
          <h2 id="farm-title">{soil.tagline}</h2>
        </div>
      </div>
      <div className="wrap farm__inner">
        <div className="farm__text" data-reveal>
          <p>{loop.steps[0].paragraphs[1]}</p>
          <p className="farm__links">
            <Link href="/our-story" className="text-link">
              Our story <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/farmers" className="text-link">
              For farmers: farm with us <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
        {grains.length > 0 && (
          <div className="farm__track" data-reveal>
            <h3>
              {loop.trace.question} <span className="tone-mute">Pick a grain.</span>
            </h3>
            <ul className={`bowls bowls--${grains.length}`}>
              {grains.map((grain, index) => {
                const photo = studioPhoto(grain.slug, BOWL);
                return (
                  <li key={grain.slug} style={{ "--i": index } as CSSProperties}>
                    <a
                      href="/our-story#trace"
                      className="bowl"
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                        event.preventDefault();
                        open(grain.slug);
                      }}
                    >
                      <span className="bowl__photo">
                        <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} 480w, ${photo.url} 960w`} sizes="(min-width: 1024px) 200px, 30vw" width={480} height={480} alt="" loading="lazy" decoding="async" />
                      </span>
                      <span className="bowl__name">{grain.name}</span>
                      <span className="bowl__go">
                        Track it <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
