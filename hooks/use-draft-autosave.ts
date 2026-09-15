"use client";

import { useEffect, useRef } from "react";
import { writeDraft } from "@/lib/draft-storage";

/**
 * Debounced localStorage autosave for a form's current values. Skips the
 * very first run so restoring a draft on mount doesn't immediately write
 * it straight back (harmless, but pointless I/O).
 */
export function useDraftAutosave(key: string | undefined, value: unknown, delayMs = 600) {
  const first = useRef(true);

  useEffect(() => {
    if (!key) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const timeout = setTimeout(() => writeDraft(key, value), delayMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(value)]);
}
