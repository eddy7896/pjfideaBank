import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePermissions } from '@/lib/permissions';
import type { Idea } from '@/types';

// Module-level variable to mock dynamic user state
let mockUser: any = null;

// Mock the Zustand stores
vi.mock('@/store/use-auth-store', () => ({
  useAuthStore: () => ({
    currentUser: mockUser,
  }),
}));

vi.mock('@/store/use-school-store', () => ({
  useSchoolStore: {
    getState: () => ({
      schools: [
        {
          id: 'school-1',
          name: 'School A',
          subGeography: {
            id: 'district-1',
            geographyId: 'state-1',
          },
        },
        {
          id: 'school-2',
          name: 'School B',
          subGeography: {
            id: 'district-2',
            geographyId: 'state-2',
          },
        },
      ],
    }),
  },
}));

describe('permissions unit tests', () => {
  beforeEach(() => {
    mockUser = null;
  });

  const mockIdea: Idea = {
    id: 'idea-1',
    title: 'Test Idea',
    schoolName: 'School A',
    schoolId: 'school-1',
    theme: 'Climate',
    teamId: 'team-1',
    studentTeam: 'Team Alpha',
    problemStatement: 'Some problem',
    targetAudience: 'Students',
    status: 'Empathize' as const,
    lastUpdated: '2026-06-12',
    stageData: {},
    createdAt: '2026-06-12',
    timeline: [],
  } as any;

  describe('canSubmitIdeas', () => {
    it('should allow schools, teacher trainers, and geography leads to submit ideas', () => {
      mockUser = { role: 'school' };
      expect(usePermissions().canSubmitIdeas).toBe(true);

      mockUser = { role: 'teacher-trainer' };
      expect(usePermissions().canSubmitIdeas).toBe(true);

      mockUser = { role: 'geography-lead' };
      expect(usePermissions().canSubmitIdeas).toBe(true);
    });

    it('should block super admin, students, and other roles from submitting ideas', () => {
      mockUser = { role: 'super-admin' };
      expect(usePermissions().canSubmitIdeas).toBe(false);

      mockUser = { role: 'student' };
      expect(usePermissions().canSubmitIdeas).toBe(false);

      mockUser = { role: 'sed-department' };
      expect(usePermissions().canSubmitIdeas).toBe(false);

      mockUser = null;
      expect(usePermissions().canSubmitIdeas).toBe(false);
    });
  });

  describe('canEditIdea', () => {
    it('should allow super admins to edit any idea', () => {
      mockUser = { role: 'super-admin' };
      expect(usePermissions().canEditIdea(mockIdea)).toBe(true);
    });

    it('should allow schools to edit their own ideas', () => {
      mockUser = { role: 'school', schoolName: 'School A' };
      expect(usePermissions().canEditIdea(mockIdea)).toBe(true);

      mockUser = { role: 'school', schoolName: 'School B' };
      expect(usePermissions().canEditIdea(mockIdea)).toBe(false);
    });

    it('should allow student teams to edit their assigned ideas', () => {
      mockUser = { role: 'student', teamId: 'team-1' };
      expect(usePermissions().canEditIdea(mockIdea)).toBe(true);

      mockUser = { role: 'student', teamId: 'team-2' };
      expect(usePermissions().canEditIdea(mockIdea)).toBe(false);
    });

    it('should allow staff to edit regional office ideas', () => {
      const regionalIdea = { ...mockIdea, schoolName: 'Pi Jam Regional Office' };
      
      mockUser = { role: 'teacher-trainer' };
      expect(usePermissions().canEditIdea(regionalIdea)).toBe(true);
      expect(usePermissions().canEditIdea(mockIdea)).toBe(false);

      mockUser = { role: 'geography-lead' };
      expect(usePermissions().canEditIdea(regionalIdea)).toBe(true);
      expect(usePermissions().canEditIdea(mockIdea)).toBe(false);
    });
  });

  describe('canAdvanceImmediately', () => {
    it('should allow super-admins and matching school admins to advance immediately', () => {
      mockUser = { role: 'super-admin' };
      expect(usePermissions().canAdvanceImmediately(mockIdea)).toBe(true);

      mockUser = { role: 'school', schoolName: 'School A' };
      expect(usePermissions().canAdvanceImmediately(mockIdea)).toBe(true);

      mockUser = { role: 'school', schoolName: 'School B' };
      expect(usePermissions().canAdvanceImmediately(mockIdea)).toBe(false);
    });

    it('should allow student teams of type teacher to advance immediately', () => {
      mockUser = { role: 'student', teamId: 'team-1', teamType: 'teacher' };
      expect(usePermissions().canAdvanceImmediately(mockIdea)).toBe(true);

      mockUser = { role: 'student', teamId: 'team-1', teamType: 'student' };
      expect(usePermissions().canAdvanceImmediately(mockIdea)).toBe(false);
    });
  });

  describe('canViewIdea', () => {
    it('should allow super admins and program leads to view any idea', () => {
      mockUser = { role: 'super-admin' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(true);

      mockUser = { role: 'program-lead' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(true);
    });

    it('should allow geography leads to view ideas within their state', () => {
      mockUser = { role: 'geography-lead', geographyId: 'state-1' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(true);

      mockUser = { role: 'geography-lead', geographyId: 'state-2' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(false);
    });

    it('should allow SED observers to view state ideas only in advanced stages', () => {
      const empathizeIdea = { ...mockIdea, status: 'Empathize' as const };
      const prototypeIdea = { ...mockIdea, status: 'Prototype' as const };
      const testIdea = { ...mockIdea, status: 'Test' as const };

      mockUser = { role: 'sed-department', geographyId: 'state-1' };
      expect(usePermissions().canViewIdea(empathizeIdea)).toBe(false);
      expect(usePermissions().canViewIdea(prototypeIdea)).toBe(true);
      expect(usePermissions().canViewIdea(testIdea)).toBe(true);

      mockUser = { role: 'sed-department', geographyId: 'state-2' };
      expect(usePermissions().canViewIdea(prototypeIdea)).toBe(false);
    });

    it('should allow teacher trainers to view ideas within their district', () => {
      mockUser = { role: 'teacher-trainer', subGeographyId: 'district-1' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(true);

      mockUser = { role: 'teacher-trainer', subGeographyId: 'district-2' };
      expect(usePermissions().canViewIdea(mockIdea)).toBe(false);
    });
  });
});
