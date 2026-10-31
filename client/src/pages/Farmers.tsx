/**
 * For farmers (client, 31 Oct 2026): a way for farmers who want to farm with Re Workshop to get in touch. In the
 * navigation as "For farmers".
 *
 * The client has not said yet what a farmer who joins gets, so the page promises nothing (copy: data/brand.ts →
 * farmersCopy): who we would like to hear from, how we farm (the words of the seven-step journey), and a short form. The
 * form keeps nothing: it writes the farmer's details into a WhatsApp message to the store (lib/whatsapp.ts), which the
 * farmer checks and sends. Only name and village are needed; everything else is optional.
 *
 * English and Hindi (31 Oct 2026, Anupam: "the farmers might not know English"). The switch at the top shows the other
 * language in its own script ("हिंदी में पढ़ें" / "Read in English"). The page opens in Hindi when the link says so
 * (/farmers?lang=hi, for sharing on WhatsApp), when the visitor chose Hindi before on this browser, or when the phone's
 * language is Hindi. The page's <main> carries lang="hi", so screen readers and the browser treat it as Hindi; the
 * navigation and footer stay in English. Hindi text uses Noto Sans Devanagari (index.html, index.css font stacks).
 * No photo yet: every seed-work photo the client has sent is already used once on the site (one photo, one place).
 */

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, Languages, Layers, MessageCircle, Phone, Sprout, Wheat } from "lucide-react";
import { SectionLink } from "@/components/SectionLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { farmersCopy, type FarmersCopy } from "@/data/brand";
import { storeInfo } from "@/data/catalog";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { farmerEnquiryUrl } from "@/lib/whatsapp";

type Lang = "en" | "hi";
const STORAGE_KEY = "rw-farmers-lang";
const howIcons = [Layers, Sprout, Wheat];

function initialLang(): Lang {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "hi" || param === "en") return param;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "hi" || saved === "en") return saved;
  } catch {
    // Storage can be blocked (private windows); the other signals still work.
  }
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((language) => language?.toLowerCase().startsWith("hi")) ? "hi" : "en";
}

function useFarmerLang() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const choose = (next: Lang) => {
    setLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not remembered; the choice still applies on this visit.
    }
    const url = new URL(window.location.href);
    if (next === "hi") url.searchParams.set("lang", "hi");
    else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  };
  return [lang, choose] as const;
}

type Fields = { name: string; place: string; land: string; crops: string; note: string };
const empty: Fields = { name: "", place: "", land: "", crops: "", note: "" };

