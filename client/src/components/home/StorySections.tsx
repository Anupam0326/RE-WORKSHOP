/** Who we are, the meaning of the name, the Soil-to-Plate Loop and the key brand statement. */

import { useEffect, useRef } from "react";
import { BookOpen, Hammer, RefreshCcw, Shovel } from "lucide-react";
import { ReMark } from "@/components/BrandMark";
import { SectionLabel } from "@/components/SectionLabel";
import { TraceDig } from "@/components/home/TraceDig";
import { brandStatement, intro, legalEntity, loop, meaning } from "@/data/brand";

export function Manifesto() {
  return (
    <section id="story" className="band band--mist band--wave story" aria-labelledby="story-title">
      <div className="wrap wrap--lined story__inner">
        <SectionLabel icon={BookOpen}>Our story</SectionLabel>
        <h2 id="story-title" className="story__statement" data-reveal>
          {intro.conscious}
        </h2>
        {legalEntity && (
          <p className="story__entity" data-reveal>
            {intro.ownership(legalEntity)}
          </p>
        )}
      </div>
    </section>
  );
}

export function Meaning() {
  return (
    <section className="section meaning" aria-labelledby="meaning-title">
      <div className="wrap">
        <header className="head">
          <SectionLabel icon={RefreshCcw}>The meaning behind “Re Workshop”</SectionLabel>
          <h2 id="meaning-title">{meaning.heading}</h2>
        </header>
        <div className="meaning__grid">
          <article className="mcard mcard--re" data-reveal>
            <ReMark className="mcard__seal" />
            <h3 className="mcard__word">Re</h3>
            <p className="mcard__lead">{meaning.re.lead}</p>
            <ul className="mcard__points">
              {meaning.re.points.map((point) => (
                <li key={point}>
                  {point.startsWith("Re") ? (
                    <>
                      <span className="re-prefix">Re</span>
                      {point.slice(2)}
                    </>
                  ) : (
                    point
                  )}
                </li>
              ))}
            </ul>
          </article>
          <article className="mcard mcard--workshop" data-reveal>
            <span className="mcard__icon" aria-hidden="true">
              <Hammer size={22} strokeWidth={1.7} />
            </span>
            <h3 className="mcard__word">Workshop</h3>
            <p className="mcard__lead">{meaning.workshop.lead}</p>
            <p className="mcard__body">{meaning.workshop.body}</p>
            <dl className="facets">
              {meaning.workshop.facets.map((facet) => (
                <div key={facet.label}>
                  <dt>{facet.label}</dt>
                  <dd>{facet.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}

export function SoilToPlate() {
  return (
    <section id="loop" className="section loop" aria-labelledby="loop-title">
      <div className="wrap">
        <header className="head">
          <SectionLabel icon={Shovel}>Soil to plate</SectionLabel>
          <h2 id="loop-title">{loop.heading}</h2>
          <p className="head__intro">{loop.intro}</p>
        </header>
        <TraceDig />
      </div>
    </section>
  );
}

/** The statement lights up word by word as it scrolls through the screen (static for reduced motion). */
export function BrandStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = brandStatement.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const spans = Array.from(element.querySelectorAll<HTMLElement>("[data-w]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      spans.forEach((span) => span.classList.add("is-lit"));
      return;
    }
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const view = window.innerHeight;
      // 0 when the text enters at 85% of the screen height, 1 when it reaches 35%.
      const progress = Math.min(1, Math.max(0, (view * 0.85 - rect.top) / (view * 0.5)));
      const lit = Math.round(progress * spans.length);
      spans.forEach((span, index) => span.classList.toggle("is-lit", index < lit));
    };
    const onScroll = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
    });
    observer.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="section statement" aria-label="Our promise">
      <div className="wrap">
        <div className="panel panel--dark grain statement__panel">
          <div className="statement__frame">
            <p ref={ref} className="statement__text">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} data-w>
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
