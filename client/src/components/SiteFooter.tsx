/** Footer: brand belief, quick links, contact, legal entity. */

import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { BrandMark, ReMark } from "@/components/BrandMark";
import { SectionLink } from "@/components/SectionLink";
import { categories, storeInfo } from "@/data/catalog";
import { intro, legalEntity } from "@/data/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <ReMark className="site-footer__stamp" />
      <div className="site-footer__top">
        <BrandMark />
        <p className="site-footer__belief">To truly nourish our bodies, we must first heal our earth.</p>
        <Link href="/shop" className="button button--ochre">
          Visit the store <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="site-footer__grid">
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="site-footer__list">
            <li><SectionLink id="story">Our story</SectionLink></li>
            <li><SectionLink id="loop">The Soil-to-Plate Loop</SectionLink></li>
            <li><SectionLink id="cafe">Open-kitchen café</SectionLink></li>
            <li><SectionLink id="founders">Founder Directors</SectionLink></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <ul className="site-footer__list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`}>{category.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Visit & contact</p>
          <ul className="site-footer__list site-footer__list--contact">
            <li>
              <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer">
                <MapPin size={16} aria-hidden="true" /> <span>{storeInfo.address}</span>
              </a>
            </li>
            {storeInfo.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`}>
                  <Phone size={16} aria-hidden="true" /> {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${storeInfo.email}`}>
                <Mail size={16} aria-hidden="true" /> <span className="break-anywhere">{storeInfo.email}</span>
              </a>
            </li>
            <li>
              <a href={storeInfo.instagram} target="_blank" rel="noreferrer">
                <Instagram size={16} aria-hidden="true" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Re Workshop · Organic Food Store & Café, Jabalpur</span>
        {legalEntity && <span>{intro.ownership(legalEntity)}</span>}
      </div>
    </footer>
  );
}
