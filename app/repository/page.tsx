"use client";

import { Suspense } from "react";
import { KanbanBoard } from "@/components/repository/kanban-board";
import { Kanban } from "lucide-react";

function RepositoryContent() {
  return <KanbanBoard />;
}

export default function RepositoryPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Kanban className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Idea Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Track ideas through the Design Thinking pipeline
          </p>
        </div>
      </div>

      {/* Board */}
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        }
      >
        <RepositoryContent />
      </Suspense>
    </div>
  );
}
