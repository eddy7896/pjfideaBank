"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function CategoryChip({ label, active, onClick, onRemove, className }: CategoryChipProps) {
  if (onRemove) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-[#DED8D3] bg-[#F4F2F1] py-1.5 pl-3.5 pr-2 text-sm font-medium text-[#111111]",
          className
        )}
      >
        {label}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label} filter`}
          className="flex h-5 w-5 items-center justify-center rounded-full text-[#3D3D3D] transition-colors hover:bg-[#DED8D3] hover:text-[#111111]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-[#15425B] bg-[#15425B] text-white"
          : "border-[#DED8D3] bg-white text-[#111111] hover:border-[#4282A4] hover:bg-[#EDF7FA]",
        className
      )}
    >
      {label}
    </button>
  );
}
