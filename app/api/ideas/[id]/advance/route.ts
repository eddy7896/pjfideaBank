import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { toStage, formData } = await request.json();
    const idea = await repos.getIdeaById(id);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    await repos.updateIdeaStageData(id, { [idea.status]: formData });
    await repos.updateIdeaStatus(id, toStage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error advancing idea stage:', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
