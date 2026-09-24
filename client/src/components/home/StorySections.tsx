/** Who we are, the meaning of the name, the Soil-to-Plate Loop and the key brand statement. */

import { Ban, Cog, Droplets, Hammer, Hand, Layers, Soup, Sprout } from "lucide-react";
import { ReMark } from "@/components/BrandMark";
import { SectionLabel } from "@/components/SectionLabel";
import { brandStatement, intro, legalEntity, loop, meaning } from "@/data/brand";

export function Manifesto() {
  return (
    <section id="story" className="manifesto section" aria-labelledby="story-title">
      <div className="rw-wrap">
        <SectionLabel>Our story</SectionLabel>
        <h2 id="story-title" className="manifesto__statement" data-reveal>
          {intro.conscious}
        </h2>
        {legalEntity && (
          <p className="manifesto__entity" data-reveal>
            {intro.ownership(legalEntity)}
          </p>
        )}
      </div>
    </section>
  );
}

export function Meaning() {
  return (
    <section className="meaning section section--tight-top" aria-labelledby="meaning-title">
      <div className="rw-wrap">
        <header className="section-head">
          <SectionLabel>The meaning behind “Re Workshop”</SectionLabel>
          <h2 id="meaning-title">{meaning.heading}</h2>
        </header>
        <div className="meaning__grid">
          <article className="meaning-card meaning-card--re" data-reveal>
            <ReMark className="meaning-card__seal" />
            <h3 className="meaning-card__word">Re</h3>
            <p className="meaning-card__lead">{meaning.re.lead}</p>
            <ol className="meaning-card__points">
              {meaning.re.points.map((point, index) => (
                <li key={point}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {point}
                </li>
              ))}
            </ol>
          </article>
          <article className="meaning-card meaning-card--workshop" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <Hammer className="meaning-card__icon" size={28} strokeWidth={1.6} aria-hidden="true" />
            <h3 className="meaning-card__word">Workshop</h3>
            <p className="meaning-card__lead">{meaning.workshop.lead}</p>
            <p className="meaning-card__body">{meaning.workshop.body}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

const methodIcons = [Cog, Hand, Droplets];

export function SoilToPlate() {
  const [soil, seeds, plate] = loop.steps;
  return (
    <section id="loop" className="loop section section--sage" aria-labelledby="loop-title">
      <div className="rw-wrap">
        <header className="section-head section-head--center">
          <SectionLabel>{loop.eyebrow}</SectionLabel>
          <h2 id="loop-title">{loop.heading}</h2>
          <p className="section-head__intro">{loop.intro}</p>
        </header>

        <ol className="loop__steps">
          <li className="loop-step loop-step--soil" data-reveal>
            <div className="loop-step__top">
              <span className="loop-step__num">01</span>
              <Layers size={26} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h3>{soil.title}</h3>
            {soil.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <ul className="chip-list chip-list--on-dark" aria-label="Soil inputs">
              {soil.tags?.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          </li>

          <li className="loop-step loop-step--seeds" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <div className="loop-step__top">
              <span className="loop-step__num">02</span>
              <Sprout size={26} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h3>{seeds.title}</h3>
            {seeds.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="loop-step__label">Focus areas include:</p>
            <dl className="focus-list">
              {seeds.focus?.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  {item.value && <dd>{item.value}</dd>}
                </div>
              ))}
            </dl>
          </li>

          <li className="loop-step loop-step--plate" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <div className="loop-step__top">
              <span className="loop-step__num">03</span>
              <Soup size={26} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h3>{plate.title}</h3>
            {plate.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <ul className="method-list">
              {plate.methods?.map((method, index) => {
                const Icon = methodIcons[index];
                return (
                  <li key={method}>
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    {method}
                  </li>
                );
              })}
            </ul>
            <p>{plate.closing}</p>
            <p className="loop-step__label">{loop.philosophyLead}</p>
            <ul className="zero-chips">
              {loop.philosophy.map((item) => (
                <li key={item}>
                  <Ban size={15} strokeWidth={2} aria-hidden="true" />
                  <strong>ZERO</strong> {item}
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function BrandStatement() {
  return (
    <section className="statement" aria-label="Our promise">
      <div className="rw-wrap">
        <p className="statement__text" data-reveal>
          {brandStatement}
        </p>
      </div>
    </section>
  );
}
