"use client";

import Link from "next/link";
import {
  Lightbulb,
  TrendingUp,
  School as SchoolIcon,
  BarChart3,
  Calendar,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  DESIGN_THINKING_STAGES,
  STATUS_COLORS,
  SCHOOLS,
} from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useThemeStore } from "@/store/use-theme-store";
import { usePermissions } from "@/lib/permissions";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { ThemeCalendar } from "@/components/calendar/theme-calendar";
import type { DesignThinkingStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const { themes } = useThemeStore();
  const { canViewIdea } = usePermissions();

  if (!currentUser) return null;

  const visibleIdeas = ideas.filter(canViewIdea);
  const totalIdeas = visibleIdeas.length;
  const schoolsCount = new Set(visibleIdeas.map((i) => i.schoolName)).size;
  const advancedCount = visibleIdeas.filter(
    (i) => i.status === "Prototype" || i.status === "Test"
  ).length;
  const themesWithIdeas = new Set(visibleIdeas.map((i) => i.theme)).size;

  // Stage distribution
  const stageCounts: Record<DesignThinkingStatus, number> = {
    Empathize: 0,
    Define: 0,
    Ideate: 0,
    Prototype: 0,
    Test: 0,
  };
  visibleIdeas.forEach((idea) => {
    stageCounts[idea.status]++;
  });
  const maxStageCount = Math.max(...Object.values(stageCounts), 1);

  // Schools with idea counts
  const schoolIdeaCounts = SCHOOLS.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    count: ideas.filter((i) => i.schoolName === name).length,
    advancedCount: ideas.filter(
      (i) => i.schoolName === name && (i.status === "Prototype" || i.status === "Test")
    ).length,
  }));

  // Recent ideas
  const recentIdeas = [...visibleIdeas]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {currentUser.role === "school" ? "My Dashboard" : currentUser.role === "student" ? "My Project" : "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentUser.role === "super-admin" && "Overview of all schools and projects"}
            {currentUser.role === "school" && `Managing ideas for ${currentUser.schoolName}`}
            {currentUser.role === "education-dept" && "Reviewing advanced-stage projects"}
            {currentUser.role === "student" && `Team: ${currentUser.displayName}`}
          </p>
        </div>
        {currentUser.role === "school" && (
          <Link href="/dashboard/submit">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Idea
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards - Hide for students */}
      {currentUser.role !== "student" && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs font-medium">
                {currentUser.role === "school" ? "My Ideas" : "Total Ideas"}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalIdeas}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SchoolIcon className="h-4 w-4" />
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
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Themes Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{themesWithIdeas}</p>
          </div>
        </div>
      )}

      {/* Yearly Thematic Calendar - Hide for students */}
      {currentUser.role !== "student" && (
        <div className="mb-8 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Yearly Thematic Calendar</h2>
            </div>
            {currentUser.role === "super-admin" && (
              <Link href="/dashboard/themes">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  Manage Calendar
                </Button>
              </Link>
            )}
          </div>
          <ThemeCalendar compact />
        </div>
      )}

      {/* Student Dashboard - Show assigned project only */}
      {currentUser.role === "student" ? (
        <div className="space-y-6">
          {visibleIdeas.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
              <Lightbulb className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h2 className="text-lg font-semibold">No Project Assigned</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your team doesn't have a project yet. Check back later!
              </p>
            </div>
          ) : (
            visibleIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/dashboard/projects/${idea.id}`}
                className="group block"
              >
                <div className="rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {idea.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        {idea.problemStatement}
                      </p>
                    </div>
                    <StatusBadge status={idea.status} className="flex-shrink-0" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Theme</p>
                      <p className="font-semibold text-foreground mt-1">{idea.theme}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">School</p>
                      <p className="font-semibold text-foreground mt-1">{idea.schoolName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Target Audience</p>
                      <p className="font-semibold text-foreground mt-1">{idea.targetAudience}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                    View & Update Project
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Stage Distribution */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stage chart */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Design Thinking Pipeline</h2>
              </div>
              <div className="space-y-3">
                {DESIGN_THINKING_STAGES.map((stage) => {
                  const count = stageCounts[stage];
                  const colors = STATUS_COLORS[stage];
                  const percentage = totalIdeas > 0 ? (count / maxStageCount) * 100 : 0;

                  // Hide non-visible stages for edu dept
                  if (
                    currentUser.role === "education-dept" &&
                    stage !== "Prototype" &&
                    stage !== "Test"
                  ) {
                    return null;
                  }

                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <div className="w-20 flex-shrink-0">
                        <span className={cn("text-xs font-medium", colors.text)}>
                          {stage}
                        </span>
                      </div>
                      <div className="flex-1 h-7 rounded-lg bg-muted/50 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-lg transition-all duration-700 flex items-center px-2",
                            colors.dot.replace("bg-", "bg-")
                          )}
                          style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                        >
                          {count > 0 && (
                            <span className="text-[10px] font-bold text-white">{count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* School cards (Admin & Edu Dept) */}
            {currentUser.role !== "school" && (
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <SchoolIcon className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Schools</h2>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {schoolIdeaCounts.map((school) => (
                    <Link
                      key={school.name}
                      href={`/dashboard/schools/${school.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-border/40 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                          <SchoolIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{school.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {school.count} {school.count === 1 ? "project" : "projects"}
                            {currentUser.role === "education-dept" && (
                              <> · {school.advancedCount} advanced</>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-indigo-500" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* School's own projects (School role) */}
            {currentUser.role === "school" && (
              <div className="rounded-xl border border-border/50 bg-card p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">My Projects Kanban</h2>
                  </div>
                  <Link href="/dashboard/submit">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <PlusCircle className="h-3.5 w-3.5" />
                      New Idea
                    </Button>
                  </Link>
                </div>
                {visibleIdeas.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No projects yet. Submit your first idea!
                  </div>
                ) : (
                  <div className="-mx-1">
                    <KanbanBoard ideas={visibleIdeas} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
          {/* Recent Activity */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Recent Activity</h2>
            {recentIdeas.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {recentIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/dashboard/projects/${idea.id}`}
                    className="block rounded-lg p-2.5 transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{idea.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {idea.schoolName}
                        </p>
                      </div>
                      <StatusBadge status={idea.status} className="text-[9px] flex-shrink-0" />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Updated {idea.lastUpdated}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Theme Distribution */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Ideas by Theme</h2>
            <div className="space-y-2">
              {themes.filter((tm) => {
                return visibleIdeas.some((i) =>
                  i.theme.toLowerCase().includes(tm.theme.toLowerCase())
                );
              }).map((tm) => {
                const count = visibleIdeas.filter((i) =>
                  i.theme.toLowerCase().includes(tm.theme.toLowerCase())
                ).length;
                return (
                  <div key={tm.month} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tm.theme}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
