"use client";

import { useEffect, useState } from "react";

/**
 * Framer Motion's `MotionConfig reducedMotion="user"` only strips
 * `animate`/`initial`/`whileInView` props. Cursor-driven effects built on
 * raw motion values (mouse parallax, magnetic hover) sit outside that and
 * need this explicit check instead.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}
