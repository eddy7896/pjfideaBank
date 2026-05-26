-- Phase 3.1 — Convert string date fields to DateTime, add unique
-- constraint on (schoolName, pin), add timestamp index.
-- All operations are idempotent where possible.

-- 1. Idea.lastUpdated: TEXT -> TIMESTAMP(3)
--    Existing values are date strings (YYYY-MM-DD). Append midnight UTC.
ALTER TABLE "Idea"
  ALTER COLUMN "lastUpdated" DROP NOT NULL;

ALTER TABLE "Idea"
  ALTER COLUMN "lastUpdated" TYPE TIMESTAMP(3)
  USING (
    CASE
      WHEN "lastUpdated" IS NULL OR "lastUpdated" = '' THEN NOW()
      WHEN "lastUpdated" ~ '^\d{4}-\d{2}-\d{2}$' THEN ("lastUpdated" || ' 00:00:00')::timestamp
      ELSE "lastUpdated"::timestamp
    END
  );

ALTER TABLE "Idea"
  ALTER COLUMN "lastUpdated" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Idea"
  ALTER COLUMN "lastUpdated" SET NOT NULL;

-- 2. TimelineEvent.timestamp: TEXT -> TIMESTAMP(3)
--    Existing values are ISO8601 strings.
ALTER TABLE "TimelineEvent"
  ALTER COLUMN "timestamp" TYPE TIMESTAMP(3)
  USING (
    CASE
      WHEN "timestamp" IS NULL OR "timestamp" = '' THEN NOW()
      ELSE "timestamp"::timestamp
    END
  );

ALTER TABLE "TimelineEvent"
  ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;

-- 3. TimelineEvent.timestamp index (for ORDER BY timestamp DESC).
CREATE INDEX IF NOT EXISTS "TimelineEvent_timestamp_idx"
  ON "TimelineEvent" ("timestamp");

-- 4. StudentTeam unique (schoolName, pin) — PIN scoped by school.
--    Skip if a duplicate exists (manual cleanup required first).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'StudentTeam_schoolName_pin_key'
  ) THEN
    ALTER TABLE "StudentTeam"
      ADD CONSTRAINT "StudentTeam_schoolName_pin_key" UNIQUE ("schoolName", "pin");
  END IF;
END $$;
