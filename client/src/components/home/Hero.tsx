/** Hero: brand welcome, the core promise, and the SOIL → HEALTH journey. Text is the LCP; photos are small. */

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { SectionLabel } from "@/components/SectionLabel";
import { SectionLink } from "@/components/SectionLink";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { intro, journey } from "@/data/brand";
import type { MediaSlotKey } from "@/data/media";

/** Photos are swappable in /admin → Site photos; the eyebrow stays, the caption comes with the photo. */
const heroTiles: { slot: MediaSlotKey; eyebrow: string }[] = [
  { slot: "hero-shelf", eyebrow: "On the shelf" },
  { slot: "hero-plate", eyebrow: "On the plate" },
  { slot: "hero-glass", eyebrow: "In the glass" },
];

function HeroTile({ slot, eyebrow, index }: { slot: MediaSlotKey; eyebrow: string; index: number }) {
  const { caption } = useSiteMedia(slot);
  return (
    <figure className={`hero-tile hero-tile--${index + 1}`}>
      <SiteImage slot={slot} sizes="(min-width: 860px) 240px, 34vw" eager={index === 0} />
      <figcaption>
        <span>{eyebrow}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Hero() {
  const [activeStep, setActiveStep] = useState(journey.length - 1);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <SectionLabel>{intro.welcome}</SectionLabel>
          <h1 id="hero-title" className="hero__title">
            We don't just sell organic food — <em>we restore life.</em>
          </h1>
          <p className="hero__lead">{intro.belief}</p>
          <div className="hero__actions">
            <Link href="/shop" className="button button--forest">
              Shop the store <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <SectionLink id="cafe" className="button button--outline">
              Visit the café
            </SectionLink>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <ReMark className="hero__seal" />
          {heroTiles.map((tile, index) => (
            <HeroTile key={tile.slot} slot={tile.slot} eyebrow={tile.eyebrow} index={index} />
          ))}
        </div>
      </div>

      <nav className="journey" aria-label="Our soil-to-health organic food journey">
        <ol className="journey__list" role="tablist" aria-label="Soil to health steps">
          {journey.map((step, index) => (
            <li key={step.label} className="journey__item">
              <button
                role="tab"
                type="button"
                className={`journey__step${index === activeStep ? " journey__step--active" : ""}`}
                aria-selected={index === activeStep}
                aria-controls="journey-panel"
                onClick={() => setActiveStep(index)}
              >
                <span className="journey__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.label}
              </button>
            </li>
          ))}
        </ol>

        <div
          id="journey-panel"
          role="tabpanel"
          className="journey__detail"
          aria-label={`${journey[activeStep].label} — ${journey[activeStep].tagline}`}
        >
          <p className="journey__tagline">{journey[activeStep].tagline}</p>
          <p className="journey__desc">{journey[activeStep].description}</p>
        </div>
      </nav>
    </section>
  );
}

