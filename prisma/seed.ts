import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.timelineEvent.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.studentTeam.deleteMany();
  await prisma.themeActivity.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  // Create schools
  const schools = await Promise.all([
    prisma.school.create({
      data: {
        id: 'sch-1',
        name: 'Springfield High',
        location: 'Springfield',
        address: '123 Main St, Springfield',
        phone: '555-0101',
        website: 'https://springfield-high.edu',
        principalName: 'Dr. Elizabeth Hartford',
        udaiseCode: 'UDI-001',
      },
    }),
    prisma.school.create({
      data: {
        id: 'sch-2',
        name: 'Riverside Academy',
        location: 'Riverside',
        address: '456 River Rd, Riverside',
        phone: '555-0102',
        website: 'https://riverside-academy.edu',
        principalName: 'Mr. James Patterson',
        udaiseCode: 'UDI-002',
      },
    }),
    prisma.school.create({
      data: {
        id: 'sch-3',
        name: 'Oakwood School',
        location: 'Oakwood',
        address: '789 Oak Ave, Oakwood',
        phone: '555-0103',
        website: 'https://oakwood-school.edu',
        principalName: 'Ms. Sarah Chen',
        udaiseCode: 'UDI-003',
      },
    }),
    prisma.school.create({
      data: {
        id: 'sch-4',
        name: 'Maplewood Institute',
        location: 'Maplewood',
        address: '321 Maple Dr, Maplewood',
        phone: '555-0104',
        website: 'https://maplewood-institute.edu',
        principalName: 'Dr. Michael Rodriguez',
        udaiseCode: 'UDI-004',
      },
    }),
  ]);

  // Create users
  await prisma.user.create({
    data: {
      id: 1,
      role: 'super-admin',
      displayName: 'Admin User',
      email: 'admin@ideabank.edu',
      schoolName: null,
      teamId: null,
    },
  });

  // Create student teams with members
  const teams = await Promise.all([
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO01',
        pin: 'pin001',
        name: 'Green Sparks',
        schoolName: 'Springfield High',
        members: {
          create: [
            { id: 'mem-1', name: 'Alice Johnson', grade: '10', contactNumber: '555-1001', gender: 'Female' },
            { id: 'mem-2', name: 'Bob Smith', grade: '10', contactNumber: '555-1002', gender: 'Male' },
            { id: 'mem-3', name: 'Carol White', grade: '11', contactNumber: '555-1003', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO02',
        pin: 'pin002',
        name: 'Tech Pioneers',
        schoolName: 'Springfield High',
        members: {
          create: [
            { id: 'mem-4', name: 'David Brown', grade: '11', contactNumber: '555-1004', gender: 'Male' },
            { id: 'mem-5', name: 'Emma Davis', grade: '10', contactNumber: '555-1005', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO03',
        pin: 'pin003',
        name: 'Code Wizards',
        schoolName: 'Riverside Academy',
        members: {
          create: [
            { id: 'mem-6', name: 'Frank Miller', grade: '9', contactNumber: '555-1006', gender: 'Male' },
            { id: 'mem-7', name: 'Grace Lee', grade: '10', contactNumber: '555-1007', gender: 'Female' },
            { id: 'mem-8', name: 'Henry Taylor', grade: '9', contactNumber: '555-1008', gender: 'Male' },
            { id: 'mem-9', name: 'Iris Martinez', grade: '10', contactNumber: '555-1009', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO04',
        pin: 'pin004',
        name: 'SafeWalk Crew',
        schoolName: 'Oakwood School',
        members: {
          create: [
            { id: 'mem-10', name: 'Jack Wilson', grade: '8', contactNumber: '555-1010', gender: 'Male' },
            { id: 'mem-11', name: 'Karen Garcia', grade: '8', contactNumber: '555-1011', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO05',
        pin: 'pin005',
        name: 'MindMatters',
        schoolName: 'Maplewood Institute',
        members: {
          create: [
            { id: 'mem-12', name: 'Luke Anderson', grade: '11', contactNumber: '555-1012', gender: 'Male' },
            { id: 'mem-13', name: 'Maya Thompson', grade: '12', contactNumber: '555-1013', gender: 'Female' },
            { id: 'mem-14', name: 'Nathan Jackson', grade: '11', contactNumber: '555-1014', gender: 'Male' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO06',
        pin: 'pin006',
        name: 'AquaSavers',
        schoolName: 'Riverside Academy',
        members: {
          create: [
            { id: 'mem-15', name: 'Olivia White', grade: '10', contactNumber: '555-1015', gender: 'Female' },
            { id: 'mem-16', name: 'Peter Harris', grade: '9', contactNumber: '555-1016', gender: 'Male' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO07',
        pin: 'pin007',
        name: 'PixelPaint',
        schoolName: 'Oakwood School',
        members: {
          create: [
            { id: 'mem-17', name: 'Quinn Martin', grade: '11', contactNumber: '555-1017', gender: 'Female' },
            { id: 'mem-18', name: 'Rachel Clark', grade: '12', contactNumber: '555-1018', gender: 'Female' },
            { id: 'mem-19', name: 'Samuel Young', grade: '11', contactNumber: '555-1019', gender: 'Male' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO08',
        pin: 'pin008',
        name: 'VisionaryVR',
        schoolName: 'Maplewood Institute',
        members: {
          create: [
            { id: 'mem-20', name: 'Tina Nelson', grade: '10', contactNumber: '555-1020', gender: 'Female' },
            { id: 'mem-21', name: 'Uma Patel', grade: '11', contactNumber: '555-1021', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO09',
        pin: 'pin009',
        name: 'RouteOptimizers',
        schoolName: 'Springfield High',
        members: {
          create: [
            { id: 'mem-22', name: 'Victor Lopez', grade: '12', contactNumber: '555-1022', gender: 'Male' },
            { id: 'mem-23', name: 'Wendy King', grade: '11', contactNumber: '555-1023', gender: 'Female' },
            { id: 'mem-24', name: 'Xavier Scott', grade: '10', contactNumber: '555-1024', gender: 'Male' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO10',
        pin: 'pin010',
        name: 'EqualAccess',
        schoolName: 'Riverside Academy',
        members: {
          create: [
            { id: 'mem-25', name: 'Yara Green', grade: '9', contactNumber: '555-1025', gender: 'Female' },
            { id: 'mem-26', name: 'Zach Adams', grade: '10', contactNumber: '555-1026', gender: 'Male' },
            { id: 'mem-27', name: 'Amelia Bell', grade: '9', contactNumber: '555-1027', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO11',
        pin: 'pin011',
        name: 'OrbitLab',
        schoolName: 'Oakwood School',
        members: {
          create: [
            { id: 'mem-28', name: 'Benjamin Cox', grade: '12', contactNumber: '555-1028', gender: 'Male' },
            { id: 'mem-29', name: 'Chloe Edwards', grade: '11', contactNumber: '555-1029', gender: 'Female' },
          ],
        },
      },
      include: { members: true },
    }),
    prisma.studentTeam.create({
      data: {
        id: 'TM-DEMO12',
        pin: 'pin012',
        name: 'GoalGetters',
        schoolName: 'Maplewood Institute',
        members: {
          create: [
            { id: 'mem-30', name: 'Dylan Foster', grade: '10', contactNumber: '555-1030', gender: 'Male' },
            { id: 'mem-31', name: 'Elena Wright', grade: '11', contactNumber: '555-1031', gender: 'Female' },
            { id: 'mem-32', name: 'Finn Hayes', grade: '9', contactNumber: '555-1032', gender: 'Male' },
          ],
        },
      },
      include: { members: true },
    }),
  ]);

  // Create ideas
  const ideas = await Promise.all([
    prisma.idea.create({
      data: {
        id: '1',
        schoolName: 'Springfield High',
        title: 'Solar Powered Desk Lamps',
        theme: 'February: Sustainability',
        teamId: 'TM-DEMO01',
        studentTeam: 'Green Sparks',
        problemStatement: 'Classrooms lack natural light during winter months, forcing schools to rely on grid electricity. This increases energy costs and carbon footprint for under-funded schools.',
        targetAudience: 'Students and school administrators',
        status: 'Ideate',
        lastUpdated: '2026-05-01',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '2',
        schoolName: 'Riverside Academy',
        title: 'AI Homework Helper Chatbot',
        theme: 'March: EdTech',
        teamId: 'TM-DEMO03',
        studentTeam: 'Code Wizards',
        problemStatement: 'Students often struggle with homework after school hours when teachers are unavailable. A guided AI tutor could provide hints and explanations without giving away answers.',
        targetAudience: 'Middle school students (ages 11-14)',
        status: 'Prototype',
        lastUpdated: '2026-04-28',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '3',
        schoolName: 'Oakwood School',
        title: 'Neighborhood Safety Mapping App',
        theme: 'January: Local Problems',
        teamId: 'TM-DEMO04',
        studentTeam: 'SafeWalk Crew',
        problemStatement: 'Students walking to school face unsafe intersections and poorly lit areas. Parents need a community-sourced map of safe routes.',
        targetAudience: 'Parents and young students',
        status: 'Define',
        lastUpdated: '2026-04-25',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '4',
        schoolName: 'Maplewood Institute',
        title: 'Mental Health Check-In Kiosk',
        theme: 'April: Health',
        teamId: 'TM-DEMO05',
        studentTeam: 'MindMatters',
        problemStatement: 'Teens hesitate to seek mental health help due to stigma. An anonymous check-in kiosk in school lobbies can prompt self-assessment and connect students with resources.',
        targetAudience: 'High school students (ages 14-18)',
        status: 'Test',
        lastUpdated: '2026-05-03',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '5',
        schoolName: 'Springfield High',
        title: 'Community Skill-Share Platform',
        theme: 'May: Community',
        teamId: 'TM-DEMO02',
        studentTeam: 'Tech Pioneers',
        problemStatement: 'Local artisans and retirees have valuable skills but no platform to share them with younger generations. A matchmaking app could pair mentors with learners.',
        targetAudience: 'Community members of all ages',
        status: 'Empathize',
        lastUpdated: '2026-05-02',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '6',
        schoolName: 'Riverside Academy',
        title: 'Rainwater Harvesting Tracker',
        theme: 'June: Climate',
        teamId: 'TM-DEMO06',
        studentTeam: 'AquaSavers',
        problemStatement: 'Schools waste thousands of gallons of rainwater annually. A sensor-based tracking system can measure collection and distribution to school gardens.',
        targetAudience: 'School facility managers and eco-clubs',
        status: 'Ideate',
        lastUpdated: '2026-04-30',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '7',
        schoolName: 'Oakwood School',
        title: 'Interactive Mural Design Tool',
        theme: 'July: Arts',
        teamId: 'TM-DEMO07',
        studentTeam: 'PixelPaint',
        problemStatement: 'School walls are blank and uninspiring. An AR tool that lets students design and preview murals before painting would increase engagement and reduce wasted paint.',
        targetAudience: 'Art students and school councils',
        status: 'Prototype',
        lastUpdated: '2026-04-22',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '8',
        schoolName: 'Maplewood Institute',
        title: 'Future Careers VR Explorer',
        theme: 'August: Future of Work',
        teamId: 'TM-DEMO08',
        studentTeam: 'VisionaryVR',
        problemStatement: 'Students lack exposure to emerging careers in AI, biotech, and renewable energy. A VR experience simulating a day in these careers can inspire informed choices.',
        targetAudience: 'High school career counselors and students',
        status: 'Empathize',
        lastUpdated: '2026-05-04',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '9',
        schoolName: 'Springfield High',
        title: 'Smart School Bus Routing',
        theme: 'September: Transportation',
        teamId: 'TM-DEMO09',
        studentTeam: 'RouteOptimizers',
        problemStatement: 'School buses follow outdated fixed routes, wasting fuel and time. An algorithm-based routing system could reduce travel time by 30% and cut emissions.',
        targetAudience: 'School transport departments',
        status: 'Define',
        lastUpdated: '2026-04-27',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '10',
        schoolName: 'Riverside Academy',
        title: 'Accessibility Audit Toolkit',
        theme: 'October: Social Justice',
        teamId: 'TM-DEMO10',
        studentTeam: 'EqualAccess',
        problemStatement: 'Many public buildings fail to meet accessibility standards. A student-led audit toolkit with checklists and photo evidence can push for improvements.',
        targetAudience: 'Local government and disability advocates',
        status: 'Ideate',
        lastUpdated: '2026-04-29',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '11',
        schoolName: 'Oakwood School',
        title: 'Mini Satellite Weather Station',
        theme: 'November: Space',
        teamId: 'TM-DEMO11',
        studentTeam: 'OrbitLab',
        problemStatement: 'Rural areas lack accurate hyperlocal weather data. Student-built mini satellite ground stations can fill gaps left by national weather services.',
        targetAudience: 'Farmers and rural communities',
        status: 'Test',
        lastUpdated: '2026-05-01',
        stageData: {},
      },
    }),
    prisma.idea.create({
      data: {
        id: '12',
        schoolName: 'Maplewood Institute',
        title: 'SDG Progress Dashboard',
        theme: 'December: Global Goals',
        teamId: 'TM-DEMO12',
        studentTeam: 'GoalGetters',
        problemStatement: 'Students learn about the UN SDGs in theory but have no way to track local progress. A visual dashboard mapping community projects to SDGs can bridge this gap.',
        targetAudience: 'Teachers, students, and local NGOs',
        status: 'Empathize',
        lastUpdated: '2026-05-03',
        stageData: {},
      },
    }),
  ]);

  // Create theme activities
  await prisma.themeActivity.createMany({
    data: [
      {
        id: 'act-1',
        date: 5,
        month: 1,
        year: 2026,
        title: 'Local Problem Identification Workshop',
        theme: 'January: Local Problems',
        schoolName: 'Oakwood School',
        description: 'Students identify and discuss local problems in their community.',
      },
      {
        id: 'act-2',
        date: 12,
        month: 2,
        year: 2026,
        title: 'Sustainability Challenge',
        theme: 'February: Sustainability',
        schoolName: 'Springfield High',
        description: 'Design sustainable solutions for classroom energy usage.',
      },
      {
        id: 'act-3',
        date: 18,
        month: 3,
        year: 2026,
        title: 'EdTech Innovation Day',
        theme: 'March: EdTech',
        schoolName: 'Riverside Academy',
        description: 'Students explore and prototype educational technology solutions.',
      },
      {
        id: 'act-4',
        date: 9,
        month: 4,
        year: 2026,
        title: 'Health & Wellness Expo',
        theme: 'April: Health',
        schoolName: 'Maplewood Institute',
        description: 'Ideas for improving student mental and physical health.',
      },
      {
        id: 'act-5',
        date: 20,
        month: 5,
        year: 2026,
        title: 'Community Connection Forum',
        theme: 'May: Community',
        schoolName: 'Springfield High',
        description: 'Connecting students with community mentors and resources.',
      },
      {
        id: 'act-6',
        date: 15,
        month: 6,
        year: 2026,
        title: 'Climate Action Projects',
        theme: 'June: Climate',
        schoolName: 'Riverside Academy',
        description: 'Solutions for environmental sustainability and climate action.',
      },
      {
        id: 'act-7',
        date: 22,
        month: 7,
        year: 2026,
        title: 'Arts & Culture Showcase',
        theme: 'July: Arts',
        schoolName: 'Oakwood School',
        description: 'Student art and cultural expression projects.',
      },
      {
        id: 'act-8',
        date: 28,
        month: 8,
        year: 2026,
        title: 'Future Careers Conference',
        theme: 'August: Future of Work',
        schoolName: 'Maplewood Institute',
        description: 'Exploring emerging careers and future work opportunities.',
      },
      {
        id: 'act-9',
        date: 10,
        month: 9,
        year: 2026,
        title: 'Transportation Solutions Sprint',
        theme: 'September: Transportation',
        schoolName: 'Springfield High',
        description: 'Designing solutions for better school transportation.',
      },
      {
        id: 'act-10',
        date: 16,
        month: 10,
        year: 2026,
        title: 'Social Justice Awareness Week',
        theme: 'October: Social Justice',
        schoolName: 'Riverside Academy',
        description: 'Addressing accessibility and equity in public spaces.',
      },
      {
        id: 'act-11',
        date: 8,
        month: 11,
        year: 2026,
        title: 'Space & STEM Exploration',
        theme: 'November: Space',
        schoolName: 'Oakwood School',
        description: 'STEM projects exploring space and satellite technology.',
      },
      {
        id: 'act-12',
        date: 3,
        month: 12,
        year: 2026,
        title: 'UN SDG Goals Forum',
        theme: 'December: Global Goals',
        schoolName: 'Maplewood Institute',
        description: 'Mapping local projects to UN Sustainable Development Goals.',
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
