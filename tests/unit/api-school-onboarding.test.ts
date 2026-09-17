import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createMockPrisma } from './helpers/mock-prisma';

const mockPrisma = createMockPrisma();

const mockRepo = {
  getUserByEmail: vi.fn(),
  getSchoolByName: vi.fn(),
  getSchoolByUdaise: vi.fn(),
  createSchool: vi.fn(),
  createUser: vi.fn(),
  createGeography: vi.fn(),
  createSubGeography: vi.fn(),
};

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));
vi.mock('@/lib/db/repositories', () => mockRepo);
vi.mock('@/lib/auth-utils', () => ({ hashPassword: vi.fn(async (pw: string) => `hashed:${pw}`) }));
vi.mock('@/lib/audit', () => ({ audit: vi.fn(async () => {}) }));
// Real ratelimit is in-memory and shared across every test in this file -
// mock it always-allow so test count/order can't trip the 5/hour gate the
// real route uses in production.
vi.mock('@/lib/ratelimit', () => ({
  rateLimit: vi.fn(() => ({ allowed: true, remaining: 99, resetAt: Date.now() + 1000 })),
  ipFromRequest: vi.fn(() => '127.0.0.1'),
}));

const { POST } = await import('@/app/api/auth/onboard/route');

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/api/auth/onboard', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as any;
}

const validSchoolPayload = {
  role: 'school',
  schoolName: 'Springfield High',
  location: 'Pune, Maharashtra',
  address: '123 Main St',
  phone: '9999999999',
  principalName: 'Dr. Hartford',
  udaiseCode: 'UDI-001',
  teacherName: 'A Teacher',
  teacherEmail: 'teacher@springfield.edu',
  teacherPassword: 'password123',
  termsAccepted: true,
};

describe('POST /api/auth/onboard — school self-registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRepo.getUserByEmail.mockResolvedValue(null);
    mockRepo.getSchoolByName.mockResolvedValue(null);
    mockRepo.getSchoolByUdaise.mockResolvedValue(null);
    mockPrisma.geography.findUnique.mockResolvedValue({ id: 'geo-mh', name: 'Maharashtra' });
    mockPrisma.subGeography.findUnique.mockResolvedValue({ id: 'sub-pune', name: 'Pune', geographyId: 'geo-mh' });
  });

  it('rejects a role of geography-lead or super-admin - self-registration only creates school/teacher-trainer', async () => {
    const res = await POST(makeRequest({ ...validSchoolPayload, role: 'geography-lead' }));
    // zod's role enum rejects anything outside ['school', 'teacher-trainer'] outright.
    expect(res.status).toBe(400);
  });

  it('rejects a school onboarding missing required fields', async () => {
    const { schoolName, ...incomplete } = validSchoolPayload;
    const res = await POST(makeRequest(incomplete));
    expect(res.status).toBe(400);
  });

  it('rejects a location with no district ("<District>, <State>" required)', async () => {
    const res = await POST(makeRequest({ ...validSchoolPayload, location: 'Maharashtra' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/District/);
  });

  it('rejects a duplicate teacher email', async () => {
    mockRepo.getUserByEmail.mockResolvedValueOnce({ id: 5 });
    const res = await POST(makeRequest(validSchoolPayload));
    expect(res.status).toBe(409);
  });

  it('rejects a duplicate school name', async () => {
    mockRepo.getSchoolByName.mockResolvedValueOnce({ id: 'sch-existing' });
    const res = await POST(makeRequest(validSchoolPayload));
    expect(res.status).toBe(409);
  });

  it('rejects a duplicate UDAISE code', async () => {
    mockRepo.getSchoolByUdaise.mockResolvedValueOnce({ id: 'sch-existing' });
    const res = await POST(makeRequest(validSchoolPayload));
    expect(res.status).toBe(409);
  });

  it('auto-creates the Geography/SubGeography when this is the first school in that district', async () => {
    mockPrisma.geography.findUnique.mockResolvedValueOnce(null);
    mockRepo.createGeography.mockResolvedValueOnce({ id: 'geo-new', name: 'Maharashtra' });
    mockPrisma.subGeography.findUnique.mockResolvedValueOnce(null);
    mockRepo.createSubGeography.mockResolvedValueOnce({ id: 'sub-new', name: 'Pune', geographyId: 'geo-new' });
    mockPrisma.school.create.mockResolvedValueOnce({ id: 'sch-1', name: 'Springfield High' });

    const res = await POST(makeRequest(validSchoolPayload));

    expect(res.status).toBe(201);
    expect(mockRepo.createGeography).toHaveBeenCalledWith({ name: 'Maharashtra', code: 'MA' });
    expect(mockRepo.createSubGeography).toHaveBeenCalledWith({ name: 'Pune', geographyId: 'geo-new' });
  });

  it('creates the school and its admin user atomically, scoped to the resolved district', async () => {
    mockPrisma.school.create.mockResolvedValueOnce({ id: 'sch-1', name: 'Springfield High' });

    const res = await POST(makeRequest(validSchoolPayload));

    expect(res.status).toBe(201);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    const schoolCreateArgs = mockPrisma.school.create.mock.calls[0][0];
    expect(schoolCreateArgs.data.subGeographyId).toBe('sub-pune');
    expect(schoolCreateArgs.data.name).toBe('Springfield High');

    const userCreateArgs = mockPrisma.user.create.mock.calls[0][0];
    expect(userCreateArgs.data.role).toBe('school');
    expect(userCreateArgs.data.schoolId).toBe('sch-1');
    expect(userCreateArgs.data.email).toBe('teacher@springfield.edu');
    expect(userCreateArgs.data.passwordHash).toBe('hashed:password123');
  });
});

