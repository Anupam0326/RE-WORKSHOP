/**
 * Hero (18 Oct 2026, impeccable skill, direction "the café menu board"; contract in client/index.html).
 * The promise, what the place is and the two doors (café and store, equal weight, each a page of its own), then the
 * open kitchen's menu board: eight dishes from the café's real menu (data/cafeMenu.ts, 22 Oct 2026), each with the
 * grain its menu description names where a board prints the price. No product, price or buy button on the first screen.
 * Client feedback the same night ("the interface is a little confusing", "make it simpler"): the board is a plain
 * board now, no picking dishes; its one link goes to the full menu on the café page.
 * The open-kitchen photo is the "hero-kitchen" site photo (/admin → Site photos); until the client uploads one, the
 * slot shows the branded placeholder.
 * Motion, the one authored moment: the board's lines are written in once. Nothing moves with reduced motion.
 */

import type { CSSProperties } from "react";
import { ArrowRight, MapPin, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { SectionLink } from "@/components/SectionLink";
import { SiteImage } from "@/components/SiteImage";
import { milletMenu } from "@/data/brand";
import { boardDishes } from "@/data/cafeMenu";
import { storeInfo } from "@/data/catalog";

export function MenuBoard({ link = true }: { link?: boolean }) {
  return (
    <div className="board grain">
      <div className="board__head">
        <h2 className="board__title">{milletMenu.heading}</h2>
        <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="board__place">
          <MapPin size={16} aria-hidden="true" />
          Open kitchen, Ridge Road
        </a>
      </div>
      <ul className="board__list" aria-label="Dishes on the millet menu">
        {boardDishes().map((dish, index) => (
          <li key={dish.id} className="board__dish" style={{ "--n": index } as CSSProperties}>
            <span className="board__name">{dish.name}</span>
            <span className="board__leader" aria-hidden="true" />
            <span className="board__tag">{dish.grain}</span>
          </li>
        ))}
      </ul>
      {link && (
        <p className="board__foot">
          <span>Cooked in front of you, in our open-kitchen café.</span>
          <SectionLink id="menu" page="/cafe" className="board__foot-link">
            See the full menu <ArrowRight size={16} aria-hidden="true" />
          </SectionLink>
        </p>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__inner">
        <div className="hero__top">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__lead">We don’t just sell organic food.</span>{" "}
            <span className="hero__main">We restore life.</span>
          </h1>
          <div className="hero__side">
            <p className="hero__what">Organic food store and café in Jabalpur.</p>
            <div className="hero__doors">
              <Link href="/cafe" className="btn btn--dark hero__door">
                <UtensilsCrossed size={18} aria-hidden="true" />
                Visit the café
              </Link>
              <Link href="/shop" className="btn btn--dark hero__door">
                <ShoppingBasket size={18} aria-hidden="true" />
                Shop the store
              </Link>
            </div>
          </div>
        </div>
        <div className="hero__stage">
          <MenuBoard />
          <figure className="hero__photo">
            <SiteImage slot="hero-kitchen" sizes="(min-width: 1024px) 360px, 100vw" eager />
          </figure>
        </div>
      </div>
    </section>
  );
}
