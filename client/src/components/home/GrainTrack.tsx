/**
 * "Track your grain" (22 Oct 2026): pick a grain from the shelves and dig down from the pack to the seed it grew from.
 * Layers, top to bottom: On our shelf → Mill → Harvest (only when known) → Farm → Seed. Each change of grain plays
 * the dig again: the dotted line draws down and the layers fill in one after another.
 *
 * Two kinds of facts, kept visibly apart:
 * - "This grain" (lime): what the store team recorded for this product in /admin (products.origin), or its own label.
 * - "How we work" (outline): the brief's description of how Re Workshop farms and processes.
 * When a grain has no recorded facts yet the tracker says so at the top and offers to ask on WhatsApp. It never
 * fills a gap with a guess (data/grainTrack.ts has the rule).
 */

import { useMemo, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, CalendarDays, ChevronDown, Cog, MapPin, MessageCircle, ShoppingBasket, Sprout } from "lucide-react";
import { Link } from "wouter";
import { ProductImage } from "@/components/ProductImage";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import type { Product } from "@/data/catalog";
import { loop } from "@/data/brand";
import { hasOrigin, labelProcessing, takeTrackRequest, trackOptions } from "@/data/grainTrack";
import { useCatalog } from "@/contexts/CatalogContext";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

const [soilStep, seedStep, plateStep] = loop.steps;
const copy = loop.trace;
const DEFAULT_GRAIN = "kodo-millet";

/** The brief's seed family a grain belongs to, highlighted in the seed layer. */
function seedFamily(product: Product) {
  const text = `${product.name} ${product.group}`.toLowerCase();
  if (/millet|kodo|kutki|ragi|jwar|jowar|bajra|kangani|sama|browntop/.test(text)) return "Nutrient-dense ancient grains";
  if (/gehu|wheat|khapli|sharbati/.test(text)) return "Ancient wheat varieties";
  if (/rice/.test(text)) return "Traditional rice";
  if (/dal|moong|chana|pulse|legume/.test(text)) return "Ancestral legume varieties";
  return "";
}

/** The brief's processing method a grain matches, highlighted at the mill. */
function millMethod(product: Product) {
  return labelProcessing(product) ? "Stone-milled (Chakki)" : "";
}

function Node({ icon: Icon, index }: { icon: ComponentType<{ size?: number; strokeWidth?: number }>; index: number }) {
  return (
    <span className="dig-layer__node track-node" aria-hidden="true" style={{ "--d": index } as CSSProperties}>
      <Icon size={16} strokeWidth={1.8} />
    </span>
  );
}

/** A fact recorded for this grain (lime tag). */
function Fact({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <p className="track-fact">
      <span className="track-tag track-tag--this">{copy.specificTag}</span>
      <span>
        {label && <strong>{label}: </strong>}
        {children}
      </span>
    </p>
  );
}

/** How Re Workshop works in general (outline tag), from the brief. */
function General({ children }: { children: ReactNode }) {
  return (
    <div className="dig-layer__context">
      <span className="track-tag">{copy.generalTag}</span>
      {children}
    </div>
  );
}