describe('POST /api/auth/onboard — pijam teacher-trainer registration', () => {
  const validTrainerPayload = {
    role: 'teacher-trainer',
    location: 'Pune, Maharashtra',
    teacherName: 'A Trainer',
    teacherEmail: 'trainer@pijam.org',
    teacherPassword: 'password123',
    assignedLeadId: '7',
    termsAccepted: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepo.getUserByEmail.mockResolvedValue(null);
    mockPrisma.geography.findUnique.mockResolvedValue({ id: 'geo-mh', name: 'Maharashtra' });
    mockPrisma.subGeography.findUnique.mockResolvedValue({ id: 'sub-pune', name: 'Pune', geographyId: 'geo-mh' });
  });

  it('rejects a trainer signup with no geography-lead selected', async () => {
    const { assignedLeadId, ...rest } = validTrainerPayload;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(400);
  });

  it('rejects a trainer signup pointing at a lead that does not exist', async () => {
    mockPrisma.user.findFirst.mockResolvedValueOnce(null);
    const res = await POST(makeRequest(validTrainerPayload));
    expect(res.status).toBe(400);
    expect(mockRepo.createUser).not.toHaveBeenCalled();
  });

  it('creates a teacher-trainer inheriting the assigned lead\'s geography', async () => {
    mockPrisma.user.findFirst.mockResolvedValueOnce({ id: 7, email: 'gl@pijam.org', geographyId: 'geo-mh' });

    const res = await POST(makeRequest(validTrainerPayload));

    expect(res.status).toBe(201);
    const createArgs = mockRepo.createUser.mock.calls[0][0];
    expect(createArgs.role).toBe('teacher-trainer');
    expect(createArgs.assignedLeadUserId).toBe(7);
    expect(createArgs.geographyId).toBe('geo-mh');
  });

  it('accepts a legacy email reference for assignedLeadId, not just a numeric id', async () => {
    mockPrisma.user.findFirst.mockResolvedValueOnce({ id: 8, email: 'gl2@pijam.org', geographyId: 'geo-mh' });

    const res = await POST(makeRequest({ ...validTrainerPayload, assignedLeadId: 'gl2@pijam.org' }));

    expect(res.status).toBe(201);
    const lookupArgs = mockPrisma.user.findFirst.mock.calls[0][0];
    expect(lookupArgs.where.email).toBe('gl2@pijam.org');
  });
});
