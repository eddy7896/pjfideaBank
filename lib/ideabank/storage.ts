import { readDraft, writeDraft, clearDraft } from "@/lib/draft-storage";

/**
 * Frontend-only persistence for the Ideabank demo. Everything here reads
 * and writes localStorage on this device only — nothing is sent to a
 * server. Swap this module for a real API-backed implementation once a
 * backend exists; every call site depends only on this interface.
 */

const SAVED_IDEAS_KEY = "ideabank:saved-ideas";
const SHARE_DRAFT_KEY = "ideabank:share-draft";

export function getSavedIdeaSlugs(): string[] {
  return readDraft<string[]>(SAVED_IDEAS_KEY) ?? [];
}

export function isIdeaSaved(slug: string): boolean {
  return getSavedIdeaSlugs().includes(slug);
}

type Listener = () => void;
const savedIdeasListeners = new Set<Listener>();

/** For useSyncExternalStore — lets SaveButton instances re-render when any of them toggles a save. */
export function subscribeSavedIdeas(listener: Listener): () => void {
  savedIdeasListeners.add(listener);
  return () => savedIdeasListeners.delete(listener);
}

export function toggleSavedIdea(slug: string): boolean {
  const current = getSavedIdeaSlugs();
  const isSaved = current.includes(slug);
  const next = isSaved ? current.filter((s) => s !== slug) : [...current, slug];
  writeDraft(SAVED_IDEAS_KEY, next);
  savedIdeasListeners.forEach((listener) => listener());
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
