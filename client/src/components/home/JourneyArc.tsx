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
 *
 * 28 Oct 2026, client recording (Windows laptop, Chrome with bookmarks bar and taskbar: a short window): the dark band
 * crossed the centre heading and description. Cause: the pinned dial took its width from the window height (it has to
 * fit on screen while pinned) but the text inside it kept its size and was 46% of the dial wide, so a short window made
 * the clear space inside the ring smaller while the text grew taller (more lines). Fix, keeping the design:
 * - the pinned dial's height budget is now exact (DIAL_RESERVE, same number in index.css), so it shrinks far less;
 * - inside the ring the heading and description scale with the dial (container units), within readable floors;
 * - the walk pins only where the whole stage fits on screen: a wide dial at least DIAL_MIN across (else the text no
 *   longer fits inside the ring), or, on phones, the dial plus its text. Elsewhere it stays in the page and the arrows
 *   and steps change the step, as with reduced motion;
 * - the text area keeps the height of the longest step (a hidden sizer), so changing step never moves the dial.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type RefObject } from "react";
import { ChefHat, ChevronDown, ChevronLeft, ChevronRight, Cog, HeartPulse, Layers, Soup, Sprout, Wheat } from "lucide-react";
import { journey } from "@/data/brand";

const icons: ComponentType<{ size?: number; strokeWidth?: number }>[] = [Layers, Sprout, Wheat, Cog, ChefHat, Soup, HeartPulse];
const last = journey.length - 1;
/** Height of the floating navigation plus breathing room; the stage pins just below it. */
const PIN_TOP = 84;
/**
 * Pinned wide dial: the height it leaves for everything but its own half circle: PIN_TOP, the stage's padding (24) and
 * the band under the ring's ends that holds the Soil and Health labels and the hint (--arc-below, 44). index.css uses
 * the same 152px in the pinned width: min(100%, 980px, (100svh - 152px) * 2).
 */
const DIAL_RESERVE = 152;
/**
 * Narrowest wide dial that pins. Measured 28 Oct 2026 across every step: the longest (Seeds) clears the band by 14px
 * at 800px, 35px at 980px; below 800px the margin falls to 5px. Pinning therefore needs a window at least
 * 800 / 2 + DIAL_RESERVE = 552px tall; shorter windows keep the full-size dial in the page.
 */
const DIAL_MIN = 800;
/** Phones: the stage's padding around the pinned dial and its text (the scroll hint below may fall off the screen). */
const NARROW_EXTRA = 24;

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

/**
 * Whether the scroll walk can pin: only when the whole stage fits under the navigation. Wide screens: the pinned dial
 * would be (svh - DIAL_RESERVE) * 2 wide, which must be at least DIAL_MIN. Phones: the dial is as wide as the page
 * either way, so its measured height (text area sized for the longest step) plus the hint must fit.
 */
function usePinnable(disabled: boolean, arcRef: RefObject<HTMLDivElement | null>) {
  const [pinnable, setPinnable] = useState(true);
  useLayoutEffect(() => {
    if (disabled) return;
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const wide = window.matchMedia("(min-width: 860px)");
    const decide = () => {
      const height = probe.offsetHeight || window.innerHeight;
      if (wide.matches) {
        setPinnable((height - DIAL_RESERVE) * 2 >= DIAL_MIN);
      } else {
        const arc = arcRef.current;
        setPinnable(!!arc && arc.offsetHeight + NARROW_EXTRA <= height - PIN_TOP);
      }
    };
    decide();
    const observer = "ResizeObserver" in window ? new ResizeObserver(decide) : null;
    if (arcRef.current) observer?.observe(arcRef.current);
    window.addEventListener("resize", decide);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", decide);
      probe.remove();
    };
  }, [disabled, arcRef]);
  return pinnable;
}

export function JourneyArc() {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const pinnable = usePinnable(reduced, arcRef);
  /** The scroll walk: pinned stage, the visitor's scroll moves the seed. Otherwise the arrows and steps pick a step. */
  const walk = !reduced && pinnable;
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
    if (!walk) return;
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
  }, [walk, measure]);

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

  // While the dial is on screen the floating Order now card steps aside (index.css: .arc-on-screen), so it never
  // covers the Plate or Health step.
  useEffect(() => {
    document.documentElement.classList.toggle("arc-on-screen", live);
    return () => document.documentElement.classList.remove("arc-on-screen");
  }, [live]);

  const active = walk ? Math.min(last, Math.round(progress * last)) : picked;
  const trail = walk ? progress : picked / last;
  const step = journey[active];
  const seed = seedAt(trail);

  /** Go to a step: scroll the page to where the seed reaches it (or, when not walking, just show it). */
  const goTo = (index: number) => {
    const target = Math.min(last, Math.max(0, index));
    if (!walk) {
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

  const classes = ["arc", risen ? "is-risen" : "", live ? "is-live" : "", walk && progress > 0.015 ? "is-moving" : ""].filter(Boolean).join(" ");

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="wrap">
        <header className="head head--center">
          <h2 id="journey-title">From living soil to a healthier you, in seven steps</h2>
        </header>
      </div>

      <div ref={scrollerRef} className={walk ? "arc-scroller is-pinned" : "arc-scroller"}>
        <div ref={stageRef} className="arc-stage">
          <div className="wrap">
            <div ref={arcRef} className={classes} style={{ "--p": trail } as CSSProperties}>
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
                <div className="arc__body">
                  {/* Invisible: every step's text in one cell, so the text area is always as tall as the longest step. */}
                  <div className="arc__sizer" aria-hidden="true">
                    {journey.map((item) => (
                      <div key={item.label} className="arc__sizer-step">
                        <h3 className="arc__tagline">{item.tagline}</h3>
                        <p className="arc__desc">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="arc__swap" key={active}>
                    <h3 className="arc__tagline">{step.tagline}</h3>
                    <p className="arc__desc">{step.description}</p>
                  </div>
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
            {walk && (
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
