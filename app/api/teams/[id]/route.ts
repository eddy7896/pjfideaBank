import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';
import { hashPassword } from '@/lib/auth-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;

    const existing = await prisma.studentTeam.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const canDelete =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName);
    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.studentTeam.delete({ where: { id } });

    await audit(request, user, {
      action: 'team.delete',
      entityType: 'StudentTeam',
      entityId: id,
      schoolName: existing.schoolName,
      payload: { name: existing.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete team:', error);
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;

    const existing = await prisma.studentTeam.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const rawPin = Math.floor(100000 + Math.random() * 900000).toString();
    const pinHash = await hashPassword(rawPin);

    const updated = await prisma.$transaction(async (tx) => {
      // Delete existing members
      await tx.teamMember.deleteMany({ where: { studentTeamId: id } });

      // Update team details, PIN, and recreate members
      return await tx.studentTeam.update({
        where: { id },
        data: {
          name: data.name,
          pin: pinHash,
          members: data.members ? {
            create: data.members.map((m: any) => ({
              name: m.name,
              grade: m.grade,
              contactNumber: m.contactNumber,
              gender: m.gender,
            })),
          } : undefined,
        },
        include: { members: true },
      });
    });

    await audit(request, user, {
      action: 'team.edit',
      entityType: 'StudentTeam',
      entityId: id,
      schoolName: existing.schoolName,
      payload: { name: updated.name, memberCount: (data.members ?? []).length },
    });

    // Return the team object with the raw PIN exactly once so the teacher can copy it
    return NextResponse.json({ ...updated, pin: rawPin });
  } catch (error) {
    console.error('Failed to edit team:', error);
    return NextResponse.json({ error: 'Failed to edit team' }, { status: 500 });
  }
}
