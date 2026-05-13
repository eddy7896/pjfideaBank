import { NextRequest, NextResponse } from 'next/server';
import { createSchool, getSchoolByName, getSchoolByUdaise, getUserByEmail, createUser } from '@/lib/db/repositories';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      schoolName,
      location,
      address,
      phone,
      website,
      principalName,
      udaiseCode,
      teacherName,
      teacherEmail,
      teacherPassword,
    } = body;

    // Validate inputs
    if (!schoolName || !location || !address || !phone || !principalName || !udaiseCode) {
      return NextResponse.json(
        { message: 'Missing required school fields' },
        { status: 400 }
      );
    }

    if (!teacherName || !teacherEmail || !teacherPassword) {
      return NextResponse.json(
        { message: 'Missing required teacher fields' },
        { status: 400 }
      );
    }

    // Check if school already exists
    const existingSchool = await getSchoolByName(schoolName);
    if (existingSchool) {
      return NextResponse.json(
        { message: 'School name already registered' },
        { status: 409 }
      );
    }

    const existingUdaise = await getSchoolByUdaise(udaiseCode);
    if (existingUdaise) {
      return NextResponse.json(
        { message: 'UDAISE code already registered' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(teacherEmail);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create school
    const school = await createSchool({
      name: schoolName,
      location,
      address,
      phone,
      website,
      principalName,
      udaiseCode,
      createdBy: teacherEmail,
    });

    // Create teacher user (in real app, hash password)
    await createUser({
      role: 'school',
      schoolName,
      displayName: teacherName,
      email: teacherEmail,
    });

    return NextResponse.json(
      { message: 'School onboarded successfully', school },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/auth/onboard error:', error);
    return NextResponse.json(
      { message: 'Onboarding failed' },
      { status: 500 }
    );
  }
}
