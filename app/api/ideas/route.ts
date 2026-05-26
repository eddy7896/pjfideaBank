import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyIdeaScoping } from '@/lib/db/scoping';
import { requireSession } from '@/lib/auth/session';

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

  // Only schools may submit a new idea. Server enforces school binding —
  // ignores any client-supplied schoolName.
  if (user.role !== 'school' || !user.schoolName) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const idea = await prisma.idea.create({
      data: {
        id: data.id,
        schoolName: user.schoolName,
        title: data.title,
        theme: data.theme,
        teamId: data.teamId,
        studentTeam: data.studentTeam,
        problemStatement: data.problemStatement,
        targetAudience: data.targetAudience,
        status: data.status,
        lastUpdated: data.lastUpdated,
        stageData: data.stageData || {},
      },
      include: { timeline: true },
    });
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
