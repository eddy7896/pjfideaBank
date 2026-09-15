import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { createMockPrisma } from './helpers/mock-prisma';

const mockPrisma = createMockPrisma();
let mockSessionUser: any = null;

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));
vi.mock('@/lib/auth/session', () => ({
  requireSession: async () =>
    mockSessionUser
      ? { user: mockSessionUser }
      : { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) },
}));
vi.mock('@/lib/auth-utils', () => ({ hashPassword: vi.fn(async (pw: string) => `hashed:${pw}`) }));
vi.mock('@/lib/audit', () => ({ audit: vi.fn(async () => {}) }));
vi.mock('@/lib/ratelimit', () => ({
  rateLimit: vi.fn(() => ({ allowed: true, remaining: 99, resetAt: Date.now() + 1000 })),
  ipFromRequest: vi.fn(() => '127.0.0.1'),
}));

const { POST } = await import('@/app/api/ideas/route');

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/api/ideas', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any;
}

const schoolUser = { id: '2', role: 'school', displayName: 'Springfield Admin', schoolName: 'Springfield High' };
const staffUser = { id: '3', role: 'geography-lead', displayName: 'A GL', schoolName: null };
const studentUser = { id: '4', role: 'student', displayName: 'A Student', schoolName: null, teamId: 'TM-1' };

const validPayload = {
  id: 'idea-1',
  title: 'Solar Desk Lamps',
  theme: 'February: Sustainability',
  problemStatement: 'Classrooms lack light.',
  targetAudience: 'Students',
};

describe('POST /api/ideas — idea submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = null;
    mockPrisma.idea.findUnique.mockResolvedValue({ id: 'idea-1', timeline: [] });
  });

  it('rejects an unauthenticated request', async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(401);
  });

  it('rejects a student trying to submit a new idea', async () => {
    mockSessionUser = studentUser;
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(403);
  });

  it('rejects invalid payload (missing problem statement)', async () => {
    mockSessionUser = schoolUser;
    const { problemStatement, ...incomplete } = validPayload;
    const res = await POST(makeRequest(incomplete));
    expect(res.status).toBe(400);
  });

  it('rejects a teamId that belongs to a different school', async () => {
    mockSessionUser = schoolUser;
    mockPrisma.studentTeam.findUnique.mockResolvedValueOnce({ id: 'TM-1', schoolName: 'Riverside Academy', name: 'Other Team' });
    const res = await POST(makeRequest({ ...validPayload, teamId: 'TM-1' }));
    expect(res.status).toBe(400);
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('auto-provisions a student team and hands back its plaintext PIN exactly once, when the school submits with no team selected', async () => {
    mockSessionUser = schoolUser;
    mockPrisma.school.findUnique.mockResolvedValueOnce({ id: 'sch-1' });
    mockPrisma.studentTeam.create.mockResolvedValueOnce({ id: 'TM-SPR123', name: 'Solar Desk Lamps Team' });
    mockPrisma.idea.create.mockResolvedValueOnce({ id: 'idea-1' });

    const res = await POST(makeRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.autoTeam).toBeDefined();
    expect(body.autoTeam.id).toBe('TM-SPR123');
    expect(body.autoTeam.pin).toMatch(/^\d{6}$/);

    const teamCreateArgs = mockPrisma.studentTeam.create.mock.calls[0][0];
    expect(teamCreateArgs.data.type).toBe('student');
    expect(teamCreateArgs.data.schoolName).toBe('Springfield High');
    // The plaintext PIN is only ever handed back in the response - never
    // stored as-is, always hashed first.
    expect(teamCreateArgs.data.pin).toBe(`hashed:${body.autoTeam.pin}`);
  });

  it('uses the existing team and does not generate a PIN when teamId is supplied', async () => {
    mockSessionUser = schoolUser;
    mockPrisma.studentTeam.findUnique.mockResolvedValueOnce({ id: 'TM-1', schoolName: 'Springfield High', name: 'Green Sparks' });
    mockPrisma.school.findUnique.mockResolvedValueOnce({ id: 'sch-1' });
    mockPrisma.idea.create.mockResolvedValueOnce({ id: 'idea-1' });

    const res = await POST(makeRequest({ ...validPayload, teamId: 'TM-1' }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.autoTeam).toBeUndefined();
    expect(mockPrisma.studentTeam.create).not.toHaveBeenCalled();

    const ideaCreateArgs = mockPrisma.idea.create.mock.calls[0][0];
    expect(ideaCreateArgs.data.teamId).toBe('TM-1');
    expect(ideaCreateArgs.data.studentTeam).toBe('Green Sparks');
    expect(ideaCreateArgs.data.status).toBe('Empathize');
  });

  it('seeds the Empathize stage from the submit form so it is not re-typed', async () => {
    mockSessionUser = schoolUser;
    mockPrisma.school.findUnique.mockResolvedValueOnce({ id: 'sch-1' });
    mockPrisma.studentTeam.create.mockResolvedValueOnce({ id: 'TM-1', name: 'Team' });
    mockPrisma.idea.create.mockResolvedValueOnce({ id: 'idea-1' });

    await POST(makeRequest(validPayload));

    const ideaCreateArgs = mockPrisma.idea.create.mock.calls[0][0];
    expect(ideaCreateArgs.data.stageData.Empathize.what).toBe('Classrooms lack light.');
    expect(ideaCreateArgs.data.stageData.Empathize.who).toBe('Students');
  });

  it('routes a staff (geography-lead/teacher-trainer) submission to the Pi Jam Regional Office shell school, as a teacher-type team', async () => {
    mockSessionUser = staffUser;
    mockPrisma.school.findUnique.mockResolvedValueOnce(null); // office school doesn't exist yet
    mockPrisma.school.create.mockResolvedValueOnce({ id: 'sch-office' });
    mockPrisma.studentTeam.create.mockResolvedValueOnce({ id: 'TM-PIJ001', name: 'Team' });
    mockPrisma.idea.create.mockResolvedValueOnce({ id: 'idea-1' });

    const res = await POST(makeRequest(validPayload));

    expect(res.status).toBe(201);
    const schoolCreateArgs = mockPrisma.school.create.mock.calls[0][0];
    expect(schoolCreateArgs.data.name).toBe('Pi Jam Regional Office');

    const teamCreateArgs = mockPrisma.studentTeam.create.mock.calls[0][0];
    expect(teamCreateArgs.data.type).toBe('teacher');

    const ideaCreateArgs = mockPrisma.idea.create.mock.calls[0][0];
    expect(ideaCreateArgs.data.schoolName).toBe('Pi Jam Regional Office');
  });

  it('creates a "created" timeline event alongside the idea', async () => {
    mockSessionUser = schoolUser;
    mockPrisma.school.findUnique.mockResolvedValueOnce({ id: 'sch-1' });
    mockPrisma.studentTeam.create.mockResolvedValueOnce({ id: 'TM-1', name: 'Team' });
    mockPrisma.idea.create.mockResolvedValueOnce({ id: 'idea-1' });

    await POST(makeRequest(validPayload));

    expect(mockPrisma.timelineEvent.create).toHaveBeenCalledTimes(1);
    const eventArgs = mockPrisma.timelineEvent.create.mock.calls[0][0];
    expect(eventArgs.data.type).toBe('created');
    expect(eventArgs.data.ideaId).toBe('idea-1');
  });
});
