"use client";

import { motion } from "framer-motion";

const SENTENCE =
  "A problem noticed in one classroom can inspire an idea in another.";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const word = {
  hidden: { opacity: 0.25, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Word-level reveal on scroll. The full sentence is always present as real
 * text (screen readers get it in one pass) — only the visual opacity/
 * position is staggered per word, and MotionConfig's reducedMotion="user"
 * collapses that to the final state instantly when the OS asks for it.
 */
export function PurposeStatement() {
  const words = SENTENCE.split(" ");
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.2] tracking-tight text-[#111111] font-heading"
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block">
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
