/**
 * Hero: the promise in two tones (words rise in once), one product sitting on a slowly shifting organic shape,
 * four tilted photos that drift with the pointer, a rotating store stamp, the belief and the two ways in.
 * Motion is skipped entirely for prefers-reduced-motion.
 */

import { Fragment, useEffect, useRef } from "react";
import { ArrowRight, MapPin, Sprout, Store, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { ReMark } from "@/components/BrandMark";
import { SectionLabel } from "@/components/SectionLabel";
import { SectionLink } from "@/components/SectionLink";
import { SiteImage, useSiteMedia } from "@/components/SiteImage";
import { intro } from "@/data/brand";
import { storeInfo } from "@/data/catalog";
import type { MediaSlotKey } from "@/data/media";

/** Photos are swappable in /admin → Site photos. Depth sets how far each one drifts with the pointer. */
const floating: { slot: MediaSlotKey; depth: number }[] = [
  { slot: "hero-shelf", depth: 14 },
  { slot: "hero-plate", depth: -18 },
  { slot: "hero-grain", depth: -10 },
  { slot: "hero-glass", depth: 16 },
];

const STAMP = "Organic food store • Open-kitchen millet café • Jabalpur • ";

/**
 * Words rise into place one after another (CSS only; the delay comes from --i).
 * The space sits outside each clipped word: trailing spaces inside an inline-block are dropped by the browser.
 */
function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="rise" style={{ "--i": start + index } as React.CSSProperties}>
            <span>{word}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

function usePointerDrift(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const hero = stage.closest(".hero") as HTMLElement | null;
    if (!hero) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      stage.style.setProperty("--px", x.toFixed(3));
      stage.style.setProperty("--py", y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export function Hero() {
  const main = useSiteMedia("hero-main");
  const stage = useRef<HTMLDivElement>(null);
  usePointerDrift(stage);
  const muted = "We don’t just sell organic food.";

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__inner">
        <SectionLabel icon={Sprout}>{intro.welcome}</SectionLabel>
        <h1 id="hero-title" className="hero__title">
          <span className="tone-mute hero__line">
            <Words text={muted} />
          </span>
          <span className="hero__line">
            <Words text="We restore life." start={muted.split(" ").length} />
          </span>
        </h1>

        <div ref={stage} className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <div className="hero__blob" aria-hidden="true" />
          <div className="hero__product">
            <SiteImage slot="hero-main" sizes="(min-width: 860px) 440px, 68vw" eager />
          </div>
          {floating.map(({ slot, depth }, index) => (
            <figure key={slot} className={`float float--${index + 1}`} style={{ "--d": depth } as React.CSSProperties}>
              <SiteImage slot={slot} sizes="(min-width: 860px) 160px, 22vw" eager={index < 2} />
            </figure>
          ))}
          <div className="stamp" aria-hidden="true">
            <svg className="stamp__ring" viewBox="0 0 120 120">
              <defs>
                <path id="stamp-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#stamp-circle" textLength="289">
                  {STAMP}
                </textPath>
              </text>
            </svg>
            <ReMark className="stamp__mark" />
          </div>
          <span className="sr-only">{main.caption}</span>
        </div>

        <p className="hero__sub">Organic food store and open-kitchen millet café in Jabalpur</p>
        <p className="hero__belief">
          <mark>{intro.belief}</mark>
        </p>
        <div className="hero__actions">
          <Link href="/shop" className="btn btn--dark btn--nudge">
            <Store size={18} aria-hidden="true" /> Shop the store <ArrowRight size={17} aria-hidden="true" className="btn__arrow" />
          </Link>
          <SectionLink id="cafe" className="btn btn--lime">
            <UtensilsCrossed size={18} aria-hidden="true" /> Visit the café
          </SectionLink>
        </div>
        <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="hero__place">
          <MapPin size={16} aria-hidden="true" /> Ridge Road, South Civil Lines, Jabalpur
        </a>
      </div>
    </section>
  );
}
