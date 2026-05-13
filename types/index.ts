export type Role = "super-admin" | "school" | "education-dept" | "student";

export interface School {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  website?: string;
  principalName: string;
  udaiseCode: string;
  createdAt: string;
  createdBy?: string;
}

export interface User {
  role: Role;
  schoolName?: string;
  displayName: string;
  email: string;
  teamId?: string;
}

export interface TeamMember {
  name: string;
  grade: string;
  contactNumber: string;
  gender: "Male" | "Female" | "Non-binary" | "Prefer not to say";
}

export interface StudentTeam {
  id: string;
  pin: string;
  name: string;
  schoolName: string;
  members: TeamMember[];
  createdAt: string;
}

export interface DemoCredential {
  email: string;
  password: string;
  user: User;
  label: string;
  description: string;
}

export type DesignThinkingStatus =
  | "Empathize"
  | "Define"
  | "Ideate"
  | "Prototype"
  | "Test";

export interface EmpathizeData {
  what: string;
  when: string;
  where: string;
  who: string;
  how: string;
  whys: string[];
  rootCause: string;
}

export interface DefineData {
  problemStatement: string;
  userPersona: string;
  needStatement: string;
  insights: string[];
}

export interface IdeateData {
  brainstormIdeas: string[];
  selectedIdea: string;
  selectionReason: string;
  constraints: string[];
}

export interface IterationEntry {
  id: string;
  description: string;
  outcome: string;
  date: string;
}

export interface PrototypeData {
  toolsRequired: string[];
  steps: string[];
  iterations: IterationEntry[];
}

export interface TestData {
  testPlan: string;
  results: string;
  passed: boolean;
  failureNotes?: string;
}

export interface TimelineEvent {
  id: string;
  type: "created" | "stage_change" | "form_submitted" | "comment" | "test_failed";
  stage?: DesignThinkingStatus;
  fromStage?: DesignThinkingStatus;
  toStage?: DesignThinkingStatus;
  content?: string;
  timestamp: string;
  author?: string;
}

export interface Idea {
  id: string;
  schoolName: string;
  title: string;
  theme: string;
  studentTeam: string;
  teamId?: string;
  problemStatement: string;
  targetAudience: string;
  status: DesignThinkingStatus;
  lastUpdated: string;
  stageData: {
    Empathize?: EmpathizeData;
    Define?: DefineData;
    Ideate?: IdeateData;
    Prototype?: PrototypeData;
    Test?: TestData;
  };
  timeline: TimelineEvent[];
}

export interface ThemeMonth {
  month: string;
  shortMonth: string;
  theme: string;
  description: string;
  icon: string;
  gradient: string;
}
