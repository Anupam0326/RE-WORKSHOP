/**
 * The café page (18 Oct 2026). The client found the site confusing to navigate ("shop and café and products"), so
 * the café moved off the long home page onto a page of its own: the open kitchen, the full menu (22 Oct 2026), the
 * No-Compromise Code, then the way into the store. Copy is the client brief's (data/brand.ts).
 * Photos are site photo slots (/admin → Site photos); empty slots show the branded placeholder.
 */

import { ArrowRight, MapPin, Phone, ShoppingBasket } from "lucide-react";
import { Link } from "wouter";
import { PageIntro } from "@/components/PageIntro";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteImage } from "@/components/SiteImage";
import { NoCompromise } from "@/components/home/CafeSections";
import { CafeMenu } from "@/components/cafe/CafeMenu";
import { BrandStatement } from "@/components/home/StorySections";
import { experience, groceryStore } from "@/data/brand";
import { storeInfo } from "@/data/catalog";
import type { MediaSlotKey } from "@/data/media";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const features: { title: string; body: string; photo: MediaSlotKey }[] = [
  { title: experience.openKitchen.title, body: experience.openKitchen.body, photo: "cafe-kitchen" },
  { title: experience.live.title, body: experience.live.body, photo: "cafe-shelf" },
];

export default function Cafe() {
  usePageMeta(
    "Open-kitchen millet café",
    "Re Workshop's open-kitchen millet café on Ridge Road, Jabalpur: the full menu with prices, from kodo upma, millet dosa rolls and ragi bread sandwiches to millet ambli and filter coffee, cooked where you can watch. Zero maida, zero refined oil, zero processed white sugar, zero corn starch.",
  );
  useReveal();
  useHashScroll();
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <PageIntro
          quiet="The café."
          title={experience.heading}
          photo="cafe-intro"
          actions={
            <>
              <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="btn btn--dark">
                <MapPin size={18} aria-hidden="true" /> Get directions
              </a>
              <a href={`tel:${storeInfo.phones[0].tel}`} className="btn btn--ghost">
                <Phone size={18} aria-hidden="true" /> Call {storeInfo.phones[0].display}
              </a>
            </>
          }
        >
          <p className="intro__text intro__text--lead">{experience.invite}</p>
          <p className="intro__text">{experience.concept}</p>
        </PageIntro>

        <section className="section" aria-label="Inside the café">
          <div className="wrap duo">
            {features.map((item) => (
              <article key={item.title} className="duo__item" data-reveal>
                <figure className="duo__photo">
                  <SiteImage slot={item.photo} sizes="(min-width: 860px) 580px, 100vw" />
                </figure>
                <h2 className="duo__title">{item.title}</h2>
                <p className="duo__body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <CafeMenu />

        <BrandStatement light />
        <NoCompromise />

        <section className="section section--flush-top" aria-labelledby="take-home-title">
          <div className="wrap">
            <div className="panel panel--mist cta-panel">
              <h2 id="take-home-title">{groceryStore.heading}</h2>
              <p>{groceryStore.lines[0]}</p>
              <Link href="/shop" className="btn btn--dark">
                <ShoppingBasket size={18} aria-hidden="true" /> Shop the store <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
