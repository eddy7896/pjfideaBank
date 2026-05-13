"use client";

import { create } from "zustand";
import type { ThemeActivity } from "@/types";

interface ActivityState {
  activities: ThemeActivity[];
  isLoaded: boolean;
  loadActivities: (month?: number, year?: number) => Promise<void>;
  createActivity: (activity: Omit<ThemeActivity, "createdAt">) => Promise<ThemeActivity>;
  deleteActivity: (id: string) => Promise<void>;
  getActivitiesForMonth: (month: number, year: number) => ThemeActivity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoaded: false,

  loadActivities: async (month?: number, year?: number) => {
    try {
      const params = new URLSearchParams();
      if (month !== undefined) params.append("month", month.toString());
      if (year !== undefined) params.append("year", year.toString());

      const res = await fetch(`/api/activities?${params}`);
      if (res.ok) {
        const data = await res.json();
        set({ activities: data, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
      set({ isLoaded: true });
    }
  },

  createActivity: async (activityData) => {
    const newActivity: ThemeActivity = {
      ...activityData,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });

      if (res.ok) {
        set((state) => ({ activities: [...state.activities, newActivity] }));
        return newActivity;
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
    }

    return newActivity;
  },

  deleteActivity: async (id: string) => {
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      set((state) => ({ activities: state.activities.filter((a) => a.id !== id) }));
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  },

  getActivitiesForMonth: (month: number, year: number) => {
    return get().activities.filter((a) => a.month === month && a.year === year);
  },
}));
