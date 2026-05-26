/**
 * Spot-check the new user-flow plumbing without going through HTTP.
 * Verifies the new schema columns, FK constraints, and migration are in
 * place. Run AFTER the migration is applied.
 */
import { prisma } from "../lib/prisma";

async function main() {
  const checks: { name: string; ok: boolean; detail?: string }[] = [];
  const ok = (n: string, d?: string) => checks.push({ name: n, ok: true, detail: d });
  const bad = (n: string, d: string) => checks.push({ name: n, ok: false, detail: d });

  // UserSubGeography table
  const exists: any = await prisma.$queryRaw`
    SELECT to_regclass('"UserSubGeography"')::text AS r;
  `;
  if (exists[0]?.r) ok("UserSubGeography table");
  else bad("UserSubGeography table", "missing");

  // User.createdById column
  const col: any = await prisma.$queryRaw`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='User' AND column_name='createdById';
  `;
  if (col.length) ok("User.createdById column");
  else bad("User.createdById column", "missing");

  // FKs
  const fks: any = await prisma.$queryRaw`
    SELECT conname FROM pg_constraint WHERE conname IN (
      'User_createdById_fkey',
      'UserSubGeography_userId_fkey',
      'UserSubGeography_subGeographyId_fkey'
    );
  `;
  const names = new Set(fks.map((f: any) => f.conname));
  for (const n of [
    "User_createdById_fkey",
    "UserSubGeography_userId_fkey",
    "UserSubGeography_subGeographyId_fkey",
  ]) {
    if (names.has(n)) ok(`FK ${n}`);
    else bad(`FK ${n}`, "missing");
  }

  // role index
  const idx: any = await prisma.$queryRaw`
    SELECT indexname FROM pg_indexes WHERE indexname='User_role_idx';
  `;
  if (idx.length) ok("User.role index");
  else bad("User.role index", "missing");

  // Geography-leads count
  const leadCount = await prisma.user.count({ where: { role: "geography-lead" } });
  ok(`geography-lead accounts in DB`, `count=${leadCount}`);

  for (const c of checks) {
    console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}${c.detail ? `  (${c.detail})` : ""}`);
  }
  const failed = checks.filter((c) => !c.ok);
  if (failed.length) process.exit(1);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
