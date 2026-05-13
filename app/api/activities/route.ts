import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get('month');
    const year = request.nextUrl.searchParams.get('year');

    const activities = await repos.getThemeActivities(
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined
    );
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const activity = await request.json();
    const result = await repos.createThemeActivity(activity);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
