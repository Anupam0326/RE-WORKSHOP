/**
 * Home. 15 Nov 2026 (the reviewer's change brief, approved by the client through Anupam): the order now follows what a
 * first-time visitor asks, one answer per section:
 * what is this place (hero: a strip of photos, the two doors) → the open kitchen and the store, side by side → what the
 * food is made without (the No-Compromise Code) → where the grain comes from (the farm, pick a grain, for farmers) →
 * who to talk to (the free consultation) → where it is (the footer: address, directions, call, WhatsApp).
 * The consultation used to be second; it now closes the page next to the contact details.
 *
 * Earlier: 3 Nov 2026: a reviewer found the site cluttered ("too much data") and the menu-board hero weak. Eleven sections
 * became six, each saying one thing with one way on to the page that holds the rest:
 * the shop front (hero) → the free consultation → the café and the store side by side → the No-Compromise Code → the
 * farm and "pick a grain" → the footer (visit us).
 * Left the home page, still on their own pages: the founders (Our story), the name and its five Re- lines (Our story),
 * the six staples (the shop; three of them now stand on the home shelf), the closing invitation (Our story, café).
 * The navigation's lime "Free consultation" button leads to the consultation band from every page.
 */

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { Consultation } from "@/components/home/Consultation";
import { NoCompromise } from "@/components/home/CafeSections";
import { CafeAndStore, FarmAndGrain } from "@/components/home/Spreads";
import { useHashScroll, useReveal } from "@/hooks/useReveal";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Home() {
  usePageMeta();
  useReveal();
  useHashScroll();
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main" className="home">
        <Hero />
        <CafeAndStore />
        <NoCompromise />
        <FarmAndGrain />
        <Consultation />
      </main>
      <SiteFooter />
    </div>
  );
}
