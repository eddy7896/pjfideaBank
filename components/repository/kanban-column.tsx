"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { IdeaCard } from "./idea-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { STATUS_COLORS } from "@/lib/constants";
import type { DesignThinkingStatus, Idea } from "@/types";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: DesignThinkingStatus;
  ideas: Idea[];
  canEditIdea: (idea: Idea) => boolean;
}

export function KanbanColumn({ status, ideas, canEditIdea }: KanbanColumnProps) {
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex min-w-[280px] flex-col rounded-xl border border-border/40 bg-muted/30 lg:min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-border/40 p-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", colors.dot)} />
          <h3 className="text-sm font-semibold">{status}</h3>
        </div>
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
            colors.bg,
            colors.text
          )}
        >
          {ideas.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-1 flex-col gap-2.5 p-2.5 transition-colors",
              snapshot.isDraggingOver && "bg-indigo-50/50",
              ideas.length === 0 && "min-h-[100px]"
            )}
          >
            {ideas.map((idea, index) => {
              const canEdit = canEditIdea(idea);
              return (
                <Draggable
                  key={idea.id}
                  draggableId={idea.id}
                  index={index}
                  isDragDisabled={!canEdit}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <IdeaCard
                        idea={idea}
                        canEdit={canEdit}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            {ideas.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-center text-xs text-muted-foreground/60">
                  No ideas here yet
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
