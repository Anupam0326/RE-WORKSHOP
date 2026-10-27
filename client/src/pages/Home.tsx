/**
 * Home. 18 Oct 2026: simplified after the client found the site confusing (one idea per section, each with one way
 * out to its page). 22 Oct 2026: made richer as magazine spreads (impeccable skill), still one idea per section:
 * menu board (hero) → the café → the store (shelves, six staples) → the No-Compromise Code → the farm → pick a grain
 * to track → the founders → the name → the closing invitation.
 * 23 Oct 2026: the free consultation with Dr. Swati Chhajed sits right under the menu board (client: visible at a
 * glance); the navigation's lime "Free consultation" button leads here from every page.
 */

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { Consultation } from "@/components/home/Consultation";
import { NoCompromise } from "@/components/home/CafeSections";
import { FeaturedProducts, ShelvesPanel } from "@/components/home/StoreSections";
import { Founders } from "@/components/home/Founders";
import { CafeSpread, FarmSpread, GrainDoor, NameSpread } from "@/components/home/Spreads";
import { FinalMessage } from "@/components/home/ClosingSections";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Home() {
  usePageMeta();
  useReveal();
  useHashScroll();
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <Hero />
        <Consultation />
        <CafeSpread />
        <ShelvesPanel />
        <FeaturedProducts />
        <NoCompromise />
        <FarmSpread />
        <GrainDoor />
        <Founders compact />
        <NameSpread />
        <FinalMessage />
      </main>
      <SiteFooter />
    </div>
  );
}
