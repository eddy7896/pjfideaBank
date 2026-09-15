/**
 * Local draft persistence for long forms. On an unreliable connection a
 * student can lose 20 minutes of typed work to a single dropped request -
 * this keeps an in-progress form recoverable from localStorage until it's
 * actually submitted, independent of network state.
 */

export function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) - the draft just won't
    // survive a reload. Not fatal, the form still works for this session.
  }
}

export function clearDraft(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
