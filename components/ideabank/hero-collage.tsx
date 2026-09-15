import { IdeaIllustration } from "./illustration";

const COLLAGE_ITEMS = [
  { image: "water-tap", className: "col-span-2 row-span-2", rotate: -5 },
  { image: "road-bend", className: "col-span-2 row-span-1", rotate: 4 },
  { image: "apple-sorter", className: "col-span-1 row-span-1", rotate: -7 },
  { image: "bird-station", className: "col-span-1 row-span-1", rotate: 6 },
];

/**
 * Original illustration collage standing in for project photography. Fixed
 * grid + overflow-hidden keeps rotation from ever pushing past the page,
 * and the floating animation is gated to large screens + motion-safe only.
 */
export function HeroCollage() {
  return (
    <div className="relative mx-auto grid max-w-3xl grid-cols-4 grid-rows-2 gap-4 overflow-hidden px-2 py-6">
      {COLLAGE_ITEMS.map((item, i) => (
        <div key={i} className={`${item.className} hidden sm:block`} style={{ transform: `rotate(${item.rotate}deg)` }}>
          <div
            className="h-full motion-reduce:animate-none lg:animate-[ideabank-float_7s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <IdeaIllustration
              imageKey={item.image}
              className="h-full min-h-[120px] w-full"
              iconClassName="h-8 w-8 sm:h-10 sm:w-10"
            />
          </div>
        </div>
      ))}
      {/* Compact mobile fallback: 3 illustrations, no rotation/animation */}
      <div className="col-span-4 grid grid-cols-3 gap-3 sm:hidden">
        {COLLAGE_ITEMS.slice(0, 3).map((item, i) => (
          <IdeaIllustration key={i} imageKey={item.image} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
