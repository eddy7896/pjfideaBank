import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  try {
    const idea = await request.json();
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
