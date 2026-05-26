-- Phase 3.2 — additive schoolId FK columns.
-- Adds `schoolId` nullable columns to Idea, StudentTeam, User pointing to
-- School.id. Backfills from existing schoolName join. Old `schoolName`
-- column + FK kept intact: cutover to schoolId is a later phase once
-- every read path is migrated.
--
-- ON DELETE behavior: Cascade for Idea + StudentTeam (mirrors the
-- existing logical "school owns its data" relationship), SetNull for
-- User so a deleted School orphans the user account but does not
-- destroy it.

-- 1. Idea.schoolId
ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "schoolId" TEXT;

UPDATE "Idea" i
SET "schoolId" = s."id"
FROM "School" s
WHERE i."schoolName" = s."name" AND i."schoolId" IS NULL;

CREATE INDEX IF NOT EXISTS "Idea_schoolId_idx" ON "Idea" ("schoolId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Idea_schoolId_fkey'
  ) THEN
    ALTER TABLE "Idea"
      ADD CONSTRAINT "Idea_schoolId_fkey"
      FOREIGN KEY ("schoolId") REFERENCES "School"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 2. StudentTeam.schoolId
ALTER TABLE "StudentTeam" ADD COLUMN IF NOT EXISTS "schoolId" TEXT;

UPDATE "StudentTeam" t
SET "schoolId" = s."id"
FROM "School" s
WHERE t."schoolName" = s."name" AND t."schoolId" IS NULL;

CREATE INDEX IF NOT EXISTS "StudentTeam_schoolId_idx" ON "StudentTeam" ("schoolId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'StudentTeam_schoolId_fkey'
  ) THEN
    ALTER TABLE "StudentTeam"
      ADD CONSTRAINT "StudentTeam_schoolId_fkey"
      FOREIGN KEY ("schoolId") REFERENCES "School"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 3. User.schoolId
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "schoolId" TEXT;

UPDATE "User" u
SET "schoolId" = s."id"
FROM "School" s
WHERE u."schoolName" = s."name" AND u."schoolId" IS NULL;

CREATE INDEX IF NOT EXISTS "User_schoolId_idx" ON "User" ("schoolId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_schoolId_fkey'
  ) THEN
    ALTER TABLE "User"
      ADD CONSTRAINT "User_schoolId_fkey"
      FOREIGN KEY ("schoolId") REFERENCES "School"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
