"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Droplets,
  Snowflake,
  Route,
  Wind,
  Apple,
  Bird,
  Accessibility,
  UtensilsCrossed,
  Sprout,
  Volume2,
  CloudRain,
  Leaf,
  BookOpen,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGE_ICONS: Record<string, LucideIcon> = {
  "water-tap": Droplets,
  "frost-pipe": Snowflake,
  "road-bend": Route,
  "classroom-air": Wind,
  "apple-sorter": Apple,
  "bird-station": Bird,
  "ramp-gauge": Accessibility,
  "tiffin-rack": UtensilsCrossed,
  "drip-line": Sprout,
  "noise-light": Volume2,
  "rain-diverter": CloudRain,
  "compost-baffle": Leaf,
};

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Water & Sanitation": Droplets,
  "Agriculture & Food": Sprout,
  "Environment & Climate": Leaf,
  "Accessibility & Inclusion": Accessibility,
  "School & Learning": BookOpen,
  "Community & Safety": ShieldCheck,
};

/**
 * Free-to-use (Unsplash License) stock photography standing in for real
 * project photography, picked per idea theme rather than the reference
 * site's own photos. Each entry is the photo's Unsplash CDN id, resolved
 * to images.unsplash.com/photo-<id> and sized via query params.
 */
const IMAGE_PHOTO_ID: Record<string, string> = {
  "water-tap": "1681073080863-0b9ab1eac8e7",
  "frost-pipe": "1640904497438-051c4ec13125",
  "road-bend": "1635963635957-4fb3c4035e9e",
  "classroom-air": "1757192420329-39acf20a12b8",
  "apple-sorter": "1599678914948-8e0a39f42a31",
  "bird-station": "1767288832047-7d23f6c8c26c",
  "ramp-gauge": "1508313144761-0ea80db40091",
  "tiffin-rack": "1780504863041-931cbb1d9694",
  "drip-line": "1485627658391-1365e4e0dbfe",
  "noise-light": "1728111770420-c7647ec54c89",
  "rain-diverter": "1685430996137-b92678138c0b",
  "compost-baffle": "1536703219213-0223580c76b2",
};

const IMAGE_ALT: Record<string, string> = {
  "water-tap": "Close-up of water dripping from a tap",
  "frost-pipe": "Icicles hanging from a frozen outdoor pipe",
  "road-bend": "A sharp curved road bend beside a hillside",
  "classroom-air": "Sunlight through an empty classroom's windows",
  "apple-sorter": "Crates of freshly harvested apples",
  "bird-station": "A small bird perched on a thin branch",
  "ramp-gauge": "A concrete building entrance with a wheelchair ramp",
  "tiffin-rack": "Stacked tiffin boxes hanging from a delivery cycle",
  "drip-line": "A hand watering a garden bed with a hose",
  "noise-light": "A long empty school corridor",
  "rain-diverter": "A rain gutter with water running down it",
  "compost-baffle": "Decomposing organic matter in a compost pile",
};

function photoUrl(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
}

function tintForKey(key: string) {
  const TINTS = ["#EDF7FA", "#F4C66B40", "#8DE3F650", "#F4F2F1"];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % TINTS.length;
  return TINTS[hash];
}

interface IdeaIllustrationProps {
  imageKey: string;
  className?: string;
  iconClassName?: string;
  /** Sizes hint passed straight to next/image; defaults to a card-sized guess. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Licensed stock photography (Unsplash) standing in for a real project
 * photo, matched per idea theme. Falls back to a tinted icon panel if the
 * photo fails to load, so the card never goes blank.
 */
export function IdeaIllustration({
  imageKey,
  className,
  iconClassName,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw",
  priority = false,
}: IdeaIllustrationProps) {
  const [errored, setErrored] = useState(false);
  const Icon = IMAGE_ICONS[imageKey] ?? Sprout;
  const photoId = IMAGE_PHOTO_ID[imageKey];
  const alt = IMAGE_ALT[imageKey] ?? "Illustration representing this idea";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[20px] border-2 border-cyan",
        className
      )}
      style={{ backgroundColor: tintForKey(imageKey) }}
    >
      {photoId && !errored ? (
        <Image
          src={photoUrl(photoId, 800)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <Icon aria-hidden="true" className={cn("relative h-10 w-10 stroke-[1.5] text-[#15425B]", iconClassName)} />
      )}
    </div>
  );
}
