-- Many-to-many join between User and School. Enables an instructor
-- ("school" role) to be assigned to several schools (a cluster), mirroring
-- UserSubGeography's role for geography-leads across multiple districts.

CREATE TABLE IF NOT EXISTS "UserSchool" (
  "userId"    INTEGER      NOT NULL,
  "schoolId"  TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserSchool_pkey" PRIMARY KEY ("userId", "schoolId")
);

CREATE INDEX IF NOT EXISTS "UserSchool_schoolId_idx"
  ON "UserSchool" ("schoolId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserSchool_userId_fkey'
  ) THEN
    ALTER TABLE "UserSchool"
      ADD CONSTRAINT "UserSchool_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserSchool_schoolId_fkey'
  ) THEN
    ALTER TABLE "UserSchool"
      ADD CONSTRAINT "UserSchool_schoolId_fkey"
      FOREIGN KEY ("schoolId") REFERENCES "School"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
