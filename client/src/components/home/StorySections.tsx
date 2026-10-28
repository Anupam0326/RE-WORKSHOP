/**
 * Story pieces used on the Our story page (and the brand statement on the café page): "Why ReWorkshop" (was "The
 * meaning behind Re Workshop", renamed by the client 28 Oct 2026) and the soil to plate to pantry loop with "Track your grain" (the seven-step arc lives in JourneyArc.tsx). Since 18 Oct 2026 these live on their own pages, not on
 * one long home page, and carry no label pills: the page already says where you are.
 */

import { useEffect, useRef } from "react";
import { Hammer } from "lucide-react";
import { ReMark } from "@/components/BrandMark";
import { GrainTrack } from "@/components/home/GrainTrack";
import { brandStatement, loop, meaning } from "@/data/brand";

export function Meaning() {
  return (
    <section className="section meaning" aria-labelledby="meaning-title">
      <div className="wrap">
        <header className="head">
          <h2 id="meaning-title">{meaning.whyHeading}</h2>
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
          <h2 id="loop-title">{loop.heading}</h2>
          <p className="head__intro">{loop.intro}</p>
        </header>
        <GrainTrack />
      </div>
    </section>
  );
}

/** The statement lights up word by word as it scrolls through the screen (static for reduced motion). */
export function BrandStatement({ light = false }: { light?: boolean }) {
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
    <section className={light ? "section statement statement--light" : "section statement"} aria-label="Our promise">
      <div className="wrap">
        <div className={light ? "statement__panel" : "panel panel--dark grain statement__panel"}>
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
