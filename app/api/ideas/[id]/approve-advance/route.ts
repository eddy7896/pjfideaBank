import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const DT_STAGES = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] as const;

/**
 * Approve the most recent pending `advance_requested` event for this idea.
 * A request is considered pending when no later `advance_approved` or
 * `advance_rejected` event has been recorded with the same toStage.
 */
export async function POST(
  _request: NextRequest,
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

    const canApprove =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName);
    if (!canApprove) {
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

    // Was it already resolved?
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

    const fromStage = latestRequest.fromStage as (typeof DT_STAGES)[number] | null;
    const toStage = latestRequest.toStage as (typeof DT_STAGES)[number] | null;
    if (!fromStage || !toStage) {
      return NextResponse.json(
        { error: 'Malformed advance request' },
        { status: 400 }
      );
    }

    // Sanity: pending request must still match current status.
    if (idea.status !== fromStage) {
      return NextResponse.json(
        { error: `Idea already moved past ${fromStage}` },
        { status: 409 }
      );
    }

    const now = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      await tx.idea.update({
        where: { id },
        data: { status: toStage },
      });

      await tx.timelineEvent.create({
        data: {
          ideaId: id,
          type: 'advance_approved',
          fromStage,
          toStage,
          content: `Advance to ${toStage} approved`,
          author: user.displayName,
          timestamp: now,
        },
      });

      await tx.timelineEvent.create({
        data: {
          ideaId: id,
          type: 'stage_change',
          fromStage,
          toStage,
          content: `Moved to ${toStage}`,
          author: user.displayName,
          timestamp: now,
        },
      });

      return tx.idea.findUnique({
        where: { id },
        include: { timeline: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to approve advance:', error);
    return NextResponse.json({ error: 'Failed to approve advance' }, { status: 500 });
  }
}
