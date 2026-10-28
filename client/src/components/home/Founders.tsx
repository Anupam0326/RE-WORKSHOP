/**
 * The three Founder Directors: titles and biographies exactly as supplied, credentials prominent.
 * Each founder has a photo slot in /admin → Site photos (client, 18 Oct 2026: "sabka pictures hona chahiye").
 * Until a portrait is uploaded the card shows the founder's monogram; nothing stands in for a face.
 * `compact` is the home-page version: name, role and lead line, then a link to the full story. No portraits there:
 * each photo appears once on the site (23 Oct 2026), and the portraits belong on Our story.
 * Side by side (from 860px) the three cards share row tracks (CSS subgrid, --founder-rows = the parts per card), so
 * the chips, lead lines and bios start level across all three even where a line has to wrap.
 * 28 Oct 2026 (Anupam): all three cards end with the bio, so they match. Dr. Swati's consultation is a call button on
 * her name line (dials her number) instead of the disclaimer and link that used to follow her bio; the disclaimer
 * stays where the client's spec puts it, beside her story on the home consultation and in How Re Workshop began.
 */

import type { CSSProperties } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { useSiteMedia } from "@/components/SiteImage";
import { consultation, founders, type Founder } from "@/data/brand";
import type { MediaSlotKey } from "@/data/media";
import { consultCallUrl } from "@/lib/whatsapp";

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
  // Parts per card: portrait, name, chips, lead, bio (compact: name, lead).
  const rows = compact ? 2 : 5;
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
        <div className="founders__grid" style={{ "--founder-rows": rows } as CSSProperties}>
          {founders.people.map((person) => (
            <article key={person.name} className="founder" data-reveal>
              {!compact && <Portrait person={person} />}
              <div className={!compact && person.consults ? "founder__head founder__head--call" : "founder__head"}>
                <h3>{person.name}</h3>
                <p className="founder__role">{person.role}</p>
                {!compact && person.consults && (
                  <a href={consultCallUrl} className="round-btn round-btn--lime founder__call" aria-label={consultation.callLabel} title={consultation.callLabel}>
                    <Phone size={18} aria-hidden="true" />
                  </a>
                )}
              </div>
              {!compact && (
                <div className="founder__creds" role="list" aria-label={`${person.name}, credentials`}>
                  {person.credentials.map((line) => (
                    <div key={line.join("|")} className="founder__creds-line">
                      {line.map((credential) => (
                        <span key={credential} className="founder__cred" role="listitem">
                          {credential}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <p className="founder__lead">{person.lead}</p>
              {!compact && <p className="founder__bio">{person.bio}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
