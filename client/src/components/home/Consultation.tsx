/**
 * Free consultation with Dr. (Mrs.) Swati Chhajed (client, 23 Oct 2026): "anyone willing to have a chat session with
 * her can connect directly", visible at a glance. Second section of the home page, and the target of the lime
 * "Free consultation" button in the navigation on every page (#consult).
 *
 * 3 Nov 2026 (reviewer: the site is cluttered): one slim band instead of a two-column block with a card. Left: the offer,
 * her own story and the client's disclaimer with the safety note (kept together, always; spec 28 Oct). Right: who you
 * will talk to, her qualifications on one line, and the button. The preview of the first WhatsApp message is gone (the
 * message is still filled in when WhatsApp opens). The chat goes straight to her own number (lib/whatsapp.ts).
 * Her photo is its own site photo slot ("consult-portrait"), never her founder portrait: each photo appears once.
 * Until one is uploaded the card shows the Re seal, not an empty frame.
 */

import { MessageCircle } from "lucide-react";
import { ReMark } from "@/components/BrandMark";
import { useSiteMedia } from "@/components/SiteImage";
import { consultation, personalExperienceDisclaimer } from "@/data/brand";
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
    <section id="consult" className="consult" aria-labelledby="consult-title">
      <div className="wrap consult__inner">
        <div className="consult__text" data-reveal>
          <h2 id="consult-title" className="consult__title">
            {consultation.title} <span className="tone-mute">{consultation.topic}</span>
          </h2>
          <p className="consult__story">{consultation.story}</p>
          <p className="consult__note">
            <span className="disclaimer">{personalExperienceDisclaimer}</span> {consultation.note}
          </p>
        </div>
        <div className="consult__act" data-reveal>
          <div className="consult__who">
            <Avatar />
            <p>
              <strong>{consultation.name}</strong>
              <span>{consultation.qualifications.join(" · ")}</span>
            </p>
          </div>
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--dark consult__cta">
            <MessageCircle size={19} aria-hidden="true" /> {consultation.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
