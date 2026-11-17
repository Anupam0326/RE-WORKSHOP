/**
 * Questions people ask (18 Nov 2026): short, factual answers about the store and café in Jabalpur, for visitors and
 * for answer engines (Google's answers, ChatGPT, Perplexity). The words and the rules for them are in data/faq.ts;
 * the page also carries them as FAQPage structured data. Linked from the footer, the sitemap and llms.txt.
 */

import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCatalog } from "@/contexts/CatalogContext";
import { faqItems, faqJsonLd } from "@/data/faq";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useHashScroll } from "@/hooks/useReveal";
import { pageMeta, SITE_URL } from "@/lib/seo";

export default function Faq() {
  const { categories, products } = useCatalog();
  const items = faqItems(categories, products);
  const meta = pageMeta("/faq");
  usePageMeta(meta.title, meta.description, { exact: true, jsonLd: faqJsonLd(items, SITE_URL) });
  useHashScroll();
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main">
        <section className="page-head">
          <div className="page-head__glow" aria-hidden="true" />
          <div className="wrap page-head__inner">
            <h1>Questions people ask</h1>
            <p className="page-head__lead">About Re Workshop, the organic food store and café on Ridge Road, Jabalpur.</p>
          </div>
        </section>
        <section className="section faq" aria-label="Questions and answers">
          <div className="wrap faq__list">
            {items.map((item) => (
              <article key={item.id} id={item.id} className="faq__item">
                <h2>{item.question}</h2>
                <p>{item.answer}</p>
                {item.link &&
                  (item.link.href.startsWith("http") ? (
                    <a href={item.link.href} target="_blank" rel="noreferrer" className="text-link">
                      {item.link.label} <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={item.link.href} className="text-link">
                      {item.link.label} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  ))}
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
