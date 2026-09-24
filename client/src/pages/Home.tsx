/** Home — the Re Workshop story in one continuous, mobile-first narrative: SOIL → SEEDS → GRAINS → PROCESSING → KITCHEN → PLATE → HEALTH. */

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { BrandStatement, Manifesto, Meaning, SoilToPlate } from "@/components/home/StorySections";
import { Experience, MilletMenu, NoCompromise } from "@/components/home/CafeSections";
import { FeaturedProducts, GroceryStore } from "@/components/home/StoreSections";
import { Founders } from "@/components/home/Founders";
import { FinalMessage, Visit } from "@/components/home/ClosingSections";
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
        <Manifesto />
        <Meaning />
        <SoilToPlate />
        <BrandStatement />
        <Experience />
        <MilletMenu />
        <NoCompromise />
        <GroceryStore />
        <FeaturedProducts />
        <Founders />
        <FinalMessage />
        <Visit />
      </main>
      <SiteFooter />
    </div>
  );
}
