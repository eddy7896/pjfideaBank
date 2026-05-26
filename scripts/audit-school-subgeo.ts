/**
 * Audit schools that lack a subGeographyId. After the Phase 4 onboard
 * change, new schools must specify a district. This script reports the
 * existing rows that violate that invariant so they can be fixed
 * manually or via a backfill UI.
 */
import { prisma } from "../lib/prisma";

async function main() {
  const orphans = await prisma.school.findMany({
    where: { subGeographyId: null },
    select: { id: true, name: true, location: true, udaiseCode: true },
  });

  if (orphans.length === 0) {
    console.log("✓ all schools have a subGeographyId");
    return;
  }

  console.log(`✗ ${orphans.length} school(s) missing subGeographyId:`);
  for (const s of orphans) {
    console.log(
      `  - ${s.id}  ${s.name.padEnd(30)}  udaise=${s.udaiseCode}  loc='${s.location}'`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
