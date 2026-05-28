import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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
import { audit } from '@/lib/audit';
import { rateLimit, ipFromRequest } from '@/lib/ratelimit';

// Self-registration is restricted to school admins and teacher trainers.
// `geography-lead` and `super-admin` accounts are minted by an existing
// super-admin via `/api/admin/users` — never via the open onboard form.
const OnboardSchema = z.object({
  role: z.enum(['school', 'teacher-trainer']).default('school'),
  schoolName: z.string().min(1).max(200).optional(),
  location: z.string().min(1).max(200).optional(),
  address: z.string().min(1).max(500).optional(),
  phone: z.string().min(1).max(40).optional(),
  website: z.string().url().max(500).optional().or(z.literal('')),
  principalName: z.string().min(1).max(200).optional(),
  udaiseCode: z.string().min(1).max(60).optional(),
  teacherName: z.string().min(1).max(200),
  teacherEmail: z.string().email().max(200),
  teacherPassword: z.string().min(8).max(200),
  assignedLeadId: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  // Ratelimit: 5 onboard attempts / hour per IP. Without this, anyone
  // could spam-create school + teacher accounts.
  const ip = ipFromRequest(request);
  const rl = rateLimit(`onboard:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: 'Too many onboarding attempts, try again later' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = OnboardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const {
      role,
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
      assignedLeadId,
    } = parsed.data;

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

      // Audit fix #18: schools without a sub-geography are invisible to
      // geography-leads and SED department scoping rules. Force the
      // onboard form to supply a district so every school is routable.
      if (!subGeographyId) {
        return NextResponse.json(
          {
            message:
              'District (sub-geography) is required. Location must be supplied as "<District>, <State>".',
          },
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

      // Create school + admin user atomically. Earlier deploys minted the
      // school row but lost the user row when the second statement crashed
      // (e.g. duplicate email surfaced after a partial submit retry),
      // leaving an orphan school nobody could log into.
      const school = await prisma.$transaction(async (tx) => {
        const created = await tx.school.create({
          data: {
            id: `SCH-${Date.now()}`,
            name: schoolName!,
            location: location!,
            subGeographyId,
            address: address!,
            phone: phone!,
            website: website || null,
            principalName: principalName!,
            udaiseCode: udaiseCode!,
            createdBy: teacherEmail,
          },
        });

        await tx.user.create({
          data: {
            role: 'school',
            schoolName: schoolName!,
            schoolId: created.id,
            displayName: teacherName,
            email: teacherEmail.toLowerCase(),
            geographyId,
            subGeographyId,
            passwordHash: hashedPassword,
          },
        });

        return created;
      });


      await audit(request, null, {
        action: 'onboard.school',
        entityType: 'School',
        entityId: school.id,
        schoolName: schoolName!,
        payload: { teacherEmail, udaiseCode, location },
      });

      return NextResponse.json(
        { message: 'School onboarded successfully', school },
        { status: 201 }
      );
    }

    if (role === 'teacher-trainer') {
      // A teacher trainer must explicitly attach to an existing
      // geography-lead account. The form picks one from
      // `/api/auth/geography-leads`; verify the choice here.
      if (!assignedLeadId) {
        return NextResponse.json(
          { message: 'Select your Geography Lead before submitting' },
          { status: 400 }
        );
      }
      const lead = await prisma.user.findFirst({
        where: { email: assignedLeadId.toLowerCase(), role: 'geography-lead' },
        select: { id: true, geographyId: true },
      });
      if (!lead) {
        return NextResponse.json(
          { message: 'Selected Geography Lead does not exist' },
          { status: 400 }
        );
      }

      // Inherit the lead's geography. The trainer's sub-geography is
      // optional and comes from the location string if supplied.
      await createUser({
        role: 'teacher-trainer',
        displayName: teacherName,
        email: teacherEmail,
        geographyId: lead.geographyId ?? geographyId,
        subGeographyId,
        assignedLeadId: assignedLeadId.toLowerCase(),
        passwordHash: hashedPassword,
      });

      await audit(request, null, {
        action: 'onboard.teacher-trainer',
        entityType: 'User',
        payload: {
          teacherEmail,
          assignedLeadId: assignedLeadId.toLowerCase(),
          geographyId: lead.geographyId ?? geographyId,
          subGeographyId,
        },
      });

      return NextResponse.json(
        { message: 'Teacher Trainer onboarded successfully' },
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
