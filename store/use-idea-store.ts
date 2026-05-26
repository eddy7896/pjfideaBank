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
  addTimelineEvent: (id: string, event: Omit<TimelineEvent, "id">) => void;
  addComment: (id: string, content: string, author: string) => void;
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
      timeline: [
        {
          id: crypto.randomUUID(),
          type: "created",
          timestamp: now.toISOString(),
          content: "Project created",
        },
      ],
    };

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIdea),
      });

      if (res.ok) {
        set((state) => ({ ideas: [newIdea, ...state.ideas] }));
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
        body: JSON.stringify({ [stage]: data }),
      });

      if (res.ok) {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? {
                  ...idea,
                  stageData: {
                    ...idea.stageData,
                    [stage]: data,
                  },
                }
              : idea
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update stage data:", error);
    }
  },

  addTimelineEvent: (id, event) => {
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id
          ? {
              ...idea,
              timeline: [
                {
                  ...event,
                  id: crypto.randomUUID(),
                },
                ...idea.timeline,
              ],
            }
          : idea
      ),
    }));
  },

  addComment: (id, content, author) => {
    get().addTimelineEvent(id, {
      type: "comment",
      content,
      author,
      timestamp: new Date().toISOString(),
    });
  },

  advanceStage: async (id, toStage, formData) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return false;

    const currentStage = idea.status;
    const now = new Date();

    try {
      const res = await fetch(`/api/ideas/${id}/advance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStage, formData }),
      });

      if (res.ok) {
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: toStage,
                  lastUpdated: now.toISOString().split("T")[0],
                  stageData: {
                    ...i.stageData,
                    [currentStage]: formData,
                  },
                  timeline: [
                    {
                      id: crypto.randomUUID(),
                      type: "form_submitted",
                      stage: currentStage,
                      timestamp: now.toISOString(),
                      content: `${currentStage} documentation submitted`,
                    },
                    {
                      id: crypto.randomUUID(),
                      type: "stage_change",
                      fromStage: currentStage,
                      toStage: toStage,
                      timestamp: now.toISOString(),
                      content: `Moved to ${toStage}`,
                    },
                    ...i.timeline,
                  ],
                }
              : i
          ),
        }));

        return true;
      }
    } catch (error) {
      console.error("Failed to advance stage:", error);
    }

    return false;
  },
}));
