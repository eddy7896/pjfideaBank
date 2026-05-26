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

    let scopedWhere: any = {};
    if (role) {
      scopedWhere = applyRoleScoping({
        role,
        schoolName,
        teamId,
        geographyId,
        subGeographyId
      });
      // Adapt "teamId" scoping constraint to "id" for the StudentTeam model
      if (scopedWhere.teamId) {
        scopedWhere.id = scopedWhere.teamId;
        delete scopedWhere.teamId;
      }
    }

    const teams = await prisma.studentTeam.findMany({
      where: scopedWhere,
      include: { members: true },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const team = await prisma.studentTeam.create({
      data: {
        id: data.id,
        pin: data.pin,
        name: data.name,
        schoolName: data.schoolName,
        members: data.members ? {
          create: data.members.map((m: any) => ({
            id: m.id,
            name: m.name,
            grade: m.grade,
            contactNumber: m.contactNumber,
            gender: m.gender,
          })),
        } : undefined,
      },
      include: { members: true },
    });
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Failed to create team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
