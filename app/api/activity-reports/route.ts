import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth/session';
import { audit } from '@/lib/audit';

const MaterialSchema = z.object({
  name: z.string().min(1),
  quantityUsed: z.number().nonnegative(),
  stockStatus: z.string(),
});

const CreateSchema = z.object({
  activityId: z.string().min(1),
  schoolName: z.string().optional(),
  teacherName: z.string().min(1),
  sessionDate: z.string().min(1),
  timeIn: z.string().min(1),
  timeOut: z.string().min(1),
  grades: z.string().min(1),
  totalStudents: z.number().int().nonnegative(),
  boysCount: z.number().int().nonnegative(),
  girlsCount: z.number().int().nonnegative(),
  lcmsCode: z.string().optional(),
  topicsLessons: z.string().min(1),
  learningGoal: z.string().min(1),
  materials: z.array(MaterialSchema),
  safetyBriefing: z.boolean(),
  ppeWorn: z.boolean(),
  labCleanup: z.boolean(),
  incidentNotes: z.string().optional(),
  studentEngagement: z.enum(['Low', 'Moderate', 'High']),
  successes: z.string().min(1),
  challenges: z.string().min(1),
  followUpActions: z.string().min(1),
  submittedBy: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  try {
    const requested = request.nextUrl.searchParams.get('schoolName') || undefined;

    // Schools may only fetch their own reports regardless of query param.
    let schoolName: string | undefined;
    if (user.role === 'super-admin' || user.role === 'program-lead') {
      schoolName = requested;
    } else if (user.role === 'school') {
      schoolName = user.schoolName ?? undefined;
    } else if (user.role === 'geography-lead' || user.role === 'teacher-trainer' || user.role === 'sed-department') {
      schoolName = requested;
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reports = await prisma.activityReport.findMany({
      where: schoolName ? { schoolName } : undefined,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch activity reports:', error);
    return NextResponse.json({ error: 'Failed to fetch activity reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireSession();
  if ('error' in gate) return gate.error;
  const { user } = gate;

  if (user.role !== 'school' || !user.schoolName) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    const report = await prisma.activityReport.create({
      data: {
        activityId: data.activityId,
        schoolName: user.schoolName, // server-bound
        teacherName: data.teacherName,
        sessionDate: data.sessionDate,
        timeIn: data.timeIn,
        timeOut: data.timeOut,
        grades: data.grades,
        totalStudents: data.totalStudents,
        boysCount: data.boysCount,
        girlsCount: data.girlsCount,
        lcmsCode: data.lcmsCode,
        topicsLessons: data.topicsLessons,
        learningGoal: data.learningGoal,
        materials: data.materials,
        safetyBriefing: data.safetyBriefing,
        ppeWorn: data.ppeWorn,
        labCleanup: data.labCleanup,
        incidentNotes: data.incidentNotes,
        studentEngagement: data.studentEngagement,
        successes: data.successes,
        challenges: data.challenges,
        followUpActions: data.followUpActions,
        submittedBy: user.displayName,
      },
    });

    await audit(request, user, {
      action: 'activity_report.create',
      entityType: 'ActivityReport',
      entityId: report.id,
      schoolName: user.schoolName,
      payload: { activityId: data.activityId, sessionDate: data.sessionDate },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity report:', error);
    return NextResponse.json({ error: 'Failed to create activity report' }, { status: 500 });
  }
}
