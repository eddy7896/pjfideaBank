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
  const hasCompletedStageData = !!idea.stageData[currentStage];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Complete {currentStage} Stage
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {nextStage && (
              <div className="flex items-center gap-2 text-foreground">
                <span className="font-semibold">{currentStage}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{nextStage}</span>
              </div>
            )}
            <p className="text-muted-foreground text-sm mt-2">
              Fill out the {currentStage} stage documentation below to advance
              to the next stage.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {getFormComponent(currentStage, idea, onSubmit)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
