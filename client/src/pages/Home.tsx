/** Home — the Re Workshop story in one continuous, mobile-first narrative: SOIL → SEEDS → GRAINS → PROCESSING → KITCHEN → PLATE → HEALTH. */

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { JourneyArc } from "@/components/home/JourneyArc";
import { BrandStatement, Manifesto, Meaning, SoilToPlate } from "@/components/home/StorySections";
import { Experience, MenuTicker, NoCompromise } from "@/components/home/CafeSections";
import { FeaturedProducts, GroceryStore, ShelvesPanel } from "@/components/home/StoreSections";
import { Founders } from "@/components/home/Founders";
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
        <ShelvesPanel />
        <JourneyArc />
        <Manifesto />
        <Meaning />
        <SoilToPlate />
        <BrandStatement />
        <Experience />
        <MenuTicker />
        <NoCompromise />
        <GroceryStore />
        <FeaturedProducts />
        <Founders />
        <FinalMessage />
      </main>
      <SiteFooter />
    </div>
  );
}
