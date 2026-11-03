/**
 * Footer: the visit/contact panel (#visit, on every page), quick links, legal entity.
 * 31 Oct 2026 (Anupam: "looks very big on a mobile device"): on phones (below 640px) it was 2.1 screens tall at 360px.
 * Now: the three actions sit in one row of tiles with short labels, Explore and Shop sit side by side, the contact
 * links are one wrapped row of chips, and the logo + tagline (already in the header and on Our story) are left out.
 * Tablet and desktop are unchanged.
 */

import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { BrandMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { storeInfo } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { finalMessage, intro, legalEntity, loop } from "@/data/brand";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

const hello = encodeURIComponent("Hello Re Workshop, I have a question.");

export function SiteFooter() {
  const { categories } = useCatalog();
  return (
    <footer className="footer">
      <div id="visit" className="footer__panel">
        <div className="footer__bg" aria-hidden="true">
          <img
            src="/site/farm-sunset-1600.webp"
            srcSet="/site/farm-sunset-800.webp 800w, /site/farm-sunset-1600.webp 1600w"
            sizes="100vw"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="footer__cta">
          <h2 className="footer__title">Find us in Jabalpur.</h2>
          {/* 3 Nov 2026: the closing invitation left the home page and lives here, on every page. */}
          <p className="footer__invite">{finalMessage.join(" ")}</p>
          <address className="footer__address">
            {storeInfo.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <div className="footer__actions">
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="btn btn--lime">
              <MapPin size={18} aria-hidden="true" /> <span className="footer__long">Get directions</span>
              <span className="footer__short">Directions</span>
            </a>
            <a href={`tel:${storeInfo.phones[0].tel}`} className="btn btn--ghost-light">
              <Phone size={18} aria-hidden="true" /> <span className="footer__long">Call {storeInfo.phones[0].display}</span>
              <span className="footer__short">Call</span>
            </a>
            {whatsappReady && (
              <a href={`https://wa.me/${whatsappDigits}?text=${hello}`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost-light">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="footer__sheet">
          <div className="footer__brand">
            <BrandMark />
            <p>To truly nourish our bodies, we must first heal our earth.</p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <p className="footer__head">Explore</p>
              <ul className="footer__list">
                <li><Link href="/our-story">Our story</Link></li>
                <li><SectionLink id="founders" page="/our-story">Founders</SectionLink></li>
                <li><SectionLink id="loop" page="/our-story">{loop.heading}</SectionLink></li>
                <li><Link href="/cafe">Open-kitchen café</Link></li>
                <li><SectionLink id="menu" page="/cafe">Millet menu</SectionLink></li>
              </ul>
            </div>
            <div className="footer__col">
              <p className="footer__head">Shop</p>
              <ul className="footer__list">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/shop/${category.slug}`}>{category.shortName}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer__col footer__col--contact">
              <p className="footer__head">Contact</p>
              <ul className="footer__list footer__list--contact">
                {storeInfo.phones.map((phone) => (
                  <li key={phone.tel}>
                    <a href={`tel:${phone.tel}`}>
                      <Phone size={15} aria-hidden="true" /> {phone.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${storeInfo.email}`}>
                    <Mail size={15} aria-hidden="true" /> <span className="break-anywhere">{storeInfo.email}</span>
                  </a>
                </li>
                <li>
                  <a href={storeInfo.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Instagram size={15} aria-hidden="true" />
                    <span className="footer__long">
                      Instagram <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} Re Workshop, Organic Food Store & Café, Jabalpur</span>
            {legalEntity && <span>{intro.ownership(legalEntity)}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}
