"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  School as SchoolIcon,
  ChevronRight,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { DESIGN_THINKING_STAGES, STATUS_COLORS, SCHOOLS } from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import { useAuthStore } from "@/store/use-auth-store";
import type { DesignThinkingStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  // Convert slug back to school name
  const schoolName = SCHOOLS.find(
    (s) => s.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!schoolName) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">School Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The school "{slug}" does not exist.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Filter based on role
  let schoolIdeas = ideas.filter((i) => i.schoolName === schoolName);
  if (currentUser.role === "education-dept") {
    schoolIdeas = schoolIdeas.filter(
      (i) => i.status === "Prototype" || i.status === "Test"
    );
  }

  const advancedCount = schoolIdeas.filter(
    (i) => i.status === "Prototype" || i.status === "Test"
  ).length;

  // Stage counts for mini chart
  const stageCounts: Record<DesignThinkingStatus, number> = {
    Empathize: 0, Define: 0, Ideate: 0, Prototype: 0, Test: 0,
  };
  schoolIdeas.forEach((i) => { stageCounts[i.status]++; });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back + Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <SchoolIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{schoolName}</h1>
            <p className="text-sm text-muted-foreground">
              {schoolIdeas.length} {schoolIdeas.length === 1 ? "project" : "projects"}
              {currentUser.role === "education-dept" && " (advanced stages only)"}
            </p>
          </div>
        </div>
      </div>

      {/* Mini stats */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {DESIGN_THINKING_STAGES.map((stage) => {
          const count = stageCounts[stage];
          const colors = STATUS_COLORS[stage];
          if (
            currentUser.role === "education-dept" &&
            stage !== "Prototype" && stage !== "Test"
          ) return null;
          return (
            <div
              key={stage}
              className={cn(
                "rounded-lg border p-3 text-center",
                colors.border,
                colors.bg
              )}
            >
              <p className={cn("text-2xl font-bold", colors.text)}>{count}</p>
              <p className={cn("text-[10px] font-medium", colors.text)}>{stage}</p>
            </div>
          );
        })}
      </div>

      {/* Projects List */}
      <div className="rounded-xl border border-border/50 bg-card">
        <div className="border-b border-border/40 p-4">
          <h2 className="text-sm font-semibold">Projects</h2>
        </div>
        {schoolIdeas.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No projects found for this school.
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {schoolIdeas
              .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
              .map((idea) => (
                <Link
                  key={idea.id}
                  href={`/dashboard/projects/${idea.id}`}
                  className="group flex items-center justify-between p-4 transition-all hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-sm font-semibold truncate">
                        {idea.title}
                      </p>
                      <StatusBadge status={idea.status} className="text-[10px]" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {idea.problemStatement}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{idea.theme}</span>
                      <span>·</span>
                      <span>{idea.studentTeam}</span>
                      <span>·</span>
                      <span>Updated {idea.lastUpdated}</span>
                    </div>
                  </div>
                  <ChevronRight className="ml-3 h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-indigo-500" />
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
