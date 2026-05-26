import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth-utils';
import { audit } from '@/lib/audit';

const CreateSchema = z
  .object({
    role: z.enum(['super-admin', 'geography-lead']),
    displayName: z.string().min(1).max(200),
    email: z.string().email().max(200),
    password: z.string().min(8).max(200),
    geographyId: z.string().optional(),
    subGeographyIds: z.array(z.string()).max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'geography-lead' && !data.geographyId) {
      ctx.addIssue({
        path: ['geographyId'],
        code: z.ZodIssueCode.custom,
        message: 'geographyId is required for geography-lead',
      });
    }
  });

const ListQuerySchema = z.object({
  role: z.enum(['super-admin', 'geography-lead', 'teacher-trainer']).optional(),
});

export async function GET(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  if (gate.user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = ListQuerySchema.safeParse({
    role: request.nextUrl.searchParams.get('role') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const users = await prisma.user.findMany({
    where: parsed.data.role ? { role: parsed.data.role } : undefined,
    select: {
      id: true,
      role: true,
      displayName: true,
      email: true,
      geographyId: true,
      subGeographyId: true,
      createdAt: true,
      createdById: true,
      geography: { select: { id: true, name: true, code: true } },
      assignedSubGeos: {
        select: {
          subGeography: {
            select: { id: true, name: true, geographyId: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user: actor } = gate;
  if (actor.role !== 'super-admin') {
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
  const data = parsed.data;

  // Email uniqueness
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  // For geography-lead: verify the geography exists + every sub-geo belongs to it.
  if (data.role === 'geography-lead') {
    const geo = await prisma.geography.findUnique({ where: { id: data.geographyId! } });
    if (!geo) {
      return NextResponse.json({ error: 'Geography not found' }, { status: 400 });
    }
    if (data.subGeographyIds?.length) {
      const subs = await prisma.subGeography.findMany({
        where: { id: { in: data.subGeographyIds } },
        select: { id: true, geographyId: true },
      });
      if (subs.length !== data.subGeographyIds.length) {
        return NextResponse.json({ error: 'Unknown sub-geography ID' }, { status: 400 });
      }
      const wrongState = subs.find((s) => s.geographyId !== data.geographyId);
      if (wrongState) {
        return NextResponse.json(
          { error: 'Sub-geography does not belong to the supplied state' },
          { status: 400 }
        );
      }
    }
  }

  const passwordHash = await hashPassword(data.password);
  const created = await prisma.user.create({
    data: {
      role: data.role,
      displayName: data.displayName,
      email: data.email.toLowerCase(),
      passwordHash,
      geographyId: data.role === 'geography-lead' ? data.geographyId : null,
      createdById: Number(actor.id),
      assignedSubGeos:
        data.role === 'geography-lead' && data.subGeographyIds?.length
          ? {
              create: data.subGeographyIds.map((sid) => ({ subGeographyId: sid })),
            }
          : undefined,
    },
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

  await audit(request, actor, {
    action: `admin.user.create.${data.role}`,
    entityType: 'User',
    entityId: String(created.id),
    payload: {
      email: data.email,
      geographyId: data.geographyId,
      subGeographyIds: data.subGeographyIds ?? [],
    },
  });

  return NextResponse.json(created, { status: 201 });
}
