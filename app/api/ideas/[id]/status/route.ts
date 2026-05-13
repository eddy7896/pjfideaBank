import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    await repos.updateIdeaStatus(params.id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating idea status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
