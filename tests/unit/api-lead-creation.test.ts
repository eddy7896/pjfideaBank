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

vi.mock('@/lib/auth-utils', () => ({
  hashPassword: vi.fn(async (pw: string) => `hashed:${pw}`),
}));

vi.mock('@/lib/audit', () => ({ audit: vi.fn(async () => {}) }));

// Import after mocks are registered.
const { POST } = await import('@/app/api/admin/users/route');

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any;
}

const superAdmin = { id: '1', role: 'super-admin', displayName: 'Faheem', email: 'faheem@pijamideabank.com' };
const geoLeadActor = { id: '2', role: 'geography-lead', displayName: 'A GL' };

describe('POST /api/admin/users — lead creation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionUser = null;
  });

  it('rejects an unauthenticated request', async () => {
    mockSessionUser = null;
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it('rejects a non-super-admin actor even if authenticated', async () => {
    mockSessionUser = geoLeadActor;
    const res = await POST(
      makeRequest({ role: 'geography-lead', displayName: 'New Lead', email: 'lead@pijam.org', password: 'password123', geographyId: 'geo-1' })
    );
    expect(res.status).toBe(403);
  });

  it('rejects geography-lead creation missing a geographyId', async () => {
    mockSessionUser = superAdmin;
    const res = await POST(
      makeRequest({ role: 'geography-lead', displayName: 'New Lead', email: 'lead@pijam.org', password: 'password123' })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.issues.fieldErrors.geographyId).toBeDefined();
  });

  it('rejects a password shorter than 8 characters', async () => {
    mockSessionUser = superAdmin;
    const res = await POST(
      makeRequest({ role: 'program-lead', displayName: 'New Lead', email: 'lead@pijam.org', password: 'short' })
    );
    expect(res.status).toBe(400);
  });

  it('rejects when the email is already registered', async () => {
    mockSessionUser = superAdmin;
    mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 99, email: 'lead@pijam.org' });
    const res = await POST(
      makeRequest({ role: 'program-lead', displayName: 'New Lead', email: 'lead@pijam.org', password: 'password123' })
    );
    expect(res.status).toBe(409);
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects a geography-lead pointed at a geography that does not exist', async () => {
    mockSessionUser = superAdmin;
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.geography.findUnique.mockResolvedValueOnce(null);
    const res = await POST(
      makeRequest({
        role: 'geography-lead',
        displayName: 'New Lead',
        email: 'lead@pijam.org',
        password: 'password123',
        geographyId: 'geo-missing',
      })
    );
    expect(res.status).toBe(400);
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects a sub-geography that belongs to a different state', async () => {
    mockSessionUser = superAdmin;
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.geography.findUnique.mockResolvedValueOnce({ id: 'geo-1', name: 'Maharashtra' });
    mockPrisma.subGeography.findMany.mockResolvedValueOnce([
      { id: 'sub-1', geographyId: 'geo-OTHER' },
    ]);
    const res = await POST(
      makeRequest({
        role: 'geography-lead',
        displayName: 'New Lead',
        email: 'lead@pijam.org',
        password: 'password123',
        geographyId: 'geo-1',
        subGeographyIds: ['sub-1'],
      })
    );
    expect(res.status).toBe(400);
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('creates a geography-lead with valid sub-geographies, scoped to their state', async () => {
    mockSessionUser = superAdmin;
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.geography.findUnique.mockResolvedValueOnce({ id: 'geo-1', name: 'Maharashtra' });
    mockPrisma.subGeography.findMany.mockResolvedValueOnce([
      { id: 'sub-1', geographyId: 'geo-1' },
      { id: 'sub-2', geographyId: 'geo-1' },
    ]);
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 10,
      role: 'geography-lead',
      displayName: 'New Lead',
      email: 'lead@pijam.org',
      geographyId: 'geo-1',
      assignedSubGeos: [],
    });

    const res = await POST(
      makeRequest({
        role: 'geography-lead',
        displayName: 'New Lead',
        email: 'Lead@Pijam.org',
        password: 'password123',
        geographyId: 'geo-1',
        subGeographyIds: ['sub-1', 'sub-2'],
      })
    );

    expect(res.status).toBe(201);
    const createArgs = mockPrisma.user.create.mock.calls[0][0];
    // Email is normalized to lowercase before storage.
    expect(createArgs.data.email).toBe('lead@pijam.org');
    expect(createArgs.data.geographyId).toBe('geo-1');
    expect(createArgs.data.assignedSubGeos.create).toHaveLength(2);
    expect(createArgs.data.createdById).toBe(1);
  });

  it('creates a super-admin with no geography attached', async () => {
    mockSessionUser = superAdmin;
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.create.mockResolvedValueOnce({
      id: 11,
      role: 'super-admin',
      displayName: 'Second Admin',
      email: 'admin2@pijam.org',
      geographyId: null,
      assignedSubGeos: [],
    });

    const res = await POST(
      makeRequest({ role: 'super-admin', displayName: 'Second Admin', email: 'admin2@pijam.org', password: 'password123' })
    );

    expect(res.status).toBe(201);
    const createArgs = mockPrisma.user.create.mock.calls[0][0];
    expect(createArgs.data.geographyId).toBeNull();
    expect(createArgs.data.assignedSubGeos).toBeUndefined();
  });
});
