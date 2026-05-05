"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  School,
  Users,
  Target,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
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
  const { ideas, updateStatus } = useIdeaStore();
  const { canEditIdea, currentUser } = usePermissions();

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

  const handleStatusChange = (newStatus: string | null) => {
    if (!newStatus || !canEdit) return;
    updateStatus(idea.id, newStatus as DesignThinkingStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {idea.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <School className="h-3.5 w-3.5" />
                {idea.schoolName}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {idea.studentTeam}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {idea.lastUpdated}
              </span>
            </div>
          </div>
          <StatusBadge status={idea.status} className="flex-shrink-0" />
        </div>
      </div>

      {/* Stage Progress */}
      <div className="mb-8 rounded-xl border border-border/50 bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Design Thinking Progress</h2>
        <div className="flex items-center gap-1">
          {DESIGN_THINKING_STAGES.map((stage, index) => {
            const colors = STATUS_COLORS[stage];
            const isActive = stage === idea.status;
            const isCompleted = index < currentStageIndex;
            return (
              <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    isActive &&
                      `${colors.border} ${colors.bg} ${colors.text} ring-4 ring-offset-2 ring-current/20`,
                    isCompleted && `${colors.dot} text-white border-transparent`,
                    !isActive && !isCompleted && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight",
                    isActive ? colors.text : "text-muted-foreground"
                  )}
                >
                  {stage}
                </span>
                {index < DESIGN_THINKING_STAGES.length - 1 && (
                  <div
                    className={cn(
                      "absolute h-0.5 w-full",
                      isCompleted ? colors.dot : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage changer (school only) */}
        {canEdit && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <div>
              <p className="text-sm font-medium text-indigo-900">Update Stage</p>
              <p className="text-xs text-indigo-700">
                Move this project through the Design Thinking pipeline
              </p>
            </div>
            <Select value={idea.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESIGN_THINKING_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("h-2 w-2 rounded-full", STATUS_COLORS[stage].dot)}
                      />
                      {stage}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-muted-foreground" />
            Problem Statement
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {idea.problemStatement}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-muted-foreground" />
            Target Audience
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {idea.targetAudience}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Theme</h2>
          <Badge variant="outline" className="text-sm">
            {idea.theme}
          </Badge>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Team</h2>
          <p className="text-sm">{idea.studentTeam}</p>
          <p className="mt-1 text-xs text-muted-foreground">{idea.schoolName}</p>
        </div>
      </div>
    </div>
  );
}
