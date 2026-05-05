"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { DEMO_CREDENTIALS } from "@/lib/constants";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
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
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: "pijam-auth",
    }
  )
);
