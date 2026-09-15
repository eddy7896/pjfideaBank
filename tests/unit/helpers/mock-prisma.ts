import { vi } from 'vitest';

/**
 * A minimal mock Prisma client covering every model/method the API routes
 * under test call. $transaction just invokes its callback with the same
 * mock object standing in for `tx` - fine for unit-testing route logic,
 * since we're not asserting real transactional atomicity here (that's
 * Postgres's job, not this route's).
 */
export function createMockPrisma() {
  const mock: any = {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    school: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    geography: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    subGeography: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    studentTeam: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    idea: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    timelineEvent: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
  mock.$transaction = vi.fn((cb: any) => cb(mock));
  return mock;
}

export type MockPrisma = ReturnType<typeof createMockPrisma>;
