/** The three Founder Directors: titles and biographies exactly as supplied, credentials prominent. */

import { founders } from "@/data/brand";

export function Founders() {
  return (
    <section id="founders" className="section founders" aria-labelledby="founders-title">
      <div className="wrap">
        <header className="head head--split">
          <h2 id="founders-title" className="founders__title">
            <span className="founders__eyebrow">{founders.eyebrow}</span>
            {founders.heading}
          </h2>
          <p className="head__intro head__side">{founders.intro}</p>
        </header>
        <div className="founders__grid">
          {founders.people.map((person) => (
            <article key={person.name} className="founder" data-reveal>
              <div className="founder__head">
                <span className="founder__monogram" aria-hidden="true">
                  {person.initials}
                </span>
                <div>
                  <h3>{person.name}</h3>
                  <p className="founder__role">{person.role}</p>
                </div>
              </div>
              <ul className="founder__creds" aria-label={`${person.name}, credentials`}>
                {person.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <p className="founder__lead">{person.lead}</p>
              <p className="founder__bio">{person.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
