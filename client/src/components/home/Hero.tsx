/**
 * Home first screen (3 Nov 2026). A reviewer found the site cluttered and the menu-board hero weak; Anupam asked for a
 * standard hero that does not look generated. One real photograph of the place, the promise, what it is, two doors.
 *
 * The photograph is the shop front on Ridge Road at night (the "home-hero" site photo; the client can replace it in
 * /admin → Site photos). 6 Nov 2026 (Anupam): replaced with an enhanced version of the same shot, 1448 x 1086, so the
 * largest file is 1448 px wide (the 2400 px file is gone). By default it is art-directed: a 16:10 crop for tablets and
 * laptops with the words over its lower left, and a 4:5 crop on phones and upright tablets that keeps the whole
 * "Re Workshop" sign (on phones the words sit on the dark ground below it). An uploaded photo is used as one image for
 * both.
 *
 * The two doors stay equal (client, 18 Oct 2026: café and store carry the same weight), each a page of its own.
 * Motion: the photograph settles from a slight zoom while the lines rise in one after another (index.css,
 * "Home hero"). With reduced motion everything is simply there.
 */

import { ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { useSiteMedia } from "@/components/SiteImage";
import { useCatalog } from "@/contexts/CatalogContext";

function HeroPhoto() {
  const { getMedia } = useCatalog();
  const { photo, alt } = useSiteMedia("home-hero");
  const uploaded = getMedia("home-hero");
  if (uploaded && photo) {
    return (
      <div className="hero__media">
        <img src={photo.url} srcSet={photo.urlSmall ? `${photo.urlSmall} 600w, ${photo.url} 1400w` : undefined} sizes="100vw" width={1400} height={875} alt={alt} fetchPriority="high" decoding="async" />
      </div>
    );
  }
  return (
    <picture className="hero__media">
      {/* Phones, and tablets held upright: the 4:5 crop, which keeps the whole sign in a tall frame. */}
      <source media="(max-width: 639px), (max-width: 1023px) and (orientation: portrait)" srcSet="/site/hero-store-portrait-720.webp 720w, /site/hero-store-portrait-1080.webp 869w" sizes="100vw" width={720} height={900} />
      <img
        src="/site/hero-store-1600.webp"
        srcSet="/site/hero-store-800.webp 800w, /site/hero-store-1600.webp 1448w"
        sizes="100vw"
        width={1448}
        height={905}
        alt="The Re Workshop shop front on Ridge Road at night: the lit sign, and the café open inside"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroPhoto />
      <div className="wrap hero__inner">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__lead">We don’t just sell organic food.</span>{" "}
          <span className="hero__main">We restore life.</span>
        </h1>
        <p className="hero__what">Organic food store and café in Jabalpur.</p>
        <div className="hero__doors">
          <Link href="/cafe" className="btn btn--lime hero__door">
            <UtensilsCrossed size={18} aria-hidden="true" />
            Visit the café
          </Link>
          <Link href="/shop" className="btn btn--white hero__door">
            <ShoppingBasket size={18} aria-hidden="true" />
            Shop the store
          </Link>
        </div>
      </div>
    </section>
  );
}
