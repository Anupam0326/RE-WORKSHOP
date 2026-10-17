/** The Re Workshop experience: open-kitchen café, live transformation, millet menu and the no-compromise code. */

import { useState } from "react";
import { ChefHat, Eye, RefreshCw, Soup, UtensilsCrossed } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";
import { SiteImage } from "@/components/SiteImage";
import type { MediaSlotKey } from "@/data/media";
import { experience, milletMenu, noCompromise } from "@/data/brand";

type Row = { id: string; title: string; body: string; slot: MediaSlotKey; icon: typeof Eye; menu?: boolean };

const rows: Row[] = [
  { id: "kitchen", title: experience.openKitchen.title, body: experience.openKitchen.body, slot: "cafe-shelf", icon: Eye },
  { id: "live", title: experience.live.title, body: experience.live.body, slot: "cafe-plate", icon: RefreshCw },
  { id: "menu", title: milletMenu.heading, body: milletMenu.intro, slot: "menu-photo", icon: Soup, menu: true },
];

export function Experience() {
  const [active, setActive] = useState(rows[0].id);
  const order = [rows.find((row) => row.id === active)!, ...rows.filter((row) => row.id !== active)];

  return (
    <section id="cafe" className="band band--mist band--wave cafe" aria-labelledby="cafe-title">
      <div className="wrap wrap--lined cafe__inner">
        <header className="head">
          <SectionLabel icon={ChefHat}>{experience.eyebrow}</SectionLabel>
          <h2 id="cafe-title">{experience.heading}</h2>
          <p className="head__lead">{experience.invite}</p>
          <p className="head__intro">{experience.concept}</p>
        </header>

        <div className="cafe__layout">
          <div className="cafe__list">
            {rows.map((row) => {
              const on = row.id === active;
              const Icon = row.icon;
              return (
                <article key={row.id} className={on ? "crow is-on" : "crow"}>
                  <h3>
                    <button type="button" className="crow__toggle" aria-expanded={on} aria-controls={`crow-${row.id}`} onClick={() => setActive(row.id)}>
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                      <span>{row.title}</span>
                    </button>
                  </h3>
                  <div id={`crow-${row.id}`} className="crow__body" hidden={!on}>
                    <p>{row.body}</p>
                    {row.menu && (
                      <ul className="chip-list chip-list--dark" aria-label="Millet menu">
                        {milletMenu.items.map((item) => (
                          <li key={item} className="chip">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="cafe__stack" aria-hidden="true">
            {order.map((row, index) => (
              <figure key={row.id} className={`stack-card stack-card--${index + 1}`}>
                <SiteImage slot={row.slot} sizes="(min-width: 860px) 340px, 60vw" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The millet menu as a moving strip, like a board above the counter. Static and wrapped for reduced motion. */
export function MenuTicker() {
  const items = milletMenu.items;
  const run = (hidden: boolean) => (
    <ul className="ticker__run" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return (
    <section className="band band--mist ticker" aria-label="On the millet menu">
      <div className="wrap wrap--lined ticker__inner">
        <p className="ticker__tags" aria-hidden="true">
          <span className="ticker__tag ticker__tag--lime">
            <UtensilsCrossed size={16} /> On the
          </span>
          <span className="ticker__tag">millet menu</span>
        </p>
        <div className="ticker__track">
          <div className="ticker__belt">
            {run(false)}
            {run(true)}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The code as one big "Zero" (seen first) beside the four ingredients it rules out.
 * Screen readers hear "Zero Maida", "Zero Refined Oil" and so on.
 */
export function NoCompromise() {
  return (
    <section className="section code" aria-labelledby="code-title">
      <div className="wrap">
        <div className="panel panel--dark grain code__panel">
          <div className="code__head">
            <h2 id="code-title">{noCompromise.heading}</h2>
            <p className="code__intro">{noCompromise.intro}</p>
          </div>
          <div className="zero" data-reveal>
            <p className="zero__word" aria-hidden="true">
              Zero
            </p>
            <ul className="zero__list">
              {noCompromise.rules.map((rule) => (
                <li key={rule} className="zero__item">
                  <span className="sr-only">Zero </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
