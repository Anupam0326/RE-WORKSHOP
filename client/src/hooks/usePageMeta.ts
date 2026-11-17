import { useEffect } from "react";
import { pageMeta, SITE_URL } from "@/lib/seo";

const SITE = "Re Workshop";

type Options = {
  /** Use `title` as the whole title (from lib/seo.ts), instead of "<title> | Re Workshop". */
  exact?: boolean;
  /** Pages that should stay out of search results (not found, basket). */
  noindex?: boolean;
  /** Structured data for this page only (a product), added as its own JSON-LD script and removed on leaving. */
  jsonLd?: object | null;
};

const home = pageMeta("/");

/**
 * Keeps <title>, meta description, canonical, robots and page JSON-LD in sync on client-side routes.
 * The server already sends the right head for each page (scripts/seo-build.mjs); this keeps it right when the visitor
 * moves between pages without reloading.
 */
export function usePageMeta(title?: string, description?: string, { exact = false, noindex = false, jsonLd = null }: Options = {}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title ? (exact ? title : `${title} | ${SITE}`) : home.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description ?? home.description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    // Always the www address, whichever address the visitor arrived on (reworkshop.store, a Vercel preview).
    canonical.href = `${SITE_URL}${window.location.pathname}`;

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex";
    } else robots?.remove();

    document.getElementById("page-jsonld")?.remove();
    if (ld) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      script.textContent = ld;
      document.head.appendChild(script);
    }
    return () => document.getElementById("page-jsonld")?.remove();
  }, [title, description, exact, noindex, ld]);
}
