/**
 * Our story (18 Oct 2026). The client asked for a more personal story with pictures of the farm, the café and the
 * founders (references: eastindiahouse.com, bombaysweetshop.com/pages/about-us). This page holds everything we know
 * to be true, in the brief's own words: the belief, the founders, what Re Workshop is today, the name, the seven
 * steps on the self-playing arc, and "Track your grain". "How it began" shows a marked place until the founders have written it
 * (data/brand.ts → origin). Photos are site photo slots; empty ones show the branded placeholder or the founder's monogram.
 */

import { ArrowRight, Info, MessageCircle, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { PageIntro } from "@/components/PageIntro";
import { SectionLink } from "@/components/SectionLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { Founders } from "@/components/home/Founders";
import { JourneyArc } from "@/components/home/JourneyArc";
import { Meaning, SoilToPlate } from "@/components/home/StorySections";
import { consultation, experience, intro, journey, legalEntity, origin } from "@/data/brand";
import { sitePhoto, type SitePhotoName } from "@/data/sitePhotos";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const [beliefLead, beliefMain] = intro.belief.split(": ");

/** "How it began": Dr. Swati's story (data/brand.ts → origin), always with its safety note and the way to her free consultation. */
function Origin() {
  if (!origin) {
    return (
      <section className="section chapter" aria-labelledby="origin-title">
        <div className="wrap chapter__inner">
          <h2 id="origin-title">How Re Workshop began</h2>
          <div className="chapter__slot">
            <ReMark className="chapter__mark" />
            <p>Coming soon: the story of how Re Workshop began, in the founders’ own words.</p>
          </div>
        </div>
      </section>
    );
  }
  const [first, ...rest] = origin.paragraphs;
  return (
    <section className="section chapter" aria-labelledby="origin-title">
      <div className="wrap chapter__inner">
        <h2 id="origin-title">{origin.heading}</h2>
        <div className="chapter__text" data-reveal>
          <p className="chapter__lead">{first}</p>
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <p className="chapter__note">
            <Info size={17} aria-hidden="true" />
            <span>{origin.note}</span>
          </p>
          <SectionLink id="consult" className="founder__consult chapter__consult">
            <MessageCircle size={16} aria-hidden="true" /> {consultation.founderLink}
          </SectionLink>
        </div>
      </div>
    </section>
  );
}

/**
 * The client's own farm photos (she asked for the farm to be seen). 23 Oct 2026: seed work only, no vegetables, and
 * none of these photos is used anywhere else on the site. Alt text says only what is in each photo.
 */
const fieldPhotos: { name: SitePhotoName; alt: string }[] = [
  { name: "seed-sowing", alt: "Women sowing seed by hand from a basket into freshly tilled soil" },
  { name: "seed-young-crop", alt: "Three women weeding a young green crop with hand hoes" },
  { name: "seed-grain-field", alt: "A green grain field at sunrise, a footpath running through it" },
];

function Fields() {
  return (
    <section className="section fields" aria-labelledby="fields-title">
      <div className="wrap">
        <header className="head head--row">
          <h2 id="fields-title">{journey[0].tagline}</h2>
        </header>
        <ul className="fields__row">
          {fieldPhotos.map(({ name, alt }) => {
            const photo = sitePhoto(name);
            return (
              <li key={name} className="fields__photo" data-reveal>
                <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} ${photo.widthSmall}w, ${photo.url} ${photo.width}w`} sizes="(min-width: 640px) 33vw, 100vw" width={800} height={600} alt={alt} loading="lazy" decoding="async" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Today() {
  const { caption } = useSiteMedia("story-today");
  return (
    <section id="today" className="band band--mist today" aria-labelledby="today-title">
      <div className="wrap today__inner">
        <div className="today__text" data-reveal>
          <h2 id="today-title">
            <span className="tone-mute">Re Workshop today.</span> A store and an open-kitchen café on Ridge Road.
          </h2>
          <p>{experience.concept}</p>
          {legalEntity && <p className="today__entity">{intro.ownership(legalEntity)}</p>}
          <div className="today__actions">
            <Link href="/cafe" className="btn btn--dark">
              <UtensilsCrossed size={18} aria-hidden="true" /> Visit the café
            </Link>
            <Link href="/shop" className="btn btn--dark">
              <ShoppingBasket size={18} aria-hidden="true" /> Shop the store
            </Link>
          </div>
        </div>
        <figure className="today__photo">
          <SiteImage slot="story-today" sizes="(min-width: 1024px) 560px, 100vw" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      </div>
    </section>
  );
}

export default function Story() {
  usePageMeta(
    "Our story",
    "Why Re Workshop exists: Amrit Krishi soil, heritage seeds, stone-milled grains and an open-kitchen café in Jabalpur, and the three founders behind it.",
  );
  useReveal();
  useHashScroll();
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <PageIntro lead={`${beliefLead}:`} title={`${beliefMain[0].toUpperCase()}${beliefMain.slice(1)}`} photo="story-intro">
          <p className="intro__text intro__text--lead">{intro.conscious}</p>
          <SectionLink id="founders" here className="text-link">
            Meet the founders <ArrowRight size={16} aria-hidden="true" />
          </SectionLink>
        </PageIntro>
        <Origin />
        <Fields />
        <Founders />
        <Today />
        <Meaning />
        <JourneyArc />
        <SoilToPlate />
      </main>
      <SiteFooter />
    </div>
  );
}