function Tags({ items, active }: { items: string[]; active?: string }) {
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

export function GrainTrack() {
  const { products } = useCatalog();
  const farm = useSiteMedia("farm-3");
  // Exactly the three options in data/grainTrack.ts (client, 28 Oct 2026), in that order, with their own labels.
  const options = useMemo(
    () => trackOptions.flatMap(({ slug, label }) => {
      const item = products.find((candidate) => candidate.slug === slug);
      return item ? [{ label, product: item }] : [];
    }),
    [products],
  );
  const trackable = useMemo(() => options.map((option) => option.product), [options]);
  const [slug, setSlug] = useState(() => takeTrackRequest() ?? DEFAULT_GRAIN);
  const [touched, setTouched] = useState(false);
  const product = trackable.find((item) => item.slug === slug) ?? trackable.find((item) => item.slug === DEFAULT_GRAIN) ?? trackable[0];

  if (!product) return null;

  const origin = product.origin ?? {};
  const processing = origin.processing || labelProcessing(product);
  const family = seedFamily(product);
  const known = hasOrigin(product);
  const ask = encodeURIComponent(`Hello Re Workshop, I'd like to know where your ${product.name} comes from: the seed, the farm and the harvest.`);
  let depth = 0;

  function pick(next: string) {
    setTouched(true);
    setSlug(next);
  }

  function trackAnother() {
    const index = trackable.findIndex((item) => item.slug === product.slug);
    pick(trackable[(index + 1) % trackable.length].slug);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("trace")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div id="trace" className="dig track">
      <div className="dig__side">
        <div className="dig__intro">
          <h3 className="dig__question">{copy.question}</h3>
          <p className="dig__prompt">{copy.prompt}</p>
        </div>
        <label className="track-pick">
          <span className="track-pick__label">{copy.pickLabel}</span>
          <span className="track-pick__control">
            <select value={product.slug} onChange={(event) => pick(event.target.value)}>
              {options.map(({ label, product: item }) => (
                <option key={item.slug} value={item.slug}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </span>
        </label>
        <p className="track-legend">
          <span className="track-tag track-tag--this">{copy.specificTag}</span> <span className="track-tag">{copy.generalTag}</span>
          <span>{copy.legend}</span>
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {touched ? `Tracking ${product.name} from the pack down to the seed.` : ""}
      </p>

      <ol className="dig__core" aria-label={`${product.name}, from the pack down to the seed`}>
        <li className="dig-layer dig-layer--plate" data-reveal aria-label={copy.layers.shelf.depth}>
          <Node icon={ShoppingBasket} index={depth} />
          <span className="track-line" key={`l0-${product.slug}`} aria-hidden="true" />
          <div className="track-swap" key={`s-${product.slug}`} style={{ "--d": depth++ } as CSSProperties}>
            <div className="dig-plate">
              <div className="dig-plate__dish">
                <ProductImage product={product} sizes="(min-width: 1024px) 160px, 112px" />
              </div>
              <div className="dig-plate__copy">
                <h4 className="dig-plate__name">{product.name}</h4>
                <p className="dig-plate__line">
                  {[product.packSize, product.group].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            {product.details.length > 0 && <Tags items={product.details} />}
            <Link href={`/product/${product.slug}`} className="text-link text-link--light">
              See it in the store <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {!known && (
            <p className="dig-layer__note track-swap" key={`n-${product.slug}`} style={{ "--d": 1 } as CSSProperties}>
              We haven’t published the seed and farm details for this grain yet. Below is how Re Workshop farms and
              processes; ask us about this batch at the bottom.
            </p>
          )}
        </li>

        <li className="dig-layer dig-layer--kitchen" data-reveal aria-label={copy.layers.mill.depth}>
          <Node icon={Cog} index={depth} />
          <span className="track-line" key={`l1-${product.slug}`} aria-hidden="true" style={{ "--d": depth } as CSSProperties} />
          <p className="dig-layer__q">{copy.layers.mill.question}</p>
          <div className="track-swap" key={`m-${product.slug}`} style={{ "--d": depth++ } as CSSProperties}>
            {processing && <Fact>{processing}</Fact>}
            <General>
              {plateStep.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <Tags items={plateStep.methods ?? []} active={millMethod(product)} />
            </General>
          </div>
        </li>

        {origin.season && (
          // No data-reveal here: this layer can appear after the page has loaded (a grain with a recorded season),
          // and reveal only arms elements present on load.
          <li className="dig-layer dig-layer--mill" aria-label={copy.layers.harvest.depth}>
            <Node icon={CalendarDays} index={depth} />
            <span className="track-line" key={`l2-${product.slug}`} aria-hidden="true" style={{ "--d": depth } as CSSProperties} />
            <p className="dig-layer__q">{copy.layers.harvest.question}</p>
            <div className="track-swap" key={`h-${product.slug}`} style={{ "--d": depth++ } as CSSProperties}>
              <Fact>{origin.season}</Fact>
            </div>
          </li>
        )}

        <li className="dig-layer dig-layer--seed" data-reveal aria-label={copy.layers.farm.depth}>
          <Node icon={MapPin} index={depth} />
          <span className="track-line" key={`l3-${product.slug}`} aria-hidden="true" style={{ "--d": depth } as CSSProperties} />
          <p className="dig-layer__q">{copy.layers.farm.question}</p>
          <div className="track-swap" key={`f-${product.slug}`} style={{ "--d": depth++ } as CSSProperties}>
            {origin.grown_at && <Fact label="Grown at">{origin.grown_at}</Fact>}
            {origin.farming && <Fact label="Grown with">{origin.farming}</Fact>}
            <General>
              <figure className="dig-photo">
                <SiteImage slot="farm-3" sizes="(min-width: 1024px) 560px, 88vw" />
                <figcaption>{farm.caption}</figcaption>
              </figure>
              <p className="dig-layer__title">{soilStep.title}</p>
              {soilStep.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <Tags items={soilStep.tags ?? []} />
            </General>
          </div>
        </li>

        <li className="dig-layer dig-layer--soil" data-reveal aria-label={copy.layers.seed.depth}>
          <Node icon={Sprout} index={depth} />
          <p className="dig-layer__q">{copy.layers.seed.question}</p>
          <div className="track-swap" key={`g-${product.slug}`} style={{ "--d": depth++ } as CSSProperties}>
            {origin.seed_variety && <Fact label="Variety">{origin.seed_variety}</Fact>}
            {origin.seed_source && <Fact label="Seed from">{origin.seed_source}</Fact>}
            <General>
              <p className="dig-layer__title">{seedStep.title}</p>
              {seedStep.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <dl className="dig-focus">
                {seedStep.focus?.map((item) => (
                  <div key={item.label} className={item.label === family ? "is-on" : undefined}>
                    <dt>{item.label}</dt>
                    {item.value && <dd>{item.value}</dd>}
                  </div>
                ))}
              </dl>
            </General>
            {origin.note && <p className="dig-layer__note">{origin.note}</p>}
          </div>
          <div className="dig-close">
            <p className="dig-close__title">{copy.closing}</p>
            <p>{copy.closingBody}</p>
            <div className="dig-close__actions">
              {whatsappReady && (
                <a href={`https://wa.me/${whatsappDigits}?text=${ask}`} target="_blank" rel="noopener noreferrer" className="btn btn--lime">
                  <MessageCircle size={18} aria-hidden="true" /> {copy.ask}
                </a>
              )}
              <button type="button" className="btn btn--ghost-light" onClick={trackAnother}>
                <ArrowDown size={18} aria-hidden="true" /> {copy.again}
              </button>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}
