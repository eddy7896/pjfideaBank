import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stageData = await request.json();
    await repos.updateIdeaStageData(id, stageData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating idea stage data:', error);
    return NextResponse.json({ error: 'Failed to update stage data' }, { status: 500 });
  }
}
