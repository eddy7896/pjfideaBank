import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { toStage, formData } = await request.json();
    const idea = await repos.getIdeaById(params.id);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    await repos.updateIdeaStageData(params.id, { [idea.status]: formData });
    await repos.updateIdeaStatus(params.id, toStage);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error advancing idea stage:', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
