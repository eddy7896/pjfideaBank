"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentTeam, TeamMember } from "@/types";

interface TeamState {
  teams: StudentTeam[];
  createTeam: (name: string, schoolName: string, members: TeamMember[]) => StudentTeam;
  deleteTeam: (id: string) => void;
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

const mockTeams: StudentTeam[] = [
  {
    id: "TM-DEMO01",
    pin: "123456",
    name: "Green Sparks",
    schoolName: "Springfield High",
    members: [
      { name: "Alice Johnson", grade: "10", contactNumber: "555-0101", gender: "Female" },
      { name: "Bob Smith", grade: "10", contactNumber: "555-0102", gender: "Male" },
      { name: "Carol Davis", grade: "10", contactNumber: "555-0103", gender: "Female" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "TM-DEMO02",
    pin: "654321",
    name: "Tech Pioneers",
    schoolName: "Springfield High",
    members: [
      { name: "David Wilson", grade: "11", contactNumber: "555-0104", gender: "Male" },
      { name: "Emma Brown", grade: "11", contactNumber: "555-0105", gender: "Female" },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: mockTeams,

      createTeam: (name: string, schoolName: string, members: TeamMember[]) => {
        const newTeam: StudentTeam = {
          id: generateTeamId(),
          pin: generatePin(),
          name,
          schoolName,
          members,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ teams: [newTeam, ...state.teams] }));
        return newTeam;
      },

      deleteTeam: (id: string) => {
        set((state) => ({ teams: state.teams.filter((t) => t.id !== id) }));
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
    }),
    {
      name: "pijam-teams",
    }
  )
);
