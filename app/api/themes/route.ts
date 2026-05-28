import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const CreateSchema = z.object({
  month: z.string().min(1).max(40),
  shortMonth: z.string().min(1).max(6),
  theme: z.string().min(1).max(120),
  description: z.string().max(400).optional(),
  icon: z.string().max(80).optional(),
  gradient: z.string().max(120).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;

  const themes = await prisma.theme.findMany({
    orderBy: [{ sortOrder: 'asc' }, { month: 'asc' }],
  });
  return NextResponse.json(themes);
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;
  if (user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const raw = await request.json();
  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await prisma.theme.create({ data: parsed.data });

  await audit(request, user, {
    action: 'theme.create',
    entityType: 'Theme',
    entityId: created.id,
    payload: { month: created.month, theme: created.theme },
  });

  return NextResponse.json(created, { status: 201 });
}
