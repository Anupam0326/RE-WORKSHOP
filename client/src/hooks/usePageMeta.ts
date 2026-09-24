import { useEffect } from "react";

const SITE = "Re Workshop";
const DEFAULT_DESCRIPTION =
  "Re Workshop, Jabalpur — a premium organic grocery store and transparent open-kitchen millet café. Heritage grains, stone-milled flours, wood-pressed oils. Zero maida, zero refined oil, zero processed sugar, zero corn starch.";

/** Keeps <title>, meta description and canonical in sync on client-side routes. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — Organic Food Store & Millet Café, Jabalpur`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", description ?? DEFAULT_DESCRIPTION);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;
  }, [title, description]);
}
