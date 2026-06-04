import { prisma } from '../prisma';
import type { User, StudentTeam, Idea, TimelineEvent, School, ThemeActivity, Geography, SubGeography } from '@/types';

// SCHOOLS
export async function createSchool(school: Omit<School, 'id' | 'createdAt'>) {
  const id = `SCH-${Date.now()}`;
  return await prisma.school.create({
    data: {
      id,
      name: school.name,
      location: school.location,
      subGeographyId: school.subGeographyId,
      address: school.address,
      phone: school.phone,
      website: school.website,
      principalName: school.principalName,
      udaiseCode: school.udaiseCode,
      createdBy: school.createdBy,
    }
  });
}

export async function getSchoolByName(name: string) {
  return await prisma.school.findUnique({
    where: { name }
  });
}

export async function getSchoolByUdaise(udaiseCode: string) {
  return await prisma.school.findUnique({
    where: { udaiseCode }
  });
}

export async function getAllSchools() {
  return await prisma.school.findMany();
}

// USERS
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

export async function createUser(
  user: Omit<User, 'email'> & { email: string; assignedLeadUserId?: number | null }
) {
  // Dual-write schoolId FK alongside the legacy schoolName during the
  // additive cutover (Phase 3.2). When the user has no schoolName the
  // lookup is skipped.
  let schoolId: string | null = null;
  if (user.schoolName) {
    const s = await prisma.school.findUnique({
      where: { name: user.schoolName },
      select: { id: true },
    });
    schoolId = s?.id ?? null;
  }

  return await prisma.user.create({
    data: {
      role: user.role,
      schoolName: user.schoolName,
      schoolId,
      displayName: user.displayName,
      email: user.email,
      teamId: user.teamId,
      geographyId: user.geographyId,
      subGeographyId: user.subGeographyId,
      assignedLeadUserId: user.assignedLeadUserId ?? null,
      passwordHash: user.passwordHash,
    }
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

// STUDENT TEAMS
export async function createTeam(team: StudentTeam) {
  const school = await prisma.school.findUnique({
    where: { name: team.schoolName },
    select: { id: true },
  });
  if (!school) {
    throw new Error(`Cannot create team: school '${team.schoolName}' not found`);
  }

  return await prisma.studentTeam.create({
    data: {
      id: team.id,
      pin: team.pin,
      name: team.name,
      schoolName: team.schoolName,
      schoolId: school.id,
      type: team.type || "student",
      members: team.members ? {
        create: team.members.map((m: any) => ({
          id: m.id || crypto.randomUUID(),
          name: m.name,
          grade: m.grade,
          contactNumber: m.contactNumber,
          gender: m.gender,
        })),
      } : undefined,
    },
    include: { members: true },
  });
}

export async function getTeamById(id: string) {
  const result = await prisma.studentTeam.findUnique({
    where: { id },
    include: { members: true },
  });
  if (result) {
    return {
      ...result,
      members: result.members || [],
      createdAt: result.createdAt.toISOString(),
    } as unknown as StudentTeam;
  }
  return null;
}

export async function getTeamsBySchool(schoolName: string) {
  const results = await prisma.studentTeam.findMany({
    where: { schoolName },
    include: { members: true },
  });
  return results.map((t: any) => ({
    ...t,
    members: t.members || [],
    createdAt: t.createdAt.toISOString(),
  })) as unknown as StudentTeam[];
}

export async function getAllTeams() {
  const results = await prisma.studentTeam.findMany({
    include: { members: true },
  });
  return results.map((t: any) => ({
    ...t,
    members: t.members || [],
    createdAt: t.createdAt.toISOString(),
  })) as unknown as StudentTeam[];
}

export async function deleteTeam(id: string) {
  return await prisma.studentTeam.delete({
    where: { id }
  });
}

// IDEAS
export async function createIdea(idea: Idea) {
  const school = await prisma.school.findUnique({
    where: { name: idea.schoolName },
    select: { id: true },
  });
  if (!school) {
    throw new Error(`Cannot create idea: school '${idea.schoolName}' not found`);
  }

  return await prisma.idea.create({
    data: {
      id: idea.id,
      schoolName: idea.schoolName,
      schoolId: school.id,
      title: idea.title,
      theme: idea.theme,
      teamId: idea.teamId,
      studentTeam: idea.studentTeam,
      problemStatement: idea.problemStatement,
      targetAudience: idea.targetAudience,
      status: idea.status,
      lastUpdated: idea.lastUpdated,
      stageData: (idea.stageData as any) || {},
    }
  });
}

export async function getIdeaById(id: string) {
  const result = await prisma.idea.findUnique({
    where: { id },
    include: { timeline: true },
  });
  if (result) {
    return {
      ...result,
      stageData: result.stageData || {},
      timeline: result.timeline.map((e: any) => ({
        ...e,
        timestamp: e.timestamp,
      })),
      createdAt: result.createdAt.toISOString(),
    } as unknown as Idea;
  }
  return null;
}

export async function getIdeasBySchool(schoolName: string) {
  const results = await prisma.idea.findMany({
    where: { schoolName },
    include: { timeline: true },
  });
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData || {},
    timeline: i.timeline.map((e: any) => ({
      ...e,
      timestamp: e.timestamp,
    })),
    createdAt: i.createdAt.toISOString(),
  })) as unknown as Idea[];
}

