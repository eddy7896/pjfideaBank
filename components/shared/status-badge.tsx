"use client";

import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";
import type { DesignThinkingStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: DesignThinkingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {status}
    </Badge>
  );
}
