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
vi.mock('@/lib/audit', () => ({ audit: vi.fn(async () => {}) }));

const { PATCH: advancePATCH } = await import('@/app/api/ideas/[id]/advance/route');
const { POST: approvePOST } = await import('@/app/api/ideas/[id]/approve-advance/route');
const { POST: rejectPOST } = await import('@/app/api/ideas/[id]/reject-advance/route');
const { PATCH: statusPATCH } = await import('@/app/api/ideas/[id]/status/route');

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/x', { method: 'PATCH', body: JSON.stringify(body) }) as any;
}
const params = () => Promise.resolve({ id: 'idea-1' });

const schoolAdmin = { id: '2', role: 'school', displayName: 'Springfield Admin', schoolName: 'Springfield High' };
const student = { id: '4', role: 'student', displayName: 'Green Sparks', schoolName: null, teamId: 'TM-1' };
const otherSchoolAdmin = { id: '5', role: 'school', displayName: 'Riverside Admin', schoolName: 'Riverside Academy' };
const superAdmin = { id: '1', role: 'super-admin', displayName: 'Faheem' };

const baseIdea = {
  id: 'idea-1',
  schoolName: 'Springfield High',
  teamId: 'TM-1',
  status: 'Empathize',
  stageData: {},
};

describe('PATCH /api/ideas/[id]/advance — team/idea progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = null;
    mockPrisma.idea.findUnique.mockResolvedValue({ ...baseIdea, timeline: [] });
  });

  it('rejects an idea owner from a different school', async () => {
    mockSessionUser = otherSchoolAdmin;
    const res = await advancePATCH(makeRequest({ toStage: 'Define', formData: { what: 'x' } }), { params: params() });
    expect(res.status).toBe(403);
  });

  it('rejects advancing to a non-adjacent stage', async () => {
    mockSessionUser = schoolAdmin;
    const res = await advancePATCH(makeRequest({ toStage: 'Prototype', formData: { what: 'x' } }), { params: params() });
    expect(res.status).toBe(400);
  });

  it('a student cannot move status directly - it only queues an advance_requested event', async () => {
    mockSessionUser = student;
    mockPrisma.idea.findUnique.mockResolvedValueOnce({ ...baseIdea, timeline: [] });

    const res = await advancePATCH(
      makeRequest({ toStage: 'Define', formData: { problemStatement: 'x' } }),
      { params: params() }
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pendingApproval).toEqual({ fromStage: 'Empathize', toStage: 'Define' });

    // Status itself must not move in the student path.
    const updateArgs = mockPrisma.idea.update.mock.calls[0][0];
    expect(updateArgs.data.status).toBeUndefined();

    const eventTypes = mockPrisma.timelineEvent.create.mock.calls.map((c: any) => c[0].data.type);
    expect(eventTypes).toEqual(['form_submitted', 'advance_requested']);
  });

  it('a school admin advances immediately - status moves in the same request', async () => {
    mockSessionUser = schoolAdmin;

    const res = await advancePATCH(
      makeRequest({ toStage: 'Define', formData: { problemStatement: 'x' } }),
      { params: params() }
    );

    expect(res.status).toBe(200);
    const updateArgs = mockPrisma.idea.update.mock.calls[0][0];
    expect(updateArgs.data.status).toBe('Define');

    const eventTypes = mockPrisma.timelineEvent.create.mock.calls.map((c: any) => c[0].data.type);
    expect(eventTypes).toEqual(['form_submitted', 'stage_change']);
  });

  it('super-admin can advance any school\'s idea immediately', async () => {
    mockSessionUser = superAdmin;
    const res = await advancePATCH(
      makeRequest({ toStage: 'Define', formData: { problemStatement: 'x' } }),
      { params: params() }
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.idea.update.mock.calls[0][0].data.status).toBe('Define');
  });
});

