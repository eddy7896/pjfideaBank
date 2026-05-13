import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teams = await prisma.studentTeam.findMany({
      include: { members: true },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const team = await prisma.studentTeam.create({
      data: {
        id: data.id,
        pin: data.pin,
        name: data.name,
        schoolName: data.schoolName,
        members: data.members ? {
          create: data.members.map((m: any) => ({
            id: m.id,
            name: m.name,
            grade: m.grade,
            contactNumber: m.contactNumber,
            gender: m.gender,
          })),
        } : undefined,
      },
      include: { members: true },
    });
    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Failed to create team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
