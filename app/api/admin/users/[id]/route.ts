import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const PatchSchema = z
  .object({
    displayName: z.string().min(1).max(200).optional(),
    geographyId: z.string().optional().nullable(),
    subGeographyIds: z.array(z.string()).max(100).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'No fields supplied' });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user: actor } = gate;
  if (actor.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: numericId } });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const raw = await request.json();
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Sub-geo reassignment only valid for geography-lead and within the
  // target's state.
  if (data.subGeographyIds !== undefined) {
    if (target.role !== 'geography-lead') {
      return NextResponse.json(
        { error: 'Sub-geography assignment only applies to geography-lead' },
        { status: 400 }
      );
    }
    if (data.subGeographyIds.length) {
      const subs = await prisma.subGeography.findMany({
        where: { id: { in: data.subGeographyIds } },
        select: { id: true, geographyId: true },
      });
      if (subs.length !== data.subGeographyIds.length) {
        return NextResponse.json({ error: 'Unknown sub-geography ID' }, { status: 400 });
      }
      const targetGeoId = data.geographyId ?? target.geographyId;
      const wrongState = subs.find((s) => s.geographyId !== targetGeoId);
      if (wrongState) {
        return NextResponse.json(
          { error: 'Sub-geography does not belong to the lead\'s state' },
          { status: 400 }
        );
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: numericId },
      data: {
        displayName: data.displayName ?? undefined,
        geographyId: data.geographyId ?? undefined,
      },
    });

    if (data.subGeographyIds !== undefined) {
      await tx.userSubGeography.deleteMany({ where: { userId: numericId } });
      if (data.subGeographyIds.length) {
        await tx.userSubGeography.createMany({
          data: data.subGeographyIds.map((sid) => ({
            userId: numericId,
            subGeographyId: sid,
          })),
        });
      }
    }
  });

  await audit(request, actor, {
    action: 'admin.user.update',
    entityType: 'User',
    entityId: String(numericId),
    payload: data,
  });

  const fresh = await prisma.user.findUnique({
    where: { id: numericId },
    select: {
      id: true,
      role: true,
      displayName: true,
      email: true,
      geographyId: true,
      assignedSubGeos: {
        select: { subGeography: { select: { id: true, name: true } } },
      },
    },
  });

  return NextResponse.json(fresh);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user: actor } = gate;
  if (actor.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }

  // Block self-deletion to avoid lockout.
  if (String(actor.id) === String(numericId)) {
    return NextResponse.json(
      { error: 'Refusing to delete your own account' },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id: numericId } });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: numericId } });

  await audit(request, actor, {
    action: 'admin.user.delete',
    entityType: 'User',
    entityId: String(numericId),
    payload: { email: target.email, role: target.role },
  });

  return NextResponse.json({ success: true });
}