describe('POST /api/ideas/[id]/approve-advance — school approves a pending request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = schoolAdmin;
    mockPrisma.idea.findUnique.mockResolvedValue({ ...baseIdea, timeline: [] });
  });

  it('rejects when there is no pending advance request', async () => {
    mockPrisma.timelineEvent.findFirst.mockResolvedValueOnce(null);
    const res = await approvePOST(makeRequest({}), { params: params() });
    expect(res.status).toBe(400);
  });

  it('rejects an already-resolved request', async () => {
    const requestedAt = new Date('2026-01-01T10:00:00Z');
    mockPrisma.timelineEvent.findFirst
      .mockResolvedValueOnce({ fromStage: 'Empathize', toStage: 'Define', timestamp: requestedAt })
      .mockResolvedValueOnce({ id: 'resolved-1' }); // a later approved/rejected event exists
    const res = await approvePOST(makeRequest({}), { params: params() });
    expect(res.status).toBe(400);
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects when the idea has already moved past the requested fromStage', async () => {
    mockPrisma.idea.findUnique.mockResolvedValueOnce({ ...baseIdea, status: 'Ideate', timeline: [] });
    mockPrisma.timelineEvent.findFirst
      .mockResolvedValueOnce({ fromStage: 'Empathize', toStage: 'Define', timestamp: new Date() })
      .mockResolvedValueOnce(null);
    const res = await approvePOST(makeRequest({}), { params: params() });
    expect(res.status).toBe(409);
  });

  it('approves the pending request, moves status, and logs both advance_approved and stage_change', async () => {
    mockPrisma.timelineEvent.findFirst
      .mockResolvedValueOnce({ fromStage: 'Empathize', toStage: 'Define', timestamp: new Date() })
      .mockResolvedValueOnce(null);

    const res = await approvePOST(makeRequest({}), { params: params() });

    expect(res.status).toBe(200);
    expect(mockPrisma.idea.update.mock.calls[0][0].data.status).toBe('Define');
    const eventTypes = mockPrisma.timelineEvent.create.mock.calls.map((c: any) => c[0].data.type);
    expect(eventTypes).toEqual(['advance_approved', 'stage_change']);
  });

  it('rejects a school trying to approve a different school\'s idea', async () => {
    mockSessionUser = otherSchoolAdmin;
    const res = await approvePOST(makeRequest({}), { params: params() });
    expect(res.status).toBe(403);
  });
});

describe('POST /api/ideas/[id]/reject-advance — school rejects a pending request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = schoolAdmin;
    mockPrisma.idea.findUnique.mockResolvedValue({ ...baseIdea, timeline: [] });
  });

  it('rejects when there is no pending advance request', async () => {
    mockPrisma.timelineEvent.findFirst.mockResolvedValueOnce(null);
    const res = await rejectPOST(makeRequest({}), { params: params() });
    expect(res.status).toBe(400);
  });

  it('records an advance_rejected event with the given reason, and status does not move', async () => {
    mockPrisma.timelineEvent.findFirst
      .mockResolvedValueOnce({ fromStage: 'Empathize', toStage: 'Define', timestamp: new Date() })
      .mockResolvedValueOnce(null);
    mockPrisma.timelineEvent.create.mockResolvedValueOnce({ id: 'evt-1', type: 'advance_rejected' });

    const res = await rejectPOST(makeRequest({ reason: 'Needs more detail' }), { params: params() });

    expect(res.status).toBe(201);
    expect(mockPrisma.idea.update).not.toHaveBeenCalled();
    const eventArgs = mockPrisma.timelineEvent.create.mock.calls[0][0];
    expect(eventArgs.data.type).toBe('advance_rejected');
    expect(eventArgs.data.content).toContain('Needs more detail');
  });
});

describe('PATCH /api/ideas/[id]/status — direct status update (kanban drag)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = null;
    mockPrisma.idea.findUnique.mockResolvedValue({ ...baseIdea, timeline: [] });
  });

  it('rejects a school editing a different school\'s idea', async () => {
    mockSessionUser = otherSchoolAdmin;
    const res = await statusPATCH(makeRequest({ status: 'Define' }), { params: params() });
    expect(res.status).toBe(403);
  });

  it('lets the owning student team move the card', async () => {
    mockSessionUser = student;
    mockPrisma.idea.update.mockResolvedValueOnce({ ...baseIdea, status: 'Define', timeline: [] });

    const res = await statusPATCH(makeRequest({ status: 'Define' }), { params: params() });

    expect(res.status).toBe(200);
    expect(mockPrisma.idea.update.mock.calls[0][0].data.status).toBe('Define');
  });

  it('lets the owning school move the card', async () => {
    mockSessionUser = schoolAdmin;
    mockPrisma.idea.update.mockResolvedValueOnce({ ...baseIdea, status: 'Ideate', timeline: [] });

    const res = await statusPATCH(makeRequest({ status: 'Ideate' }), { params: params() });

    expect(res.status).toBe(200);
  });
});
