import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const schoolName = request.nextUrl.searchParams.get('schoolName');

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
  try {
    const data = await request.json();

    const report = await prisma.activityReport.create({
      data: {
        activityId: data.activityId,
        schoolName: data.schoolName,
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
        submittedBy: data.submittedBy,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity report:', error);
    return NextResponse.json({ error: 'Failed to create activity report' }, { status: 500 });
  }
}
