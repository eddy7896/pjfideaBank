import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const updated = await prisma.idea.update({
      where: { id },
      data: { status },
      include: { timeline: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update idea status:', error);
    return NextResponse.json({ error: 'Failed to update idea status' }, { status: 500 });
  }
}
