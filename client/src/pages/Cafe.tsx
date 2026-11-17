/**
 * The café page.
 *
 * 18 Nov 2026 (Anupam): the café menu is gone from the site, with every price and the count of dishes; "Our popular
 * options" (components/cafe/PopularDishes.tsx) takes its place: six dishes, named on their photos. The photo strip
 * keeps the three photos of the place; its dish slides (name and price) went with the menu. The menu data stays in
 * content/cafe-menu/ for when it is wanted back; the menu component is in _backup/menu-removed-2026-11-18/.
 *
 * 15 Nov 2026 (the reviewer's change brief): the headline with "An Open kitchen" large, short pointers, a strip of
 * photos to swipe through, each with its own caption. Gone then: the two photo cards, the dark menu book, the brand
 * statement, the No-Compromise panel and the grocery-store panel.
 *
 * 18 Oct 2026: the café moved off the long home page onto a page of its own. Copy is the client brief's
 * (data/brand.ts). Photos are site photo slots (/admin → Site photos).
 */

import type { RefObject } from "react";
import { MapPin } from "lucide-react";
import { CarouselControls } from "@/components/CarouselControls";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLink } from "@/components/SectionLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { CafePointers } from "@/components/home/Spreads";
import { PopularDishes } from "@/components/cafe/PopularDishes";
import { experience } from "@/data/brand";
import { storeInfo } from "@/data/catalog";
import type { MediaSlotKey } from "@/data/media";
import { useCarousel } from "@/hooks/useCarousel";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const places: MediaSlotKey[] = ["cafe-intro", "cafe-kitchen", "cafe-shelf"];

function PlaceSlide({ slot, eager }: { slot: MediaSlotKey; eager: boolean }) {
  const { caption } = useSiteMedia(slot);
  return (
    <figure className="strip__slide">
      <span className="strip__photo">
        <SiteImage slot={slot} sizes="(min-width: 1024px) 560px, 84vw" eager={eager} />
      </span>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The café in photos: the room, the kitchen, something from the kitchen. */
function CafePhotos() {
  const count = places.length;
  const carousel = useCarousel(count);
  return (
    <div ref={carousel.rootRef as RefObject<HTMLDivElement>} className="strip" data-reveal>
      <div {...carousel.stripProps} className="strip__track" role="group" aria-roledescription="carousel" aria-label="Photos of the café: swipe, or use the arrow keys">
        {places.map((slot, index) => (
          <PlaceSlide key={slot} slot={slot} eager={index === 0} />
        ))}
      </div>
      <CarouselControls className="strip__ctl" label="Photos of the café" count={count} active={carousel.active} onSelect={carousel.select} onPrevious={carousel.previous} onNext={carousel.next} />
    </div>
  );
}

export default function Cafe() {
  usePageMeta(
    "Open-kitchen millet café",
    "Re Workshop's open-kitchen millet café on Ridge Road, Jabalpur: ragi bread sandwiches, creamy millet pasta, millet dhokla chaat and more, cooked where you can watch. Zero maida, zero refined oil, zero processed white sugar, zero corn starch.",
  );
  useReveal();
  useHashScroll();
  const [big, rest] = experience.headingParts;
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <section className="intro cafe-top" aria-labelledby="page-title">
          <div className="wrap intro__inner cafe-top__inner">
            <div className="cafe-top__text">
              <h1 id="page-title" className="cafe-top__title">
                <span className="cafe-top__big">{big}</span> <span className="cafe-top__rest">{rest}</span>
              </h1>
              <CafePointers withCode />
              <div className="intro__actions">
                <SectionLink id="popular" here className="btn btn--dark">
                  Our popular options
                </SectionLink>
                <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="btn btn--ghost">
                  <MapPin size={18} aria-hidden="true" /> Get directions
                </a>
              </div>
            </div>
            <CafePhotos />
          </div>
        </section>

        <PopularDishes />
      </main>
      <SiteFooter />
    </div>
  );
}
