"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
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
import { MOCK_IDEAS } from "@/lib/mock-data";

type StageDataType =
  | EmpathizeData
  | DefineData
  | IdeateData
  | PrototypeData
  | TestData;

interface IdeaState {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, "id" | "status" | "lastUpdated" | "stageData" | "timeline">) => void;
  updateStatus: (id: string, newStatus: DesignThinkingStatus) => void;
  reorderIdeas: (updatedIdeas: Idea[]) => void;
  getIdeasByTheme: (theme: string) => Idea[];
  getIdeasBySchool: (schoolName: string) => Idea[];
  getAdvancedIdeas: () => Idea[];
  updateStageData: (id: string, stage: DesignThinkingStatus, data: StageDataType) => void;
  addTimelineEvent: (id: string, event: Omit<TimelineEvent, "id">) => void;
  addComment: (id: string, content: string, author: string) => void;
  advanceStage: (id: string, toStage: DesignThinkingStatus, formData: StageDataType) => boolean;
}

export const useIdeaStore = create<IdeaState>()(
  persist(
    (set, get) => ({
      ideas: MOCK_IDEAS,
      addIdea: (ideaData) => {
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
      updateStageData: (id, stage, data) => {
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
      advanceStage: (id, toStage, formData) => {
        const idea = get().ideas.find((i) => i.id === id);
        if (!idea) return false;

        const currentStage = idea.status;
        const now = new Date();

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
      },
    }),
    {
      name: "pijam-ideas",
    }
  )
);
