"use client";

import { create } from "zustand";
import type { ThemeMonth } from "@/types";

interface ThemeStore {
  themes: ThemeMonth[];
  isLoaded: boolean;
  loadThemes: () => Promise<void>;
  addTheme: (theme: ThemeMonth) => Promise<void>;
  updateTheme: (month: string, updated: ThemeMonth) => Promise<void>;
  removeTheme: (month: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themes: [],
  isLoaded: false,

  loadThemes: async () => {
    try {
      const res = await fetch("/api/themes", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as Array<ThemeMonth & { id?: string; sortOrder?: number }>;
        set({ themes: data.map(({ id: _id, sortOrder: _o, ...t }) => t as ThemeMonth), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error("Failed to load themes:", e);
      set({ isLoaded: true });
    }
  },

  addTheme: async (theme) => {
    const res = await fetch("/api/themes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(theme),
    });
    if (res.ok) await get().loadThemes();
  },

  updateTheme: async (month, updated) => {
    const res = await fetch(`/api/themes/${encodeURIComponent(month)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shortMonth: updated.shortMonth,
        theme: updated.theme,
        description: updated.description,
        icon: updated.icon,
        gradient: updated.gradient,
      }),
    });
    if (res.ok) await get().loadThemes();
  },

  removeTheme: async (month) => {
    const res = await fetch(`/api/themes/${encodeURIComponent(month)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await get().loadThemes();
  },

  resetToDefaults: async () => {
    // Server-side reset is intentionally not exposed; reseed via
    // `npm run db:seed-themes` if you need to roll back.
    await get().loadThemes();
  },
}));
