/**
 * Free consultation with Dr. (Mrs.) Swati Chhajed (client, 23 Oct 2026): "anyone willing to have a chat session with
 * her can connect directly", visible at a glance. Second section of the home page, right under the menu board, and
 * the target of the lime "Free consultation" button in the navigation on every page (#consult).
 *
 * Left: the offer, her own story and the safety note (kept together, always). Right: one card for the action: who
 * you'll be talking to, her qualifications, the exact first message WhatsApp opens with, and the button. The chat
 * goes straight to her own number (lib/whatsapp.ts), not the store's.
 * Her photo is its own site photo slot ("consult-portrait"), never her founder portrait: each photo appears once.
 * Until one is uploaded the card shows the Re seal, not an empty frame.
 */

import { Check, Info, MessageCircle } from "lucide-react";
import { ReMark } from "@/components/BrandMark";
import { useSiteMedia } from "@/components/SiteImage";
import { consultation } from "@/data/brand";
import { consultChatUrl } from "@/lib/whatsapp";

function Avatar() {
  const { photo, alt } = useSiteMedia("consult-portrait");
  if (!photo) {
    return (
      <span className="consult__avatar consult__avatar--seal" aria-hidden="true">
        <ReMark />
      </span>
    );
  }
  return (
    <span className="consult__avatar">
      <img src={photo.urlSmall ?? photo.url} width={96} height={96} alt={alt || consultation.name} loading="lazy" decoding="async" />
    </span>
  );
}

export function Consultation() {
  const href = consultChatUrl(consultation.message);
  return (
    <section id="consult" className="section consult" aria-labelledby="consult-title">
      <div className="wrap consult__inner">
        <div className="consult__text" data-reveal>
          <h2 id="consult-title" className="consult__title">
            {consultation.title} <span className="tone-mute">{consultation.topic}</span>
          </h2>
          <p className="consult__story">{consultation.story}</p>
          <p className="consult__note">
            <Info size={17} aria-hidden="true" />
            <span>{consultation.note}</span>
          </p>
        </div>

        <div className="consult__card" data-reveal>
          <div className="consult__who">
            <Avatar />
            <p>
              <strong>{consultation.name}</strong>
              <span>{consultation.role}</span>
            </p>
          </div>
          <ul className="consult__quals" aria-label="Experience and qualifications">
            {consultation.qualifications.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <figure className="consult__chat">
            <blockquote className="consult__bubble">{consultation.message}</blockquote>
            <figcaption>WhatsApp opens with this message. Change it before you send if you like.</figcaption>
          </figure>
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--dark btn--full consult__cta">
            <MessageCircle size={19} aria-hidden="true" /> {consultation.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
