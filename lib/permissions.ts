"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useSchoolStore } from "@/store/use-school-store";
import type { Idea } from "@/types";


export function usePermissions() {
  const { currentUser } = useAuthStore();

  // School admins and staff can submit new ideas
  const canSubmitIdeas =
    currentUser?.role === "school" ||
    currentUser?.role === "teacher-trainer" ||
    currentUser?.role === "geography-lead";

  // Only school admins, students, and staff can edit their respective ideas
  const canEditIdea = (idea: Idea): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "super-admin") {
      return true;
    }
    if (currentUser.role === "school") {
      return idea.schoolName === currentUser.schoolName;
    }
    if (currentUser.role === "student") {
      return idea.teamId === currentUser.teamId;
    }
    if (currentUser.role === "teacher-trainer" || currentUser.role === "geography-lead") {
      return idea.schoolName === "Pi Jam Regional Office";
    }
    return false;
  };

  // Students must route every stage move through school approval. Schools,
  // super-admins, and staff move immediately.
  const canAdvanceImmediately = (idea: Idea): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "super-admin") return true;
    if (currentUser.role === "school") return idea.schoolName === currentUser.schoolName;
    if (currentUser.role === "student" && (currentUser as any).teamType === "teacher") {
      return true;
    }
    if (currentUser.role === "teacher-trainer" || currentUser.role === "geography-lead") {
      return idea.schoolName === "Pi Jam Regional Office";
    }
    return false;
  };

  // Only the school side may resolve a student's pending request.
  const canApproveAdvance = (idea: Idea): boolean => canAdvanceImmediately(idea);

  // Whether a pending advance request currently sits on this idea (no
  // resolution after it).
  const hasPendingAdvance = (idea: Idea): boolean => {
    const sorted = [...idea.timeline].sort((a, b) =>
      String(a.timestamp).localeCompare(String(b.timestamp))
    );
    let pending = false;
    for (const ev of sorted) {
      if (ev.type === "advance_requested") pending = true;
      else if (ev.type === "advance_approved" || ev.type === "advance_rejected")
        pending = false;
      else if (ev.type === "stage_change") pending = false;
    }
    return pending;
  };

  const canDragIdea = (idea: Idea): boolean => canEditIdea(idea);

  // Geographic scoping check for viewing details
  const canViewIdea = (
    idea: Idea,
    ideaSchoolGeographics?: { geographyId: string; subGeographyId: string }
  ): boolean => {
    if (!currentUser) return false;

    // Resolve school geographics dynamically from school store if not supplied
    let geo = ideaSchoolGeographics;
    if (!geo) {
      const schools = useSchoolStore.getState().schools;
      const school = schools.find((s) => s.name === idea.schoolName || s.id === (idea as any).schoolId);
      if (school?.subGeography) {
        geo = {
          geographyId: school.subGeography.geographyId,
          subGeographyId: school.subGeography.id,
        };
      }
    }

    switch (currentUser.role) {
      case "super-admin":
      case "program-lead":
        // Global administrative access
        return true;

      case "geography-lead":
        // State-scoped access
        return geo?.geographyId === currentUser.geographyId;

      case "sed-department":
        // State-scoped + advanced stage observation only (Prototype & Test)
        const isAdvanced = idea.status === "Prototype" || idea.status === "Test";
        return (
          geo?.geographyId === currentUser.geographyId && isAdvanced
        );

      case "teacher-trainer":
        // District-scoped access
        return geo?.subGeographyId === currentUser.subGeographyId;


      case "school":
        // School-isolated access
        return idea.schoolName === currentUser.schoolName;

      case "student":
        // Project-isolated access
        return idea.teamId === currentUser.teamId;

      default:
        return false;
    }
  };

  const isReadOnly =
    currentUser?.role !== "school" &&
    currentUser?.role !== "student" &&
    currentUser?.role !== "teacher-trainer" &&
    currentUser?.role !== "geography-lead";

  return {
    currentUser,
    canSubmitIdeas,
    canViewIdea,
    canEditIdea,
    canDragIdea,
    canAdvanceImmediately,
    canApproveAdvance,
    hasPendingAdvance,
    isReadOnly,
  };
}
