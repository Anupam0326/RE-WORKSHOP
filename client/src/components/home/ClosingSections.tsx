/** Final brand message, set large inside the page's guide lines. The visit/contact block lives in the footer (#visit). */

import { finalMessage } from "@/data/brand";

export function FinalMessage() {
  return (
    <section className="final" aria-label="Our invitation">
      <div className="band band--lines">
        <div className="wrap wrap--lined">
          <blockquote className="final__quote" data-reveal>
            {finalMessage.map((line, index) => (
              <span key={line} className={index === 1 ? "tone-mute" : undefined}>
                {line}
              </span>
            ))}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
