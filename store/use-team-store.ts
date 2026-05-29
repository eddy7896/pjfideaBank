"use client";

import { create } from "zustand";
import type { StudentTeam, TeamMember } from "@/types";

interface TeamState {
  teams: StudentTeam[];
  isLoaded: boolean;
  loadTeams: () => Promise<void>;
  createTeam: (name: string, schoolName: string, members: TeamMember[]) => Promise<StudentTeam>;
  updateTeam: (id: string, name: string, members: TeamMember[]) => Promise<StudentTeam>;
  deleteTeam: (id: string) => Promise<void>;
  getTeamsBySchool: (schoolName: string) => StudentTeam[];
  getTeamById: (id: string) => StudentTeam | undefined;
  loginStudent: (teamId: string, pin: string) => StudentTeam | null;
}

const generateTeamId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TM-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const generatePin = (): string => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
};

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  isLoaded: false,

  loadTeams: async () => {
    try {
      const res = await fetch("/api/teams", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        set({ teams: data, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load teams:", error);
      set({ isLoaded: true });
    }
  },

  createTeam: async (name: string, schoolName: string, members: TeamMember[]) => {
    const newTeam: StudentTeam = {
      id: generateTeamId(),
      pin: generatePin(),
      name,
      schoolName,
      members,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });

      if (res.ok) {
        set((state) => ({ teams: [newTeam, ...state.teams] }));
        return newTeam;
      }
    } catch (error) {
      console.error("Failed to create team:", error);
    }

    return newTeam;
  },

  updateTeam: async (id: string, name: string, members: TeamMember[]) => {
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, members }),
      });

      if (res.ok) {
        const updatedTeam = await res.json();
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? updatedTeam : t)),
        }));
        return updatedTeam;
      }
    } catch (error) {
      console.error("Failed to update team:", error);
    }
    throw new Error("Failed to update team");
  },

  deleteTeam: async (id: string) => {
    try {
      await fetch(`/api/teams/${id}`, { method: "DELETE" });
      set((state) => ({ teams: state.teams.filter((t) => t.id !== id) }));
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  },

  getTeamsBySchool: (schoolName: string) => {
    return get().teams.filter((t) => t.schoolName === schoolName);
  },

  getTeamById: (id: string) => {
    return get().teams.find((t) => t.id === id);
  },

  loginStudent: (teamId: string, pin: string) => {
    const team = get().teams.find((t) => t.id === teamId && t.pin === pin);
    return team || null;
  },
}));
