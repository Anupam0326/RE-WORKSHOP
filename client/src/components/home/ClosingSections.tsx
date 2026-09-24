/** Final brand message and the visit/contact block. */

import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { SectionLabel } from "@/components/SectionLabel";
import { storeInfo } from "@/data/catalog";
import { finalMessage } from "@/data/brand";

export function FinalMessage() {
  return (
    <section className="final section section--forest" aria-label="Our invitation">
      <ReMark className="final__seal" />
      <div className="rw-wrap final__inner">
        <blockquote className="final__quote" data-reveal>
          {finalMessage.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </blockquote>
        <div className="final__actions">
          <Link href="/shop" className="button button--ochre">
            Shop the store <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="button button--ghost-light">
            Get directions <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  return (
    <section id="visit" className="visit section" aria-labelledby="visit-title">
      <div className="rw-wrap">
        <header className="section-head">
          <SectionLabel>Visit the store & café</SectionLabel>
          <h2 id="visit-title">Find us in Jabalpur.</h2>
        </header>
        <div className="visit__grid">
          <address className="visit-card visit-card--dark">
            <MapPin size={22} strokeWidth={1.7} aria-hidden="true" />
            <p className="eyebrow">Address</p>
            <p className="visit-card__big">
              {storeInfo.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="button button--ochre">
              Get directions <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </address>
          <div className="visit-card">
            <Phone size={22} strokeWidth={1.7} aria-hidden="true" />
            <p className="eyebrow">Call or write</p>
            <ul className="visit-card__links">
              {storeInfo.phones.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${storeInfo.email}`} className="break-anywhere">
                  <Mail size={16} aria-hidden="true" /> {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
