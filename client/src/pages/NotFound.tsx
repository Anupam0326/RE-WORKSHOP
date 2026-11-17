import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotFound() {
  // Unknown addresses answer with this page; keep it out of search results (the server still says 200).
  usePageMeta("Page not found", undefined, { noindex: true });
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main" className="not-found wrap">
        <SectionLabel>404</SectionLabel>
        <h1>This page isn’t on our shelves.</h1>
        <p>Head back to the store, or start with our story.</p>
        <div className="not-found__actions">
          <Link href="/shop" className="btn btn--dark">
            Shop the store <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/" className="btn btn--ghost">
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
