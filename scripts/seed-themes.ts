/**
 * Seed the new Theme table from the legacy THEME_MONTHS constant.
 * Idempotent — upserts by `month`.
 */
import { prisma } from "../lib/prisma";
import { THEME_MONTHS } from "../lib/constants";

async function main() {
  let i = 0;
  for (const t of THEME_MONTHS) {
    await prisma.theme.upsert({
      where: { month: t.month },
      create: {
        month: t.month,
        shortMonth: t.shortMonth,
        theme: t.theme,
        description: t.description,
        icon: t.icon,
        gradient: t.gradient,
        sortOrder: i,
      },
      update: {
        shortMonth: t.shortMonth,
        theme: t.theme,
        description: t.description,
        icon: t.icon,
        gradient: t.gradient,
        sortOrder: i,
      },
    });
    i++;
  }
  const count = await prisma.theme.count();
  console.log(`✓ Theme rows: ${count}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
