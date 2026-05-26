import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const { id } = await params;
    const existing = await prisma.themeActivity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const canDelete =
      user.role === 'super-admin' ||
      (user.role === 'school' && existing.schoolName === user.schoolName);
    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.themeActivity.delete({ where: { id } });

    await audit(request, user, {
      action: 'activity.delete',
      entityType: 'ThemeActivity',
      entityId: id,
      schoolName: existing.schoolName,
      payload: { title: existing.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
