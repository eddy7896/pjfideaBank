"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function HeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.current = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY.current = (e.clientY - rect.top) / rect.height - 0.5;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -20, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
    }),
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 1, 0.5],
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-primary/5 to-background"
    >
      {/* Animated Background Circles */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(91,164,199,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(91,164,199,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(91,164,199,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Central Element - Pulsing Circle */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-primary/20 blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating Cards */}
      <motion.div
        className="absolute top-12 left-8 w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="flex h-full items-center justify-center text-2xl">💡</div>
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-12 w-24 h-24 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="flex h-full items-center justify-center text-3xl">🚀</div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-8 w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="flex h-full items-center justify-center text-xl">⚡</div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/4 w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div className="flex h-full items-center justify-center text-lg">🎯</div>
      </motion.div>

      {/* Center Glow */}
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-primary"
        animate={{
          boxShadow: [
            "0 0 20px rgba(91,164,199,0.5)",
            "0 0 40px rgba(91,164,199,0.8)",
            "0 0 20px rgba(91,164,199,0.5)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop" }}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
