/**
 * Soil → Health: the seven steps of the brief's journey set on a half circle, like a horizon.
 * Tap a step on the arc; its tagline and description fill the centre. Copy: data/brand.ts → journey.
 */

import { useState, type ComponentType } from "react";
import { ChefHat, ChevronLeft, ChevronRight, Cog, HeartPulse, Layers, Soup, Sprout, Wheat } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { journey } from "@/data/brand";

const icons: ComponentType<{ size?: number; strokeWidth?: number }>[] = [Layers, Sprout, Wheat, Cog, ChefHat, Soup, HeartPulse];

/** Position on the arc: 0 = far left (Soil), last = far right (Health). */
function place(index: number, count: number) {
  const angle = Math.PI - (index / (count - 1)) * Math.PI;
  return { "--x": `${50 + 45 * Math.cos(angle)}%`, "--y": `${100 - 90 * Math.sin(angle)}%` } as React.CSSProperties;
}

export function JourneyArc() {
  const [active, setActive] = useState(0);
  const step = journey[active];
  const go = (delta: number) => setActive((current) => Math.min(journey.length - 1, Math.max(0, current + delta)));

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="wrap">
        <header className="head head--center">
          <SectionLabel icon={Sprout}>Soil to health</SectionLabel>
          <h2 id="journey-title">From living soil to a healthier you, in seven steps</h2>
        </header>

        <div className="arc">
          <div className="arc__rings" aria-hidden="true">
            <span className="arc__ring arc__ring--outer" />
            <span className="arc__ring arc__ring--band" />
            <span className="arc__ring arc__ring--inner" />
            <span className="arc__spokes" />
          </div>

          <ol className="arc__steps" role="tablist" aria-label="Soil to health steps">
            {journey.map((item, index) => {
              const Icon = icons[index] ?? Sprout;
              const on = index === active;
              return (
                <li key={item.label} role="presentation" className="arc__step" style={place(index, journey.length)}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="arc-panel"
                    className={on ? "arc__node is-on" : index < active ? "arc__node is-past" : "arc__node"}
                    onClick={() => setActive(index)}>
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
            <p className="arc__where">{step.label}</p>
            <h3 className="arc__tagline">{step.tagline}</h3>
            <p className="arc__desc">{step.description}</p>
            <div className="arc__nav">
              <button type="button" className="round-btn" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous step">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="round-btn round-btn--lime" onClick={() => go(1)} disabled={active === journey.length - 1} aria-label="Next step">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
