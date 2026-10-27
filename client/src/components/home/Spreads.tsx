/**
 * Home page spreads (22 Oct 2026, impeccable skill: "magazine spreads", safer re-roll; contract in client/index.html).
 * Below the menu board the home page reads like a magazine: alternating photo-led spreads, each one idea with one way
 * out to the page that holds the rest (client feedback 18 Oct: richer is fine, confusing is not).
 * Photos are site photo slots (data/media.ts): the client's own café and farm photos, never stock. Copy is the brief's.
 */

import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { experience, journey, loop, meaning } from "@/data/brand";
import { studioPhoto, studioPhotoCount } from "@/data/catalog";
import { requestTrack } from "@/data/grainTrack";
import type { MediaSlotKey } from "@/data/media";
import { useCatalog } from "@/contexts/CatalogContext";

function SpreadPhoto({ slot, className, sizes }: { slot: MediaSlotKey; className: string; sizes: string }) {
  const { caption } = useSiteMedia(slot);
  return (
    <figure className={className}>
      <SiteImage slot={slot} sizes={sizes} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

type SpreadProps = {
  id?: string;
  title: string;
  children: ReactNode;
  main: MediaSlotKey;
  inset: MediaSlotKey;
  flip?: boolean;
  /** "bleed": the main photo runs edge to edge across the page, the words sit below it. */
  scale?: "column" | "bleed";
  tone?: "paper" | "mist";
};

/** One spread: words on one side, a large photo with a smaller one laid over its corner on the other. */
function Spread({ id, title, children, main, inset, flip = false, scale = "column", tone = "paper" }: SpreadProps) {
  const headingId = `${id ?? main}-title`;
  const text = (
    <div className="spread__text" data-reveal>
      <h2 id={headingId} className="spread__title">
        {title}
      </h2>
      {children}
    </div>
  );
  if (scale === "bleed") {
    return (
      <section id={id} className={`spread spread--bleed spread--${tone}`} aria-labelledby={headingId}>
        <div className="spread__band">
          <SpreadPhoto slot={main} className="spread__main" sizes="100vw" />
        </div>
        <div className="wrap spread__inner">
          {text}
          <SpreadPhoto slot={inset} className="spread__inset" sizes="(min-width: 1024px) 340px, 50vw" />
        </div>
      </section>
    );
  }
  return (
    <section id={id} className={`spread spread--${tone}${flip ? " spread--flip" : ""}`} aria-labelledby={headingId}>
      <div className="wrap spread__inner">
        {text}
        <div className="spread__media" data-reveal>
          <SpreadPhoto slot={main} className="spread__main" sizes="(min-width: 1024px) 680px, 100vw" />
          <SpreadPhoto slot={inset} className="spread__inset" sizes="(min-width: 1024px) 300px, 45vw" />
        </div>
      </div>
    </section>
  );
}

export function CafeSpread() {
  return (
    <Spread id="cafe-spread" title={experience.heading} main="store" inset="cafe-plate">
      <p className="spread__lead">{experience.openKitchen.body}</p>
      <p className="spread__body">{experience.live.body}</p>
      <div className="spread__links">
        <Link href="/cafe" className="btn btn--dark">
          See the café <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Spread>
  );
}

export function FarmSpread() {
  const soil = journey[0];
  return (
    <Spread id="farm-spread" title={soil.tagline} main="farm" inset="farm-2" scale="bleed" tone="mist">
      <p className="spread__lead">{loop.steps[0].paragraphs[1]}</p>
      <p className="spread__body">{soil.description}</p>
      <div className="spread__links">
        <Link href="/our-story" className="btn btn--dark">
          Our story <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Spread>
  );
}

/** The millets, each in its studio bowl: pick one and the grain tracker on Our story opens on it. */
const DOOR_GRAINS = ["kodo-millet", "kutki-millet", "kangani-millet", "browntop-millet", "sama-millet", "ragi-millet-aata"];
/** The bowl shot is the third studio photo of each grain. */
const BOWL = 3;

export function GrainDoor() {
  const { getProduct } = useCatalog();
  const [, navigate] = useLocation();
  const grains = DOOR_GRAINS.filter((slug) => (studioPhotoCount[slug] ?? 0) >= BOWL)
    .map((slug) => ({ slug, name: getProduct(slug)?.name }))
    .filter((grain): grain is { slug: string; name: string } => Boolean(grain.name));
  if (grains.length < 3) return null;
  const shown = grains.slice(0, grains.length >= 6 ? 6 : 3);
  const open = (slug: string) => {
    requestTrack(slug);
    navigate("/our-story#trace");
  };
  return (
    <section className="section grain-door" aria-labelledby="grain-door-title">
      <div className="wrap">
        <header className="head head--row">
          <h2 id="grain-door-title">
            <span className="tone-mute">{loop.trace.question}</span> Pick a grain.
          </h2>
          <p className="head__intro grain-door__intro">Dig down from the pack on our shelf to the seed it grew from.</p>
        </header>
        <ul className="grain-door__row">
          {shown.map((grain, index) => {
            const photo = studioPhoto(grain.slug, BOWL);
            return (
              <li key={grain.slug} style={{ "--i": index } as CSSProperties}>
                <a
                  href="/our-story#trace"
                  className="grain-door__bowl"
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                    event.preventDefault();
                    open(grain.slug);
                  }}
                >
                  <span className="grain-door__photo">
                    <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} 480w, ${photo.url} 960w`} sizes="(min-width: 1024px) 190px, (min-width: 640px) 30vw, 45vw" width={480} height={480} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="grain-door__name">{grain.name}</span>
                  <span className="grain-door__go">
                    Track it <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** The name, set as type: one huge Re and the five things it stands for, then what a workshop is. */
export function NameSpread() {
  return (
    <section className="section name-spread" aria-labelledby="name-title">
      <div className="wrap">
        <div className="panel panel--dark grain name-spread__panel">
          <ReMark className="name-spread__seal" />
          <h2 id="name-title" className="name-spread__title">
            {meaning.heading}
          </h2>
          <div className="name-spread__grid">
            <p className="name-spread__re" aria-hidden="true">
              Re
            </p>
            <ul className="name-spread__points" aria-label={meaning.re.lead}>
              {meaning.re.points.map((point) => (
                <li key={point} data-reveal>
                  {point.startsWith("Re") ? (
                    <>
                      <span className="re-prefix">Re</span>
                      {point.slice(2)}
                    </>
                  ) : (
                    point
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="name-spread__workshop">{meaning.workshop.lead}</p>
          <Link href="/our-story" className="text-link text-link--light">
            Read our story <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
