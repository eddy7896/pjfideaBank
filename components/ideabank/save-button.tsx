"use client";

import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { isProblemSaved, toggleSavedProblem, subscribeSavedProblems } from "@/lib/ideabank/storage";

interface SaveButtonProps {
  slug: string;
  title: string;
  variant?: "icon" | "labelled";
  className?: string;
}

function alwaysFalse() {
  return false;
}

export function SaveButton({ slug, title, variant = "icon", className }: SaveButtonProps) {
  const saved = useSyncExternalStore(
    subscribeSavedProblems,
    () => isProblemSaved(slug),
    alwaysFalse
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedProblem(slug);
  }

  const label = saved ? `Remove ${title} from saved problems` : `Save ${title} for later`;

  if (variant === "labelled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
          saved
            ? "border-[#15425B] bg-[#15425B] text-white"
            : "border-[#DED8D3] bg-white text-[#111111] hover:border-[#15425B]",
          className
        )}
      >
        <Bookmark className="h-4 w-4" aria-hidden="true" fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save problem"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DED8D3] bg-white text-[#3D3D3D] transition-colors hover:border-[#15425B] hover:text-[#15425B]",
        saved && "border-[#15425B] bg-[#EDF7FA] text-[#15425B]",
        className
      )}
    >
      <Bookmark className="h-4.5 w-4.5" aria-hidden="true" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
