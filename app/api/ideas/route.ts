import { NextRequest, NextResponse } from 'next/server';
import { getIdeasBySchool, getIdeasByTeam, getAllIdeas, createIdea } from '@/lib/db/repositories';

// Helper to get current user from headers (in real app, decode JWT or session)
function getCurrentUser(request: NextRequest) {
  const role = request.headers.get('x-user-role');
  const schoolName = request.headers.get('x-user-school');
  const teamId = request.headers.get('x-user-team');

  if (!role) return null;
  return { role, schoolName, teamId };
}

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let ideas: any[] = [];

    // Super admin sees all
    if (user.role === 'super-admin') {
      ideas = await getAllIdeas();
    }
    // School sees only their school's ideas
    else if (user.role === 'school' && user.schoolName) {
      ideas = await getIdeasBySchool(user.schoolName);
    }
    // Student sees only their team's ideas
    else if (user.role === 'student' && user.teamId) {
      ideas = await getIdeasByTeam(user.teamId);
    }
    // Education dept sees advanced stage only
    else if (user.role === 'education-dept') {
      const allIdeas = await getAllIdeas();
      ideas = allIdeas.filter((i) => i.status === 'Prototype' || i.status === 'Test');
    }

    return NextResponse.json(ideas);
  } catch (error) {
    console.error('GET /api/ideas error:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only school can create ideas
    if (user.role !== 'school') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Ensure schoolName matches current user
    if (body.schoolName !== user.schoolName) {
      return NextResponse.json({ error: 'Forbidden: mismatched school' }, { status: 403 });
    }

    const idea = await createIdea(body);
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('POST /api/ideas error:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
