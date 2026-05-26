import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { applyIdeaScoping } from '@/lib/db/scoping';
import { requireSession } from '@/lib/auth/session';

const CreateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  theme: z.string().min(1),
  teamId: z.string().optional().nullable(),
  studentTeam: z.string().optional(),
  problemStatement: z.string().min(1),
  targetAudience: z.string().min(1),
  // server overrides — accepted but ignored
  schoolName: z.string().optional(),
  status: z.string().optional(),
  lastUpdated: z.string().optional(),
  stageData: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;

  try {
    const scopedWhere = applyIdeaScoping(gate.user);
    const ideas = await prisma.idea.findMany({
      where: scopedWhere,
      include: { timeline: true },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  if (user.role !== 'school' || !user.schoolName) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const raw = await request.json();
    const parsed = CreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // If a teamId is supplied, verify it belongs to this school. Block
    // cross-school team assignment.
    if (data.teamId) {
      const team = await prisma.studentTeam.findUnique({
        where: { id: data.teamId },
      });
      if (!team || team.schoolName !== user.schoolName) {
        return NextResponse.json(
          { error: 'Team does not belong to your school' },
          { status: 400 }
        );
      }
    }

    const todayIso = new Date().toISOString();
    const today = todayIso.split('T')[0];

    // Seed Empathize stage with the submit-form fields so users do not have
    // to retype the problem statement when they hit the Empathize gate.
    const stageData = {
      ...(data.stageData ?? {}),
      Empathize: {
        ...(((data.stageData ?? {}) as Record<string, any>).Empathize ?? {}),
        what: data.problemStatement,
        who: data.targetAudience,
      },
    };

    const idea = await prisma.$transaction(async (tx) => {
      const created = await tx.idea.create({
        data: {
          id: data.id,
          schoolName: user.schoolName!,
          title: data.title,
          theme: data.theme,
          teamId: data.teamId ?? null,
          studentTeam: data.studentTeam ?? '',
          problemStatement: data.problemStatement,
          targetAudience: data.targetAudience,
          status: 'Empathize',
          lastUpdated: today,
          stageData,
        },
      });

      await tx.timelineEvent.create({
        data: {
          id: crypto.randomUUID(),
          ideaId: created.id,
          type: 'created',
          content: 'Project created',
          author: user.displayName,
          timestamp: todayIso,
        },
      });

      return tx.idea.findUnique({
        where: { id: created.id },
        include: { timeline: true },
      });
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
