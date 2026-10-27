/**
 * The café menu on /cafe#menu, as a menu book (23 Oct 2026, Anupam: "do not make it appear that large... menu book
 * style with dedicated arrows on left and right"). 65 dishes no longer run down the page: the book shows one page
 * at a time on phones and an open two-page spread from 1024px, and the arrows (or the keyboard arrows, or a swipe)
 * turn the pages. Section tabs open the page where a section starts; a dish photo opens the page with that dish and
 * lights it up.
 *
 * Pages are the same height, so the book never jumps. They are filled by measuring: every dish is laid out once,
 * hidden, at the real page width; dishes are packed into pages that fit, and a section that runs over carries on
 * at the top of the next page as "continued". It repaginates when the page size changes (rotation, resize, fonts).
 * "See every dish at once" lays the whole menu out as a list (for scanning, find-in-page and screen readers).
 * Data: data/cafeMenu.ts (never retype dishes or prices here).
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BookOpen, ChevronLeft, ChevronRight, List, MapPin } from "lucide-react";
import { cafeMenu, dishPhoto, menuPrice, photographedDishes, type MenuCategory, type MenuItem } from "@/data/cafeMenu";
import { milletMenu } from "@/data/brand";
import { storeInfo } from "@/data/catalog";

type Block = { kind: "head"; cat: MenuCategory; continued: boolean } | { kind: "item"; cat: MenuCategory; item: MenuItem };
type Page = Block[];

/** Space above a section that starts part-way down a page (px); the same value is used when packing. */
const SECTION_GAP = 26;
/** Safety margin so rounding never clips the last dish on a page (px). */
const SLACK = 6;

