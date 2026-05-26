import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nextStage, stageData } = await request.json();

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

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
