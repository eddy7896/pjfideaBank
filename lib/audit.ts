import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth/session";
import { ipFromRequest } from "@/lib/ratelimit";

export type AuditEntry = {
  action: string;
  entityType: string;
  entityId?: string | null;
  schoolName?: string | null;
  payload?: any;
};

/**
 * Persist a single audit event. Fire-and-forget — failures must not break
 * the user-facing request, so errors are swallowed after logging.
 */
export async function audit(
  request: Request | null,
  actor: SessionUser | null,
  entry: AuditEntry
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actor?.id ?? null,
        actorRole: actor?.role ?? null,
        actorEmail: null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        schoolName: entry.schoolName ?? actor?.schoolName ?? null,
        ip: request ? ipFromRequest(request) : null,
        payload: entry.payload ?? undefined,
      },
    });
  } catch (e) {
    console.error("audit log failed:", e);
  }
}
