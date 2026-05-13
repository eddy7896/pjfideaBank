import { eq } from 'drizzle-orm';
import { getDb } from './index';
import { schools, users, studentTeams, ideas, timelineEvents, themeActivities } from './schema';
import type { User, StudentTeam, Idea, TimelineEvent, School, ThemeActivity } from '@/types';

// SCHOOLS
export async function createSchool(school: Omit<School, 'id' | 'createdAt'>) {
  const db = getDb();
  const id = `SCH-${Date.now()}`;
  return await db.insert(schools).values({
    id,
    name: school.name,
    location: school.location,
    address: school.address,
    phone: school.phone,
    website: school.website,
    principalName: school.principalName,
    udaiseCode: school.udaiseCode,
    createdBy: school.createdBy,
  }).returning();
}

export async function getSchoolByName(name: string) {
  const db = getDb();
  const result = await db.select().from(schools).where(eq(schools.name, name));
  return result[0] || null;
}

export async function getSchoolByUdaise(udaiseCode: string) {
  const db = getDb();
  const result = await db.select().from(schools).where(eq(schools.udaiseCode, udaiseCode));
  return result[0] || null;
}

export async function getAllSchools() {
  const db = getDb();
  return await db.select().from(schools);
}

// USERS
export async function getUserByEmail(email: string) {
  const db = getDb();
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function createUser(user: Omit<User, 'email'> & { email: string }) {
  const db = getDb();
  return await db.insert(users).values({
    role: user.role,
    schoolName: user.schoolName,
    displayName: user.displayName,
    email: user.email,
    teamId: user.teamId,
  }).returning();
}

export async function getAllUsers() {
  const db = getDb();
  return await db.select().from(users);
}

// STUDENT TEAMS
export async function createTeam(team: StudentTeam) {
  const db = getDb();
  return await db.insert(studentTeams).values({
    id: team.id,
    pin: team.pin,
    name: team.name,
    schoolName: team.schoolName,
    members: JSON.stringify(team.members),
  }).returning();
}

export async function getTeamById(id: string) {
  const db = getDb();
  const result = await db.select().from(studentTeams).where(eq(studentTeams.id, id));
  if (result[0]) {
    return {
      ...result[0],
      members: result[0].members ? JSON.parse(result[0].members) : [],
    } as StudentTeam;
  }
  return null;
}

export async function getTeamsBySchool(schoolName: string) {
  const db = getDb();
  const results = await db.select().from(studentTeams).where(eq(studentTeams.schoolName, schoolName));
  return results.map((t: any) => ({
    ...t,
    members: t.members ? JSON.parse(t.members) : [],
  })) as StudentTeam[];
}

export async function getAllTeams() {
  const db = getDb();
  const results = await db.select().from(studentTeams);
  return results.map((t: any) => ({
    ...t,
    members: t.members ? JSON.parse(t.members) : [],
  })) as StudentTeam[];
}

export async function deleteTeam(id: string) {
  const db = getDb();
  return await db.delete(studentTeams).where(eq(studentTeams.id, id));
}

// IDEAS
export async function createIdea(idea: Idea) {
  const db = getDb();
  return await db.insert(ideas).values({
    id: idea.id,
    schoolName: idea.schoolName,
    title: idea.title,
    theme: idea.theme,
    teamId: idea.teamId,
    studentTeam: idea.studentTeam,
    problemStatement: idea.problemStatement,
    targetAudience: idea.targetAudience,
    status: idea.status,
    lastUpdated: idea.lastUpdated,
    stageData: JSON.stringify(idea.stageData),
  }).returning();
}

export async function getIdeaById(id: string) {
  const db = getDb();
  const result = await db.select().from(ideas).where(eq(ideas.id, id));
  if (result[0]) {
    return {
      ...result[0],
      stageData: result[0].stageData ? JSON.parse(result[0].stageData) : {},
      timeline: [],
    } as unknown as Idea;
  }
  return null;
}

export async function getIdeasBySchool(schoolName: string) {
  const db = getDb();
  const results = await db.select().from(ideas).where(eq(ideas.schoolName, schoolName));
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData ? JSON.parse(i.stageData) : {},
    timeline: [],
  })) as unknown as Idea[];
}

export async function getIdeasByTeam(teamId: string) {
  const db = getDb();
  const results = await db.select().from(ideas).where(eq(ideas.teamId, teamId));
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData ? JSON.parse(i.stageData) : {},
    timeline: [],
  })) as unknown as Idea[];
}

export async function getAllIdeas() {
  const db = getDb();
  const results = await db.select().from(ideas);
  return results.map((i: any) => ({
    ...i,
    stageData: i.stageData ? JSON.parse(i.stageData) : {},
    timeline: [],
  })) as unknown as Idea[];
}

export async function updateIdeaStatus(id: string, status: string) {
  const db = getDb();
  return await db.update(ideas)
    .set({ status, lastUpdated: new Date().toISOString().split('T')[0] })
    .where(eq(ideas.id, id))
    .returning();
}

export async function updateIdeaStageData(id: string, stageData: any) {
  const idea = await getIdeaById(id);
  if (!idea) throw new Error('Idea not found');

  const db = getDb();
  const updated = {
    ...idea.stageData,
    ...stageData,
  };

  return await db.update(ideas)
    .set({ stageData: JSON.stringify(updated), lastUpdated: new Date().toISOString().split('T')[0] })
    .where(eq(ideas.id, id))
    .returning();
}

export async function deleteIdea(id: string) {
  const db = getDb();
  return await db.delete(ideas).where(eq(ideas.id, id));
}

// TIMELINE EVENTS
export async function createTimelineEvent(event: TimelineEvent) {
  const db = getDb();
  return await db.insert(timelineEvents).values({
    id: event.id,
    ideaId: (event as any).ideaId || '',
    type: event.type,
    stage: event.stage,
    fromStage: event.fromStage,
    toStage: event.toStage,
    content: event.content,
    author: event.author,
    timestamp: event.timestamp,
  }).returning();
}

export async function getTimelineByIdeaId(ideaId: string) {
  const db = getDb();
  return await db.select().from(timelineEvents).where(eq(timelineEvents.ideaId, ideaId));
}

export async function deleteTimelineEvent(id: string) {
  const db = getDb();
  return await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
}

// THEME ACTIVITIES
export async function createThemeActivity(activity: ThemeActivity) {
  const db = getDb();
  return await db.insert(themeActivities).values({
    id: activity.id,
    date: activity.date,
    month: activity.month,
    year: activity.year,
    title: activity.title,
    theme: activity.theme,
    schoolName: activity.schoolName,
    description: activity.description,
  }).returning();
}

export async function getThemeActivities(month?: number, year?: number) {
  const db = getDb();
  if (month !== undefined && year !== undefined) {
    const results = await db.select().from(themeActivities)
      .where(
        month !== undefined ? eq(themeActivities.month, month) : undefined,
      );
    return results.filter((a: any) => a.year === year);
  }
  return await db.select().from(themeActivities);
}

export async function deleteThemeActivity(id: string) {
  const db = getDb();
  return await db.delete(themeActivities).where(eq(themeActivities.id, id));
}
