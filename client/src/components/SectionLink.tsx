/** In-page section link that works from any route: native smooth scroll on Home, client navigation elsewhere. */

import type { MouseEvent, ReactNode } from "react";
import { useLocation } from "wouter";

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function SectionLink({ id, className, children, onNavigate, ...rest }: { id: string; className?: string; children: ReactNode; onNavigate?: () => void; "aria-label"?: string }) {
  const [location, navigate] = useLocation();
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate?.();
    if (location === "/") {
      // Let an open menu unmount and release its scroll lock first (setTimeout, not rAF: rAF can be throttled).
      window.setTimeout(() => scrollToSection(id), 40);
    } else {
      navigate(`/#${id}`);
    }
  }
  return (
    <a href={`/#${id}`} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
