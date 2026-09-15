"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";

/**
 * Counts up to a value once it scrolls into view. Adapted from Skiper UI's
 * Skiper37 animated-number pattern (https://skiper-ui.com/v1/skiper37,
 * free tier, attribution below), trimmed to one reusable variant and
 * restyled to this project's own tokens.
 */
export function StatCounter({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  return (
    <div className="text-center">
      <motion.div
        onViewportEnter={() => setDisplay(value)}
        onViewportLeave={() => setDisplay(0)}
        viewport={{ once: false, margin: "-10%" }}
        className="font-display text-5xl font-bold tracking-tight text-foreground tabular-nums md:text-6xl"
      >
        <NumberFlow value={display} suffix={suffix} />
      </motion.div>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/**
 * Skiper 37 AnimatedNumber — React + Number Flow + Framer Motion
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Original: https://skiper-ui.com/v1/skiper37 — Author: @gurvinder-singh02
 */
