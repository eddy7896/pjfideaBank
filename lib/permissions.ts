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
    isReadOnly,
  };
}
