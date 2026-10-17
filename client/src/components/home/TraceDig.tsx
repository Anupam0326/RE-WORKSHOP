/**
 * "Every plate has roots": pick an everyday dish and dig from the plate down to the soil it grew in.
 * The answers change with the dish; the soil at the bottom never does. That contrast is the point.
 * Copy lives in data/brand.ts (loop.trace) and data/trace.ts; facts come only from the brief and the catalogue.
 */

import { useState, type ComponentType } from "react";
import { ArrowUp, ChefHat, Cog, Layers, Soup, Sprout } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { ProductImage } from "@/components/ProductImage";
import { SectionLink } from "@/components/SectionLink";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { getStaticProduct, type Product } from "@/data/catalog";
import { loop } from "@/data/brand";
import { takeTraceRequest, traceDishes, traceDishIndex, type TraceDish } from "@/data/trace";
import { useCatalog } from "@/contexts/CatalogContext";

const [soilStep, seedStep, plateStep] = loop.steps;
const copy = loop.trace;

function Node({ icon: Icon }: { icon: ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <span className="dig-layer__node" aria-hidden="true">
      <Icon size={16} strokeWidth={1.8} />
    </span>
  );
}

function PlatePhoto({ dish }: { dish: TraceDish }) {
  const { getProduct } = useCatalog();
  const live = dish.photo ? getProduct(dish.photo) : undefined;
  const product = live?.images.length ? live : dish.photo ? getStaticProduct(dish.photo) : undefined;
  // No real photo yet: an empty plate carrying the Re Workshop seal (never a stock image).
  if (!product?.images.length) return <ReMark className="dig-plate__seal" />;
  return <ProductImage product={{ name: dish.name, images: product.images }} sizes="(min-width: 1024px) 160px, 112px" />;
}

function Shelves({ dish }: { dish: TraceDish }) {
  const { getProduct } = useCatalog();
  const items = dish.products.map((slug) => getProduct(slug)).filter((product): product is Product => Boolean(product));
  if (!items.length) return null;
  return (
    <div className="dig-shelves">
      <p className="dig-shelves__label">{copy.shelvesLabel}</p>
      <ul className="chip-list">
        {items.map((product) => (
          <li key={product.slug}>
            <Link href={`/product/${product.slug}`} className="chip chip--link">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Highlights({ items, active }: { items: string[]; active?: string }) {
  return (
    <ul className="dig-tags">
      {items.map((item) => (
        <li key={item} className={item === active ? "is-on" : undefined}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TraceDig() {
  const [dishId, setDishId] = useState(() => takeTraceRequest() ?? traceDishes[0].id);
  const dish = traceDishIndex.get(dishId) ?? traceDishes[0];
  const farm = useSiteMedia("farm");

  function traceAnother() {
    const index = traceDishes.findIndex((item) => item.id === dish.id);
    setDishId(traceDishes[(index + 1) % traceDishes.length].id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("trace")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div id="trace" className="dig">
      <div className="dig__side">
        <div className="dig__intro">
          <h3 className="dig__question">{copy.question}</h3>
          <p className="dig__prompt">{copy.prompt}</p>
        </div>
        <div className="dig__picker" role="radiogroup" aria-label={copy.pickLabel}>
          {traceDishes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === dish.id}
              className={item.id === dish.id ? "pill is-active" : "pill"}
              onClick={() => setDishId(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {`Tracing ${dish.name} from the plate down to the soil.`}
      </p>

      <ol className="dig__core" aria-label={`${dish.name}, from the plate down to the soil`}>
        <li className="dig-layer dig-layer--plate" data-reveal>
          <Node icon={Soup} />
          <p className="dig-layer__depth">{copy.layers.plate.depth}</p>
          <div className="dig-swap" key={dish.id}>
            <div className="dig-plate">
              <div className="dig-plate__dish">
                <PlatePhoto dish={dish} />
              </div>
              <div className="dig-plate__copy">
                <h4 className="dig-plate__name">{dish.name}</h4>
                <p className="dig-plate__line">{dish.plate}</p>
              </div>
            </div>
            <Shelves dish={dish} />
          </div>
        </li>

        <li className="dig-layer dig-layer--kitchen" data-reveal>
          <Node icon={ChefHat} />
          <p className="dig-layer__depth">{copy.layers.kitchen.depth}</p>
          <p className="dig-layer__q">{copy.layers.kitchen.question}</p>
          <p className="dig-layer__a dig-swap" key={`k-${dish.id}`}>
            {dish.kitchen}
          </p>
          <div className="dig-layer__context">
            <p>{plateStep.closing}</p>
          </div>
        </li>

        <li className="dig-layer dig-layer--mill" data-reveal>
          <Node icon={Cog} />
          <p className="dig-layer__depth">{copy.layers.mill.depth}</p>
          <p className="dig-layer__q">{copy.layers.mill.question}</p>
          <p className="dig-layer__a dig-swap" key={`m-${dish.id}`}>
            {dish.mill}
          </p>
          <div className="dig-layer__context">
            {plateStep.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <Highlights items={plateStep.methods ?? []} active={dish.method} />
          </div>
        </li>

        <li className="dig-layer dig-layer--seed" data-reveal>
          <Node icon={Sprout} />
          <p className="dig-layer__depth">{copy.layers.seed.depth}</p>
          <p className="dig-layer__q">{copy.layers.seed.question}</p>
          <p className="dig-layer__a dig-swap" key={`s-${dish.id}`}>
            {dish.seed}
          </p>
          <div className="dig-layer__context">
            <p className="dig-layer__title">{seedStep.title}</p>
            {seedStep.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <dl className="dig-focus">
              {seedStep.focus?.map((item) => (
                <div key={item.label} className={item.label === dish.focus ? "is-on" : undefined}>
                  <dt>{item.label}</dt>
                  {item.value && <dd>{item.value}</dd>}
                </div>
              ))}
            </dl>
          </div>
        </li>

        <li className="dig-layer dig-layer--soil" data-reveal>
          <Node icon={Layers} />
          <p className="dig-layer__depth">{copy.layers.soil.depth}</p>
          <p className="dig-layer__q">{copy.layers.soil.question}</p>
          <p className="dig-layer__a">{copy.layers.soil.answer}</p>
          {dish.soil && (
            <p className="dig-layer__note dig-swap" key={`n-${dish.id}`}>
              {dish.soil}
            </p>
          )}
          <div className="dig-layer__context">
            <figure className="dig-photo">
              <SiteImage slot="farm" sizes="(min-width: 1024px) 560px, 88vw" />
              <figcaption>{farm.caption}</figcaption>
            </figure>
            <p className="dig-layer__title">{soilStep.title}</p>
            {soilStep.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <Highlights items={soilStep.tags ?? []} />
          </div>
          <div className="dig-close">
            <p className="dig-close__title">{copy.closing}</p>
            <p>{copy.closingBody}</p>
            <div className="dig-close__actions">
              <button type="button" className="btn btn--lime" onClick={traceAnother}>
                <ArrowUp size={18} aria-hidden="true" /> {copy.again}
              </button>
              <SectionLink id="cafe" className="text-link text-link--light">
                Visit the café
              </SectionLink>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}
