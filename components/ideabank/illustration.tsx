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

const TINTS = [
  "bg-[#EDF7FA] text-[#15425B]",
  "bg-[#F4C66B]/25 text-[#15425B]",
  "bg-[#8DE3F6]/30 text-[#15425B]",
  "bg-[#F4F2F1] text-[#4282A4]",
];

function tintForKey(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % TINTS.length;
  return TINTS[hash];
}

interface IdeaIllustrationProps {
  imageKey: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Original, non-photographic illustration standing in for a project photo.
 * Decorative: the idea title next to it already carries the information,
 * so this is aria-hidden rather than duplicating alt text.
 */
export function IdeaIllustration({ imageKey, className, iconClassName }: IdeaIllustrationProps) {
  const Icon = IMAGE_ICONS[imageKey] ?? Sprout;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[20px] border-2 border-cyan",
        tintForKey(imageKey),
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        preserveAspectRatio="none"
      >
        <pattern id={`dots-${imageKey}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#dots-${imageKey})`} />
      </svg>
      <Icon className={cn("relative h-10 w-10 stroke-[1.5]", iconClassName)} />
    </div>
  );
}
