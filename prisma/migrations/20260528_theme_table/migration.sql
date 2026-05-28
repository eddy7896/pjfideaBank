-- Phase G — Theme table. Replaces the localStorage `useThemeStore` so
-- super-admin curated themes survive across browsers and reach every
-- role.

CREATE TABLE IF NOT EXISTS "Theme" (
  "id"          TEXT NOT NULL,
  "month"       TEXT NOT NULL,
  "shortMonth"  TEXT NOT NULL,
  "theme"       TEXT NOT NULL,
  "description" TEXT,
  "icon"        TEXT,
  "gradient"    TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Theme_month_key" ON "Theme" ("month");
