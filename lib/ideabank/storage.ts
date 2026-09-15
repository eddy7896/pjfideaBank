import { readDraft, writeDraft, clearDraft } from "@/lib/draft-storage";

/**
 * Frontend-only persistence for the Ideabank demo. Everything here reads
 * and writes localStorage on this device only — nothing is sent to a
 * server. Swap this module for a real API-backed implementation once a
 * backend exists; every call site depends only on this interface.
 */

const SAVED_PROBLEMS_KEY = "ideabank:saved-problems";
const SHARE_DRAFT_KEY = "ideabank:share-draft";

export function getSavedProblemSlugs(): string[] {
  return readDraft<string[]>(SAVED_PROBLEMS_KEY) ?? [];
}

export function isProblemSaved(slug: string): boolean {
  return getSavedProblemSlugs().includes(slug);
}

type Listener = () => void;
const savedProblemsListeners = new Set<Listener>();

/** For useSyncExternalStore — lets SaveButton instances re-render when any of them toggles a save. */
export function subscribeSavedProblems(listener: Listener): () => void {
  savedProblemsListeners.add(listener);
  return () => savedProblemsListeners.delete(listener);
}

export function toggleSavedProblem(slug: string): boolean {
  const current = getSavedProblemSlugs();
  const isSaved = current.includes(slug);
  const next = isSaved ? current.filter((s) => s !== slug) : [...current, slug];
  writeDraft(SAVED_PROBLEMS_KEY, next);
  savedProblemsListeners.forEach((listener) => listener());
  return !isSaved;
}

export interface ShareIdeaDraft {
  title: string;
  category: string;
  problem: string;
  affectedUsers: string;
  context: string;
  proposedSolution: string;
  stage: string;
  materials: string;
  estimatedCost: string;
  whatWasTried: string;
  whatWasLearned: string;
  imageDataUrl: string | null;
}

export function readShareDraft(): ShareIdeaDraft | null {
  return readDraft<ShareIdeaDraft>(SHARE_DRAFT_KEY);
}

export function writeShareDraft(draft: ShareIdeaDraft): void {
  writeDraft(SHARE_DRAFT_KEY, draft);
}

export function clearShareDraft(): void {
  clearDraft(SHARE_DRAFT_KEY);
}

const SUBMITTED_IDEAS_KEY = "ideabank:submitted-ideas";

export interface SubmittedIdea extends ShareIdeaDraft {
  submittedAt: string;
}

export function getSubmittedIdeas(): SubmittedIdea[] {
  return readDraft<SubmittedIdea[]>(SUBMITTED_IDEAS_KEY) ?? [];
}

export function saveSubmittedIdea(draft: ShareIdeaDraft): SubmittedIdea {
  const submission: SubmittedIdea = { ...draft, submittedAt: new Date().toISOString() };
  const existing = getSubmittedIdeas();
  writeDraft(SUBMITTED_IDEAS_KEY, [submission, ...existing]);
  return submission;
}
