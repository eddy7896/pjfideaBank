"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/types";
import { MOCK_USERS } from "@/lib/constants";

interface AuthState {
  currentUser: User;
  switchUser: (user: User) => void;
  switchRole: (role: Role, schoolName?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: MOCK_USERS[0], // Default: Super Admin
      switchUser: (user) => set({ currentUser: user }),
      switchRole: (role, schoolName) => {
        const user = MOCK_USERS.find(
          (u) => u.role === role && (role !== "school" || u.schoolName === schoolName)
        );
        if (user) set({ currentUser: user });
      },
    }),
    {
      name: "pijam-auth",
    }
  )
);
