-- Many-to-many join between User and SubGeography. Enables a
-- geography-lead to manage multiple districts within a state.
--
-- Also adds `User.createdById` so we can audit which super-admin
-- minted each geography-lead / super-admin account.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdById" INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_createdById_fkey'
  ) THEN
    ALTER TABLE "User"
      ADD CONSTRAINT "User_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User" ("role");

CREATE TABLE IF NOT EXISTS "UserSubGeography" (
  "userId"         INTEGER      NOT NULL,
  "subGeographyId" TEXT         NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserSubGeography_pkey" PRIMARY KEY ("userId", "subGeographyId")
);

CREATE INDEX IF NOT EXISTS "UserSubGeography_subGeographyId_idx"
  ON "UserSubGeography" ("subGeographyId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserSubGeography_userId_fkey'
  ) THEN
    ALTER TABLE "UserSubGeography"
      ADD CONSTRAINT "UserSubGeography_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserSubGeography_subGeographyId_fkey'
  ) THEN
    ALTER TABLE "UserSubGeography"
      ADD CONSTRAINT "UserSubGeography_subGeographyId_fkey"
      FOREIGN KEY ("subGeographyId") REFERENCES "SubGeography"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
