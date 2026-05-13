import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      include: { timeline: true },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const idea = await prisma.idea.create({
      data: {
        id: data.id,
        schoolName: data.schoolName,
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
  } finally {
    await prisma.$disconnect();
  }
}
