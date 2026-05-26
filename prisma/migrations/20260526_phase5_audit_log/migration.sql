-- Phase 5 — AuditLog table for every mutation across ideas, teams,
-- approvals, rejections, onboarding. Idempotent.

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"         TEXT NOT NULL,
  "actorId"    TEXT,
  "actorRole"  TEXT,
  "actorEmail" TEXT,
  "action"     TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId"   TEXT,
  "schoolName" TEXT,
  "ip"         TEXT,
  "payload"    JSONB,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_entity_idx" ON "AuditLog" ("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog" ("actorId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog" ("createdAt");
