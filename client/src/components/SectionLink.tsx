/**
 * Link to a section of a page that works from any route: smooth scroll when that page is already open, client
 * navigation (then a scroll to the hash) from anywhere else. `page` defaults to the home page; `here` targets a
 * section every page has (the footer's #visit panel), so it always scrolls on the current page.
 */

import type { MouseEvent, ReactNode } from "react";
import { useLocation } from "wouter";

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `${window.location.pathname}#${id}`);
}

type Props = {
  id: string;
  page?: string;
  here?: boolean;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  "aria-label"?: string;
};

export function SectionLink({ id, page = "/", here = false, className, children, onNavigate, ...rest }: Props) {
  const [location, navigate] = useLocation();
  const samePage = here || location === page;
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate?.();
    if (samePage) {
      // Let an open menu unmount and release its scroll lock first (setTimeout, not rAF: rAF can be throttled).
      window.setTimeout(() => scrollToSection(id), 40);
    } else {
      navigate(`${page}#${id}`);
    }
  }
  return (
    <a href={samePage ? `#${id}` : `${page}#${id}`} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
