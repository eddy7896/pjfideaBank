interface NotebookGridProps {
  className?: string;
}

/**
 * A faint dot-grid + margin rule, standing in for notebook paper texture
 * behind the hero — literal to the "working notebook" brand mark rather
 * than a generic gradient-blob backdrop. Purely decorative: aria-hidden,
 * pointer-events-none, and masked to fade out at the edges so the tile
 * repeat never reads as a hard-edged pattern.
 */
export function NotebookGrid({ className }: NotebookGridProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%)",
      }}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="notebook-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#4282A4" fillOpacity="0.16" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#notebook-dots)" />
        {/* margin rule, offset like a ruled page */}
        <line x1="9%" y1="0" x2="9%" y2="100%" stroke="#8DE3F6" strokeOpacity="0.25" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
