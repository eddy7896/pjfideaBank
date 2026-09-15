"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Uses browser history so a filtered Explore search (state lives in the URL)
 * is preserved when the visitor comes back, rather than resetting to a bare
 * /explore link.
 */
export function BackToResults() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#4282A4] hover:underline"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to results
    </button>
  );
}
