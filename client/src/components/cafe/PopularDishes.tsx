/**
 * Our popular options (18 Nov 2026, Anupam): the café menu left the site; this takes its place on the café page.
 * Six dishes with the café's own photos, each named on its photo. No prices and no count of dishes anywhere.
 *
 * The list is data/popularDishes.json: ids and names copied exactly from the café menu
 * (content/cafe-menu/reworkshop_cafe_menu.json); `node scripts/cafe-menu.mjs --check` fails if a name no longer matches.
 * Six fills two rows of three (grid rule: rows are always full). Besan Cheela is not here: its photo is on the home
 * first screen (one photo, one place).
 */

import { MessageCircle } from "lucide-react";
import popular from "@/data/popularDishes.json";
import { sitePhoto, type SitePhotoName } from "@/data/sitePhotos";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

const question = encodeURIComponent("Hello Re Workshop, I have a question about the café's dishes.");

export function PopularDishes() {
  return (
    <section id="popular" className="section popular" aria-labelledby="popular-title">
      <div className="wrap">
        <header className="popular__head" data-reveal>
          <h2 id="popular-title">Our popular options</h2>
          <p>Made fresh in our open kitchen.</p>
        </header>
        <ul className="popular__grid">
          {popular.map((dish) => {
            const photo = sitePhoto(`dish-${dish.id}` as SitePhotoName);
            return (
              <li key={dish.id} className="popular__item" data-reveal>
                <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} ${photo.widthSmall}w, ${photo.url} ${photo.width}w`} sizes="(min-width: 860px) 400px, 46vw" width={480} height={480} alt={dish.name} loading="lazy" decoding="async" />
                <span className="popular__name" aria-hidden="true">
                  {dish.name}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="popular__after">
          To know more about our dishes, visit the café
          {whatsappReady ? (
            <>
              {" "}
              or{" "}
              <a href={`https://wa.me/${whatsappDigits}?text=${question}`} target="_blank" rel="noopener noreferrer" className="text-link">
                <MessageCircle size={16} aria-hidden="true" /> ask us on WhatsApp
              </a>
            </>
          ) : null}
          .
        </p>
      </div>
    </section>
  );
}
