/** The three Founder Directors — titles and biographies exactly as supplied, credentials prominent. */

import { SectionLabel } from "@/components/SectionLabel";
import { founders } from "@/data/brand";

export function Founders() {
  return (
    <section id="founders" className="founders section section--sage" aria-labelledby="founders-title">
      <div className="rw-wrap">
        <header className="section-head">
          <SectionLabel>{founders.eyebrow}</SectionLabel>
          <h2 id="founders-title">{founders.heading}</h2>
          <p className="section-head__intro">{founders.intro}</p>
        </header>
        <div className="founders__grid">
          {founders.people.map((person, index) => (
            <article key={person.name} className="founder-card" data-reveal style={{ "--i": index } as React.CSSProperties}>
              <div className="founder-card__head">
                <span className="founder-card__monogram" aria-hidden="true">
                  {person.initials}
                </span>
                <div>
                  <h3>{person.name}</h3>
                  <p className="founder-card__role">{person.role}</p>
                </div>
              </div>
              <ul className="credential-list" aria-label={`${person.name} — credentials`}>
                {person.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <p className="founder-card__lead">{person.lead}</p>
              <p className="founder-card__bio">{person.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
