"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Folder, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { useIdeaStore } from "@/store/use-idea-store";
import { usePermissions } from "@/lib/permissions";
import { DESIGN_THINKING_STAGES, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const { currentUser, canSubmitIdeas } = usePermissions();

  if (!currentUser) return null;

  const schoolProjects =
    currentUser.role === "school"
      ? ideas.filter((idea) => idea.schoolName === currentUser.schoolName)
      : [];

  const projectsByStage = DESIGN_THINKING_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = schoolProjects.filter((idea) => idea.status === stage);
      return acc;
    },
    {} as Record<string, typeof schoolProjects>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-sm text-muted-foreground">
                {schoolProjects.length} project{schoolProjects.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {canSubmitIdeas && (
            <Link href="/dashboard/submit">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Projects by Stage */}
      {schoolProjects.length > 0 ? (
        <div className="space-y-6">
          {DESIGN_THINKING_STAGES.map((stage) => {
            const stageProjects = projectsByStage[stage];
            if (stageProjects.length === 0) return null;

            const colors = STATUS_COLORS[stage];
            return (
              <div key={stage} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      colors.dot
                    )}
                  />
                  <h2 className="text-lg font-semibold capitalize">{stage}</h2>
                  <Badge variant="secondary">{stageProjects.length}</Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stageProjects.map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/dashboard/projects/${idea.id}`}
                      className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {idea.title}
                        </h3>
                        <StatusBadge status={idea.status} className="flex-shrink-0" />
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {idea.problemStatement}
                      </p>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Team:</span> {idea.studentTeam}
                        </div>
                        <div>
                          <span className="font-medium">Theme:</span> {idea.theme}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span> {idea.lastUpdated}
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Start by submitting your first idea to the Idea Bank
          </p>
          {canSubmitIdeas && (
            <Link href="/dashboard/submit">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Idea
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
