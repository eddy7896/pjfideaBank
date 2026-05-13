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
  const { currentUser, canSubmitIdeas } = usePermissions();

  if (!currentUser) return null;

  const schoolProjects =
    currentUser.role === "school"
      ? ideas.filter((idea) => idea.schoolName === currentUser.schoolName)
      : currentUser.role === "student"
      ? ideas.filter((idea) => idea.teamId === currentUser.teamId)
      : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
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

        {/* Projects List */}
        {schoolProjects.length > 0 ? (
          <div className="space-y-4">
            {schoolProjects.map((idea) => (
              <Link
                key={idea.id}
                href={`/dashboard/projects/${idea.id}`}
                className="group block rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all"
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
    </div>
  );
}
