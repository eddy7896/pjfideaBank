export type IdeaCategory =
  | "Water & Sanitation"
  | "Agriculture & Food"
  | "Environment & Climate"
  | "Accessibility & Inclusion"
  | "School & Learning"
  | "Community & Safety";

export const IDEA_CATEGORIES: IdeaCategory[] = [
  "Water & Sanitation",
  "Agriculture & Food",
  "Environment & Climate",
  "Accessibility & Inclusion",
  "School & Learning",
  "Community & Safety",
];

export type IdeaStage = "Observed" | "Ideating" | "Prototyping" | "Tested";

export const IDEA_STAGES: IdeaStage[] = ["Observed", "Ideating", "Prototyping", "Tested"];

export interface IdeaMaterial {
  name: string;
  costRupees: number | null;
}

export interface Idea {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: IdeaCategory;
  tags: string[];
  stage: IdeaStage;
  problem: string;
  affectedUsers: string;
  context: string;
  proposedSolution: string;
  materials: IdeaMaterial[];
  estimatedCost: number | null;
  prototypeSteps: string[];
  testingNotes: string | null;
  improvements: string | null;
  image: string;
  createdAt: string;
}
