import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const PatchSchema = z
  .object({
    shortMonth: z.string().min(1).max(6).optional(),
    theme: z.string().min(1).max(120).optional(),
    description: z.string().max(400).optional(),
    icon: z.string().max(80).optional(),
    gradient: z.string().max(120).optional(),
    sortOrder: z.number().int().min(0).max(999).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'No fields supplied' });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;
  if (user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { month } = await params;
  const raw = await request.json();
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.theme
    .update({ where: { month: decodeURIComponent(month) }, data: parsed.data })
    .catch(() => null);
  if (!updated) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  await audit(request, user, {
    action: 'theme.update',
    entityType: 'Theme',
    entityId: updated.id,
    payload: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;
  if (user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { month } = await params;
  const existing = await prisma.theme
    .delete({ where: { month: decodeURIComponent(month) } })
    .catch(() => null);
  if (!existing) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  await audit(request, user, {
    action: 'theme.delete',
    entityType: 'Theme',
    entityId: existing.id,
    payload: { month: existing.month },
  });

  return NextResponse.json({ success: true });
}
