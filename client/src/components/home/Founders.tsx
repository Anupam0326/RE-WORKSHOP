/**
 * The three Founder Directors: titles and biographies exactly as supplied, credentials prominent.
 * Each founder has a photo slot in /admin → Site photos (client, 18 Oct 2026: "sabka pictures hona chahiye").
 * Until a portrait is uploaded the card shows the founder's monogram; nothing stands in for a face.
 * `compact` is the home-page version: name, role and lead line, then a link to the full story. No portraits there:
 * each photo appears once on the site (23 Oct 2026), and the portraits belong on Our story.
 */

import { ArrowRight, MessageCircle } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { useSiteMedia } from "@/components/SiteImage";
import { consultation, founders, type Founder } from "@/data/brand";
import type { MediaSlotKey } from "@/data/media";

function Portrait({ person }: { person: Founder }) {
  const { photo, alt } = useSiteMedia(person.photoSlot as MediaSlotKey);
  if (!photo) {
    return (
      <div className="founder__photo founder__photo--empty" role="img" aria-label={`${person.name}, photo coming soon`}>
        <span aria-hidden="true">{person.initials}</span>
      </div>
    );
  }
  const uploaded = /-1400\.\w+$/.test(photo.url);
  const small = photo.widthSmall ?? (uploaded ? 600 : 480);
  const large = photo.width ?? (uploaded ? 1400 : 960);
  return (
    <div className="founder__photo">
      <img
        src={photo.urlSmall ?? photo.url}
        srcSet={photo.urlSmall ? `${photo.urlSmall} ${small}w, ${photo.url} ${large}w` : undefined}
        sizes="(min-width: 860px) 360px, 100vw"
        width={480}
        height={480}
        alt={alt || person.name}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function Founders({ compact = false }: { compact?: boolean }) {
  return (
    <section id="founders" className={compact ? "section founders founders--compact" : "section founders"} aria-labelledby="founders-title">
      <div className="wrap">
        <header className="head head--split">
          <h2 id="founders-title" className="founders__title">
            {founders.heading}
          </h2>
          <div className="head__side">
            <p className="head__intro">{founders.intro}</p>
            {compact && (
              <SectionLink id="founders" page="/our-story" className="text-link">
                Meet the founders <ArrowRight size={16} aria-hidden="true" />
              </SectionLink>
            )}
          </div>
        </header>
        <div className="founders__grid">
          {founders.people.map((person) => (
            <article key={person.name} className="founder" data-reveal>
              {!compact && <Portrait person={person} />}
              <div className="founder__head">
                <h3>{person.name}</h3>
                <p className="founder__role">{person.role}</p>
              </div>
              {!compact && (
                <ul className="founder__creds" aria-label={`${person.name}, credentials`}>
                  {person.credentials.map((credential) => (
                    <li key={credential}>{credential}</li>
                  ))}
                </ul>
              )}
              <p className="founder__lead">{person.lead}</p>
              {!compact && <p className="founder__bio">{person.bio}</p>}
              {!compact && person.consults && (
                <SectionLink id="consult" className="founder__consult">
                  <MessageCircle size={16} aria-hidden="true" /> {consultation.founderLink}
                </SectionLink>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
