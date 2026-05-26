import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
