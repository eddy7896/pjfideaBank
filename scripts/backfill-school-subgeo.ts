/**
 * Backfill `School.subGeographyId` for orphan rows. Phase C of the
 * post-deploy audit.
 *
 * Strategy: for every school missing a subGeo, parse `location` ("X, Y"
 * = district, state) and resolve/create the geography + sub-geography.
 * If `location` has only one segment, treat that as state and skip the
 * school (will need manual touch).
 *
 * Idempotent; run as many times as needed.
 */
import { prisma } from "../lib/prisma";

async function main() {
  const orphans = await prisma.school.findMany({
    where: { subGeographyId: null },
    select: {
      id: true,
      name: true,
      location: true,
      createdBy: true,
    },
  });

  if (orphans.length === 0) {
    console.log("✓ no orphan schools, nothing to do");
    return;
  }

  console.log(`Found ${orphans.length} orphan school(s). Backfilling…`);
  let fixed = 0;
  let skipped = 0;

  for (const s of orphans) {
    const parts = s.location.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      console.log(`  - skip ${s.name}: location='${s.location}' has no district`);
      skipped++;
      continue;
    }
    const district = parts[0];
    const state = parts[parts.length - 1];
    const stateCode = state.slice(0, 2).toUpperCase();

    let geo = await prisma.geography.findUnique({ where: { name: state } });
    if (!geo) {
      geo = await prisma.geography.create({
        data: {
          id: `GEO-${Date.now()}`,
          name: state,
          code: stateCode,
        },
      });
      console.log(`    + created Geography ${state}`);
    }

    let subGeo = await prisma.subGeography.findUnique({
      where: { name_geographyId: { name: district, geographyId: geo.id } },
    });
    if (!subGeo) {
      subGeo = await prisma.subGeography.create({
        data: {
          id: `SUBGEO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: district,
          geographyId: geo.id,
        },
      });
      console.log(`    + created SubGeography ${district} in ${state}`);
    }

    await prisma.school.update({
      where: { id: s.id },
      data: { subGeographyId: subGeo.id },
    });

    // Also pin the school-admin user(s) to the same scope so their
    // session token carries it after next login.
    await prisma.user.updateMany({
      where: { schoolName: s.name, role: "school" },
      data: { geographyId: geo.id, subGeographyId: subGeo.id, schoolId: s.id },
    });

    console.log(`  ✓ ${s.name} -> ${district}, ${state}`);
    fixed++;
  }

  console.log(`done. fixed=${fixed} skipped=${skipped}`);

  if (skipped > 0) {
    console.log(
      "\nSchools still missing a sub-geography. Re-run after editing the\n" +
      "School.location column to include the district, e.g.:\n" +
      "  UPDATE \"School\" SET location = 'Pune, Maharashtra' WHERE name = 'Springfield High';"
    );
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