function DishPhoto({ item, sizes, className }: { item: MenuItem; sizes: string; className?: string }) {
  const photo = dishPhoto(item.id);
  if (!photo) return null;
  return (
    <img
      className={className}
      src={photo.urlSmall ?? photo.url}
      srcSet={`${photo.urlSmall} ${photo.widthSmall}w, ${photo.url} ${photo.width}w`}
      sizes={sizes}
      width={480}
      height={480}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

function SectionHead({ cat, continued, as: Tag = "h3" }: { cat: MenuCategory; continued: boolean; as?: "h3" | "div" }) {
  return (
    <div className={continued ? "book-cat book-cat--cont" : "book-cat"}>
      <Tag className="menu-cat__title">{continued ? `${cat.name}, continued` : cat.name}</Tag>
      {!continued && cat.parentSection && <p className="menu-cat__note">{cat.parentSection}</p>}
    </div>
  );
}

/** A dish on the page. No thumbnail: each dish photo appears once, in the photo row above the book. */
function Dish({ item, lit = false, as: Tag = "li" }: { item: MenuItem; lit?: boolean; as?: "li" | "div" }) {
  return (
    <Tag className={lit ? "menu-item is-lit" : "menu-item"} data-dish={item.id}>
      <div className="menu-item__body">
        <p className="menu-item__line">
          <span className="menu-item__name">{item.name}</span>
          <span className="board__leader" aria-hidden="true" />
          <span className="menu-item__price">{menuPrice(item.price)}</span>
        </p>
        {item.description && <p className="menu-item__desc">{item.description}</p>}
      </div>
    </Tag>
  );
}

/** Greedy packing of measured blocks into pages of the available height. */
function paginate(measure: HTMLElement, available: number): Page[] {
  const height = (key: string) => measure.querySelector<HTMLElement>(`[data-m="${key}"]`)?.getBoundingClientRect().height ?? 0;
  const pages: Page[] = [];
  let page: Page = [];
  let used = 0;
  const room = available - SLACK;
  const newPage = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
  };
  for (const cat of cafeMenu.categories) {
    const head = height(`head:${cat.id}`);
    const cont = height(`cont:${cat.id}`);
    cat.items.forEach((item, index) => {
      const dish = height(`item:${item.id}`);
      if (index === 0) {
        // A section starts on a fresh page unless its heading and first two dishes fit (no lone dish under a heading).
        const gap = page.length ? SECTION_GAP : 0;
        const second = cat.items[1] ? height(`item:${cat.items[1].id}`) : 0;
        if (page.length && used + gap + head + dish + second > room) newPage();
        used += (page.length ? SECTION_GAP : 0) + head;
        page.push({ kind: "head", cat, continued: false });
      } else if (used + dish > room) {
        newPage();
        used += cont;
        page.push({ kind: "head", cat, continued: true });
      }
      used += dish;
      page.push({ kind: "item", cat, item });
    });
  }
  newPage();
  return pages;
}

/** A page as runs of one section heading and its dishes (every page starts with a heading). */
function runs(page: Page) {
  const out: { cat: MenuCategory; continued: boolean; items: MenuItem[] }[] = [];
  for (const block of page) {
    if (block.kind === "head") out.push({ cat: block.cat, continued: block.continued, items: [] });
    else if (out.length) out[out.length - 1].items.push(block.item);
    else out.push({ cat: block.cat, continued: true, items: [block.item] });
  }
  return out;
}

function pageOf(pages: Page[], test: (block: Block) => boolean) {
  const index = pages.findIndex((page) => page.some(test));
  return index < 0 ? 0 : index;
}

/** Rows stay full: six photos (6 across on wide screens, 3 by 2 on phones), else three, else none. */
function photoRow() {
  const dishes = photographedDishes();
  if (dishes.length >= 6) return dishes.slice(0, 6);
  if (dishes.length >= 3) return dishes.slice(0, 3);
  return [];
}

function useTwoUp() {
  const [twoUp, setTwoUp] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setTwoUp(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return twoUp;
}

function MenuBook({ jump }: { jump: { id: string; n: number } | null }) {
  const twoUp = useTwoUp();
  const perView = twoUp ? 2 : 1;
  const [pages, setPages] = useState<Page[]>([]);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<string | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const signatureRef = useRef("");

  const spreadStart = Math.floor(index / perView) * perView;
  const total = pages.length;
  const lastStart = total ? Math.floor((total - 1) / perView) * perView : 0;

  const relayout = useCallback(() => {
    const measure = measureRef.current;
    const content = contentRef.current;
    if (!measure || !content || content.clientHeight === 0) return;
    const next = paginate(measure, content.clientHeight);
    const signature = next.map((page) => page.map((block) => (block.kind === "head" ? `#${block.cat.id}${block.continued ? "+" : ""}` : block.item.id)).join(",")).join("|");
    if (signature === signatureRef.current) return;
    signatureRef.current = signature;
    setPages(next);
  }, []);

  // Measure on mount and whenever the page box or the fonts change.
  useLayoutEffect(() => {
    relayout();
    const content = contentRef.current;
    if (!content) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(relayout);
    });
    observer.observe(content);
    document.fonts?.ready.then(relayout).catch(() => undefined);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [relayout, perView]);

  // Keep the reader on the same dish when the pages are recut.
  useEffect(() => {
    if (!pages.length) return;
    const anchor = anchorRef.current;
    if (anchor) setIndex(pageOf(pages, (block) => block.kind === "item" && block.item.id === anchor));
    else setIndex((current) => Math.min(current, pages.length - 1));
  }, [pages]);

  // Remember the first dish of the current view.
  useEffect(() => {
    const first = pages[spreadStart]?.find((block) => block.kind === "item");
    anchorRef.current = first && first.kind === "item" ? first.item.id : null;
  }, [pages, spreadStart]);

  const go = useCallback(
    (target: number, direction?: "next" | "prev") => {
      if (!total) return;
      const clamped = Math.max(0, Math.min(total - 1, target));
      const start = Math.floor(clamped / perView) * perView;
      if (start === spreadStart) return;
      setTurn(direction ?? (start > spreadStart ? "next" : "prev"));
      setTouched(true);
      setIndex(start);
    },
    [total, perView, spreadStart],
  );

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bringIntoView = () => {
    const book = bookRef.current;
    if (!book) return;
    const top = book.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.5) book.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  };

  // A dish photo or a section tab asks for a page.
  useEffect(() => {
    if (!jump || !pages.length) return;
    const target = jump.id.startsWith("cat:")
      ? pageOf(pages, (block) => block.kind === "head" && !block.continued && block.cat.id === jump.id.slice(4))
      : pageOf(pages, (block) => block.kind === "item" && block.item.id === jump.id);
    setTouched(true);
    const start = Math.floor(target / perView) * perView;
    if (start !== spreadStart) {
      setTurn(start > spreadStart ? "next" : "prev");
      setIndex(start);
    }
    if (!jump.id.startsWith("cat:")) {
      setLit(jump.id);
      const timer = window.setTimeout(() => setLit(null), 2600);
      bringIntoView();
      return () => window.clearTimeout(timer);
    }
    bringIntoView();
    // Runs once per request (jump.n changes); the pages are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(spreadStart + perView, "next");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(spreadStart - perView, "prev");
    }
  };
  const onPointerDown = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") swipeRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(spreadStart + (dx < 0 ? perView : -perView), dx < 0 ? "next" : "prev");
  };

  const shown = Array.from({ length: perView }, (_, i) => spreadStart + i);
  const firstItem = pages[spreadStart]?.find((block) => block.kind === "item");
  // Every section on the open pages, in order ("Summer Coolers, Hot Sips").
  const section = Array.from(new Set(shown.flatMap((i) => pages[i] ?? []).map((block) => block.cat.name))).join(", ");
  const range = perView === 2 && spreadStart + 1 < total ? `${spreadStart + 1}–${spreadStart + 2}` : `${spreadStart + 1}`;
  const status = total ? `Page${perView === 2 && spreadStart + 1 < total ? "s" : ""} ${range} of ${total}` : "";

  const prev = (
    <button type="button" className="round-btn book__arrow book__arrow--prev" onClick={() => go(spreadStart - perView, "prev")} disabled={spreadStart === 0} aria-label="Previous page">
      <ChevronLeft size={22} aria-hidden="true" />
    </button>
  );
  const next = (
    <button type="button" className="round-btn round-btn--lime book__arrow book__arrow--next" onClick={() => go(spreadStart + perView, "next")} disabled={spreadStart >= lastStart} aria-label="Next page">
      <ChevronRight size={22} aria-hidden="true" />
    </button>
  );

  return (
    <div className="book board grain" ref={bookRef} data-section={firstItem?.cat.id ?? ""}>
      <div className="board__head">
        <p className="board__title" aria-hidden="true">
          {milletMenu.heading}
        </p>
        <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="board__place">
          <MapPin size={16} aria-hidden="true" />
          Open kitchen, Ridge Road
        </a>
      </div>

      <div className="book__stage" role="group" aria-roledescription="menu book" aria-label="Café menu" onKeyDown={onKeyDown}>
        {prev}
        <div
          className={`book__spread book__spread--${perView === 2 ? "two" : "one"}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeRef.current = null)}
        >
          {shown.map((pageIndex, slot) => {
            const page = pages[pageIndex];
            return (
              <section
                key={slot}
                className={`book__page${slot === 1 ? " book__page--right" : ""}`}
                aria-label={page ? `Page ${pageIndex + 1} of ${total}` : undefined}
                aria-hidden={page ? undefined : true}
              >
                <div className="book__content" ref={slot === 0 ? contentRef : undefined}>
                  {slot === 0 && (
                    // The measuring copy: every block once, hidden, at the page's own width.
                    <div className="book__measure" ref={measureRef} aria-hidden="true">
                      {cafeMenu.categories.map((cat) => (
                        <div key={cat.id}>
                          <div data-m={`head:${cat.id}`}>
                            <SectionHead cat={cat} continued={false} as="div" />
                          </div>
                          <div data-m={`cont:${cat.id}`}>
                            <SectionHead cat={cat} continued as="div" />
                          </div>
                          {cat.items.map((item) => (
                            <div key={item.id} data-m={`item:${item.id}`}>
                              <Dish item={item} as="div" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {page && (
                    <div className={`book__flow${turn ? ` turn-${turn}` : ""}`} key={`${pageIndex}-${total}`}>
                      {runs(page).map((run, i) => (
                        <div key={`${run.cat.id}-${i}`} style={i > 0 ? { marginTop: SECTION_GAP } : undefined}>
                          <SectionHead cat={run.cat} continued={run.continued} />
                          <ul className="book__dishes">
                            {run.items.map((item) => (
                              <Dish key={item.id} item={item} lit={lit === item.id} />
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="book__folio" aria-hidden="true">
                  {page ? pageIndex + 1 : ""}
                </p>
              </section>
            );
          })}
        </div>
        {next}
      </div>

      <div className="book__foot">
        <div className="book__nav-phone">{prev}</div>
        <p className="book__status">
          <span>{status}</span>
          {section && <span className="book__section">{section}</span>}
        </p>
        <div className="book__nav-phone">{next}</div>
      </div>
      <p className="sr-only" aria-live="polite">
        {touched && status ? `${status}, ${section}` : ""}
      </p>
    </div>
  );
}

/** The whole menu at once, in two columns from 860px. */
function MenuList() {
  return (
    <div className="board grain cafe-board">
      <div className="board__head">
        <p className="board__title" aria-hidden="true">
          {milletMenu.heading}
        </p>
        <a href={storeInfo.mapUrl} target="_blank" rel="noreferrer" className="board__place">
          <MapPin size={16} aria-hidden="true" />
          Open kitchen, Ridge Road
        </a>
      </div>
      <div className="cafe-board__columns">
        {cafeMenu.categories.map((cat) => (
          <section key={cat.id} id={`menu-${cat.id}`} className="menu-cat" aria-labelledby={`menu-${cat.id}-title`}>
            <h3 id={`menu-${cat.id}-title`} className="menu-cat__title">
              {cat.name}
            </h3>
            {cat.parentSection && <p className="menu-cat__note">{cat.parentSection}</p>}
            <ul className="menu-cat__items">
              {cat.items.map((item) => (
                <Dish key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function CafeMenu() {
  const row = useMemo(photoRow, []);
  const [jump, setJump] = useState<{ id: string; n: number } | null>(null);
  const [all, setAll] = useState(false);
  const request = (id: string) => {
    setAll(false);
    setJump((current) => ({ id, n: (current?.n ?? 0) + 1 }));
  };

  return (
    <section id="menu" className="section cafe-menu" aria-labelledby="menu-title">
      <div className="wrap">
        <header className="head head--split cafe-menu__head">
          <h2 id="menu-title">
            <span className="tone-mute">The café menu.</span> Every dish and drink, with its price.
          </h2>
          <nav className="head__side" aria-label="Menu sections">
            <ul className="cafe-menu__sections">
              {cafeMenu.categories.map((cat) => (
                <li key={cat.id}>
                  <button type="button" className="pill" onClick={() => request(`cat:${cat.id}`)}>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {row.length > 0 && (
          <ul className={`dish-row dish-row--${row.length}`} aria-label="Dishes from our kitchen">
            {row.map((item) => (
              <li key={item.id}>
                <button type="button" className="dish-card" onClick={() => request(item.id)} aria-label={`${item.name}, ${menuPrice(item.price)}: show it in the menu`}>
                  <span className="dish-card__photo">
                    <DishPhoto item={item} sizes="(min-width: 860px) 200px, 31vw" />
                  </span>
                  <span className="dish-card__name">{item.name}</span>
                  <span className="dish-card__price">{menuPrice(item.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {all ? <MenuList /> : <MenuBook jump={jump} />}

        <div className="cafe-menu__after">
          <p>Prices in Indian rupees. Cooked in front of you, in our open-kitchen café.</p>
          <button type="button" className="text-link" onClick={() => setAll((value) => !value)} aria-pressed={all}>
            {all ? <BookOpen size={16} aria-hidden="true" /> : <List size={16} aria-hidden="true" />}
            {all ? "Back to the menu book" : "See every dish at once"}
          </button>
        </div>
      </div>
    </section>
  );
}
