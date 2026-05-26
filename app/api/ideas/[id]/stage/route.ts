import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName) ||
      (user.role === 'student' && existing.teamId === user.teamId);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { stageData } = await request.json();
    const updated = await prisma.idea.update({
      where: { id },
      data: { stageData },
      include: { timeline: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update stage data:', error);
    return NextResponse.json({ error: 'Failed to update stage data' }, { status: 500 });
  }
}
