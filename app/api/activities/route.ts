import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const activities = await prisma.themeActivity.findMany();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const activity = await prisma.themeActivity.create({
      data: {
        id: data.id || `act-${Date.now()}`,
        date: data.date,
        month: data.month,
        year: data.year,
        title: data.title,
        theme: data.theme,
        schoolName: data.schoolName,
        description: data.description,
      },
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
