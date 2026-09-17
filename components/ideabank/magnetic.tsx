"use client";

import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

interface MagneticProps {
  children: ReactNode;
  /** Max pixel offset the content shifts toward the pointer. */
  strength?: number;
  className?: string;
}

/**
 * Wraps a button/link so it drifts a few px toward the pointer on hover,
 * settling back with a spring on leave. Not a custom cursor — the native
 * pointer stays exactly as-is, only the element underneath moves.
 * Skipped entirely for reduced-motion and touch/coarse-pointer devices,
 * where there's no hover to react to anyway.
 */
export function Magnetic({ children, strength = 14, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || e.pointerType !== "mouse") return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = e.clientX - (bounds.left + bounds.width / 2);
    const relY = e.clientY - (bounds.top + bounds.height / 2);
    x.set((relX / (bounds.width / 2)) * strength);
    y.set((relY / (bounds.height / 2)) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
