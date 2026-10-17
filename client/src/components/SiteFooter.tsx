/** Footer: the visit/contact panel (#visit, on every page), quick links, legal entity. */

import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { BrandMark, ReMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { storeInfo } from "@/data/catalog";
import { useCatalog } from "@/contexts/CatalogContext";
import { intro, legalEntity } from "@/data/brand";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

const hello = encodeURIComponent("Hello Re Workshop, I have a question.");

export function SiteFooter() {
  const { categories } = useCatalog();
  return (
    <footer className="footer">
      <div id="visit" className="footer__panel">
        <ReMark className="footer__mark" />
        <div className="footer__cta">
          <p className="footer__kicker">Visit the store and café</p>
          <h2 className="footer__title">Find us in Jabalpur.</h2>
          <address className="footer__address">
            {storeInfo.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <div className="footer__actions">
            <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="btn btn--lime">
              <MapPin size={18} aria-hidden="true" /> Get directions
            </a>
            <a href={`tel:${storeInfo.phones[0].tel}`} className="btn btn--ghost-light">
              <Phone size={18} aria-hidden="true" /> Call {storeInfo.phones[0].display}
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
            <div>
              <p className="footer__head">Explore</p>
              <ul className="footer__list">
                <li><SectionLink id="story">Our story</SectionLink></li>
                <li><SectionLink id="loop">The Soil-to-Plate Loop</SectionLink></li>
                <li><SectionLink id="cafe">Open-kitchen café</SectionLink></li>
                <li><SectionLink id="founders">Founders</SectionLink></li>
              </ul>
            </div>
            <div>
              <p className="footer__head">Shop</p>
              <ul className="footer__list">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/shop/${category.slug}`}>{category.shortName}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
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
                  <a href={storeInfo.instagram} target="_blank" rel="noreferrer">
                    <Instagram size={15} aria-hidden="true" /> Instagram <ArrowUpRight size={14} aria-hidden="true" />
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
