/** The No-Compromise Code: on the home page and the café page (it covers the café and the packaged foods). */

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
