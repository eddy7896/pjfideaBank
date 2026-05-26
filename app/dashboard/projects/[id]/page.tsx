"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  School,
  Users,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { StageGateModal } from "@/components/project/stage-gate-modal";
import { ProjectTimeline } from "@/components/project/project-timeline";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { DESIGN_THINKING_STAGES, STATUS_COLORS } from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import { usePermissions } from "@/lib/permissions";
import type { DesignThinkingStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { ideas, updateStageData, advanceStage, addComment } = useIdeaStore();
  const { canEditIdea, currentUser } = usePermissions();
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idea = ideas.find((i) => i.id === id);

  if (!idea || !currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">Project Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This project doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const canEdit = canEditIdea(idea);
  const currentStageIndex = DESIGN_THINKING_STAGES.indexOf(idea.status);
  const nextStage = currentStageIndex < DESIGN_THINKING_STAGES.length - 1
    ? DESIGN_THINKING_STAGES[currentStageIndex + 1]
    : null;
  const hasStageData = !!idea.stageData[idea.status];

  const handleGateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (nextStage) {
        const success = await advanceStage(idea.id, nextStage, formData);
        if (success) {
          toast.success(`Moved to ${nextStage} stage`);
          setIsGateModalOpen(false);
          await useIdeaStore.getState().loadIdeas();
        } else {
          toast.error("Failed to advance stage");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (content: string) => {
    await addComment(idea.id, content);
    toast.success("Note added");
  };

  const daysInStage = Math.floor(
    (new Date().getTime() - new Date(idea.lastUpdated).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">
                  {idea.title}
                </h1>
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <School className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span className="truncate">{idea.schoolName}</span>
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span className="truncate">{idea.studentTeam}</span>
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                    {idea.lastUpdated}
                  </span>
                </div>
              </div>
              <StatusBadge status={idea.status} className="flex-shrink-0 self-start" />
            </div>
          </div>

          {/* DT Progress */}
          <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 space-y-1">
              <h2 className="text-sm sm:text-base font-semibold">Design Thinking Progress</h2>
              <p className="text-xs text-muted-foreground">
                Stage {currentStageIndex + 1} of {DESIGN_THINKING_STAGES.length}
              </p>
            </div>
            <div className="space-y-4">
              {DESIGN_THINKING_STAGES.map((stage, index) => {
                const colors = STATUS_COLORS[stage];
                const isActive = stage === idea.status;
                const isCompleted = index < currentStageIndex;

                return (
                  <div key={stage} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all flex-shrink-0",
                        isActive &&
                          `${colors.border} ${colors.bg} ${colors.text} ring-2 ring-offset-2 ring-current/20`,
                        isCompleted && `${colors.dot} text-white border-transparent`,
                        !isActive &&
                          !isCompleted &&
                          "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium capitalize",
                        isActive && "text-primary",
                        isCompleted && "text-foreground",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}>
                        {stage}
                      </p>
                      {isActive && (
                        <p className="text-xs text-primary/80 mt-0.5">Current stage</p>
                      )}
                      {isCompleted && (
                        <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
                      )}
                    </div>
                    {isCompleted && (
                      <div className={cn("h-1 w-12 rounded-full", colors.dot)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Overview Details */}
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-4">Project Overview</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/50 bg-background p-5">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Problem Statement
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {idea.problemStatement}
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-background p-5">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Target Audience
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {idea.targetAudience}
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-background p-5">
                  <h4 className="mb-2 text-sm font-semibold">Theme</h4>
                  <Badge variant="outline">{idea.theme}</Badge>
                </div>

                <div className="rounded-lg border border-border/50 bg-background p-5">
                  <h4 className="mb-2 text-sm font-semibold">Team</h4>
                  <p className="text-sm">{idea.studentTeam}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{idea.schoolName}</p>
                </div>
              </div>
            </div>

            {/* Current Stage Data */}
            {hasStageData && (
              <div className="border-t border-border/50 pt-6">
                <h3 className="text-base font-semibold mb-4 capitalize">
                  {idea.status} Stage Documentation
                </h3>
                <div className="rounded-lg border border-border/50 bg-background p-5">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {(() => {
                      const data = idea.stageData[idea.status];
                      if (!data) return null;

                      if ("what" in data) {
                        return (
                          <div className="space-y-2">
                            <p><strong>What:</strong> {data.what}</p>
                            <p><strong>When:</strong> {data.when}</p>
                            <p><strong>Where:</strong> {data.where}</p>
                            <p><strong>Who:</strong> {data.who}</p>
                            <p><strong>How:</strong> {data.how}</p>
                            <p><strong>Root Cause:</strong> {data.rootCause}</p>
                          </div>
                        );
                      }
                      if ("problemStatement" in data) {
                        return (
                          <div className="space-y-2">
                            <p><strong>Problem:</strong> {data.problemStatement}</p>
                            <p><strong>Persona:</strong> {data.userPersona}</p>
                            <p><strong>Need:</strong> {data.needStatement}</p>
                          </div>
                        );
                      }
                      if ("brainstormIdeas" in data) {
                        return (
                          <div className="space-y-2">
                            <p><strong>Selected:</strong> {data.selectedIdea}</p>
                            <p><strong>Reason:</strong> {data.selectionReason}</p>
                          </div>
                        );
                      }
                      if ("toolsRequired" in data) {
                        return (
                          <div className="space-y-2">
                            <p><strong>Tools:</strong></p>
                            <ul className="list-disc pl-5">
                              {data.toolsRequired.map((tool, i) => (
                                <li key={i}>{tool}</li>
                              ))}
                            </ul>
                            <p><strong>Iterations:</strong> {data.iterations.length}</p>
                          </div>
                        );
                      }
                      if ("testPlan" in data) {
                        return (
                          <div className="space-y-2">
                            <p><strong>Result:</strong> {data.passed ? "✓ Passed" : "✗ Failed"}</p>
                            <p><strong>Plan:</strong> {data.testPlan}</p>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs - Kanban & Timeline */}
          <Tabs defaultValue="kanban" className="rounded-xl border border-border/50 bg-card">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 p-0">
              <TabsTrigger value="kanban" className="rounded-none">
                Kanban
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-none">
                Timeline
              </TabsTrigger>
            </TabsList>

            {/* Kanban Tab */}
            <TabsContent value="kanban" className="p-6">
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  This project&apos;s position in the design thinking pipeline
                </p>
              </div>
              <KanbanBoard ideas={[idea]} visibleStages={DESIGN_THINKING_STAGES} readOnly />
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="p-6">
              <ProjectTimeline
                idea={idea}
                onAddComment={handleAddComment}
                canComment={canEdit}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stage Action Card */}
          {canEdit && nextStage && (
            <div className="rounded-xl border border-primary/20 bg-card p-5">
              <h3 className="font-semibold mb-2">Next Step</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You&apos;re in <span className="font-semibold text-foreground">{idea.status}</span>
              </p>
              <Button
                onClick={() => setIsGateModalOpen(true)}
                className="w-full"
                size="sm"
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                Move to {nextStage}
              </Button>
              {!hasStageData && (
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded">
                  Complete documentation to advance
                </p>
              )}
            </div>
          )}

          {/* Stats Card */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-4">Timeline Stats</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Days in current stage</p>
                <p className="font-semibold text-lg">{daysInStage}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total events</p>
                <p className="font-semibold text-lg">{idea.timeline.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current stage</p>
                <p className="font-semibold capitalize">{idea.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Gate Modal */}
      <StageGateModal
        open={isGateModalOpen}
        idea={idea}
        onClose={() => setIsGateModalOpen(false)}
        onSubmit={handleGateSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
