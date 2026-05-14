"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School as SchoolIcon,
  Users,
  FileText,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuthStore } from "@/store/use-auth-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useTeamStore } from "@/store/use-team-store";
import { SCHOOLS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SchoolsPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const { teams } = useTeamStore();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== "super-admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only super-admin can view this page.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const schoolsList = SCHOOLS.map((schoolName) => {
    const schoolTeams = teams.filter((t) => t.schoolName === schoolName);
    const schoolIdeas = ideas.filter((i) => i.schoolName === schoolName);
    const stageBreakdown = {
      Empathize: schoolIdeas.filter((i) => i.status === "Empathize").length,
      Define: schoolIdeas.filter((i) => i.status === "Define").length,
      Ideate: schoolIdeas.filter((i) => i.status === "Ideate").length,
      Prototype: schoolIdeas.filter((i) => i.status === "Prototype").length,
      Test: schoolIdeas.filter((i) => i.status === "Test").length,
    };

    return {
      name: schoolName,
      teamsCount: schoolTeams.length,
      projectsCount: schoolIdeas.length,
      teams: schoolTeams,
      ideas: schoolIdeas,
      stageBreakdown,
    };
  });

  const selectedSchoolData = selectedSchool
    ? schoolsList.find((s) => s.name === selectedSchool)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-8 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Schools Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            View all schools, teams, and projects across the platform
          </p>
        </div>

        {!selectedSchoolData ? (
          /* Schools List View */
          <div className="grid gap-4">
            {schoolsList.map((school) => (
              <Card
                key={school.name}
                className="border-border/20 p-3 sm:p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedSchool(school.name)}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25 flex-shrink-0">
                      <SchoolIcon className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">{school.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                          {school.teamsCount} {school.teamsCount === 1 ? "team" : "teams"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 sm:h-4 w-3 sm:w-4" />
                          {school.projectsCount} {school.projectsCount === 1 ? "project" : "projects"}
                        </span>
                      </div>
                      {school.projectsCount > 0 && (
                        <div className="flex gap-2 mt-3">
                          {Object.entries(school.stageBreakdown).map(
                            ([stage, count]) =>
                              count > 0 && (
                                <Badge key={stage} variant="secondary" className="text-xs">
                                  {stage}: {count}
                                </Badge>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* School Detail View */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setSelectedSchool(null)}
              className="gap-2"
            >
              ← Back to Schools
            </Button>

            {/* School Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25">
                <SchoolIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold">{selectedSchoolData.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedSchoolData.teamsCount} {selectedSchoolData.teamsCount === 1 ? "team" : "teams"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {selectedSchoolData.projectsCount} {selectedSchoolData.projectsCount === 1 ? "project" : "projects"}
                  </span>
                </div>
              </div>
            </div>

            {/* Teams Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Teams ({selectedSchoolData.teamsCount})</h2>
              {selectedSchoolData.teams.length > 0 ? (
                <div className="grid gap-3">
                  {selectedSchoolData.teams.map((team) => (
                    <Card key={team.id} className="border-border/20 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{team.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {team.id} • {team.members?.length || 0} members
                          </p>
                        </div>
                        <Badge variant="outline">{team.id}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No teams created yet</p>
                </Card>
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Projects ({selectedSchoolData.projectsCount})</h2>
              {selectedSchoolData.ideas.length > 0 ? (
                <div className="grid gap-3">
                  {selectedSchoolData.ideas.map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/dashboard/projects/${idea.id}`}
                    >
                      <Card className="border-border/20 p-4 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground truncate">{idea.title}</h3>
                              <StatusBadge status={idea.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {idea.problemStatement}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>Team: {idea.studentTeam}</span>
                              <span>•</span>
                              <span>Theme: {idea.theme}</span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="border-border/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No projects created yet</p>
                </Card>
              )}
            </div>

            {/* Stage Breakdown */}
            {selectedSchoolData.projectsCount > 0 && (
              <Card className="border-border/20 p-6">
                <h3 className="font-semibold mb-4">Project Stage Breakdown</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(selectedSchoolData.stageBreakdown).map(([stage, count]) => (
                    <div key={stage} className="text-center">
                      <div className="text-2xl font-bold text-primary">{count}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stage}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
