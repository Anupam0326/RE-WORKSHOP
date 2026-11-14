/**
 * The café menu on /cafe#menu.
 *
 * 15 Nov 2026 (the reviewer's change brief, approved by the client through Anupam): the dark "Mindful Millet Menu" book
 * (20 pages on a phone, a description under every dish) and its "See every dish at once" switch are gone. The reviewer
 * read the book as a repeat of the pictured dishes above it, and the switch stretched the page to several screens.
 * Now: a heading, one line under it, the pictured dishes, then the eight sections as tabs. A section is a plain list of
 * dish and price, easy to scan; a dish that has a description opens it on a tap (the descriptions say what a dish is
 * made of, which people with allergies ask about, so they are kept, just not in the way).
 * Every one of the menu's dishes and prices is still here. The book version is kept outside the repository in case it
 * is wanted back.
 *
 * Data: data/cafeMenu.ts (never retype dishes or prices here).
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { cafeMenu, categoryOf, dishPhoto, menuPrice, rowDishes, type MenuItem } from "@/data/cafeMenu";
import { whatsappDigits, whatsappReady } from "@/lib/whatsapp";

const question = encodeURIComponent("Hello Re Workshop, I have a question about the café menu.");

/** Ask the menu to open a dish's section and light the dish up (the photo strip at the top of the page uses this). */
export function showDish(id: string) {
  window.dispatchEvent(new CustomEvent("rw-show-dish", { detail: id }));
}

function Row({ item, lit }: { item: MenuItem; lit: boolean }) {
  const line = (
    <>
      <span className="menu-row__name">{item.name}</span>
      {item.description && <ChevronDown className="menu-row__more" size={16} aria-hidden="true" />}
      <span className="menu-row__price">{menuPrice(item.price)}</span>
    </>
  );
  return (
    <li className={lit ? "menu-row is-lit" : "menu-row"} data-dish={item.id}>
      {item.description ? (
        <details open={lit || undefined}>
          <summary className="menu-row__line">{line}</summary>
          <p className="menu-row__desc">{item.description}</p>
        </details>
      ) : (
        <div className="menu-row__line">{line}</div>
      )}
    </li>
  );
}

export function CafeMenu() {
  const { categories } = cafeMenu;
  const row = rowDishes();
  const [open, setOpen] = useState(categories[0].id);
  const [lit, setLit] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const show = (id: string) => {
    const category = categoryOf(id);
    if (!category) return;
    setOpen(category.id);
    setLit(id);
  };

  // A dish picked from a photo (here or in the strip at the top of the page): bring it into view once its section shows.
  useEffect(() => {
    const onShow = (event: Event) => show((event as CustomEvent<string>).detail);
    window.addEventListener("rw-show-dish", onShow);
    return () => window.removeEventListener("rw-show-dish", onShow);
  }, []);

  useEffect(() => {
    if (!lit) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = sectionRef.current?.querySelector<HTMLElement>(`[data-dish="${lit}"]`);
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, [lit]);

  // Keep the chosen tab in view on phones, where the tabs scroll sideways. The rail is moved directly: scrollIntoView on
  // the tab would also move the page and cancel the scroll to a dish.
  useEffect(() => {
    const rail = tabsRef.current;
    const tab = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (rail && tab) rail.scrollTo({ left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2, behavior: "auto" });
  }, [open]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const move = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    const next = categories[(index + move + categories.length) % categories.length];
    setOpen(next.id);
    setLit(null);
    tabsRef.current?.querySelector<HTMLElement>(`#menu-tab-${next.id}`)?.focus();
  };

  return (
    <section ref={sectionRef} id="menu" className="section cafe-menu" aria-labelledby="menu-title">
      <div className="wrap">
        <header className="cafe-menu__head">
          <h2 id="menu-title">The café menu</h2>
          <p className="cafe-menu__sub">Every dish and drink with its price.</p>
        </header>

        {row.length > 0 && (
          <ul className={`dish-row dish-row--${row.length}`} aria-label="Dishes from our kitchen">
            {row.map((item) => {
              const photo = dishPhoto(item.id)!;
              return (
                <li key={item.id}>
                  <button type="button" className="dish-card" onClick={() => show(item.id)} aria-label={`${item.name}, ${menuPrice(item.price)}: show it in the menu`}>
                    <span className="dish-card__photo">
                      <img src={photo.urlSmall ?? photo.url} srcSet={`${photo.urlSmall} ${photo.widthSmall}w, ${photo.url} ${photo.width}w`} sizes="(min-width: 860px) 380px, 31vw" width={480} height={480} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="dish-card__name">{item.name}</span>
                    <span className="dish-card__price">{menuPrice(item.price)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div ref={tabsRef} className="pill-rail menu-tabs" role="tablist" aria-label="Menu sections">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`menu-tab-${category.id}`}
              aria-selected={category.id === open}
              aria-controls={`menu-panel-${category.id}`}
              tabIndex={category.id === open ? 0 : -1}
              className={category.id === open ? "pill is-active" : "pill"}
              onClick={() => {
                setOpen(category.id);
                setLit(null);
              }}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {categories.map((category) => (
          <div key={category.id} role="tabpanel" id={`menu-panel-${category.id}`} aria-labelledby={`menu-tab-${category.id}`} hidden={category.id !== open} className="menu-panel">
            {category.parentSection && <p className="menu-panel__note">{category.parentSection}</p>}
            <ul className="menu-list">
              {category.items.map((item) => (
                <Row key={item.id} item={item} lit={item.id === lit} />
              ))}
            </ul>
          </div>
        ))}

        <p className="cafe-menu__after">
          Prices in Indian rupees. To know more about a dish, visit the café
          {whatsappReady ? (
            <>
              {" "}
              or{" "}
              <a href={`https://wa.me/${whatsappDigits}?text=${question}`} target="_blank" rel="noopener noreferrer" className="text-link">
                ask us on WhatsApp
              </a>
            </>
          ) : null}
          .
        </p>
      </div>
    </section>
  );
}
