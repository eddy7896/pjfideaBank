import { prisma } from "../lib/prisma";

async function main() {
  const cols: any = await prisma.$queryRaw`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_name IN ('Idea','TimelineEvent','StudentTeam')
      AND column_name IN ('lastUpdated','timestamp','pin')
    ORDER BY table_name, column_name;
  `;
  console.log("columns:", cols);

  const constraints: any = await prisma.$queryRaw`
    SELECT conname
    FROM pg_constraint
    WHERE conname IN ('StudentTeam_schoolName_pin_key', 'Idea_teamId_fkey')
  `;
  console.log("constraints:", constraints);

  const ideaSample = await prisma.idea.findFirst({ select: { id: true, lastUpdated: true } });
  console.log("idea sample:", ideaSample);

  const tlSample = await prisma.timelineEvent.findFirst({ select: { id: true, timestamp: true } });
  console.log("timeline sample:", tlSample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
