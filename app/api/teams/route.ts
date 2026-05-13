import { NextRequest, NextResponse } from 'next/server';
import { getAllTeams, createTeam, getTeamsBySchool } from '@/lib/db/repositories';

// Helper to get current user from headers
function getCurrentUser(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  const schoolName = request.headers.get('x-user-school');

  if (!role) return null;
  return { role, schoolName };
}

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolName = request.nextUrl.searchParams.get('school');

    // Super admin can query any school
    if (user.role === 'super-admin') {
      if (schoolName) {
        const teams = await getTeamsBySchool(schoolName);
        return NextResponse.json(teams);
      }
      const teams = await getAllTeams();
      return NextResponse.json(teams);
    }

    // School can only see their own teams
    if (user.role === 'school') {
      // Prevent querying other school's teams
      if (schoolName && schoolName !== user.schoolName) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const teams = await getTeamsBySchool(user.schoolName!);
      return NextResponse.json(teams);
    }

    // Students and education-dept have no access
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('GET /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only school can create teams
    if (user.role !== 'school') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Ensure schoolName matches current user
    if (body.schoolName !== user.schoolName) {
      return NextResponse.json({ error: 'Forbidden: mismatched school' }, { status: 403 });
    }

    const team = await createTeam(body);
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('POST /api/teams error:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
