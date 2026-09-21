import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { applyActivityScoping } from '@/lib/db/scoping';
import { audit } from '@/lib/audit';

const CreateSchema = z.object({
  id: z.string().optional(),
  scheduledDate: z.string().datetime(),
  title: z.string().min(1).max(200),
  theme: z.string().min(1).max(200),
  schoolName: z.string().optional().nullable(),
  geographyId: z.string().optional().nullable(),
  subGeographyId: z.string().optional().nullable(),
  description: z.string().max(2000).optional(),
});

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const where = await applyActivityScoping(user);
    const activities = await prisma.themeActivity.findMany({ where });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  // Only super-admin, program-lead, and geography-lead may create activities.
  if (user.role !== 'super-admin' && user.role !== 'program-lead' && user.role !== 'geography-lead') {
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

    let geographyId = data.geographyId ?? null;
    let subGeographyId = data.subGeographyId ?? null;

    if (user.role === 'geography-lead') {
      geographyId = user.geographyId ?? null;
      // If they have multiple subGeographies, it's complex, but generally they create at geography level
      // or we just rely on what they selected if we want to restrict it further.
      // For now, enforce geographyId to their own territory.
    }

    const scheduledDate = new Date(data.scheduledDate);

    const activity = await prisma.themeActivity.create({
      data: {
        id: data.id || `act-${Date.now()}`,
        scheduledDate,
        title: data.title,
        theme: data.theme,
        schoolName: data.schoolName ?? null, // kept for legacy compat if needed
        geographyId,
        subGeographyId,
        description: data.description,
      },
    });

    await audit(request, user, {
      action: 'activity.create',
      entityType: 'ThemeActivity',
      entityId: activity.id,
      schoolName: data.schoolName ?? null,
      payload: { title: data.title, theme: data.theme, geographyId },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
