"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginStudent: (teamId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await res.json().catch(() => ({}));
          
          if (res.ok) {
            if (data.success && data.user) {
              set({ currentUser: data.user, isAuthenticated: true });
              return { success: true };
            }
          }
          
          return {
            success: false,
            error: data.message || "Invalid credentials. If this is a newly registered account, make sure you enter the registered email.",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to connect to authentication server. Please check your network.",
          };
        }
      },
      loginStudent: async (teamId, pin) => {
        try {
          const res = await fetch("/api/auth/login-student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId, pin }),
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            if (data.success && data.team) {
              const user: User = {
                role: "student",
                displayName: data.team.name,
                email: "",
                schoolName: data.team.schoolName,
                teamId: data.team.id,
              };
              set({ currentUser: user, isAuthenticated: true });
              return { success: true };
            }
          }

          return {
            success: false,
            error: data.message || "Invalid Team ID or PIN.",
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to connect to authentication server. Please check your network.",
          };
        }
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

