"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}

/**
 * Fades content up into place once, on first viewport entry. Framer Motion's
 * `MotionConfig reducedMotion="user"` (set in app/layout.tsx) strips the
 * translate/opacity animation automatically for prefers-reduced-motion.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  className?: string;
  /** Max px of vertical drift in each direction as the element transits the viewport. */
  strength?: number;
}

/**
 * Drifts content vertically as it moves through the viewport (classic
 * scroll parallax) rather than just fading in once. Unlike ScrollReveal
 * this is driven by raw scroll progress, not a whileInView animate prop,
 * so it needs its own prefers-reduced-motion check.
 */
export function ScrollParallax({ children, className, strength = 40 }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [strength, -strength]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
