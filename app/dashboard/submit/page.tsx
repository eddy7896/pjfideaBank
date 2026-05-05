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
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
          <PenLine className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Submit an Idea
          </h1>
          <p className="text-sm text-muted-foreground">
            Submitting as <strong>{currentUser.schoolName}</strong>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
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
