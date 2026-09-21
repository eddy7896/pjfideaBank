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
  id: z.string().optional(),
  activityId: z.string().min(1),
  schoolName: z.string().optional(),
  teacherName: z.string().optional(),
  sessionDate: z.string().optional(),
  timeIn: z.string().optional(),
  timeOut: z.string().optional(),
  grades: z.string().optional(),
  totalStudents: z.number().int().nonnegative().optional(),
  boysCount: z.number().int().nonnegative().optional(),
  girlsCount: z.number().int().nonnegative().optional(),
  lcmsCode: z.string().optional(),
  topicsLessons: z.string().optional(),
  learningGoal: z.string().optional(),
  materials: z.array(MaterialSchema).optional(),
  safetyBriefing: z.boolean().optional(),
  ppeWorn: z.boolean().optional(),
  labCleanup: z.boolean().optional(),
  incidentNotes: z.string().optional(),
  studentEngagement: z.enum(['Low', 'Moderate', 'High']).optional(),
  successes: z.string().optional(),
  challenges: z.string().optional(),
  followUpActions: z.string().optional(),
  outcome: z.string().optional(),
  ideasGenerated: z.number().int().nonnegative().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED']).default('SUBMITTED'),
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

    const payload = {
      activityId: data.activityId,
      schoolName: user.schoolName, // server-bound
      teacherName: data.teacherName || user.displayName || "",
      sessionDate: data.sessionDate || new Date().toISOString(),
      timeIn: data.timeIn || "",
      timeOut: data.timeOut || "",
      grades: data.grades || "",
      totalStudents: data.totalStudents || 0,
      boysCount: data.boysCount || 0,
      girlsCount: data.girlsCount || 0,
      lcmsCode: data.lcmsCode || "",
      topicsLessons: data.topicsLessons || "",
      learningGoal: data.learningGoal || "",
      materials: data.materials || [],
      safetyBriefing: data.safetyBriefing ?? false,
      ppeWorn: data.ppeWorn ?? false,
      labCleanup: data.labCleanup ?? false,
      incidentNotes: data.incidentNotes || "",
      studentEngagement: data.studentEngagement || "Moderate",
      successes: data.successes || "",
      challenges: data.challenges || "",
      followUpActions: data.followUpActions || "",
      outcome: data.outcome || "",
      ideasGenerated: data.ideasGenerated || 0,
      status: data.status,
      submittedBy: user.displayName || "",
    };

    let report;
    if (data.id) {
      // Ensure the report belongs to this school
      const existing = await prisma.activityReport.findUnique({ where: { id: data.id } });
      if (!existing || existing.schoolName !== user.schoolName) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      report = await prisma.activityReport.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      report = await prisma.activityReport.create({
        data: payload,
      });
    }

    await audit(request, user, {
      action: data.id ? 'activity_report.update' : 'activity_report.create',
      entityType: 'ActivityReport',
      entityId: report.id,
      schoolName: user.schoolName,
      payload: { activityId: data.activityId, sessionDate: data.sessionDate, status: data.status },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create/update activity report:', error);
    return NextResponse.json({ error: 'Failed to process activity report' }, { status: 500 });
  }
}
