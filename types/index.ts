export type Role =
  | "super-admin"
  | "program-lead"
  | "geography-lead"
  | "teacher-trainer"
  | "school"
  | "student"
  | "sed-department";

export interface Geography {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface SubGeography {
  id: string;
  name: string;
  geographyId: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  location: string;
  subGeographyId?: string;
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
  geographyId?: string;
  subGeographyId?: string;
  assignedLeadId?: string; // assigned GL/PL email
  passwordHash?: string;
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
  type:
    | "created"
    | "stage_change"
    | "form_submitted"
    | "comment"
    | "test_failed"
    | "advance_requested"
    | "advance_approved"
    | "advance_rejected";
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

export interface ActivityReport {
  id: string;
  activityId: string;
  schoolName: string;
  teacherName: string;
  sessionDate: string;
  timeIn: string;
  timeOut: string;
  grades: string;
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
  lcmsCode?: string;
  topicsLessons: string;
  learningGoal: string;
  materials: Array<{
    name: string;
    quantityUsed: number;
    stockStatus: string;
  }>;
  safetyBriefing: boolean;
  ppeWorn: boolean;
  labCleanup: boolean;
  incidentNotes?: string;
  studentEngagement: "Low" | "Moderate" | "High";
  successes: string;
  challenges: string;
  followUpActions: string;
  createdAt: string;
  submittedBy: string;
}

export interface ThemeActivity {
  id: string;
  date: number;
  month: number;
  year: number;
  title: string;
  theme: string;
  schoolName?: string;
  description?: string;
  createdAt: string;
}
