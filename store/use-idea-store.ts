"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DesignThinkingStatus, Idea } from "@/types";
import { MOCK_IDEAS } from "@/lib/mock-data";

interface IdeaState {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, "id" | "status" | "lastUpdated">) => void;
  updateStatus: (id: string, newStatus: DesignThinkingStatus) => void;
  reorderIdeas: (updatedIdeas: Idea[]) => void;
  getIdeasByTheme: (theme: string) => Idea[];
  getIdeasBySchool: (schoolName: string) => Idea[];
  getAdvancedIdeas: () => Idea[];
}

export const useIdeaStore = create<IdeaState>()(
  persist(
    (set, get) => ({
      ideas: MOCK_IDEAS,
      addIdea: (ideaData) => {
        const newIdea: Idea = {
          ...ideaData,
          id: crypto.randomUUID(),
          status: "Empathize",
          lastUpdated: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ ideas: [newIdea, ...state.ideas] }));
      },
      updateStatus: (id, newStatus) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? {
                  ...idea,
                  status: newStatus,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : idea
          ),
        }));
      },
      reorderIdeas: (updatedIdeas) => {
        set({ ideas: updatedIdeas });
      },
      getIdeasByTheme: (theme) => {
        return get().ideas.filter((idea) =>
          idea.theme.toLowerCase().includes(theme.toLowerCase())
        );
      },
      getIdeasBySchool: (schoolName) => {
        return get().ideas.filter((idea) => idea.schoolName === schoolName);
      },
      getAdvancedIdeas: () => {
        return get().ideas.filter(
          (idea) => idea.status === "Prototype" || idea.status === "Test"
        );
      },
    }),
    {
      name: "pijam-ideas",
    }
  )
);