export async function getIdeasByTeam(teamId: string) {
  const results = await prisma.idea.findMany({
    where: { teamId },
    include: { timeline: true },
  });
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData || {},
    timeline: i.timeline.map((e: any) => ({
      ...e,
      timestamp: e.timestamp,
    })),
    createdAt: i.createdAt.toISOString(),
  })) as unknown as Idea[];
}

export async function getAllIdeas() {
  const results = await prisma.idea.findMany({
    include: { timeline: true },
  });
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData || {},
    timeline: i.timeline.map((e: any) => ({
      ...e,
      timestamp: e.timestamp,
    })),
    createdAt: i.createdAt.toISOString(),
  })) as unknown as Idea[];
}

export async function updateIdeaStatus(id: string, status: string) {
  return await prisma.idea.update({
    where: { id },
    data: {
      status,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
  });
}

export async function updateIdeaStageData(id: string, stageData: any) {
  const idea = await getIdeaById(id);
  if (!idea) throw new Error('Idea not found');

  const currentStageData = (idea.stageData as any) || {};
  const updated = {
    ...currentStageData,
    ...stageData,
  };

  return await prisma.idea.update({
    where: { id },
    data: {
      stageData: updated,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
  });
}

export async function deleteIdea(id: string) {
  return await prisma.idea.delete({
    where: { id }
  });
}

// TIMELINE EVENTS
export async function createTimelineEvent(event: TimelineEvent) {
  return await prisma.timelineEvent.create({
    data: {
      id: event.id,
      ideaId: (event as any).ideaId || '',
      type: event.type,
      stage: event.stage,
      fromStage: event.fromStage,
      toStage: event.toStage,
      content: event.content,
      author: event.author,
      timestamp: event.timestamp,
    }
  });
}

export async function getTimelineByIdeaId(ideaId: string) {
  return await prisma.timelineEvent.findMany({
    where: { ideaId }
  });
}

export async function deleteTimelineEvent(id: string) {
  return await prisma.timelineEvent.delete({
    where: { id }
  });
}

// THEME ACTIVITIES
export async function createThemeActivity(activity: ThemeActivity) {
  return await prisma.themeActivity.create({
    data: {
      id: activity.id,
      scheduledDate: new Date(activity.scheduledDate),
      title: activity.title,
      theme: activity.theme,
      schoolName: activity.schoolName,
      description: activity.description,
    }
  });
}

export async function getThemeActivities(month?: number, year?: number) {
  let where: any = {};
  if (month !== undefined && year !== undefined) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    where = {
      scheduledDate: {
        gte: startDate,
        lt: endDate,
      }
    };
  } else if (year !== undefined) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));
    where = {
      scheduledDate: {
        gte: startDate,
        lt: endDate,
      }
    };
  }
  
  return await prisma.themeActivity.findMany({ where });
}

export async function deleteThemeActivity(id: string) {
  return await prisma.themeActivity.delete({
    where: { id }
  });
}

// GEOGRAPHIES
export async function createGeography(geo: { name: string; code: string }) {
  const id = `GEO-${Date.now()}`;
  const result = await prisma.geography.create({
    data: {
      id,
      name: geo.name,
      code: geo.code,
    }
  });

  // Trigger: Auto-generate an SED Login ID & credentials
  const stateCodeLower = geo.code.toLowerCase();
  const email = `sed.${stateCodeLower}@pijam.org`;
  const displayName = `SED ${geo.name} Observer`;
  
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    await createUser({
      role: 'sed-department',
      displayName,
      email,
      geographyId: id,
    });
  }

  return {
    ...result,
    createdAt: result.createdAt.toISOString(),
  } as unknown as Geography;
}

export async function createSubGeography(subGeo: { name: string; geographyId: string }) {
  const id = `SUBGEO-${Date.now()}`;
  const result = await prisma.subGeography.create({
    data: {
      id,
      name: subGeo.name,
      geographyId: subGeo.geographyId,
    }
  });
  return {
    ...result,
    createdAt: result.createdAt.toISOString(),
  } as unknown as SubGeography;
}

export async function getAllGeographies() {
  const results = await prisma.geography.findMany();
  return results.map((g: any) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  })) as unknown as Geography[];
}

export async function getSubGeographies(geographyId?: string) {
  const results = await prisma.subGeography.findMany({
    where: {
      geographyId: geographyId || undefined,
    }
  });
  return results.map((s: any) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
  })) as unknown as SubGeography[];
}

export async function getGeographyById(id: string) {
  const result = await prisma.geography.findUnique({
    where: { id }
  });
  if (result) {
    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
    } as unknown as Geography;
  }
  return null;
}

export async function getSubGeographyById(id: string) {
  const result = await prisma.subGeography.findUnique({
    where: { id }
  });
  if (result) {
    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
    } as unknown as SubGeography;
  }
  return null;
}

// Student Team Auto-generator Trigger
export async function autoGenerateStudentTeam(schoolName: string) {
  const prefix = schoolName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'TM');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const teamId = `TM-${prefix}${randomSuffix}`;
  
  // Generate secure 6-digit pin
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  
  const team: StudentTeam = {
    id: teamId,
    pin,
    name: `Team ${schoolName.split(' ')[0]} ${randomSuffix}`,
    schoolName,
    type: "student",
    members: [],
    createdAt: new Date().toISOString(),
  };

  await createTeam(team);
  return team;
}
