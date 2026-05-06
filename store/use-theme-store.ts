import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMonth } from "@/types";
import { THEME_MONTHS as DEFAULT_THEMES } from "@/lib/constants";

interface ThemeStore {
  themes: ThemeMonth[];
  addTheme: (theme: ThemeMonth) => void;
  removeTheme: (month: string) => void;
  updateTheme: (month: string, updatedTheme: ThemeMonth) => void;
  resetToDefaults: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themes: [...DEFAULT_THEMES],
      addTheme: (theme) => set((state) => ({ themes: [...state.themes, theme] })),
      removeTheme: (month) =>
        set((state) => ({
          themes: state.themes.filter((t) => t.month !== month),
        })),
      updateTheme: (month, updatedTheme) =>
        set((state) => ({
          themes: state.themes.map((t) =>
            t.month === month ? updatedTheme : t
          ),
        })),
      resetToDefaults: () => set({ themes: [...DEFAULT_THEMES] }),
    }),
    {
      name: "pijam-themes",
    }
  )
);
