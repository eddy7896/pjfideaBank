"use client";

import { useState } from "react";
import { Calendar, GripVertical, School, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { DesignThinkingStatus, Idea } from "@/types";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea;
  canEdit: boolean;
  isDragging?: boolean;
}

export function IdeaCard({ idea, canEdit, isDragging }: IdeaCardProps) {
  const [open, setOpen] = useState(false);
  const { updateStatus } = useIdeaStore();
  const colors = STATUS_COLORS[idea.status];

  const themeLabel = idea.theme.split(": ")[1] || idea.theme;

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={cn(
          "group cursor-pointer border-border/50 transition-all duration-200 hover:shadow-md",
          isDragging && "rotate-2 shadow-xl ring-2 ring-indigo-400",
          !isDragging && "hover:-translate-y-0.5"
        )}
      >
        <CardHeader className="p-3.5 pb-2">
          <div className="flex items-start gap-2">
            {canEdit && (
              <GripVertical className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">
                {idea.title}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
                <School className="h-3 w-3" />
                {idea.schoolName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3.5 pb-3.5">
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {idea.problemStatement}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-border/60 text-[10px] font-medium"
            >
              {themeLabel}
            </Badge>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-2.5 w-2.5" />
              {idea.lastUpdated}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{idea.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 pt-1">
              <School className="h-3.5 w-3.5" />
              {idea.schoolName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Current Stage
              </span>
              {canEdit ? (
                <Select
                  value={idea.status}
                  onValueChange={(value) => {
                    if (value) updateStatus(idea.id, value as DesignThinkingStatus);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DESIGN_THINKING_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              STATUS_COLORS[stage].dot
                            )}
                          />
                          {stage}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <StatusBadge status={idea.status} />
              )}
            </div>

            {/* Theme */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Theme
              </span>
              <p className="mt-1 text-sm">{idea.theme}</p>
            </div>

            {/* Team */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Team
              </span>
              <p className="mt-1 flex items-center gap-1.5 text-sm">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {idea.studentTeam}
              </p>
            </div>

            {/* Problem Statement */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Problem Statement
              </span>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                {idea.problemStatement}
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Target Audience
              </span>
              <p className="mt-1 text-sm">{idea.targetAudience}</p>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Last updated: {idea.lastUpdated}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
