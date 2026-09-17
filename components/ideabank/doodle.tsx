"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Small hand-drawn decorative marks. Always aria-hidden and non-interactive.
 * The stroked ones draw themselves in on scroll (pathLength 0 -> 1) rather
 * than just appearing — `whileInView` is stripped to the end state
 * automatically under prefers-reduced-motion via the global MotionConfig.
 */

export function DoodleSpark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      className={cn("h-8 w-8 text-panel-yellow", className)}
    >
      <motion.path
        d="M20 3 L23 16 L36 20 L23 24 L20 37 L17 24 L4 20 L17 16 Z"
        fill="currentColor"
        initial={{ scale: 0, rotate: -35, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "50% 50%" }}
      />
    </svg>
  );
}

export function DoodleUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 14"
      fill="none"
      className={cn("h-3 w-full text-cyan", className)}
    >
      <motion.path
        d="M2 8.5C30 3 60 2 80 5.5C100 9 130 10 158 5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 50"
      fill="none"
      className={cn("h-10 w-16 text-[#4282A4]", className)}
    >
      <motion.path
        d="M4 6C28 6 46 20 44 42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M32 36L44 44L50 30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function DoodleLoop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 60"
      fill="none"
      className={cn("h-12 w-12 text-[#4282A4]", className)}
    >
      <motion.path
        d="M8 30C8 15 22 8 32 12C42 16 46 30 34 34C24 37.5 20 26 28 22C34 19 42 24 40 32C38 40 26 46 14 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
