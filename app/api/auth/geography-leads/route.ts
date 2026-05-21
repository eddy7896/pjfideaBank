import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.user.findMany({
      where: { role: 'geography-lead' }
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('GET /api/auth/geography-leads error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch geography leads' },
      { status: 500 }
    );
  }
}
