import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const TIMELINE_TYPES = [
  'created',
  'stage_change',
  'form_submitted',
  'comment',
  'test_failed',
] as const;

const DT_STAGES = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] as const;

const BodySchema = z.object({
  type: z.enum(TIMELINE_TYPES),
  stage: z.enum(DT_STAGES).optional(),
  fromStage: z.enum(DT_STAGES).optional(),
  toStage: z.enum(DT_STAGES).optional(),
  content: z.string().max(2000).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  const { id } = await params;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 });

  // Scope: only owners/admins can read this timeline.
  const canView =
    user.role === 'super-admin' ||
    user.role === 'program-lead' ||
    (user.role === 'school' && idea.schoolName === user.schoolName) ||
    (user.role === 'student' && idea.teamId === user.teamId) ||
    user.role === 'sed-department' ||
    user.role === 'geography-lead' ||
    user.role === 'teacher-trainer';
  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const timeline = await prisma.timelineEvent.findMany({
    where: { ideaId: id },
    orderBy: { timestamp: 'desc' },
  });
  return NextResponse.json(timeline);
}

export async function POST(
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

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canPost =
      user.role === 'super-admin' ||
      (user.role === 'school' && idea.schoolName === user.schoolName) ||
      (user.role === 'student' && idea.teamId === user.teamId);
    if (!canPost) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const event = await prisma.timelineEvent.create({
      data: {
        ideaId: id,
        type: parsed.data.type,
        stage: parsed.data.stage,
        fromStage: parsed.data.fromStage,
        toStage: parsed.data.toStage,
        content: parsed.data.content,
        author: user.displayName,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create timeline event:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}
