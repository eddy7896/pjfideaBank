"use client";

import { create } from "zustand";
import { signIn, signOut, getSession } from "next-auth/react";
import type { User } from "@/types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginStudent: (teamId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

function sessionToUser(sessionUser: any): User | null {
  if (!sessionUser) return null;
  return {
    role: sessionUser.role,
    displayName: sessionUser.displayName ?? sessionUser.name ?? "",
    email: sessionUser.email ?? "",
    schoolName: sessionUser.schoolName ?? undefined,
    teamId: sessionUser.teamId ?? undefined,
    geographyId: sessionUser.geographyId ?? undefined,
    subGeographyId: sessionUser.subGeographyId ?? undefined,
    subGeographyIds: sessionUser.subGeographyIds ?? undefined,
    schoolIds: sessionUser.schoolIds ?? undefined,
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  currentUser: null,
  isAuthenticated: false,

  hydrate: async () => {
    const session = await getSession();
    const u = sessionToUser(session?.user);
    set({ currentUser: u, isAuthenticated: !!u });
  },

  login: async (email, password) => {
    const res = await signIn("user-credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      return { success: false, error: "Invalid email or password." };
    }
    const session = await getSession();
    const u = sessionToUser(session?.user);
    if (!u) return { success: false, error: "Session not established." };
    set({ currentUser: u, isAuthenticated: true });
    return { success: true };
  },

  loginStudent: async (teamId, pin) => {
    const res = await signIn("student-credentials", {
      teamId,
      pin,
      redirect: false,
    });
    if (res?.error) {
      return { success: false, error: "Invalid Team ID or PIN." };
    }
    const session = await getSession();
    const u = sessionToUser(session?.user);
    if (!u) return { success: false, error: "Session not established." };
    set({ currentUser: u, isAuthenticated: true });
    return { success: true };
  },

  logout: async () => {
    await signOut({ redirect: false });
    set({ currentUser: null, isAuthenticated: false });
    // Schools is role/geography-scoped, so its cache can't outlive the
    // session on a shared classroom device - clear it on every logout.
    // Themes is identical for every role, safe to leave cached.
    try {
      localStorage.removeItem("pijam-schools-cache");
    } catch {
      // localStorage unavailable (private mode, etc.) - nothing to clear
    }
  },
}));
