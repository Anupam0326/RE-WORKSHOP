/**
 * A swipeable photo strip (15 Nov 2026, the reviewer's brief: "like an Instagram carousel", built for low-cost phones).
 *
 * The strip is an ordinary sideways-scrolling row with scroll snapping, so the swipe itself is done by the browser and
 * costs no script; this hook only reads which photo is on screen, moves the strip for the dots and arrows, and
 * optionally turns the photos by itself until someone touches it.
 *
 * Photos after the first are held back until the page has finished loading (`armed`), so they never compete with the
 * first screen, and then load one ahead of the photo on screen rather than all at once; with the phone's data saver
 * on they wait until the visitor swipes, taps a dot or an arrow.
 * Reduced motion: no turning by itself, and the dots jump instead of gliding.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Milliseconds between photos when it turns by itself; 0 or omitted means it only moves when the visitor moves it. */
  auto?: number;
};

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dataSaver = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

export function useCarousel(count: number, { auto = 0 }: Options = {}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  /** The furthest photo reached so far: photos load one ahead of it, not all at once. */
  const [reach, setReach] = useState(0);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const canPlay = auto > 0 && count > 1;

  // Later photos: wait for the page to finish loading, then a moment more.
  useEffect(() => {
    if (dataSaver()) return;
    let timer = 0;
    const arm = () => {
      timer = window.setTimeout(() => setArmed(true), 1500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
    };
  }, []);

  // Which photo is on screen: the one whose left edge is nearest the strip's.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let frame = 0;
    const read = () => {
      const slides = Array.from(strip.children) as HTMLElement[];
      const pad = parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0;
      let best = 0;
      let distance = Infinity;
      slides.forEach((slide, index) => {
        const d = Math.abs(slide.offsetLeft - pad - strip.scrollLeft);
        if (d < distance) {
          distance = d;
          best = index;
        }
      });
      // Scrolled to the very end: the last photo, even when the strip is too short to bring its left edge to the start.
      if (strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2) best = slides.length - 1;
      // Only when the photo on screen actually changes: this runs on every frame of a swipe.
      if (best === activeRef.current) return;
      activeRef.current = best;
      setActive(best);
      setReach((value) => Math.max(value, best));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      strip.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  const go = useCallback(
    (index: number) => {
      const strip = stripRef.current;
      if (!strip) return;
      const wrapped = ((index % count) + count) % count;
      const target = strip.children[wrapped] as HTMLElement | undefined;
      if (!target) return;
      setReach((value) => Math.max(value, wrapped));
      const pad = parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0;
      strip.scrollTo({ left: target.offsetLeft - pad, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    [count],
  );

  /** The visitor has taken over: load the other photos now and stop turning by itself. */
  const takeOver = useCallback(() => {
    setArmed(true);
    setPlaying(false);
  }, []);

  // Turn by itself once the other photos may load, unless motion is reduced.
  useEffect(() => {
    if (canPlay && armed && !prefersReducedMotion()) setPlaying(true);
    // Only when `armed` first turns true: a visitor who has taken over is never overruled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  // Hold while the strip is off screen or the tab is hidden.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !canPlay || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [canPlay]);

  useEffect(() => {
    if (!playing || !onScreen || !canPlay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) go(activeRef.current + 1);
    }, auto);
    return () => window.clearInterval(timer);
  }, [playing, onScreen, canPlay, auto, go]);

  const step = (by: number) => {
    takeOver();
    go(activeRef.current + by);
  };

  return {
    rootRef,
    stripRef,
    active,
    armed,
    /** Whether photo `index` may be requested yet: the first always; the rest once armed, one ahead of the furthest reached. */
    mayLoad: (index: number) => index === 0 || (armed && index <= reach + 1),
    playing,
    canPlay,
    /** Spread on the strip: a touch, a wheel or a key means the visitor has taken over. */
    stripProps: {
      ref: stripRef,
      tabIndex: 0,
      onPointerDown: takeOver,
      onWheel: takeOver,
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      },
    },
    select: (index: number) => {
      takeOver();
      go(index);
    },
    next: () => step(1),
    previous: () => step(-1),
    toggle: () => {
      setArmed(true);
      setPlaying((value) => !value);
    },
  };
}
