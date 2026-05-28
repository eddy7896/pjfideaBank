"use client";

import { create } from "zustand";

export type SchoolRow = {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  website?: string | null;
  principalName: string;
  udaiseCode: string;
  subGeographyId?: string | null;
  createdAt: string;
  subGeography?: {
    id: string;
    name: string;
    geographyId: string;
    geography?: { id: string; name: string; code: string } | null;
  } | null;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface SchoolState {
  schools: SchoolRow[];
  isLoaded: boolean;
  loadSchools: () => Promise<void>;
  getBySlug: (slug: string) => SchoolRow | undefined;
  slugFor: (name: string) => string;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schools: [],
  isLoaded: false,
  loadSchools: async () => {
    try {
      const res = await fetch("/api/schools", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as SchoolRow[];
        set({ schools: data, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load schools:", error);
      set({ isLoaded: true });
    }
  },
  getBySlug: (slug) => get().schools.find((s) => slugify(s.name) === slug),
  slugFor: (name) => slugify(name),
}));
