"use client";

import { ThemeCalendar } from "@/components/calendar/theme-calendar";
import { StatusBadge } from "@/components/shared/status-badge";
import { DESIGN_THINKING_STAGES } from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Lightbulb,
  TrendingUp,
  School,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const { ideas } = useIdeaStore();
  const { currentUser } = useAuthStore();

  const totalIdeas = ideas.length;
  const schoolsCount = new Set(ideas.map((i) => i.schoolName)).size;
  const advancedCount = ideas.filter(
    (i) => i.status === "Prototype" || i.status === "Test"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Thematic Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              Explore monthly themes and discover student project ideas
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs font-medium">Total Ideas</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totalIdeas}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <School className="h-4 w-4" />
            <span className="text-xs font-medium">Schools</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{schoolsCount}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Advanced Stage</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{advancedCount}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium">Themes Active</span>
          </div>
          <p className="mt-2 text-2xl font-bold">12</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <ThemeCalendar />

      {/* Design Thinking Legend */}
      <div className="mt-10 rounded-xl border border-border/40 bg-muted/20 p-5">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Design Thinking Stages
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {DESIGN_THINKING_STAGES.map((stage, index) => (
            <div key={stage} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="mr-1 text-muted-foreground/40">→</span>
              )}
              <StatusBadge status={stage} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
