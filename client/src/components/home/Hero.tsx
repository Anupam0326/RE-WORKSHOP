/** Hero: brand welcome, the core promise, and the SOIL → HEALTH journey. Text is the LCP; photos are small. */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { ProductImage } from "@/components/ProductImage";
import { SectionLabel } from "@/components/SectionLabel";
import { SectionLink } from "@/components/SectionLink";
import { getProductBySlug } from "@/data/catalog";
import { intro, journey } from "@/data/brand";

const heroTiles = [
  { slug: "kodo-millet", caption: "On the shelf", note: "Kodo millet" },
  { slug: "kodo-masala-idly-premix", caption: "On the plate", note: "Millet idli" },
  { slug: "masala-sattu-cooler-premix", caption: "In the glass", note: "Masala sattu cooler" },
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <SectionLabel>{intro.welcome}</SectionLabel>
          <h1 id="hero-title" className="hero__title">
            We don’t just sell organic food — <em>we restore life.</em>
          </h1>
          <p className="hero__lead">{intro.belief}</p>
          <div className="hero__actions">
            <Link href="/shop" className="button button--forest">
              Shop the store <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <SectionLink id="cafe" className="button button--outline">
              Visit the café
            </SectionLink>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <ReMark className="hero__seal" />
          {heroTiles.map((tile, index) => {
            const product = getProductBySlug(tile.slug);
            if (!product) return null;
            return (
              <figure key={tile.slug} className={`hero-tile hero-tile--${index + 1}`}>
                <ProductImage product={product} sizes="(min-width: 860px) 240px, 34vw" eager={index === 0} />
                <figcaption>
                  <span>{tile.caption}</span>
                  {tile.note}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <ol className="journey" aria-label="Our journey, from soil to health">
        {journey.map((step, index) => (
          <li key={step} className="journey__step">
            <span className="journey__num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
