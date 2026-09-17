"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IdeaIllustration } from "./illustration";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const COLLAGE_ITEMS = [
  { image: "water-tap", className: "col-span-2 row-span-2", rotate: -5, depth: 10 },
  { image: "road-bend", className: "col-span-2 row-span-1", rotate: 4, depth: 22 },
  { image: "apple-sorter", className: "col-span-1 row-span-1", rotate: -7, depth: 16 },
  { image: "bird-station", className: "col-span-1 row-span-1", rotate: 6, depth: 28 },
];

function ParallaxCard({
  item,
  index,
  mouseX,
  mouseY,
}: {
  item: (typeof COLLAGE_ITEMS)[number];
  index: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useSpring(useTransform(mouseX, (v) => v * item.depth), { stiffness: 120, damping: 20 });
  const y = useSpring(useTransform(mouseY, (v) => v * item.depth), { stiffness: 120, damping: 20 });

  return (
    <motion.div
      className={`${item.className} hidden sm:block`}
      style={{ x, y, rotate: item.rotate }}
    >
      <div
        className="h-full motion-reduce:animate-none lg:animate-[ideabank-float_7s_ease-in-out_infinite]"
        style={{ animationDelay: `${index * 0.6}s` }}
      >
        <IdeaIllustration
          imageKey={item.image}
          className="h-full min-h-[120px] w-full"
          iconClassName="h-8 w-8 sm:h-10 sm:w-10"
          priority={index === 0}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 40vw"
        />
      </div>
    </motion.div>
  );
}

/**
 * Original illustration collage standing in for project photography. Fixed
 * grid + overflow-hidden keeps rotation from ever pushing past the page,
 * the floating animation is gated to large screens + motion-safe only, and
 * a subtle pointer-parallax (each card drifts a different amount toward
 * the cursor) only engages for mouse input, never touch, and is skipped
 * outright under prefers-reduced-motion.
 */
export function HeroCollage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || e.pointerType !== "mouse") return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set(((e.clientX - bounds.left) / bounds.width - 0.5) * 2);
    mouseY.set(((e.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto grid max-w-3xl grid-cols-4 grid-rows-2 gap-4 overflow-hidden px-2 py-6"
    >
      {COLLAGE_ITEMS.map((item, i) => (
        <ParallaxCard key={i} item={item} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
      {/* Compact mobile fallback: 3 illustrations, no rotation/animation/parallax */}
      <div className="col-span-4 grid grid-cols-3 gap-3 sm:hidden">
        {COLLAGE_ITEMS.slice(0, 3).map((item, i) => (
          <IdeaIllustration key={i} imageKey={item.image} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
