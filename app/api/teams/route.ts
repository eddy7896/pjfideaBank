import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyTeamScoping } from '@/lib/db/scoping';
import { requireSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth-utils';
import { audit } from '@/lib/audit';

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;

  try {
    const scopedWhere = applyTeamScoping(gate.user);
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
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  if (user.role !== 'school' || !user.schoolName) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();

    // Hash incoming PIN before persisting. Always store as scrypt hash.
    const rawPin = String(data.pin ?? '').trim();
    if (!/^\d{6}$/.test(rawPin)) {
      return NextResponse.json({ error: 'Invalid PIN format' }, { status: 400 });
    }
    const pinHash = await hashPassword(rawPin);

    const school = await prisma.school.findUnique({
      where: { name: user.schoolName },
      select: { id: true },
    });
    if (!school) {
      return NextResponse.json(
        { error: 'School record missing — contact support' },
        { status: 500 }
      );
    }

    const team = await prisma.studentTeam.create({
      data: {
        id: data.id,
        pin: pinHash,
        name: data.name,
        schoolName: user.schoolName,
        schoolId: school.id,
        type: data.type || "student",
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

    await audit(request, user, {
      action: 'team.create',
      entityType: 'StudentTeam',
      entityId: team.id,
      schoolName: user.schoolName,
      payload: { name: team.name, memberCount: (data.members ?? []).length },
    });

    // Return the *plaintext* PIN exactly once so the school admin can hand it
    // off to students. It is never persisted in cleartext.
    return NextResponse.json({ ...team, pin: rawPin }, { status: 201 });
  } catch (error) {
    console.error('Failed to create team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
