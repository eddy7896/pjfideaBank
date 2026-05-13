import type { Idea, StudentTeam, User } from "@/types";

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
  genderRatio: number; // percentage female
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
    team.members.forEach((member) => {
      studentsByGender[member.gender]++;
    });
    return acc + team.members.length;
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
    count: team.members.length,
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
  };
}
