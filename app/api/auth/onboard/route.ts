import { NextRequest, NextResponse } from 'next/server';
import { 
  createSchool, 
  getSchoolByName, 
  getSchoolByUdaise, 
  getUserByEmail, 
  createUser,
  createGeography,
  createSubGeography
} from '@/lib/db/repositories';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      role = 'school',
      schoolName,
      location, // "Pune, Maharashtra" or "Maharashtra"
      address,
      phone,
      website,
      principalName,
      udaiseCode,
      teacherName,
      teacherEmail,
      teacherPassword,
      assignedLeadId,
    } = body;

    // Common credentials validation
    if (!teacherName || !teacherEmail || !teacherPassword) {
      return NextResponse.json(
        { message: 'Missing required credentials fields' },
        { status: 400 }
      );
    }

    // Cryptographically hash the password before storing it
    const hashedPassword = await hashPassword(teacherPassword);


    // Check if email already exists
    const existingUser = await getUserByEmail(teacherEmail);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Resolve Geography and SubGeography IDs from location string
    let geographyId: string | undefined;
    let subGeographyId: string | undefined;

    if (location) {
      const parts = location.split(', ');
      const stateName = parts[parts.length - 1];
      const districtName = parts.length > 1 ? parts[0] : null;

      // 1. Geography Lookup / Auto-creation (Triggers auto-SED generation)
      let geoRecord = await prisma.geography.findUnique({
        where: { name: stateName }
      });
      if (!geoRecord) {
        const stateCode = stateName.slice(0, 2).toUpperCase();
        geoRecord = await createGeography({ name: stateName, code: stateCode }) as any;
      }
      geographyId = geoRecord!.id;

      // 2. SubGeography Lookup / Auto-creation
      if (districtName) {
        let subGeoRecord = await prisma.subGeography.findUnique({
          where: {
            name_geographyId: {
              name: districtName,
              geographyId: geographyId!
            }
          }
        });
        if (!subGeoRecord) {
          subGeoRecord = await createSubGeography({ name: districtName, geographyId: geographyId! }) as any;
        }
        subGeographyId = subGeoRecord!.id;
      }
    }

    if (role === 'school') {
      // Validate school inputs
      if (!schoolName || !location || !address || !phone || !principalName || !udaiseCode) {
        return NextResponse.json(
          { message: 'Missing required school fields' },
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

      // Create school
      const school = await createSchool({
        name: schoolName,
        location,
        subGeographyId,
        address,
        phone,
        website,
        principalName,
        udaiseCode,
        createdBy: teacherEmail,
      });

      // Create school admin user
      await createUser({
        role: 'school',
        schoolName,
        displayName: teacherName,
        email: teacherEmail,
        geographyId,
        subGeographyId,
        passwordHash: hashedPassword,
      });


      return NextResponse.json(
        { message: 'School onboarded successfully', school },
        { status: 201 }
      );
    } 
    
    if (role === 'teacher-trainer') {
      await createUser({
        role: 'teacher-trainer',
        displayName: teacherName,
        email: teacherEmail,
        geographyId,
        subGeographyId,
        assignedLeadId,
        passwordHash: hashedPassword,
      });


      return NextResponse.json(
        { message: 'Teacher Trainer onboarded successfully' },
        { status: 201 }
      );
    }

    if (role === 'geography-lead') {
      await createUser({
        role: 'geography-lead',
        displayName: teacherName,
        email: teacherEmail,
        geographyId,
        passwordHash: hashedPassword,
      });


      return NextResponse.json(
        { message: 'Geography Lead onboarded successfully' },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: 'Invalid role' },
      { status: 400 }
    );
  } catch (error) {
    console.error('POST /api/auth/onboard error:', error);
    return NextResponse.json(
      { message: 'Onboarding failed' },
      { status: 500 }
    );
  }
}
