"use client";

import Link from "next/link";
import {
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe, Calendar,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
} from "lucide-react";
import { useThemeStore } from "@/store/use-theme-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe, Calendar,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
};

interface ThemeCalendarProps {
  compact?: boolean;
}

export function ThemeCalendar({ compact = false }: ThemeCalendarProps) {
  const { themes } = useThemeStore();
  const { ideas } = useIdeaStore();

  return (
    <div
      className={cn(
        "grid gap-3",
        compact
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {themes.map((tm) => {
        const Icon = iconMap[tm.icon] || Globe;
        const count = ideas.filter((idea) =>
          idea.theme.toLowerCase().includes(tm.theme.toLowerCase())
        ).length;

        if (compact) {
          return (
            <div
              key={tm.month}
              className="group relative overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={cn(
                  "relative flex h-16 items-center gap-3 bg-gradient-to-br px-3",
                  tm.gradient
                )}
              >
                <Icon className="h-5 w-5 text-white/90 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider leading-none">
                    {tm.shortMonth}
                  </p>
                  <p className="text-sm font-semibold text-white truncate leading-tight mt-0.5">
                    {tm.theme}
                  </p>
                </div>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-bold text-white backdrop-blur-sm flex-shrink-0">
                    {count}
                  </span>
                )}
                {/* Decorative */}
                <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/10" />
              </div>
            </div>
          );
        }

        return (
          <Link
            key={tm.month}
            href={`/dashboard/themes`}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
          >
            {/* Gradient header */}
            <div
              className={cn(
                "relative flex h-28 flex-col justify-between bg-gradient-to-br p-4",
                tm.gradient
              )}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {tm.shortMonth}
                </span>
                {count > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs font-bold text-white backdrop-blur-sm">
                    {count}
                  </span>
                )}
              </div>
              <Icon className="h-8 w-8 text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-white" />

              {/* Decorative circles */}
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-foreground">
                {tm.theme}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {tm.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "idea" : "ideas"}
                </span>
                <span className="text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                  View →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
