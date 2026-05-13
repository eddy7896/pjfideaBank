"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmpathizeForm } from "@/components/forms/stage-forms/empathize-form";
import { DefineForm } from "@/components/forms/stage-forms/define-form";
import { IdeateForm } from "@/components/forms/stage-forms/ideate-form";
import { PrototypeForm } from "@/components/forms/stage-forms/prototype-form";
import { TestForm } from "@/components/forms/stage-forms/test-form";
import type { DesignThinkingStatus, Idea } from "@/types";
import { ArrowRight } from "lucide-react";

interface StageGateModalProps {
  open: boolean;
  idea: Idea;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const getNextStage = (current: DesignThinkingStatus): DesignThinkingStatus | null => {
  const stages: DesignThinkingStatus[] = [
    "Empathize",
    "Define",
    "Ideate",
    "Prototype",
    "Test",
  ];
  const index = stages.indexOf(current);
  return index < stages.length - 1 ? stages[index + 1] : null;
};

const getFormComponent = (stage: DesignThinkingStatus, idea: Idea, onSubmit: any) => {
  const stageData = idea.stageData[stage];

  switch (stage) {
    case "Empathize":
      return (
        <EmpathizeForm
          initialData={stageData as any}
          onSubmit={onSubmit}
        />
      );
    case "Define":
      return (
        <DefineForm
          initialData={stageData as any}
          onSubmit={onSubmit}
        />
      );
    case "Ideate":
      return (
        <IdeateForm
          initialData={stageData as any}
          onSubmit={onSubmit}
        />
      );
    case "Prototype":
      return (
        <PrototypeForm
          initialData={stageData as any}
          onSubmit={onSubmit}
        />
      );
    case "Test":
      return (
        <TestForm
          initialData={stageData as any}
          onSubmit={onSubmit}
        />
      );
    default:
      return null;
  }
};

export function StageGateModal({
  open,
  idea,
  onClose,
  onSubmit,
  isLoading,
}: StageGateModalProps) {
  const nextStage = getNextStage(idea.status);
  const currentStage = idea.status;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <DialogTitle className="text-2xl font-bold">
              {currentStage} Documentation
            </DialogTitle>
            {nextStage && (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-sm font-semibold text-primary">✓</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{currentStage}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">→</span>
                </div>
                <span className="text-sm font-medium text-primary">{nextStage}</span>
              </div>
            )}
            <DialogDescription className="text-sm text-muted-foreground">
              Complete the {currentStage} stage documentation to proceed to the next step.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-8 rounded-lg border border-primary/10 bg-primary/5 p-4 mb-6">
          <p className="text-xs font-medium text-primary/80 uppercase tracking-wide">
            {currentStage} Stage
          </p>
          <p className="text-sm text-foreground/80 mt-1">
            Fill out the required information below to advance to {nextStage || "completion"}.
          </p>
        </div>

        <div>
          {getFormComponent(currentStage, idea, onSubmit)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
