"use client";

import { create } from "zustand";
import type {
  DesignThinkingStatus,
  Idea,
  TimelineEvent,
  EmpathizeData,
  DefineData,
  IdeateData,
  PrototypeData,
  TestData,
} from "@/types";

type StageDataType =
  | EmpathizeData
  | DefineData
  | IdeateData
  | PrototypeData
  | TestData;

interface IdeaState {
  ideas: Idea[];
  isLoaded: boolean;
  loadIdeas: () => Promise<void>;
  addIdea: (idea: Omit<Idea, "id" | "status" | "lastUpdated" | "stageData" | "timeline">) => Promise<void>;
  updateStatus: (id: string, newStatus: DesignThinkingStatus) => Promise<void>;
  reorderIdeas: (updatedIdeas: Idea[]) => void;
  getIdeasByTheme: (theme: string) => Idea[];
  getIdeasBySchool: (schoolName: string) => Idea[];
  getAdvancedIdeas: () => Idea[];
  updateStageData: (id: string, stage: DesignThinkingStatus, data: StageDataType) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  advanceStage: (id: string, toStage: DesignThinkingStatus, formData: StageDataType) => Promise<boolean>;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  isLoaded: false,

  loadIdeas: async () => {
    try {
      const res = await fetch("/api/ideas", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        set({ ideas: data, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load ideas:", error);
      set({ isLoaded: true });
    }
  },

  addIdea: async (ideaData) => {
    const now = new Date();
    const newIdea: Idea = {
      ...ideaData,
      id: crypto.randomUUID(),
      status: "Empathize",
      lastUpdated: now.toISOString().split("T")[0],
      stageData: {},
      timeline: [],
    };

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newIdea),
      });

      if (res.ok) {
        const created = (await res.json()) as Idea;
        set((state) => ({ ideas: [created, ...state.ideas] }));
      }
    } catch (error) {
      console.error("Failed to create idea:", error);
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
      const res = await fetch(`/api/ideas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
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
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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

  updateStageData: async (id, stage, data) => {
    try {
      const res = await fetch(`/api/ideas/${id}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stage, data }),
      });

      if (res.ok) {
        const updated = (await res.json()) as Idea;
        set((state) => ({
          ideas: state.ideas.map((idea) => (idea.id === id ? updated : idea)),
        }));
      }
    } catch (error) {
      console.error("Failed to update stage data:", error);
    }
  },

  addComment: async (id, content) => {
    try {
      const res = await fetch(`/api/ideas/${id}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: "comment", content }),
      });

      if (res.ok) {
        const event = (await res.json()) as TimelineEvent;
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, timeline: [event, ...idea.timeline] }
              : idea
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  },

  advanceStage: async (id, toStage, formData) => {
    try {
      const res = await fetch(`/api/ideas/${id}/advance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ toStage, formData }),
      });

      if (res.ok) {
        const updated = (await res.json()) as Idea;
        set((state) => ({
          ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
        }));
        return true;
      }
    } catch (error) {
      console.error("Failed to advance stage:", error);
    }

    return false;
  },
}));
