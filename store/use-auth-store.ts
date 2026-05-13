"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { useTeamStore } from "./use-team-store";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  loginStudent: (teamId: string, pin: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: (email, password) => {
        const cred = DEMO_CREDENTIALS.find(
          (c) => c.email === email && c.password === password
        );
        if (cred) {
          set({ currentUser: cred.user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: "Invalid email or password. Try one of the demo credentials below." };
      },
      loginStudent: (teamId, pin) => {
        const team = useTeamStore.getState().loginStudent(teamId, pin);
        if (team) {
          const user: User = {
            role: "student",
            displayName: team.name,
            email: "",
            schoolName: team.schoolName,
            teamId: team.id,
          };
          set({ currentUser: user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: "Invalid Team ID or PIN." };
      },
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: "pijam-auth",
    }
  )
);
