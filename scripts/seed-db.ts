import { createUser, createTeam, createIdea } from '@/lib/db/repositories';
import { DEMO_CREDENTIALS } from '@/lib/constants';
import { MOCK_IDEAS } from '@/lib/mock-data';

const createDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

async function seedDatabase() {
  console.log('🌱 Initializing database...');

  console.log('👥 Seeding users...');
  for (const cred of DEMO_CREDENTIALS) {
    try {
      await createUser({
        role: cred.user.role,
        schoolName: cred.user.schoolName,
        displayName: cred.user.displayName,
        email: cred.user.email,
      });
    } catch (e) {
      // User might already exist
    }
  }

  console.log('👨‍👩‍👧‍👦 Seeding teams...');
  const teams = [
    {
      id: 'TM-DEMO01',
      pin: '123456',
      name: 'Green Sparks',
      schoolName: 'Springfield High',
      memberNames: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'TM-DEMO02',
      pin: '654321',
      name: 'Tech Pioneers',
      schoolName: 'Springfield High',
      memberNames: ['David Wilson', 'Emma Brown'],
      createdAt: new Date().toISOString(),
    },
  ];

  for (const team of teams) {
    try {
      await createTeam(team as any);
    } catch (e) {
      // Team might already exist
    }
  }

  console.log('💡 Seeding ideas...');
  for (const idea of MOCK_IDEAS) {
    try {
      await createIdea({
        ...idea,
        lastUpdated: createDate(Math.floor(Math.random() * 10)),
      });
    } catch (e) {
      // Idea might already exist
    }
  }

  console.log('✅ Database seeded successfully!');
}

seedDatabase().catch(console.error);
