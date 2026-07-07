"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  const orbitCards = [
    { icon: "💡", label: "Identify", delay: 0, angle: 0 },
    { icon: "🤝", label: "Collaborate", delay: 0.15, angle: 72 },
    { icon: "🔧", label: "Prototype", delay: 0.3, angle: 144 },
    { icon: "✨", label: "Innovate", delay: 0.45, angle: 216 },
    { icon: "🎯", label: "Impact", delay: 0.6, angle: 288 },
  ];

  const radius = 140;

  return (
    <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-border/20 bg-white">
      {/* Subtle background grid */}
      <svg className="absolute inset-0 opacity-[0.03]" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Central Repository Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Central glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 to-primary/20 blur-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ width: 140, height: 140, top: -70, left: -70 }}
          />

          {/* Folder icon container */}
          <div className="relative w-32 h-32 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-primary/20"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 140, height: 140, top: -4, left: -4 }}
          />
        </motion.div>
      </div>

      {/* Orbiting Idea Cards */}
      {orbitCards.map((card, i) => {
        const radians = (card.angle * Math.PI) / 180;
        const x = Number((Math.cos(radians) * radius).toFixed(2));
        const y = Number((Math.sin(radians) * radius).toFixed(2));

        return (
          <motion.div
            key={i}
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: "50%",
              left: "50%",
              width: 250,
              height: 250,
              marginTop: -125,
              marginLeft: -125,
            }}
          >
            <motion.div
              className="absolute w-20 h-20 rounded-2xl border border-primary/30 bg-white flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                delay: card.delay,
                repeat: Infinity,
              }}
              whileHover={{ scale: 1.1 }}
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {card.icon}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Connecting lines from center */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <motion.g
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {orbitCards.map((card, i) => {
            const radians = (card.angle * Math.PI) / 180;
            const endX = Number((50 + (Math.cos(radians) * radius) / 5).toFixed(2));
            const endY = Number((50 + (Math.sin(radians) * radius) / 5).toFixed(2));

            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${endX}%`}
                y2={`${endY}%`}
                stroke="url(#gradient)"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(91, 164, 199)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(91, 164, 199)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </motion.g>
      </svg>
    </div>
  );
}
