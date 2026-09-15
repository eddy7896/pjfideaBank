/**
 * Retry wrapper for GET requests only. On a flaky 3G/4G connection a read
 * failing outright (dropped connection, timeout) is usually recoverable a
 * second later - this retries transient failures automatically instead of
 * making the user notice and manually reload.
 *
 * Deliberately NOT used for POST/PATCH/DELETE: if the request actually
 * reached the server and only the response was lost on the way back,
 * blindly retrying a non-idempotent write could double-create/double-apply
 * it. Mutations keep surfacing their real error and rely on an explicit
 * human retry instead.
 */
export async function fetchWithRetry(
  input: string,
  init?: RequestInit,
  { retries = 2, baseDelayMs = 500 }: { retries?: number; baseDelayMs?: number } = {}
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init);
      // Retry server errors (likely transient) but not client errors
      // (4xx will just fail the same way again).
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        return res;
      }
      lastError = new Error(`Server error: ${res.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }

  throw lastError;
}
