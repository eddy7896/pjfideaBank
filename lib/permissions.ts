"use client";

import { useAuthStore } from "@/store/use-auth-store";
import type { Idea } from "@/types";

export function usePermissions() {
  const { currentUser } = useAuthStore();

  // Only school admins can submit new ideas
  const canSubmitIdeas = currentUser?.role === "school";

  // Only school admins and students can edit their respective ideas
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
    return false;
  };

  // Students must route every stage move through school approval. Schools
  // and super-admins move immediately.
  const canAdvanceImmediately = (idea: Idea): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "super-admin") return true;
    if (currentUser.role === "school") return idea.schoolName === currentUser.schoolName;
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

    switch (currentUser.role) {
      case "super-admin":
      case "program-lead":
        // Global administrative access
        return true;

      case "geography-lead":
        // State-scoped access
        return ideaSchoolGeographics?.geographyId === currentUser.geographyId;

      case "sed-department":
        // State-scoped + advanced stage observation only (Prototype & Test)
        const isAdvanced = idea.status === "Prototype" || idea.status === "Test";
        return (
          ideaSchoolGeographics?.geographyId === currentUser.geographyId && isAdvanced
        );

      case "teacher-trainer":
        // District-scoped access
        return ideaSchoolGeographics?.subGeographyId === currentUser.subGeographyId;

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
    currentUser?.role !== "school" && currentUser?.role !== "student";

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
