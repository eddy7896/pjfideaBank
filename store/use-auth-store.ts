"use client";

import { create } from "zustand";
import { signIn, signOut, getSession } from "next-auth/react";
import type { User } from "@/types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  /**
   * Sync the store from a session object the caller already has (e.g. from
   * next-auth's `useSession()`), rather than fetching one. `useSession()`
   * shares one fetch across every consumer via SessionProvider's context;
   * calling `getSession()` again here would just duplicate that same
   * request on every dashboard mount, which is what used to cause the
   * "Failed to fetch" console errors when one of the two aborted the other.
   */
  setSessionUser: (sessionUser: any | null | undefined) => void;
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

  setSessionUser: (sessionUser) => {
    const u = sessionToUser(sessionUser);
    set({ currentUser: u, isAuthenticated: !!u });
  },

  login: async (email, password, setLoginStatus?: (s: string) => void) => {
    try {
      if (setLoginStatus) setLoginStatus("signIn called...");
      const res = await signIn("user-credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        if (setLoginStatus) setLoginStatus(`signIn error: ${res.error}`);
        return { success: false, error: "Invalid email or password." };
      }
      if (setLoginStatus) setLoginStatus("getSession called...");
      const session = await getSession();
      if (setLoginStatus) setLoginStatus("sessionToUser called...");
      const u = sessionToUser(session?.user);
      if (!u) {
        if (setLoginStatus) setLoginStatus("Session missing user.");
        return { success: false, error: "Session not established." };
      }
      if (setLoginStatus) setLoginStatus("Updating auth state...");
      set({ currentUser: u, isAuthenticated: true });
      return { success: true };
    } catch (err: any) {
      if (setLoginStatus) setLoginStatus(`signIn threw: ${err.message}`);
      throw err;
    }
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
