"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { DESIGN_THINKING_STAGES, STATUS_COLORS } from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import type { Idea, DesignThinkingStatus } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KanbanBoardProps {
  ideas: Idea[];
  readOnly?: boolean;
  visibleStages?: DesignThinkingStatus[];
}

export function KanbanBoard({ ideas, readOnly = false, visibleStages }: KanbanBoardProps) {
  const { updateStatus } = useIdeaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stages = visibleStages || DESIGN_THINKING_STAGES;

  const onDragEnd = (result: DropResult) => {
    if (readOnly) return;
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as DesignThinkingStatus;
    updateStatus(draggableId, newStatus);
    toast.success(`Moved to ${newStatus}`);
  };

  if (!mounted) {
    return <div className="h-48 animate-pulse rounded-xl bg-muted/50" />;
  }

  // Get only the ideas that exist in this prop to ensure we only show the school's own ideas
  const getIdeasByStatus = (status: DesignThinkingStatus) => {
    return ideas.filter((i) => i.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex w-full gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const columnIdeas = getIdeasByStatus(stage);
          const colors = STATUS_COLORS[stage];

          return (
            <div key={stage} className="flex min-w-[280px] w-[300px] flex-col rounded-xl bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground/80">{stage}</h3>
                <span className="flex h-5 items-center justify-center rounded-full bg-background px-2 text-xs font-medium text-muted-foreground shadow-sm border">
                  {columnIdeas.length}
                </span>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 rounded-lg transition-colors min-h-[150px] flex flex-col gap-2",
                      snapshot.isDraggingOver && "bg-muted/80"
                    )}
                  >
                    {columnIdeas.map((idea, index) => (
                      <Draggable key={idea.id} draggableId={idea.id} index={index} isDragDisabled={readOnly}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "group flex flex-col rounded-lg border border-border/50 bg-card p-3 shadow-sm transition-all hover:border-indigo-200",
                              snapshot.isDragging && "scale-[1.02] shadow-lg rotate-1"
                            )}
                          >
                            <Link href={`/dashboard/projects/${idea.id}`} className="block">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-sm font-semibold line-clamp-2 leading-tight">
                                  {idea.title}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                {idea.problemStatement}
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <span className={cn("px-1.5 py-0.5 rounded-sm font-medium", colors.bg, colors.text)}>
                                  {idea.theme}
                                </span>
                                <span>{idea.studentTeam}</span>
                              </div>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
