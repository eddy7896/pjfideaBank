export type Role = "super-admin" | "school" | "education-dept";

export interface User {
  role: Role;
  schoolName?: string;
  displayName: string;
}

export type DesignThinkingStatus =
  | "Empathize"
  | "Define"
  | "Ideate"
  | "Prototype"
  | "Test";

export interface Idea {
  id: string;
  schoolName: string;
  title: string;
  theme: string;
  studentTeam: string;
  problemStatement: string;
  targetAudience: string;
  status: DesignThinkingStatus;
  lastUpdated: string;
}

export interface ThemeMonth {
  month: string;
  shortMonth: string;
  theme: string;
  description: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
}
