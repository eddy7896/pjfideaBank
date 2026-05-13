import { NextRequest, NextResponse } from 'next/server';
import * as repos from '@/lib/db/repositories';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await repos.deleteThemeActivity(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
