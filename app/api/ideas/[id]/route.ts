import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';

const PatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  theme: z.string().min(1).optional(),
  problemStatement: z.string().min(1).optional(),
  targetAudience: z.string().min(1).optional(),
  teamId: z.string().nullable().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'No fields supplied' });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Only the owning school or super-admin may edit core idea fields.
    // Students do their own changes via /stage and /advance routes.
    const canEdit =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName);
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const raw = await request.json();
    const parsed = PatchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Lock the core fields once the idea has left Empathize. Schools should
    // not silently rewrite the brief while students are working on it.
    const mutatesCore =
      parsed.data.title !== undefined ||
      parsed.data.theme !== undefined ||
      parsed.data.problemStatement !== undefined ||
      parsed.data.targetAudience !== undefined;
    if (mutatesCore && existing.status !== 'Empathize') {
      return NextResponse.json(
        { error: 'Core fields can only be edited while in Empathize' },
        { status: 400 }
      );
    }

    // If reassigning to another team, verify it belongs to this school.
    if (parsed.data.teamId) {
      const team = await prisma.studentTeam.findUnique({
        where: { id: parsed.data.teamId },
      });
      if (!team || team.schoolName !== existing.schoolName) {
        return NextResponse.json(
          { error: 'Team does not belong to this school' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.idea.update({
      where: { id },
      data: parsed.data,
      include: { timeline: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update idea:', error);
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const existing = await prisma.idea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const canDelete =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName);
    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Timeline cascades via schema.prisma onDelete: Cascade.
    await prisma.idea.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete idea:', error);
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 });
  }
}
