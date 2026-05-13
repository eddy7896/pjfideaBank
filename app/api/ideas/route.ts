import { NextRequest, NextResponse } from 'next/server';
import { getAllIdeas, createIdea } from '@/lib/db/repositories';

export async function GET() {
  try {
    const ideas = await getAllIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('GET /api/ideas error:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idea = await createIdea(body);
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('POST /api/ideas error:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
