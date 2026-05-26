import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const DT_STAGES = ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'] as const;

const BodySchema = z.object({
  stage: z.enum(DT_STAGES).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  // Back-compat: prior callers sent { stageData: { Empathize: {...} } } or
  // a single key like { Empathize: {...} }.
  stageData: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

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

    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName) ||
      (user.role === 'student' && existing.teamId === user.teamId);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Resolve patch shape into a per-stage merge map.
    let patch: Record<string, any> = {};
    if (parsed.data.stage && parsed.data.data) {
      patch = { [parsed.data.stage]: parsed.data.data };
    } else if (parsed.data.stageData) {
      patch = parsed.data.stageData as Record<string, any>;
    } else {
      // Treat unknown top-level keys that match a stage name as a stage map.
      const rawObj = raw as Record<string, any>;
      for (const k of DT_STAGES) {
        if (k in rawObj) patch[k] = rawObj[k];
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: 'No stage data supplied' },
        { status: 400 }
      );
    }

    const current = (existing.stageData as Record<string, any>) || {};
    const merged = { ...current, ...patch };

    const updated = await prisma.idea.update({
      where: { id },
      data: {
        stageData: merged,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      include: { timeline: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update stage data:', error);
    return NextResponse.json({ error: 'Failed to update stage data' }, { status: 500 });
  }
}
