"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A headline whose characters start scattered and rotated in 3D space and
 * converge into place as the section scrolls into view - literally the
 * page's thesis (scattered observations becoming one clear idea) acted out
 * in the type itself, not just decorative motion.
 *
 * Adapted from Skiper UI's Skiper31 scroll character effect
 * (https://skiper-ui.com/v1/skiper31, free tier, attribution below),
 * generalized to take any text and restyled to this project's own tokens.
 */
function Character({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 26, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 40, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 14, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.15, 1]);

  return (
    <motion.span
      className={cn("inline-block", char === " " && "w-[0.3em]")}
      style={{ x, y, rotateX, opacity }}
    >
      {char}
    </motion.span>
  );
}

export function ScrollRevealHeadline({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "start 0.3"],
  });

  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <div ref={targetRef} style={{ perspective: "600px" }} className={className}>
      {characters.map((char, index) => (
        <Character
          key={index}
          char={char}
          index={index}
          centerIndex={centerIndex}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

/**
 * Skiper 31 ScrollAnimation — React + Framer Motion
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Original: https://skiper-ui.com/v1/skiper31 — Author: @gurvinder-singh02
 */
