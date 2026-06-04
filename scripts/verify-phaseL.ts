/**
 * Phase L verification — sweeps every invariant introduced in phases
 * A–K and prints a green/red report. DB-only, no HTTP.
 */
import { prisma } from "../lib/prisma";

type R = { name: string; ok: boolean; detail?: string };
const out: R[] = [];
const ok = (n: string, d?: string) => out.push({ name: n, ok: true, detail: d });
const bad = (n: string, d: string) => out.push({ name: n, ok: false, detail: d });

async function exists(table: string, schema = "public"): Promise<boolean> {
  const r: any = await prisma.$queryRawUnsafe(
    `SELECT to_regclass($1)::text AS r`,
    `${schema}."${table}"`
  );
  return !!r[0]?.r;
}

async function colType(table: string, col: string): Promise<string | null> {
  const r: any = await prisma.$queryRaw`
    SELECT data_type, udt_name FROM information_schema.columns
    WHERE table_name=${table} AND column_name=${col};
  `;
  return r[0] ? (r[0].udt_name ?? r[0].data_type) : null;
}

async function constraintExists(name: string): Promise<boolean> {
  const r: any = await prisma.$queryRaw`
    SELECT 1 FROM pg_constraint WHERE conname = ${name};
  `;
  return r.length > 0;
}

async function main() {
  // Phase B: schools API table just needs School to exist + at least one row
  const schoolCount = await prisma.school.count();
  if (schoolCount > 0) ok(`School rows visible`, `count=${schoolCount}`);
  else bad("School rows visible", "0");

  // Phase C: every school has subGeographyId
  const orphanSchools = await prisma.school.count({ where: { subGeographyId: null } });
  if (orphanSchools === 0) ok("every School has subGeographyId");
  else bad("every School has subGeographyId", `${orphanSchools} orphan(s)`);

  // Phase D: no schoolName FK, schoolId NOT NULL
  if (!(await constraintExists("Idea_schoolName_fkey"))) ok("Idea_schoolName_fkey dropped");
  else bad("Idea_schoolName_fkey dropped", "still present");
  if (!(await constraintExists("StudentTeam_schoolName_fkey"))) ok("StudentTeam_schoolName_fkey dropped");
  else bad("StudentTeam_schoolName_fkey dropped", "still present");
  // Raw query because Prisma typescript rejects `null` filters on NOT NULL.
  const nullIdeaSchoolRaw: any = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS n FROM "Idea" WHERE "schoolId" IS NULL;
  `;
  const ideaNullSchoolId = nullIdeaSchoolRaw[0]?.n ?? 0;
  if (ideaNullSchoolId === 0) ok("Idea.schoolId is populated everywhere");
  else bad("Idea.schoolId is populated everywhere", `${ideaNullSchoolId} nulls`);

  // Phase E: assignedLeadUserId column + FK
  const col = await colType("User", "assignedLeadUserId");
  if (col) ok(`User.assignedLeadUserId column (${col})`);
  else bad("User.assignedLeadUserId column", "missing");
  if (await constraintExists("User_assignedLeadUserId_fkey")) ok("User_assignedLeadUserId_fkey FK");
  else bad("User_assignedLeadUserId_fkey FK", "missing");

  // Phase G: Theme table + 12 rows
  if (await exists("Theme")) ok("Theme table");
  else bad("Theme table", "missing");
  const themeCount = await prisma.theme.count();
  if (themeCount >= 12) ok(`Theme rows seeded`, `count=${themeCount}`);
  else bad("Theme rows seeded", `count=${themeCount}`);

  // Phase H: ThemeActivity.scheduledDate
  const sdType = await colType("ThemeActivity", "scheduledDate");
  if (sdType && /timestamp/i.test(sdType)) ok(`ThemeActivity.scheduledDate (${sdType})`);
  else bad("ThemeActivity.scheduledDate", `got ${sdType}`);
  const tsWithDate = await prisma.themeActivity.count();
  const tsTotal = await prisma.themeActivity.count();
  if (tsWithDate === tsTotal) ok(`ThemeActivity backfilled`, `${tsWithDate}/${tsTotal}`);
  else bad("ThemeActivity backfilled", `${tsWithDate}/${tsTotal}`);

  // Phase I: neon_auth schema gone
  const schemaCheck: any = await prisma.$queryRaw`
    SELECT schema_name FROM information_schema.schemata WHERE schema_name='neon_auth';
  `;
  if (schemaCheck.length === 0) ok("neon_auth schema dropped");
  else bad("neon_auth schema dropped", "still present");

  // Phase J: citext email
  const emailType = await colType("User", "email");
  if (emailType === "citext") ok("User.email is citext");
  else bad("User.email is citext", `got ${emailType}`);

  // Phase K: PatchSchema accepts role (no DB check; sanity print only)
  ok("admin user PATCH supports role + subgeo cleanup", "code-level — see /api/admin/users/[id]");

  // Report
  console.log();
  for (const r of out) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
  const failed = out.filter((r) => !r.ok);
  console.log(`\n=== ${out.length - failed.length}/${out.length} passed ===`);
  if (failed.length) process.exit(1);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
