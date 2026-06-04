import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { applyIdeaScoping } from '@/lib/db/scoping';
import { requireSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth-utils';
import { audit } from '@/lib/audit';
import { rateLimit, ipFromRequest } from '@/lib/ratelimit';

const CreateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  theme: z.string().min(1),
  teamId: z.string().optional().nullable(),
  studentTeam: z.string().optional(),
  problemStatement: z.string().min(1),
  targetAudience: z.string().min(1),
  // server overrides — accepted but ignored
  schoolName: z.string().optional(),
  status: z.string().optional(),
  lastUpdated: z.string().optional(),
  stageData: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(_request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;

  try {
    const scopedWhere = applyIdeaScoping(gate.user);
    const ideas = await prisma.idea.findMany({
      where: scopedWhere,
      include: { timeline: true },
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  const isSchool = user.role === 'school' && !!user.schoolName;
  const isStaff = user.role === 'teacher-trainer' || user.role === 'geography-lead';

  if (!isSchool && !isStaff) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Per-school throttle: 30 idea submissions / hour.
  const ip = ipFromRequest(request);
  const rl = rateLimit(`ideas:create:${user.schoolName}:${ip}`, 30, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions, slow down' },
      { status: 429 }
    );
  }

  try {
    const raw = await request.json();
    const parsed = CreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // If a teamId is supplied, verify it belongs to this school. Block
    // cross-school team assignment.
    let teamId = data.teamId ?? null;
    let studentTeamName = data.studentTeam ?? '';
    let autoTeamPlaintextPin: string | null = null;

    if (teamId) {
      const team = await prisma.studentTeam.findUnique({
        where: { id: teamId },
      });
      if (!team || team.schoolName !== user.schoolName) {
        return NextResponse.json(
          { error: 'Team does not belong to your school' },
          { status: 400 }
        );
      }
      studentTeamName = team.name;
    }

    const now = new Date();

    // Seed Empathize stage with the submit-form fields so users do not have
    // to retype the problem statement when they hit the Empathize gate.
    const stageData = {
      ...(data.stageData ?? {}),
      Empathize: {
        ...(((data.stageData ?? {}) as Record<string, any>).Empathize ?? {}),
        what: data.problemStatement,
        who: data.targetAudience,
      },
    };

    let targetSchoolName = user.schoolName!;

    if (isStaff) {
      targetSchoolName = "Pi Jam Regional Office";
    }

    // School.id is the authoritative FK after Phase D. Resolve once and
    // require it for both StudentTeam.create and Idea.create.
    let school = await prisma.school.findUnique({
      where: { name: targetSchoolName },
      select: { id: true },
    });
    
    if (!school) {
      if (isStaff) {
        // Auto-provision the dummy school for staff if it doesn't exist
        school = await prisma.school.create({
          data: {
            id: `SCH-PIJAM-${Date.now()}`,
            name: targetSchoolName,
            location: "Regional Office",
            address: "Pi Jam Foundation",
            phone: "0000000000",
            principalName: "Pi Jam Admin",
            udaiseCode: "PIJAM-OFFICE-01",
            createdBy: "system",
          },
          select: { id: true }
        });
      } else {
        return NextResponse.json(
          { error: 'School record missing — contact support' },
          { status: 500 }
        );
      }
    }

    const idea = await prisma.$transaction(async (tx) => {
      // RBAC.md §2.5: when a school creates an idea without specifying a
      // team, auto-provision a student team so the kids have a login.
      if (!teamId) {
        const slug = targetSchoolName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'T');
        const suffix = Math.floor(100 + Math.random() * 900);
        const generatedTeamId = `TM-${slug}${suffix}`;
        const teamName = `${data.title} Team`;
        const pinPlain = String(Math.floor(100000 + Math.random() * 900000));
        const pinHash = await hashPassword(pinPlain);

        const created = await tx.studentTeam.create({
          data: {
            id: generatedTeamId,
            pin: pinHash,
            name: teamName,
            schoolName: targetSchoolName,
            schoolId: school.id,
            type: isStaff ? "teacher" : "student",
          },
        });
        teamId = created.id;
        studentTeamName = created.name;
        autoTeamPlaintextPin = pinPlain;
      }

      const created = await tx.idea.create({
        data: {
          id: data.id,
          schoolName: targetSchoolName,
          schoolId: school.id,
          title: data.title,
          theme: data.theme,
          teamId,
          studentTeam: studentTeamName,
          problemStatement: data.problemStatement,
          targetAudience: data.targetAudience,
          status: 'Empathize',
          stageData,
        },
      });

      await tx.timelineEvent.create({
        data: {
          ideaId: created.id,
          type: 'created',
          content: autoTeamPlaintextPin
            ? `Project created. Team ${teamId} auto-generated.`
            : 'Project created',
          author: user.displayName,
          timestamp: now,
        },
      });

      return tx.idea.findUnique({
        where: { id: created.id },
        include: { timeline: true },
      });
    });

    await audit(request, user, {
      action: 'idea.create',
      entityType: 'Idea',
      entityId: idea?.id,
      schoolName: targetSchoolName,
      payload: {
        title: data.title,
        theme: data.theme,
        teamId,
        autoTeamProvisioned: !!autoTeamPlaintextPin,
      },
    });

    // Hand the auto-generated PIN back to the caller exactly once. Never
    // persisted in cleartext.
    return NextResponse.json(
      { ...(idea ?? {}), autoTeam: autoTeamPlaintextPin ? { id: teamId, pin: autoTeamPlaintextPin, name: studentTeamName } : undefined },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create idea:', error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
