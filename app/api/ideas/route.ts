import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function GET() {
  try {
    const ideas = await repos.getAllIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const idea = await request.json();
    const result = await repos.createIdea(idea);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
