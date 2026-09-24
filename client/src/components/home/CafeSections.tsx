/** The Re Workshop experience: open-kitchen café, live transformation, millet menu and the no-compromise code. */

import { ArrowRight, Ban, ChefHat, Eye, RefreshCw } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { SectionLabel } from "@/components/SectionLabel";
import { getProductBySlug } from "@/data/catalog";
import { experience, milletMenu, noCompromise } from "@/data/brand";

function Photo({ slug, sizes }: { slug: string; sizes: string }) {
  const product = getProductBySlug(slug);
  return product ? <ProductImage product={product} sizes={sizes} /> : null;
}

export function Experience() {
  return (
    <section id="cafe" className="experience section" aria-labelledby="cafe-title">
      <div className="rw-wrap">
        <header className="section-head">
          <SectionLabel>{experience.eyebrow}</SectionLabel>
          <h2 id="cafe-title">{experience.heading}</h2>
          <p className="section-head__intro section-head__intro--large">{experience.invite}</p>
          <p className="section-head__intro">{experience.concept}</p>
        </header>

        <div className="experience__grid">
          <article className="exp-card" data-reveal>
            <Eye size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>{experience.openKitchen.title}</h3>
            <p>{experience.openKitchen.body}</p>
          </article>
          <article className="exp-card exp-card--accent" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <RefreshCw size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>{experience.live.title}</h3>
            <p>{experience.live.body}</p>
          </article>
        </div>

        <div className="shelf-plate" role="group" aria-label="Live transformation: from the grocery shelf to the plate" data-reveal>
          <figure className="shelf-plate__stage">
            <div className="shelf-plate__media">
              <Photo slug="kodo-millet" sizes="(min-width: 860px) 360px, 40vw" />
            </div>
            <figcaption>
              <span>From our grocery shelves</span>
              Ancient millets & heritage grains
            </figcaption>
          </figure>
          <div className="shelf-plate__bridge" aria-hidden="true">
            <ChefHat size={22} strokeWidth={1.6} />
            <span>Open kitchen</span>
            <ArrowRight size={18} />
          </div>
          <figure className="shelf-plate__stage">
            <div className="shelf-plate__media">
              <Photo slug="kodo-masala-idly-premix" sizes="(min-width: 860px) 360px, 40vw" />
            </div>
            <figcaption>
              <span>Right before your eyes</span>
              Fresh, steaming, nutritious meals
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function MilletMenu() {
  return (
    <section className="menu section section--forest" aria-labelledby="menu-title">
      <div className="rw-wrap menu__layout">
        <div className="menu__intro">
          <SectionLabel tone="dark">At the café</SectionLabel>
          <h2 id="menu-title">{milletMenu.heading}</h2>
          <p>{milletMenu.intro}</p>
          <figure className="menu__photo">
            <Photo slug="masala-sattu-cooler-premix" sizes="(min-width: 860px) 320px, 60vw" />
            <figcaption>Masala sattu cooler</figcaption>
          </figure>
        </div>
        <ul className="menu-list" aria-label="Millet menu">
          {milletMenu.items.map((item, index) => (
            <li key={item} className="menu-list__item" data-reveal style={{ "--i": index } as React.CSSProperties}>
              <span className="menu-list__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="menu-list__name">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function NoCompromise() {
  return (
    <section className="code section" aria-labelledby="code-title">
      <div className="rw-wrap">
        <header className="section-head section-head--center">
          <SectionLabel>Our live café</SectionLabel>
          <h2 id="code-title">{noCompromise.heading}</h2>
          <p className="section-head__intro">{noCompromise.intro}</p>
        </header>
        <ul className="zero-grid">
          {noCompromise.rules.map((rule, index) => (
            <li key={rule} className="zero-tile" data-reveal style={{ "--i": index } as React.CSSProperties}>
              <Ban className="zero-tile__icon" size={26} strokeWidth={1.8} aria-hidden="true" />
              <span className="zero-tile__zero">ZERO</span>
              <span className="zero-tile__what">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
