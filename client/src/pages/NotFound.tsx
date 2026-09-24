import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionLabel } from "@/components/SectionLabel";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found");
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main" className="not-found rw-wrap">
        <SectionLabel>404</SectionLabel>
        <h1>This page isn’t on our shelves.</h1>
        <p>Head back to the store, or start with our story.</p>
        <div className="not-found__actions">
          <Link href="/shop" className="button button--forest">
            Visit the store <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/" className="button button--outline">
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
