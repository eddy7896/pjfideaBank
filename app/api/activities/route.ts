import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const CreateSchema = z.object({
  id: z.string().optional(),
  date: z.number().int().min(1).max(31),
  month: z.number().int().min(0).max(11),
  year: z.number().int().min(2020).max(2100),
  title: z.string().min(1).max(200),
  theme: z.string().min(1).max(200),
  schoolName: z.string().optional().nullable(),
  description: z.string().max(2000).optional(),
});

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    let where: any = {};
    if (user.role === 'super-admin' || user.role === 'program-lead') {
      where = {};
    } else if (user.role === 'school') {
      where = { OR: [{ schoolName: null }, { schoolName: user.schoolName }] };
    } else if (user.role === 'geography-lead' || user.role === 'teacher-trainer' || user.role === 'sed-department') {
      let schoolGeoWhere: any = {};
      if (user.role === 'geography-lead') {
        if (user.subGeographyIds && user.subGeographyIds.length > 0) {
          schoolGeoWhere = { subGeographyId: { in: user.subGeographyIds } };
        } else {
          schoolGeoWhere = { subGeography: { geographyId: user.geographyId } };
        }
      } else if (user.role === 'teacher-trainer') {
        schoolGeoWhere = { subGeographyId: user.subGeographyId };
      } else if (user.role === 'sed-department') {
        schoolGeoWhere = { subGeography: { geographyId: user.geographyId } };
      }

      const schools = await prisma.school.findMany({
        where: schoolGeoWhere,
        select: { name: true },
      });
      const schoolNames = schools.map((s) => s.name);

      where = {
        OR: [
          { schoolName: null },
          { schoolName: { in: schoolNames } }
        ]
      };
    } else {
      where = { schoolName: null };
    }

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

  // Only super-admin (global activities) and school admins (own school) may create.
  if (user.role !== 'super-admin' && user.role !== 'school') {
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

    // School admins can only schedule against their own school. super-admins
    // may explicitly leave schoolName null (global) or set any school.
    let schoolName = data.schoolName ?? null;
    if (user.role === 'school') {
      schoolName = user.schoolName ?? null;
    }

    // Compute the authoritative `scheduledDate` alongside the legacy
    // triplet. The frontend still sends month as 0-indexed (JS Date
    // convention), so add 1 here when storing the 1-indexed legacy
    // value AND when constructing scheduledDate. Existing legacy rows
    // were already stored 1-indexed; new rows align with them.
    const monthOneIndexed = data.month + 1;
    const scheduledDate = new Date(Date.UTC(data.year, data.month, data.date));

    const activity = await prisma.themeActivity.create({
      data: {
        id: data.id || `act-${Date.now()}`,
        date: data.date,
        month: monthOneIndexed,
        year: data.year,
        scheduledDate,
        title: data.title,
        theme: data.theme,
        schoolName,
        description: data.description,
      },
    });

    await audit(request, user, {
      action: 'activity.create',
      entityType: 'ThemeActivity',
      entityId: activity.id,
      schoolName,
      payload: { title: data.title, theme: data.theme },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
