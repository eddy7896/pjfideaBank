import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRoleScoping } from '@/lib/db/scoping';

export async function GET(request: NextRequest) {
  try {
    const role = request.headers.get('x-user-role');
    const schoolName = request.headers.get('x-user-school-name') || undefined;
    const teamId = request.headers.get('x-user-team-id') || undefined;
    const geographyId = request.headers.get('x-user-geography-id') || undefined;
    const subGeographyId = request.headers.get('x-user-sub-geography-id') || undefined;

    let scopedWhere = {};
    if (role) {
      scopedWhere = applyRoleScoping({
        role,
        schoolName,
        teamId,
        geographyId,
        subGeographyId
      });
    }

    const ideas = await prisma.idea.findMany({
      where: scopedWhere,
      include: { timeline: true },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const idea = await prisma.idea.create({
      data: {
        id: data.id,
        schoolName: data.schoolName,
        title: data.title,
        theme: data.theme,
        teamId: data.teamId,
        studentTeam: data.studentTeam,
        problemStatement: data.problemStatement,
        targetAudience: data.targetAudience,
        status: data.status,
        lastUpdated: data.lastUpdated,
        stageData: data.stageData || {},
      },
      include: { timeline: true },
    });
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
