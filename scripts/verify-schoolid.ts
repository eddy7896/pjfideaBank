import { prisma } from "../lib/prisma";

async function main() {
  const ideaStats: any = await prisma.$queryRaw`
    SELECT COUNT(*) AS total,
           COUNT("schoolId") AS with_id,
           COUNT(*) FILTER (WHERE "schoolId" IS NULL) AS missing
    FROM "Idea";
  `;
  const teamStats: any = await prisma.$queryRaw`
    SELECT COUNT(*) AS total,
           COUNT("schoolId") AS with_id,
           COUNT(*) FILTER (WHERE "schoolId" IS NULL) AS missing
    FROM "StudentTeam";
  `;
  const userStats: any = await prisma.$queryRaw`
    SELECT COUNT(*) AS total,
           COUNT("schoolName") AS with_school_name,
           COUNT("schoolId") AS with_school_id
    FROM "User";
  `;

  console.log("Idea:", ideaStats);
  console.log("StudentTeam:", teamStats);
  console.log("User:", userStats);
}

main().catch(console.error).finally(() => prisma.$disconnect());
