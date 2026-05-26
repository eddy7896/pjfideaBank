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
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const { ideas, updateStageData, advanceStage, addComment, updateIdea, deleteIdea, approveAdvance, rejectAdvance } = useIdeaStore();
  const { canEditIdea, canApproveAdvance, hasPendingAdvance, currentUser } = usePermissions();
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    theme: "",
    problemStatement: "",
    targetAudience: "",
  });

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
          if (currentUser.role === "student") {
            toast.success("Sent to teacher for review");
          } else {
            toast.success(`Moved to ${nextStage} stage`);
          }
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

  const handleApprove = async () => {
    const ok = await approveAdvance(idea.id);
    if (ok) toast.success("Advance approved");
    else toast.error("Failed to approve");
  };

  const handleReject = async () => {
    const reason = window.prompt("Reason for rejection (optional)") ?? undefined;
    const ok = await rejectAdvance(idea.id, reason);
    if (ok) toast.success("Advance rejected");
    else toast.error("Failed to reject");
  };

  const pending = hasPendingAdvance(idea);

  const handleAddComment = async (content: string) => {
    await addComment(idea.id, content);
    toast.success("Note added");
  };

  const canManage =
    currentUser.role === "super-admin" ||
    (currentUser.role === "school" && idea.schoolName === currentUser.schoolName);
  const coreFieldsLocked = idea.status !== "Empathize";

  const openEdit = () => {
    setEditForm({
      title: idea.title,
      theme: idea.theme,
      problemStatement: idea.problemStatement,
      targetAudience: idea.targetAudience,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    const ok = await updateIdea(idea.id, {
      title: editForm.title.trim(),
      theme: editForm.theme.trim(),
      problemStatement: editForm.problemStatement.trim(),
      targetAudience: editForm.targetAudience.trim(),
    });
    if (ok) {
      toast.success("Project updated");
      setIsEditOpen(false);
    } else {
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async () => {
    const ok = await deleteIdea(idea.id);
    if (ok) {
      toast.success("Project deleted");
      router.push("/dashboard");
    } else {
      toast.error("Failed to delete project");
    }
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
          {/* Pending Review Card (school side) */}
          {pending && canApproveAdvance(idea) && nextStage && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-900 mb-2">Pending Review</h3>
              <p className="text-xs text-amber-800 mb-4">
                Student team requested advance from{" "}
                <strong>{idea.status}</strong> to{" "}
                <strong>{nextStage}</strong>.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={handleApprove}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}

          {/* Pending Review Notice (student side) */}
          {pending && currentUser.role === "student" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-900 mb-2">
                Awaiting Teacher Review
              </h3>
              <p className="text-xs text-amber-800">
                Your advance request has been sent. The teacher will approve or
                reject it.
              </p>
            </div>
          )}

          {/* Stage Action Card */}
          {canEdit && nextStage && !pending && (
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
                {currentUser.role === "student"
                  ? `Request review for ${nextStage}`
                  : `Move to ${nextStage}`}
              </Button>
              {!hasStageData && (
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded">
                  Complete documentation to advance
                </p>
              )}
            </div>
          )}

          {/* Manage Card */}
          {canManage && (
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
              <h3 className="font-semibold">Manage</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={openEdit}
                disabled={coreFieldsLocked}
                title={coreFieldsLocked ? "Core fields locked after Empathize" : undefined}
              >
                <Pencil className="h-4 w-4" />
                Edit details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete project
              </Button>
              {coreFieldsLocked && (
                <p className="text-xs text-muted-foreground">
                  Core fields are locked once the project leaves Empathize.
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

      {/* Edit Idea Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Project Details</DialogTitle>
            <DialogDescription>
              Only editable while the project is in the Empathize stage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Theme</label>
              <Input
                value={editForm.theme}
                onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Problem Statement</label>
              <Textarea
                rows={4}
                value={editForm.problemStatement}
                onChange={(e) =>
                  setEditForm({ ...editForm, problemStatement: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Target Audience</label>
              <Input
                value={editForm.targetAudience}
                onChange={(e) =>
                  setEditForm({ ...editForm, targetAudience: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  This deletes the idea and its timeline events. Cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
