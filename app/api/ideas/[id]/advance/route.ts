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
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName) ||
      (user.role === 'student' && idea.teamId === user.teamId);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { nextStage, stageData } = await request.json();

    const currentStageData = (idea.stageData as Record<string, any>) || {};
    const updated = await prisma.idea.update({
      where: { id },
      data: {
        status: nextStage,
        stageData: {
          ...currentStageData,
          [nextStage]: stageData,
        },
      },
      include: { timeline: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to advance stage:', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
