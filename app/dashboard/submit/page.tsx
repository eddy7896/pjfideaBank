"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { IdeaForm } from "@/components/forms/idea-form";
import { useAuthStore } from "@/store/use-auth-store";
import { PenLine, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

function SubmitContent() {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  if (!currentUser) return null;

  // Only school role can submit
  if (currentUser.role !== "school") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Access Restricted</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Only school accounts can submit new ideas. Please use a school login.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/60 to-primary shadow-lg shadow-primary/25">
            <PenLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Submit an Idea
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              <strong className="text-foreground">{currentUser.schoolName}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8 space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">→</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Starting with Empathize Stage
              </p>
              <p className="text-sm text-foreground/80">
                Document the problem through user research, empathy mapping, and root cause analysis using the 5 Whys framework.
              </p>
            </div>
          </div>
        </div>
        <IdeaForm />
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        }
      >
        <SubmitContent />
      </Suspense>
    </div>
  );
}
