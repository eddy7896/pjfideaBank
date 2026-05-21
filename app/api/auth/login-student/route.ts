import { NextRequest, NextResponse } from 'next/server';
import { getTeamById } from '@/lib/db/repositories';

export async function POST(request: NextRequest) {
  try {
    const { teamId, pin } = await request.json();

    if (!teamId || !pin) {
      return NextResponse.json(
        { message: 'Team ID and PIN are required' },
        { status: 400 }
      );
    }

    const team = await getTeamById(teamId);
    if (!team || team.pin !== pin) {
      return NextResponse.json(
        { message: 'Invalid Team ID or PIN' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        schoolName: team.schoolName,
        members: team.members,
        createdAt: team.createdAt,
      }
    });
  } catch (error) {
    console.error('POST /api/auth/login-student error:', error);
    return NextResponse.json(
      { message: 'Internal server error during student login' },
      { status: 500 }
    );
  }
}
