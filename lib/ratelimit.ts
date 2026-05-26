/**
 * Naive in-memory sliding-window ratelimiter. Suitable for single-instance
 * deployments. Replace with Upstash/Redis when horizontally scaled.
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export type RateResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh: Entry = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { allowed: true, remaining: max - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: max - existing.count,
    resetAt: existing.resetAt,
  };
}

export function ipFromRequest(req: any): string {
  if (!req) return "unknown";

  // Case 1: Standard Request / NextRequest (headers is a Headers object with a get method)
  if (req.headers && typeof req.headers.get === "function") {
    try {
      const xff = req.headers.get("x-forwarded-for");
      if (xff) return xff.split(",")[0].trim();
      const real = req.headers.get("x-real-ip");
      if (real) return real;
    } catch (e) {
      // Swallowed
    }
  }

  // Case 2: Plain object (headers is a record of string keys)
  if (req.headers && typeof req.headers === "object") {
    const xff = req.headers["x-forwarded-for"] || req.headers["X-Forwarded-For"];
    if (xff) return String(xff).split(",")[0].trim();
    
    const real = req.headers["x-real-ip"] || req.headers["X-Real-IP"];
    if (real) return String(real);
  }

  // Case 3: Direct properties or socket remote addresses
  if (req.ip) return req.ip;
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;

  return "unknown";
}
