/**
 * Soil → Health: the seven steps of the brief's journey set on a half circle, like a horizon (Our story page).
 *
 * 26 Oct 2026 (Anupam: "animate this differently such that it attracts attention when users go through it"):
 * the visitor's own scroll walks the journey. The arc holds in place (sticky) while the page scrolls past it, and a
 * glowing seed travels along the forest band from Soil to Health, drawing a lime trail behind it. Each step lights
 * up when the seed reaches it and stays lit; the centre text changes with it; the glow behind the arc warms like a
 * sunrise as the seed climbs over and down the far side. On arrival the arc rises into place and the seven steps
 * appear one after another around it. The arrows and the steps themselves scroll the page to that step, so the arc
 * and the page never disagree. No timer: nothing moves unless the visitor moves.
 * Reduced motion: no pinning, no travel; the arc changes step with the arrows or a tap on a step, instantly.
 * Copy: data/brand.ts → journey.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { ChefHat, ChevronDown, ChevronLeft, ChevronRight, Cog, HeartPulse, Layers, Soup, Sprout, Wheat } from "lucide-react";
import { journey } from "@/data/brand";

const icons: ComponentType<{ size?: number; strokeWidth?: number }>[] = [Layers, Sprout, Wheat, Cog, ChefHat, Soup, HeartPulse];
const last = journey.length - 1;
/** Height of the floating navigation plus breathing room; the stage pins just below it. */
const PIN_TOP = 84;

/** Position on the arc: 0 = far left (Soil), last = far right (Health). */
function place(index: number) {
  const angle = Math.PI - (index / last) * Math.PI;
  return { "--x": `${50 + 45 * Math.cos(angle)}%`, "--y": `${100 - 90 * Math.sin(angle)}%`, "--i": index } as CSSProperties;
}

/** The seed's point on the band (the SVG path below: centre 100,100, radius 69). */
function seedAt(progress: number) {
  const angle = Math.PI - progress * Math.PI;
  return { x: 100 + 69 * Math.cos(angle), y: 100 - 69 * Math.sin(angle) };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function JourneyArc() {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [picked, setPicked] = useState(0);
  const [risen, setRisen] = useState(false);
  const [live, setLive] = useState(false);

  // Scroll → progress (0 at Soil, 1 at Health), measured against how far the pinned stage can travel.
  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const stage = stageRef.current;
    if (!scroller || !stage) return;
    const travel = scroller.offsetHeight - stage.offsetHeight;
    if (travel <= 0) return;
    const scrolled = PIN_TOP - scroller.getBoundingClientRect().top;
    setProgress(Math.min(1, Math.max(0, scrolled / travel)));
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, measure]);

  // The sunrise: the arc rises and the steps appear once, when the stage first comes into view. `live` keeps the
  // seed's glow breathing only while the arc is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !("IntersectionObserver" in window)) {
      setRisen(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting);
        if (entry.isIntersecting) setRisen(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const active = reduced ? picked : Math.min(last, Math.round(progress * last));
  const trail = reduced ? picked / last : progress;
  const step = journey[active];
  const seed = seedAt(trail);

  /** Go to a step: scroll the page to where the seed reaches it (or, with reduced motion, just show it). */
  const goTo = (index: number) => {
    const target = Math.min(last, Math.max(0, index));
    if (reduced) {
      setPicked(target);
      return;
    }
    const scroller = scrollerRef.current;
    const stage = stageRef.current;
    if (!scroller || !stage) return;
    const travel = scroller.offsetHeight - stage.offsetHeight;
    const top = window.scrollY + scroller.getBoundingClientRect().top - PIN_TOP + (target / last) * travel;
    window.scrollTo({ top: Math.round(top) + 1, behavior: "smooth" });
  };

  const classes = ["arc", risen ? "is-risen" : "", live ? "is-live" : "", !reduced && progress > 0.015 ? "is-moving" : ""].filter(Boolean).join(" ");

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="wrap">
        <header className="head head--center">
          <h2 id="journey-title">From living soil to a healthier you, in seven steps</h2>
        </header>
      </div>

      <div ref={scrollerRef} className={reduced ? "arc-scroller" : "arc-scroller is-pinned"}>
        <div ref={stageRef} className="arc-stage">
          <div className="wrap">
            <div className={classes} style={{ "--p": trail } as CSSProperties}>
              <div className="arc__rings" aria-hidden="true">
                <span className="arc__ring arc__ring--outer" />
                <span className="arc__ring arc__ring--glow" />
                <span className="arc__ring arc__ring--band" />
                <span className="arc__ring arc__ring--inner" />
                <span className="arc__spokes" />
                {/* The trail: a lime line along the band from Soil to the seed, and the seed itself. */}
                <svg className="arc__progress" viewBox="0 0 200 100">
                  <defs>
                    <radialGradient id="arc-seed-glow">
                      <stop offset="0%" stopColor="#cfe89d" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#cfe89d" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path className="arc__track" d="M 31 100 A 69 69 0 0 1 169 100" pathLength={1} />
                  <path className="arc__trail" d="M 31 100 A 69 69 0 0 1 169 100" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: 1 - trail }} />
                  <g className="arc__seed" transform={`translate(${seed.x.toFixed(2)} ${seed.y.toFixed(2)})`}>
                    <circle className="arc__seed-halo" r="9" fill="url(#arc-seed-glow)" />
                    <circle className="arc__seed-core" r="2.6" />
                  </g>
                </svg>
              </div>

              <ol className="arc__steps" role="tablist" aria-label="Soil to health steps">
                {journey.map((item, index) => {
                  const Icon = icons[index] ?? Sprout;
                  const on = index === active;
                  const reached = index / last <= trail + 0.001;
                  return (
                    <li key={item.label} role="presentation" className="arc__step" style={place(index)}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls="arc-panel"
                        className={on ? "arc__node is-on" : reached ? "arc__node is-past" : "arc__node"}
                        onClick={() => goTo(index)}
                      >
                        <span className="arc__icon">
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        <span className="arc__label">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div id="arc-panel" role="tabpanel" className="arc__panel" aria-live="polite" aria-label={`${step.label}: ${step.tagline}`}>
                <div className="arc__swap" key={active}>
                  <h3 className="arc__tagline">{step.tagline}</h3>
                  <p className="arc__desc">{step.description}</p>
                </div>
                <div className="arc__nav">
                  <button type="button" className="round-btn" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous step">
                    <ChevronLeft size={18} />
                  </button>
                  <p className="arc__count" aria-hidden="true">
                    {active + 1} / {journey.length}
                  </p>
                  <button type="button" className="round-btn round-btn--lime" onClick={() => goTo(active + 1)} disabled={active === last} aria-label="Next step">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
            {!reduced && (
              <p className="arc__hint" aria-hidden="true">
                Scroll to walk from soil to health <ChevronDown size={16} />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
