import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const DT_STAGES = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] as const;

const BodySchema = z.object({
  // Client historically called this `toStage` while the previous server
  // expected `nextStage`. Accept both, prefer `toStage`.
  toStage: z.enum(DT_STAGES).optional(),
  nextStage: z.enum(DT_STAGES).optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
  stageData: z.record(z.string(), z.unknown()).optional(),
});

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

    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName) ||
      (user.role === 'student' && idea.teamId === user.teamId);
    if (!canEdit) {
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
    const nowIso = new Date().toISOString();
    const today = nowIso.split('T')[0];
    const author = user.displayName;

    // Persist stage advance + form documentation + 2 timeline events atomically.
    const updated = await prisma.$transaction(async (tx) => {
      const idea2 = await tx.idea.update({
        where: { id },
        data: {
          status: toStage,
          lastUpdated: today,
          stageData: {
            ...currentStageData,
            [fromStage]: submittedData,
          },
        },
      });

      await tx.timelineEvent.create({
        data: {
          id: crypto.randomUUID(),
          ideaId: id,
          type: 'form_submitted',
          stage: fromStage,
          content: `${fromStage} documentation submitted`,
          author,
          timestamp: nowIso,
        },
      });

      await tx.timelineEvent.create({
        data: {
          id: crypto.randomUUID(),
          ideaId: id,
          type: 'stage_change',
          fromStage,
          toStage,
          content: `Moved to ${toStage}`,
          author,
          timestamp: nowIso,
        },
      });

      return tx.idea.findUnique({
        where: { id: idea2.id },
        include: { timeline: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to advance stage:', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
