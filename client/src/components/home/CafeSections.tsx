/** The No-Compromise Code: on the home page and the café page (it covers the café and the packaged foods). */

import type { CSSProperties } from "react";
import { noCompromise } from "@/data/brand";

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
            {/* 3 Nov 2026: as the list comes into view each ingredient is struck out in lime, one after another, so
                "zero" is shown as well as said (index.css, "Zero, struck out"). */}
            <ul className="zero__list">
              {noCompromise.rules.map((rule, index) => (
                <li key={rule} className="zero__item" style={{ "--i": index } as CSSProperties}>
                  <span className="sr-only">Zero </span>
                  <span className="zero__strike">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
