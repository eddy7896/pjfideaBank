import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/repositories';
import { verifyPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        role: user.role,
        displayName: user.displayName,
        email: user.email,
        schoolName: user.schoolName || undefined,
        teamId: user.teamId || undefined,
        geographyId: user.geographyId || undefined,
        subGeographyId: user.subGeographyId || undefined,
        assignedLeadId: user.assignedLeadId || undefined,
      }
    });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json(
      { message: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

