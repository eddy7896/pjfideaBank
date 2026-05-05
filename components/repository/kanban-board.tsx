"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanColumn } from "./kanban-column";
import { DESIGN_THINKING_STAGES, THEME_MONTHS } from "@/lib/constants";
import { useIdeaStore } from "@/store/use-idea-store";
import { usePermissions } from "@/lib/permissions";
import type { DesignThinkingStatus, Idea } from "@/types";
import { cn } from "@/lib/utils";

export function KanbanBoard() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams.get("theme") || "";
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState(initialTheme);
  const { ideas, updateStatus } = useIdeaStore();
  const { currentUser, canViewIdea, canEditIdea, isReadOnly } =
    usePermissions();

  // Filter ideas based on permissions and filters
  const filteredIdeas = useMemo(() => {
    let result = ideas.filter(canViewIdea);

    if (themeFilter) {
      result = result.filter((idea) =>
        idea.theme.toLowerCase().includes(themeFilter.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.schoolName.toLowerCase().includes(q) ||
          idea.problemStatement.toLowerCase().includes(q) ||
          idea.studentTeam.toLowerCase().includes(q)
      );
    }

    return result;
  }, [ideas, currentUser, themeFilter, search, canViewIdea]);

  // Group by status
  const columns: Record<DesignThinkingStatus, Idea[]> = useMemo(() => {
    const grouped = {
      Empathize: [] as Idea[],
      Define: [] as Idea[],
      Ideate: [] as Idea[],
      Prototype: [] as Idea[],
      Test: [] as Idea[],
    };
    filteredIdeas.forEach((idea) => {
      if (grouped[idea.status]) {
        grouped[idea.status].push(idea);
      }
    });
    return grouped;
  }, [filteredIdeas]);

  // Determine which columns to show
  const visibleStages =
    currentUser.role === "education-dept"
      ? (["Prototype", "Test"] as DesignThinkingStatus[])
      : DESIGN_THINKING_STAGES;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as DesignThinkingStatus;

    // Find the idea and check permission
    const idea = ideas.find((i) => i.id === draggableId);
    if (!idea || !canEditIdea(idea)) return;

    updateStatus(draggableId, newStatus);
  };

  const clearFilters = () => {
    setSearch("");
    setThemeFilter("");
  };

  const hasActiveFilters = search.trim() !== "" || themeFilter !== "";

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas by title, school, team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={themeFilter || "all"} onValueChange={(v) => setThemeFilter(v === "all" ? "" : (v ?? ""))}>
            <SelectTrigger className="w-[200px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="All Themes" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Themes</SelectItem>
              {THEME_MONTHS.map((tm) => (
                <SelectItem key={tm.theme} value={tm.theme}>
                  {tm.shortMonth}: {tm.theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Showing:</span>
          {themeFilter && (
            <Badge variant="outline" className="gap-1 text-xs">
              {themeFilter}
              <button
                onClick={() => setThemeFilter("")}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"}
          </span>
        </div>
      )}

      {/* Read-only banner for Education Dept */}
      {isReadOnly && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <p className="text-sm text-amber-800">
            <strong>Read-only view</strong> — You are viewing ideas in the
            advanced stages (Prototype & Test) only.
          </p>
        </div>
      )}

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={cn("flex gap-4 overflow-x-auto pb-4 lg:grid lg:overflow-visible", currentUser.role === "education-dept" ? "lg:grid-cols-2" : "lg:grid-cols-5")}>
          {visibleStages.map((stage) => (
            <KanbanColumn
              key={stage}
              status={stage}
              ideas={columns[stage] || []}
              canEditIdea={canEditIdea}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
