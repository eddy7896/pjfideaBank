import { NextRequest, NextResponse } from 'next/server';
import { getAllTeams, createTeam, getTeamsBySchool } from '@/lib/db/repositories';

export async function GET(request: NextRequest) {
  try {
    const schoolName = request.nextUrl.searchParams.get('school');

    if (schoolName) {
      const teams = await getTeamsBySchool(schoolName);
      return NextResponse.json(teams);
    }

    const teams = await getAllTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error('GET /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const team = await createTeam(body);
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('POST /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
