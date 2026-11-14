/**
 * The café page.
 *
 * 15 Nov 2026 (the reviewer's change brief, approved by the client through Anupam). The page is now three things, in
 * the order a visitor asks: what the café is like (the headline with "An Open kitchen" set large, four short pointers,
 * a strip of photos to swipe through, each with its own caption), what it serves (the menu, compact), and how to get
 * there (the footer: address, directions, call, WhatsApp).
 * Gone, because they repeated what the page or the site already says: the two photo cards with "Take a seat at our
 * wellness café and watch your health reset in real-time." and "Live transformation", the dark menu book, the
 * statement "We understand your need to eat healthy in spite of your busy routine!", the No-Compromise panel (one
 * pointer carries it here; the panel is on the home page) and the grocery-store panel (the store is in the navigation).
 *
 * 18 Oct 2026: the café moved off the long home page onto a page of its own. Copy is the client brief's
 * (data/brand.ts). Photos are site photo slots (/admin → Site photos) and the café's own dish photos.
 */

import type { RefObject } from "react";
import { MapPin } from "lucide-react";
import { CarouselControls } from "@/components/CarouselControls";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLink } from "@/components/SectionLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { CafePointers } from "@/components/home/Spreads";
import { CafeMenu, showDish } from "@/components/cafe/CafeMenu";
import { experience } from "@/data/brand";
import { dishPhoto, menuPrice, stripDishes } from "@/data/cafeMenu";
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

/** The café in photos: the room, the kitchen, something from the kitchen, then three dishes from the menu. */
function CafePhotos() {
  const dishes = stripDishes();
  const count = places.length + dishes.length;
  const carousel = useCarousel(count);
  return (
    <div ref={carousel.rootRef as RefObject<HTMLDivElement>} className="strip" data-reveal>
      <div {...carousel.stripProps} className="strip__track" role="group" aria-roledescription="carousel" aria-label="Photos of the café: swipe, or use the arrow keys">
        {places.map((slot, index) => (
          <PlaceSlide key={slot} slot={slot} eager={index === 0} />
        ))}
        {dishes.map((item) => {
          const photo = dishPhoto(item.id)!;
          return (
            <figure key={item.id} className="strip__slide">
              <span className="strip__photo">
                <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} ${photo.widthSmall}w, ${photo.url} ${photo.width}w`} sizes="(min-width: 1024px) 560px, 84vw" width={480} height={480} alt="" loading="lazy" decoding="async" />
              </span>
              <figcaption>
                {item.name}, {menuPrice(item.price)}.{" "}
                <button type="button" className="text-link strip__jump" onClick={() => showDish(item.id)}>
                  See it in the menu
                </button>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <CarouselControls className="strip__ctl" label="Photos of the café" count={count} active={carousel.active} onSelect={carousel.select} onPrevious={carousel.previous} onNext={carousel.next} />
    </div>
  );
}

export default function Cafe() {
  usePageMeta(
    "Open-kitchen millet café",
    "Re Workshop's open-kitchen millet café on Ridge Road, Jabalpur: the full menu with prices, from kodo upma, millet dosa rolls and ragi bread sandwiches to millet ambli and filter coffee, cooked where you can watch. Zero maida, zero refined oil, zero processed white sugar, zero corn starch.",
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
                <SectionLink id="menu" here className="btn btn--dark">
                  See the menu
                </SectionLink>
                <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="btn btn--ghost">
                  <MapPin size={18} aria-hidden="true" /> Get directions
                </a>
              </div>
            </div>
            <CafePhotos />
          </div>
        </section>

        <CafeMenu />
      </main>
      <SiteFooter />
    </div>
  );
}
