"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Folder, ArrowRight, Plus, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { useIdeaStore } from "@/store/use-idea-store";
import { usePermissions } from "@/lib/permissions";

export default function ProjectsPage() {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const { currentUser, canSubmitIdeas, canViewIdea } = usePermissions();

  if (!currentUser) return null;

  const schoolProjects = ideas.filter((idea) => canViewIdea(idea));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {schoolProjects.length} project{schoolProjects.length !== 1 ? "s" : ""}
            </p>
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

        {/* Projects List */}
        {schoolProjects.length > 0 ? (
          <div className="space-y-4">
            {schoolProjects.map((idea) => (
              <Link
                key={idea.id}
                href={`/dashboard/projects/${idea.id}`}
                className="group block rounded-xl border border-border/20 bg-white p-6 hover:border-border/40 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {idea.problemStatement}
                    </p>
                  </div>
                  <StatusBadge status={idea.status} className="flex-shrink-0" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="font-medium text-foreground">{idea.studentTeam}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Theme</p>
                    <p className="font-medium text-foreground">{idea.theme}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">School</p>
                    <p className="font-medium text-foreground text-sm truncate">{idea.schoolName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="font-medium text-foreground">{idea.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/20 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">No projects yet</h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
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
    </div>
  );
}
