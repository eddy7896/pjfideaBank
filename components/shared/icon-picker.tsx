"use client";

import { useState } from "react";
import {
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe, Calendar,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe, Calendar,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
};

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = Object.entries(AVAILABLE_ICONS).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search icons…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
      />
      <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto rounded-lg border border-border/40 bg-muted/20 p-2">
        {filtered.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-accent",
              value === name
                ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={name}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-8 py-3 text-center text-xs text-muted-foreground">
            No icons match "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
