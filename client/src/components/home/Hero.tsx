/**
 * Home first screen.
 *
 * 15 Nov 2026 (the reviewer's change brief, approved by the client through Anupam): one photograph became a strip of
 * photographs the visitor swipes through, like an Instagram post, because a first-time visitor on a phone saw the sign
 * and two buttons and could not tell what the place offers. Each photo shows one thing (the shop front, inside, a dish,
 * the farm) and the line under the headline changes with the photo on screen. The headline is new too: the reviewer's
 * "We make food for your parents, grandparents and your kids" in place of "We don’t just sell organic food. We restore
 * life." (data/brand.ts → hero). The free-consultation band no longer follows the hero; it closes the page.
 *
 * Photos are site photo slots (/admin → Site photos), the client's own, never stock. Two slots have no photo yet (the
 * open kitchen, the store's shelves); they join the strip by themselves when the store uploads one. By default each
 * photo is art-directed: a 16:10 crop for tablets and laptops and a 4:5 crop for phones and upright tablets. An
 * uploaded photo is used as one image for both.
 *
 * Weight: only the first photo loads with the page (high priority); the rest wait until the page has finished loading
 * and then load one ahead of the photo on screen, or wait for a swipe if the phone's data saver is on
 * (hooks/useCarousel.ts). The swipe is the browser's own
 * scroll snapping. The strip turns by itself every few seconds until it is touched, and never with reduced motion.
 *
 * The two doors stay equal (client, 18 Oct 2026: café and store carry the same weight), each a page of its own.
 */

import { ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { CarouselControls } from "@/components/CarouselControls";
import { useCatalog } from "@/contexts/CatalogContext";
import { hero } from "@/data/brand";
import type { MediaSlotKey } from "@/data/media";
import { useCarousel } from "@/hooks/useCarousel";

type Art = {
  /** File name stem in /site: <stem>-800.webp, <stem>-1600.webp, <stem>-portrait-720.webp, <stem>-portrait-1080.webp. */
  stem: string;
  /** Real pixel widths of the 16:10 "1600" file and the 4:5 "1080" file (phone photos are smaller than their names). */
  wide: number;
  tall: number;
  alt: string;
};

type Slide = { slot: MediaSlotKey; art: Art | null; caption: string; uploadedCaption?: string };

const slides = (productCount: number): Slide[] => [
  { slot: "home-hero", art: { stem: "hero-store", wide: 1448, tall: 869, alt: "The Re Workshop shop front on Ridge Road at night: the lit sign, and the café open inside" }, caption: hero.captions.front },
  { slot: "home-cafe", art: { stem: "hero-inside", wide: 1158, tall: 695, alt: "Inside Re Workshop: a café table in the middle of the room, shelves of packed grains and flours along the walls" }, caption: hero.captions.inside },
  { slot: "home-kitchen", art: null, caption: hero.captions.kitchen },
  { slot: "home-dish", art: { stem: "hero-dish", wide: 1200, tall: 1080, alt: "Besan Cheela on a plate, folded, with chutneys" }, caption: hero.captions.dish, uploadedCaption: hero.captions.dishGeneric },
  { slot: "home-shelves", art: null, caption: hero.captions.shelves(productCount) },
  { slot: "home-farm", art: { stem: "hero-farm", wide: 960, tall: 960, alt: "Mustard in flower at the edge of a green field on the farm" }, caption: hero.captions.farm },
];

function SlidePhoto({ slide, first, uploaded }: { slide: Slide; first: boolean; uploaded: { url: string; urlSmall: string | null; alt: string } | undefined }) {
  // Later photos are only put on the page when they are next in line (useCarousel → mayLoad), so they can load at once.
  const loading = "eager";
  const priority = first ? "high" : "low";
  if (uploaded) {
    return <img src={uploaded.url} srcSet={uploaded.urlSmall ? `${uploaded.urlSmall} 600w, ${uploaded.url} 1400w` : undefined} sizes="100vw" width={1400} height={875} alt={uploaded.alt || slide.caption} loading={loading} fetchPriority={priority} decoding="async" />;
  }
  const art = slide.art!;
  return (
    <picture>
      {/* Tablets held upright (full-screen hero): the 4:5 crop. 18 Nov 2026 (client): phones show the whole landscape
          photo instead of a tall crop, so phones fall through to the 16:10 files below. */}
      <source
        media="(min-width: 640px) and (max-width: 1023px) and (orientation: portrait)"
        srcSet={`/site/${art.stem}-portrait-720.webp ${Math.min(720, art.tall)}w, /site/${art.stem}-portrait-1080.webp ${art.tall}w`}
        sizes="100vw"
        width={720}
        height={900}
      />
      <img src={`/site/${art.stem}-1600.webp`} srcSet={`/site/${art.stem}-800.webp 800w, /site/${art.stem}-1600.webp ${art.wide}w`} sizes="100vw" width={1448} height={905} alt={art.alt} loading={loading} fetchPriority={priority} decoding="async" />
    </picture>
  );
}

export function Hero() {
  const { getMedia, products } = useCatalog();
  // A slide exists when the store has uploaded its photo or the site carries a default for it.
  const shown = slides(products.length)
    .map((slide) => ({ slide, uploaded: getMedia(slide.slot) }))
    .filter(({ slide, uploaded }) => uploaded || slide.art);
  // 18 Nov 2026 (client: "slideshow is slow"): a new photo every 4 seconds (was 6.5).
  const carousel = useCarousel(shown.length, { auto: 4000 });
  const current = shown[Math.min(carousel.active, shown.length - 1)];
  const caption = current.uploaded ? current.uploaded.caption || current.slide.uploadedCaption || current.slide.caption : current.slide.caption;

  return (
    <section ref={carousel.rootRef} className="hero" aria-labelledby="hero-title">
      <div {...carousel.stripProps} className="hero__strip" role="group" aria-roledescription="carousel" aria-label="Photos of Re Workshop: swipe, or use the arrow keys">
        {shown.map(({ slide, uploaded }, index) => (
          <div key={slide.slot} className="hero__slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${shown.length}`}>
            {carousel.mayLoad(index) && <SlidePhoto slide={slide} first={index === 0} uploaded={uploaded} />}
          </div>
        ))}
      </div>
      <div className="wrap hero__inner">
        <CarouselControls
          className="hero__ctl"
          label="Photos of Re Workshop"
          count={shown.length}
          active={carousel.active}
          onSelect={carousel.select}
          onPrevious={carousel.previous}
          onNext={carousel.next}
          playing={carousel.playing}
          onToggle={carousel.canPlay ? carousel.toggle : undefined}
        />
        <h1 id="hero-title" className="hero__title">
          <span className="hero__lead">{hero.lead}</span> <span className="hero__main">{hero.main}</span>
        </h1>
        {/* One line per photo. The key restarts the fade so the change is seen; screen readers hear the new line. */}
        <p className="hero__what" aria-live="polite">
          <span key={current.slide.slot}>{caption}</span>
        </p>
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
