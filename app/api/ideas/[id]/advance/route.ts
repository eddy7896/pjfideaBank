import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const DT_STAGES = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] as const;

const BodySchema = z.object({
  toStage: z.enum(DT_STAGES).optional(),
  nextStage: z.enum(DT_STAGES).optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
  stageData: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Stage advance handler with split-role semantics:
 *
 * - super-admin and school owners advance immediately. The status moves
 *   in the same transaction that writes the form_submitted + stage_change
 *   timeline events.
 *
 * - student owners cannot self-advance. Their submission records the
 *   form documentation under `stageData[fromStage]` and emits an
 *   `advance_requested` event. A school admin must call
 *   POST /api/ideas/:id/approve-advance to apply the transition.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const raw = await request.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const toStage = parsed.data.toStage ?? parsed.data.nextStage;
    const submittedData = parsed.data.formData ?? parsed.data.stageData;
    if (!toStage || !submittedData) {
      return NextResponse.json(
        { error: 'toStage and formData are required' },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canAdvance =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName);
    const isStudentOwner =
      user.role === 'student' && idea.teamId === user.teamId;
    if (!canAdvance && !isStudentOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fromStage = idea.status;
    const currentIdx = DT_STAGES.indexOf(fromStage as any);
    const nextIdx = DT_STAGES.indexOf(toStage);
    if (currentIdx < 0 || nextIdx !== currentIdx + 1) {
      return NextResponse.json(
        { error: `Cannot advance from ${fromStage} to ${toStage}` },
        { status: 400 }
      );
    }

    const currentStageData = (idea.stageData as Record<string, any>) || {};
    const now = new Date();
    const author = user.displayName;

    if (isStudentOwner) {
      // Student path: persist the stage doc + queue an advance_requested
      // event. Status does not move.
      const updated = await prisma.$transaction(async (tx) => {
        await tx.idea.update({
          where: { id },
          data: {
            stageData: {
              ...currentStageData,
              [fromStage]: submittedData,
            },
          },
        });

        await tx.timelineEvent.create({
          data: {
            ideaId: id,
            type: 'form_submitted',
            stage: fromStage,
            content: `${fromStage} documentation submitted`,
            author,
            timestamp: now,
          },
        });

        await tx.timelineEvent.create({
          data: {
            ideaId: id,
            type: 'advance_requested',
            fromStage,
            toStage,
            content: `Requested advance to ${toStage}`,
            author,
            timestamp: now,
          },
        });

        return tx.idea.findUnique({
          where: { id },
          include: { timeline: true },
        });
      });

      await audit(request, user, {
        action: 'idea.advance_requested',
        entityType: 'Idea',
        entityId: id,
        schoolName: idea.schoolName,
        payload: { fromStage, toStage },
      });

      return NextResponse.json({
        ...updated,
        pendingApproval: { fromStage, toStage },
      });
    }

    // School/super-admin path: apply transition immediately.
    const updated = await prisma.$transaction(async (tx) => {
      await tx.idea.update({
        where: { id },
        data: {
          status: toStage,
          stageData: {
            ...currentStageData,
            [fromStage]: submittedData,
          },
        },
      });

      await tx.timelineEvent.create({
        data: {
          ideaId: id,
          type: 'form_submitted',
          stage: fromStage,
          content: `${fromStage} documentation submitted`,
          author,
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
          author,
          timestamp: now,
        },
      });

      return tx.idea.findUnique({
        where: { id },
        include: { timeline: true },
      });
    });

    await audit(request, user, {
      action: 'idea.advance',
      entityType: 'Idea',
      entityId: id,
      schoolName: idea.schoolName,
      payload: { fromStage, toStage },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to advance stage:', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
