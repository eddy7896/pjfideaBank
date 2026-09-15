import { Eye, Lightbulb, Wrench, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IdeaStage } from "@/lib/ideabank/types";

const STAGE_META: Record<IdeaStage, { icon: LucideIcon; className: string }> = {
  Observed: { icon: Eye, className: "bg-[#F4F2F1] text-[#3D3D3D]" },
  Ideating: { icon: Lightbulb, className: "bg-[#EDF7FA] text-[#15425B]" },
  Prototyping: { icon: Wrench, className: "bg-[#F4C66B]/30 text-[#5B4415]" },
  Tested: { icon: CheckCircle2, className: "bg-[#E7F5EE] text-[#1F6B45]" },
};

interface StageBadgeProps {
  stage: IdeaStage;
  className?: string;
}

/** Stage is always shown with both an icon and a text label, never colour alone. */
export function StageBadge({ stage, className }: StageBadgeProps) {
  const { icon: Icon, className: tint } = STAGE_META[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tint,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {stage}
    </span>
  );
}
