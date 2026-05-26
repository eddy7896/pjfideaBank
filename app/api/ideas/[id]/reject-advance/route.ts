import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const BodySchema = z.object({
  reason: z.string().max(1000).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const raw = await request.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 });

    const canReject =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName);
    if (!canReject) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const latestRequest = await prisma.timelineEvent.findFirst({
      where: { ideaId: id, type: 'advance_requested' },
      orderBy: { timestamp: 'desc' },
    });
    if (!latestRequest) {
      return NextResponse.json(
        { error: 'No pending advance request' },
        { status: 400 }
      );
    }

    const resolution = await prisma.timelineEvent.findFirst({
      where: {
        ideaId: id,
        type: { in: ['advance_approved', 'advance_rejected'] },
        toStage: latestRequest.toStage ?? undefined,
        timestamp: { gt: latestRequest.timestamp },
      },
    });
    if (resolution) {
      return NextResponse.json(
        { error: 'Request already resolved' },
        { status: 400 }
      );
    }

    const event = await prisma.timelineEvent.create({
      data: {
        ideaId: id,
        type: 'advance_rejected',
        fromStage: latestRequest.fromStage,
        toStage: latestRequest.toStage,
        content: parsed.data.reason
          ? `Advance rejected: ${parsed.data.reason}`
          : 'Advance rejected',
        author: user.displayName,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to reject advance:', error);
    return NextResponse.json({ error: 'Failed to reject advance' }, { status: 500 });
  }
}
