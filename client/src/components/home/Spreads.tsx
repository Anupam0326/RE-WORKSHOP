/**
 * Home sections below the hero (3 Nov 2026: a reviewer found the site cluttered). The home page went from eleven
 * sections to six; each section here says one thing and has one way on to the page that holds the rest.
 *
 * - CafeAndStore: the two halves of Re Workshop side by side, as equals. The café as a photograph of the room; the
 *   store as a two-shelf display of six packs that stand up one after another as the section comes into view (the
 *   products marked "Feature on home page" in /admin come first, so that switch still does something; only products
 *   with a studio pack shot, so every pack looks the same), with the everyday shelves as plain links.
 *   It replaces the café spread, "Shop by shelf" and "Staples to start with".
 * - FarmAndGrain: the farm, edge to edge, then "where did your grain come from?" with the three grains the tracker
 *   follows (data/grainTrack.ts). It replaces the farm spread and "Pick a grain".
 * Photos are site photo slots (data/media.ts): the client's own, never stock. Copy is the brief's, unchanged.
 */

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SiteImage } from "@/components/SiteImage";
import { experience, groceryStore, journey, loop } from "@/data/brand";
import { pickSix, studioPhoto, studioPhotoCount, type Product } from "@/data/catalog";
import { requestTrack, trackOptions } from "@/data/grainTrack";
import { useCatalog } from "@/contexts/CatalogContext";

/** The pack-front studio shot is each product's second photo; products without one show their first photo. */
const PACK = 2;
/** The bowl shot is the third studio photo of each grain. */
const BOWL = 3;

const hasPack = (product: Product) => (studioPhotoCount[product.slug] ?? 0) >= PACK;

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

export function CafeAndStore() {
  const { featured, products, categories } = useCatalog();
  const packs = pickSix(featured.filter(hasPack), products.filter(hasPack));
  // The everyday shelves (the ones with several products each); one-off items stay in the shop.
  const shelves = categories.filter((category) => products.filter((product) => product.categorySlug === category.slug).length >= 3);
  return (
    <section className="section ways" aria-label="The café and the store">
      <div className="wrap ways__grid">
        <article className="way" data-reveal>
          <figure className="way__media">
            <SiteImage slot="home-cafe" sizes="(min-width: 860px) 600px, 100vw" />
          </figure>
          <h2 className="way__title">{experience.heading}</h2>
          <p className="way__text">{experience.openKitchen.body}</p>
          <Link href="/cafe" className="text-link way__go">
            See the café and the menu <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>

        <article className="way" data-reveal>
          <div className="way__media shelf">
            <ul className="shelf__packs" aria-label="Staples to start with">
              {packs.map((product, index) => (
                <Pack key={product.id} product={product} index={index} />
              ))}
            </ul>
          </div>
          <h2 className="way__title">{groceryStore.heading}</h2>
          <p className="way__text">{groceryStore.lines[1]}</p>
          <p className="way__aisles">
            {shelves.map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`}>
                {category.shortName}
              </Link>
            ))}
          </p>
          <Link href="/shop" className="text-link way__go">
            All {products.length} products <ArrowRight size={16} aria-hidden="true" />
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
      <figure className="farm__photo">
        <SiteImage slot="farm" sizes="100vw" />
      </figure>
      <div className="wrap farm__inner">
        <div className="farm__text" data-reveal>
          <h2 id="farm-title">{soil.tagline}</h2>
          <p>{loop.steps[0].paragraphs[1]}</p>
          <Link href="/our-story" className="text-link">
            Our story <ArrowRight size={16} aria-hidden="true" />
          </Link>
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
