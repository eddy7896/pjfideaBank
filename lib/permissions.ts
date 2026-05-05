"use client";

import { useAuthStore } from "@/store/use-auth-store";
import type { Idea } from "@/types";

export function usePermissions() {
  const { currentUser } = useAuthStore();

  const canSubmitIdeas = currentUser.role !== "education-dept";

  const canViewIdea = (idea: Idea): boolean => {
    switch (currentUser.role) {
      case "super-admin":
        return true;
      case "school":
        return idea.schoolName === currentUser.schoolName;
      case "education-dept":
        return idea.status === "Prototype" || idea.status === "Test";
      default:
        return false;
    }
  };

  const canEditIdea = (idea: Idea): boolean => {
    switch (currentUser.role) {
      case "super-admin":
        return true;
      case "school":
        return idea.schoolName === currentUser.schoolName;
      case "education-dept":
        return false;
      default:
        return false;
    }
  };

  const canDragIdea = (idea: Idea): boolean => canEditIdea(idea);

  const isReadOnly = currentUser.role === "education-dept";

  return {
    currentUser,
    canSubmitIdeas,
    canViewIdea,
    canEditIdea,
    canDragIdea,
    isReadOnly,
  };
}
