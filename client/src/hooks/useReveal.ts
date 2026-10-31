import { useEffect } from "react";

/**
 * Fades [data-reveal] elements in once as they enter the viewport.
 * One IntersectionObserver per page; skipped entirely for reduced motion or old browsers.
 * 31 Oct 2026: it also picks up [data-reveal] elements that appear after the page has loaded (a MutationObserver
 * rescans, once per frame). Before, only the elements present at first render were watched, so anything added later
 * (the For farmers cards after a change of language) stayed invisible until a refresh.
 */
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canObserve = !reduce && "IntersectionObserver" in window;
    const watched = new WeakSet<Element>();
    const observer = canObserve
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-in");
              observer?.unobserve(entry.target);
            }
          },
          // Trigger slightly before an element enters the viewport so fast flicks never land on blank space.
          { rootMargin: "0px 0px 15% 0px", threshold: 0 },
        )
      : null;

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((element) => {
        if (!observer) {
          element.classList.add("is-in");
          return;
        }
        if (watched.has(element)) return;
        watched.add(element);
        observer.observe(element);
      });
    };
    scan();

    let frame = 0;
    const mutations = "MutationObserver" in window
      ? new MutationObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(scan);
        })
      : null;
    mutations?.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations?.disconnect();
      observer?.disconnect();
    };
  }, []);
}

/** Scrolls to the URL hash after a client-side navigation lands on a page. */
export function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 0);
    return () => window.clearTimeout(timer);
  }, []);
}
