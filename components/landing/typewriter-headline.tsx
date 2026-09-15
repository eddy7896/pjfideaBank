"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TYPE_SPEED_MS = 42;
const DELETE_SPEED_MS = 24;
const HOLD_MS = 1900;

/**
 * Types out one phrase at a time, holds, deletes, moves to the next.
 * Falls back to a static first phrase (no cursor blink) under
 * prefers-reduced-motion, same as the rest of the landing page's motion.
 */
export function TypewriterHeadline({
  phrases,
  className,
}: {
  phrases: readonly string[];
  className?: string;
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState(prefersReducedMotion ? phrases[0] : "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text !== current) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED_MS);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), HOLD_MS);
      }
    } else {
      if (text !== "") {
        timeout = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED_MS);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((phraseIndex + 1) % phrases.length);
        }, 0);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, prefersReducedMotion]);

  return (
    <p className={cn("font-mono", className)}>
      {text}
      {!prefersReducedMotion && (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-[blink-caret_1s_steps(2)_infinite] bg-current align-middle"
        />
      )}
    </p>
  );
}
