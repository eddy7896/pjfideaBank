export type ProblemCategory =
  | "Water & Sanitation"
  | "Agriculture & Food"
  | "Environment & Climate"
  | "Accessibility & Inclusion"
  | "School & Learning"
  | "Community & Safety";

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  "Water & Sanitation",
  "Agriculture & Food",
  "Environment & Climate",
  "Accessibility & Inclusion",
  "School & Learning",
  "Community & Safety",
];

/**
 * Development stage of a student's own tracked idea (used by the Share an
 * Idea flow) — not a property of a Problem Bank entry, since a problem
 * hasn't been picked up by anyone yet.
 */
export type IdeaStage = "Observed" | "Ideating" | "Prototyping" | "Tested";

export const IDEA_STAGES: IdeaStage[] = ["Observed", "Ideating", "Prototyping", "Tested"];

/**
 * A problem in the Problem Bank is an unsolved starting point, not a
 * finished idea — there's no proposed solution, materials, or stage,
 * because those belong to a specific team's tracked idea (documented via
 * the real Share an Idea / dashboard flow), not to the shared catalog.
 */
export interface Problem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ProblemCategory;
  tags: string[];
  problem: string;
  affectedUsers: string;
  context: string;
  /** A few starter questions to help a student begin thinking through it. */
  promptQuestions: string[];
  image: string;
  createdAt: string;
}
