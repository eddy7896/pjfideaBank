import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth-utils';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), 'scripts', 'jk-schools.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: jk-schools.json file not found at: ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  let schoolsData;
  try {
    schoolsData = JSON.parse(rawData);
  } catch (error) {
    console.error('❌ Error parsing jk-schools.json. Please check if it is valid JSON:', error);
    process.exit(1);
  }

  console.log(`🌱 Seeding J&K data. Total schools to process: ${schoolsData.length}`);

  // 1. Ensure Jammu & Kashmir geography exists
  let geo = await prisma.geography.findUnique({
    where: { name: 'Jammu and Kashmir' }
  });
  if (!geo) {
    console.log('🗺️ Creating Geography: Jammu and Kashmir');
    geo = await prisma.geography.create({
      data: {
        name: 'Jammu and Kashmir',
        code: 'JK'
      }
    });
  } else {
    console.log('🗺️ Geography "Jammu and Kashmir" already exists.');
  }

  let successCount = 0;
  let skippedCount = 0;
  let teamsCount = 0;

  for (const row of schoolsData) {
    const {
      district,
      schoolName,
      address,
      phone,
      website,
      principalName,
      udaiseCode,
      teacherName,
      teacherEmail,
      defaultPassword,
      teams
    } = row;

    // Validate row properties
    if (!district || !schoolName || !address || !phone || !principalName || !udaiseCode || !teacherName || !teacherEmail || !defaultPassword) {
      console.warn(`⚠️ Skipping row with missing required fields (School: ${schoolName || 'Unknown'})`);
      skippedCount++;
      continue;
    }

    try {
      // 2. Ensure SubGeography (District) exists
      let subGeo = await prisma.subGeography.findFirst({
        where: {
          name: district,
          geographyId: geo.id
        }
      });
      if (!subGeo) {
        console.log(`📍 Creating SubGeography: ${district}`);
        subGeo = await prisma.subGeography.create({
          data: {
            name: district,
            geographyId: geo.id
          }
        });
      }

      // 3. Check duplicate school or email
      const existingSchool = await prisma.school.findFirst({
        where: {
          OR: [
            { name: schoolName },
            { udaiseCode }
          ]
        }
      });

      const existingUser = await prisma.user.findUnique({
        where: { email: teacherEmail.toLowerCase() }
      });

      if (existingSchool || existingUser) {
        console.warn(`⚠️ Skipping: School "${schoolName}" (UDAISE: ${udaiseCode}) or User "${teacherEmail}" already exists in the system.`);
        skippedCount++;
        continue;
      }

      // 4. PRE-HASH password and student PINs
      const hashedTeacherPassword = await hashPassword(defaultPassword);

      const processedTeams: Array<{
        teamName: string;
        students: string[];
        ideaTitle: string;
        plainPin: string;
        hashedPin: string;
      }> = [];

      if (teams && Array.isArray(teams)) {
        for (const teamItem of teams) {
          const { teamName, students, idea: ideaTitle } = teamItem;

          if (!teamName || !students || !Array.isArray(students) || !ideaTitle) {
            continue;
          }

          const plainPin = Math.floor(100000 + Math.random() * 900000).toString();
          const hashedPin = await hashPassword(plainPin);

          processedTeams.push({
            teamName,
            students,
            ideaTitle,
            plainPin,
            hashedPin
          });
        }
      }

      // Determine default gender based on school gender prefix (GHSS vs BHSS)
      let defaultGender = 'Female';
      if (schoolName.includes('BHSS') || schoolName.toLowerCase().includes('boys')) {
        defaultGender = 'Male';
      }

      // 5. Database Direct Operations (no transaction wrapper, latency-friendly)
      const school = await prisma.school.create({
        data: {
          name: schoolName,
          location: `${district}, Jammu and Kashmir`,
          subGeographyId: subGeo.id,
          address,
          phone,
          website: website || null,
          principalName,
          udaiseCode,
          createdBy: 'system-seed'
        }
      });

      await prisma.user.create({
        data: {
          role: 'school',
          schoolName,
          schoolId: school.id,
          displayName: teacherName,
          email: teacherEmail.toLowerCase(),
          geographyId: geo.id,
          subGeographyId: subGeo.id,
          passwordHash: hashedTeacherPassword
        }
      });

      console.log(`\n🏫 Seeded School: ${schoolName} (${district})`);

      for (const team of processedTeams) {
        const createdTeam = await prisma.studentTeam.create({
          data: {
            name: team.teamName,
            pin: team.hashedPin,
            schoolId: school.id,
            schoolName: school.name,
            type: 'student',
            members: {
              create: team.students.map(studentName => ({
                name: studentName,
                grade: '10',
                contactNumber: '+91-9999999999',
                gender: defaultGender
              }))
            }
          }
        });

        await prisma.idea.create({
          data: {
            schoolName: school.name,
            schoolId: school.id,
            title: team.ideaTitle,
            theme: 'January: Local Problems',
            teamId: createdTeam.id,
            studentTeam: team.teamName,
            problemStatement: team.ideaTitle,
            targetAudience: 'School & Community',
            status: 'Empathize',
            stageData: {}
          }
        });

        console.log(`  👥 Created Team: "${team.teamName}" | ID: ${createdTeam.id} | Plain PIN: ${team.plainPin} | Project: "${team.ideaTitle}"`);
        teamsCount++;
      }

      successCount++;
    } catch (error) {
      console.error(`❌ Failed to seed School: ${schoolName}`, error);
      skippedCount++;
    }
  }

  console.log(`\n🎉 Seeding complete. Successfully seeded: ${successCount} schools, ${teamsCount} student teams. Skipped: ${skippedCount} schools.`);
}

main()
  .catch((e) => {
    console.error('❌ General Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
