/**
 * One-off migration: replace plaintext StudentTeam.pin with a scrypt hash.
 *
 * Detection: rows whose `pin` does not contain ":" are treated as legacy
 * plaintext (post-hash format is `salt:derivedKey`). Rows are updated in place.
 *
 * Safe to re-run — hashed rows are skipped.
 *
 * Usage:
 *   npx tsx scripts/hash-student-pins.ts
 */
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth-utils";

async function main() {
  const teams = await prisma.studentTeam.findMany({ select: { id: true, pin: true } });
  let migrated = 0;
  let skipped = 0;

  for (const t of teams) {
    if (t.pin.includes(":")) {
      skipped++;
      continue;
    }
    const hash = await hashPassword(t.pin);
    await prisma.studentTeam.update({
      where: { id: t.id },
      data: { pin: hash },
    });
    migrated++;
    console.log(`hashed ${t.id}`);
  }

  console.log(`done. migrated=${migrated} already-hashed=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
