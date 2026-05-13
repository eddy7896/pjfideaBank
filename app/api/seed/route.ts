import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';
import { MOCK_IDEAS } from '@/lib/mock-data';

const MOCK_TEAMS = [
  {
    id: "TM-DEMO01",
    pin: "123456",
    name: "Green Sparks",
    schoolName: "Springfield High",
    members: [
      { name: "Alice Johnson", grade: "10", contactNumber: "555-0101", gender: "Female" as const },
      { name: "Bob Smith", grade: "10", contactNumber: "555-0102", gender: "Male" as const },
      { name: "Carol Davis", grade: "10", contactNumber: "555-0103", gender: "Female" as const },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "TM-DEMO02",
    pin: "654321",
    name: "Tech Pioneers",
    schoolName: "Springfield High",
    members: [
      { name: "David Wilson", grade: "11", contactNumber: "555-0104", gender: "Male" as const },
      { name: "Emma Brown", grade: "11", contactNumber: "555-0105", gender: "Female" as const },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "TM-DEMO03",
    pin: "111111",
    name: "Code Wizards",
    schoolName: "Riverside Academy",
    members: [
      { name: "Frank Miller", grade: "9", contactNumber: "555-0106", gender: "Male" as const },
      { name: "Grace Lee", grade: "9", contactNumber: "555-0107", gender: "Female" as const },
      { name: "Henry Zhang", grade: "9", contactNumber: "555-0108", gender: "Male" as const },
    ],
    createdAt: new Date().toISOString(),
  },
];

const MOCK_SCHOOLS = [
  {
    id: "SCH-001",
    name: "Springfield High",
    location: "Springfield",
    address: "123 Main St, Springfield",
    phone: "555-1234",
    website: "https://springfield-high.edu",
    principalName: "Dr. Seymour Skinner",
    udaiseCode: "UDAISE-001",
  },
  {
    id: "SCH-002",
    name: "Riverside Academy",
    location: "Riverside",
    address: "456 River Rd, Riverside",
    phone: "555-5678",
    website: "https://riverside-academy.edu",
    principalName: "Ms. Victoria Principal",
    udaiseCode: "UDAISE-002",
  },
  {
    id: "SCH-003",
    name: "Oakwood School",
    location: "Oakwood",
    address: "789 Oak Ave, Oakwood",
    phone: "555-9999",
    website: "https://oakwood-school.edu",
    principalName: "Mr. Robert Oak",
    udaiseCode: "UDAISE-003",
  },
];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer seed-token-pijam') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Seed schools
    for (const school of MOCK_SCHOOLS) {
      try {
        await repos.createSchool({
          name: school.name,
          location: school.location,
          address: school.address,
          phone: school.phone,
          website: school.website,
          principalName: school.principalName,
          udaiseCode: school.udaiseCode,
        });
      } catch (e) {
        // School might already exist
      }
    }

    // Seed teams
    for (const team of MOCK_TEAMS) {
      try {
        await repos.createTeam(team);
      } catch (e) {
        // Team might already exist
      }
    }

    // Seed ideas
    for (const idea of MOCK_IDEAS) {
      try {
        await repos.createIdea(idea);
      } catch (e) {
        // Idea might already exist
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
