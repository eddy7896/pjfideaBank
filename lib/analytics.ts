import type { Idea, StudentTeam, User } from "@/types";

type SchoolGeoRef = {
  name: string;
  subGeography?: { geography?: { name: string } | null } | null;
};

export interface AnalyticsData {
  totalSchools: number;
  totalIdeas: number;
  totalStudents: number;
  totalTeams: number;

  ideasByStatus: Record<string, number>;
  studentsByGender: { Male: number; Female: number; "Non-binary": number; "Prefer not to say": number };
  studentsPerTeam: { teamId: string; teamName: string; count: number }[];
  ideasPerTeam: { teamId: string; teamName: string; count: number }[];
  ideasPerSchool: { schoolName: string; count: number }[];
  teamsPerSchool: { schoolName: string; count: number }[];
  genderRatio: number;
  ideasByTheme: { theme: string; count: number }[];
  designProgressionPath: { stage: string; ideasReached: number; percentage: number }[];
  gradeDistribution: { grade: string; count: number }[];
  teamSizeDistribution: { size: number; count: number }[];
  studentsByGrade: Record<string, number>;
}

export function computeAnalytics(
  ideas: Idea[],
  teams: StudentTeam[],
  users: User[]
): AnalyticsData {
  // Count schools
  const uniqueSchools = new Set(ideas.map((i) => i.schoolName));
  const totalSchools = uniqueSchools.size;

  // Count students by gender across teams
  const studentsByGender = {
    Male: 0,
    Female: 0,
    "Non-binary": 0,
    "Prefer not to say": 0,
  };

  const totalStudents = teams.reduce((acc, team) => {
    const members = team.members || [];
    members.forEach((member) => {
      studentsByGender[member.gender]++;
    });
    return acc + members.length;
  }, 0);

  const genderRatio =
    totalStudents > 0
      ? Math.round((studentsByGender.Female / totalStudents) * 100)
      : 0;

  // Ideas by status
  const ideasByStatus: Record<string, number> = {
    Empathize: 0,
    Define: 0,
    Ideate: 0,
    Prototype: 0,
    Test: 0,
  };
  ideas.forEach((idea) => {
    ideasByStatus[idea.status]++;
  });

  // Students per team
  const studentsPerTeam = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    count: (team.members || []).length,
  }));

  // Ideas per team
  const ideaCountByTeam: Record<string, number> = {};
  ideas.forEach((idea) => {
    if (idea.teamId) {
      ideaCountByTeam[idea.teamId] = (ideaCountByTeam[idea.teamId] || 0) + 1;
    }
  });

  const ideasPerTeam = teams
    .map((team) => ({
      teamId: team.id,
      teamName: team.name,
      count: ideaCountByTeam[team.id] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Ideas per school
  const ideaCountBySchool: Record<string, number> = {};
  ideas.forEach((idea) => {
    ideaCountBySchool[idea.schoolName] =
      (ideaCountBySchool[idea.schoolName] || 0) + 1;
  });

  const ideasPerSchool = Array.from(uniqueSchools)
    .map((school) => ({
      schoolName: school,
      count: ideaCountBySchool[school] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Teams per school
  const teamCountBySchool: Record<string, number> = {};
  teams.forEach((team) => {
    teamCountBySchool[team.schoolName] =
      (teamCountBySchool[team.schoolName] || 0) + 1;
  });

  const teamsPerSchool = Array.from(uniqueSchools)
    .map((school) => ({
      schoolName: school,
      count: teamCountBySchool[school] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Ideas by theme
  const ideaCountByTheme: Record<string, number> = {};
  ideas.forEach((idea) => {
    ideaCountByTheme[idea.theme] = (ideaCountByTheme[idea.theme] || 0) + 1;
  });

  const ideasByTheme = Object.entries(ideaCountByTheme)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);

  // Design thinking progression
  const designProgressionPath = [
    { stage: "Empathize", ideasReached: ideasByStatus.Empathize },
    { stage: "Define", ideasReached: ideasByStatus.Define },
    { stage: "Ideate", ideasReached: ideasByStatus.Ideate },
    { stage: "Prototype", ideasReached: ideasByStatus.Prototype },
    { stage: "Test", ideasReached: ideasByStatus.Test },
  ].map((item) => ({
    ...item,
    percentage: ideas.length > 0 ? Math.round((item.ideasReached / ideas.length) * 100) : 0,
  }));

  // Grade distribution from team members
  const studentsByGrade: Record<string, number> = {};
  teams.forEach((team) => {
    const members = team.members || [];
    members.forEach((member) => {
      studentsByGrade[member.grade] = (studentsByGrade[member.grade] || 0) + 1;
    });
  });

  const gradeDistribution = Object.entries(studentsByGrade)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => {
      const aNum = parseInt(a.grade);
      const bNum = parseInt(b.grade);
      return isNaN(aNum) || isNaN(bNum) ? a.grade.localeCompare(b.grade) : aNum - bNum;
    });

  // Team size distribution
  const teamSizeCounts: Record<number, number> = {};
  teams.forEach((team) => {
    const size = (team.members || []).length;
    teamSizeCounts[size] = (teamSizeCounts[size] || 0) + 1;
  });

  const teamSizeDistribution = Object.entries(teamSizeCounts)
    .map(([size, count]) => ({ size: parseInt(size), count }))
    .sort((a, b) => a.size - b.size);

  return {
    totalSchools,
    totalIdeas: ideas.length,
    totalStudents,
    totalTeams: teams.length,
    ideasByStatus,
    studentsByGender,
    studentsPerTeam,
    ideasPerTeam,
    ideasPerSchool,
    teamsPerSchool,
    genderRatio,
    ideasByTheme,
    designProgressionPath,
    gradeDistribution,
    teamSizeDistribution,
    studentsByGrade,
  };
}

/**
 * Real submission trend, bucketed by day from Idea.createdAt. Replaces any
 * placeholder/random trend data — every point here is an actual count.
 */
export function computeIdeasByDay(
  ideas: Idea[],
  days = 14
): { date: string; label: string; count: number }[] {
  const buckets: { date: string; label: string; count: number }[] = [];
  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * dayMs);
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: 0,
    });
  }

  const indexByDate = new Map(buckets.map((b, i) => [b.date, i]));
  for (const idea of ideas) {
    if (!idea.createdAt) continue;
    const key = idea.createdAt.slice(0, 10);
    const idx = indexByDate.get(key);
    if (idx !== undefined) buckets[idx].count++;
  }

  return buckets;
}

/**
 * Rolls ideas up from school -> district -> state, for roles whose domain
 * spans multiple states (super-admin, program-lead). Schools with no
 * resolved subGeography/geography are omitted rather than guessed at.
 */
export function computeIdeasByGeography(
  ideas: Idea[],
  schools: SchoolGeoRef[]
): { geographyName: string; count: number }[] {
  const schoolToState = new Map<string, string>();
  for (const school of schools) {
    const stateName = school.subGeography?.geography?.name;
    if (stateName) schoolToState.set(school.name, stateName);
  }

  const countByState: Record<string, number> = {};
  for (const idea of ideas) {
    const state = schoolToState.get(idea.schoolName);
    if (!state) continue;
    countByState[state] = (countByState[state] || 0) + 1;
  }

  return Object.entries(countByState)
    .map(([geographyName, count]) => ({ geographyName, count }))
    .sort((a, b) => b.count - a.count);
}