function FarmerForm({ t }: { t: FarmersCopy }) {
  const [values, setValues] = useState(empty);
  /** The chosen practice by position, so it survives a change of language. */
  const [practice, setPractice] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const missing = { name: !values.name.trim(), place: !values.place.trim() };

  // A message prepared in one language is not offered again after switching to the other.
  useEffect(() => setSentUrl(null), [t.lang]);

  const set = (key: keyof Fields) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTried(true);
    if (missing.name || missing.place) {
      (missing.name ? nameRef : placeRef).current?.focus();
      return;
    }
    const url = farmerEnquiryUrl(
      {
        name: values.name.trim(),
        place: values.place.trim(),
        land: values.land.trim(),
        crops: values.crops.trim(),
        practice: practice === null ? "" : t.practices[practice],
        note: values.note.trim(),
      },
      t.message,
    );
    setSentUrl(url);
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url;
  };

  const invalid = (key: "name" | "place") => tried && missing[key];
  const optional = <span className="farm-field__opt">{t.fields.optional}</span>;

  return (
    <form className="farm-form" onSubmit={onSubmit} noValidate aria-labelledby="form-title">
      <div className="farm-field">
        <label htmlFor="farm-name">{t.fields.name}</label>
        <input ref={nameRef} id="farm-name" name="name" autoComplete="name" value={values.name} onChange={set("name")} required aria-invalid={invalid("name")} aria-describedby={invalid("name") ? "farm-name-error" : undefined} />
        {invalid("name") && (
          <p id="farm-name-error" className="farm-field__error">
            {t.errors.name}
          </p>
        )}
      </div>
      <div className="farm-field">
        <label htmlFor="farm-place">{t.fields.place}</label>
        <input ref={placeRef} id="farm-place" name="place" autoComplete="address-level2" placeholder={t.fields.placeExample} value={values.place} onChange={set("place")} required aria-invalid={invalid("place")} aria-describedby={invalid("place") ? "farm-place-error" : undefined} />
        {invalid("place") && (
          <p id="farm-place-error" className="farm-field__error">
            {t.errors.place}
          </p>
        )}
      </div>
      <div className="farm-form__row">
        <div className="farm-field">
          <label htmlFor="farm-land">
            {t.fields.land} {optional}
          </label>
          <input id="farm-land" name="land" inputMode="decimal" value={values.land} onChange={set("land")} />
        </div>
        <div className="farm-field">
          <label htmlFor="farm-crops">
            {t.fields.crops} {optional}
          </label>
          <input id="farm-crops" name="crops" placeholder={t.fields.cropsExample} value={values.crops} onChange={set("crops")} />
        </div>
      </div>
      <fieldset className="farm-field">
        <legend>
          {t.fields.practice} {optional}
        </legend>
        <div className="farm-choices">
          {t.practices.map((label, index) => (
            <label key={index} className="farm-choice">
              <input type="radio" name="practice" value={index} checked={practice === index} onChange={() => setPractice(index)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="farm-field">
        <label htmlFor="farm-note">
          {t.fields.note} {optional}
        </label>
        <textarea id="farm-note" name="note" rows={3} value={values.note} onChange={set("note")} />
      </div>
      <button type="submit" className="btn btn--dark btn--full">
        <MessageCircle size={18} aria-hidden="true" /> {t.submit}
      </button>
      <p className="farm-form__note">{t.formNote}</p>
      {sentUrl && (
        <p className="farm-form__sent" role="status">
          {t.sent.before}{" "}
          <a href={sentUrl} target="_blank" rel="noopener noreferrer">
            {t.sent.link}
          </a>
          .
        </p>
      )}
    </form>
  );
}

/**
 * Fetches the Hindi font in the background as soon as the page opens (about 210 KB, four weights, only here), so the
 * first switch to Hindi shows the right letters at once instead of a fallback font that then swaps.
 */
function usePreloadHindiFont() {
  useEffect(() => {
    if (!("fonts" in document)) return;
    for (const weight of [400, 500, 600, 700]) {
      document.fonts.load(`${weight} 16px "Noto Sans Devanagari"`, "किसान").catch(() => undefined);
    }
  }, []);
}

export default function Farmers() {
  const [lang, setLang] = useFarmerLang();
  const t = farmersCopy[lang];
  usePageMeta(t.metaTitle, t.metaDescription);
  useReveal();
  useHashScroll();
  usePreloadHindiFont();
  const phone = storeInfo.phones[0];
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main" lang={lang} className={lang === "hi" ? "farmers is-hi" : "farmers"}>
        <section className="intro intro--plain" aria-labelledby="page-title">
          <div className="wrap intro__inner">
            <button type="button" className="lang-switch" onClick={() => setLang(t.switchLang)} lang={t.switchLang}>
              <Languages size={18} aria-hidden="true" /> {t.switchTo}
            </button>
            <div className="intro__top">
              <h1 id="page-title" className="intro__title">
                <span className="intro__main">
                  <span className="intro__quiet">{t.quiet} </span>
                  {t.title}
                </span>
              </h1>
              <div className="intro__side">
                <p className="intro__text intro__text--lead">{t.lead}</p>
                <p className="intro__text">{t.body}</p>
                <div className="intro__actions">
                  <SectionLink id="farm-form" here className="btn btn--dark">
                    <MessageCircle size={18} aria-hidden="true" /> {t.formHeading}
                  </SectionLink>
                  <a href={`tel:${phone.tel}`} className="btn btn--ghost">
                    <Phone size={18} aria-hidden="true" /> {t.call} {phone.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="who-title">
          <div className="wrap">
            <header className="head">
              <h2 id="who-title">{t.whoHeading}</h2>
            </header>
            <ul className="farm-cards">
              {/* Keyed by position, not text: changing language updates the cards in place (no remount, no second fade). */}
              {t.who.map((item, index) => (
                <li key={index} className="farm-card" data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section farm-how" aria-labelledby="how-title">
          <div className="wrap">
            <header className="head">
              <h2 id="how-title">{t.howHeading}</h2>
            </header>
            <ul className="farm-how__grid">
              {t.how.map((item, index) => {
                const Icon = howIcons[index] ?? Sprout;
                return (
                  <li key={index} className="farm-how__item" data-reveal>
                    <span className="farm-how__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                );
              })}
            </ul>
            <SectionLink id="journey" page="/our-story" className="text-link farm-how__more">
              {t.howMore} <ArrowRight size={16} aria-hidden="true" />
            </SectionLink>
          </div>
        </section>

        <section id="farm-form" className="section" aria-labelledby="form-title">
          <div className="wrap farm-form-wrap">
            <div className="farm-form__aside">
              <h2 id="form-title">{t.formHeading}</h2>
              <p className="farm-form__intro">{t.formIntro}</p>
              <p className="farm-form__call">
                {t.callLine}{" "}
                <a href={`tel:${phone.tel}`}>
                  <Phone size={16} aria-hidden="true" /> {t.call} {phone.display}
                </a>
              </p>
            </div>
            <FarmerForm t={t} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
