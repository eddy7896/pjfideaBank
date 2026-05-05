"use client";

import { useAuthStore } from "@/store/use-auth-store";
import type { Idea } from "@/types";

export function usePermissions() {
  const { currentUser } = useAuthStore();

  // Only schools can submit ideas
  const canSubmitIdeas = currentUser?.role === "school";

  const canViewIdea = (idea: Idea): boolean => {
    if (!currentUser) return false;
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

  // Only schools can edit their own ideas
  const canEditIdea = (idea: Idea): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "school") {
      return idea.schoolName === currentUser.schoolName;
    }
    return false;
  };

  const canDragIdea = (idea: Idea): boolean => canEditIdea(idea);

  const isReadOnly = currentUser?.role !== "school";

  return {
    currentUser,
    canSubmitIdeas,
    canViewIdea,
    canEditIdea,
    canDragIdea,
    isReadOnly,
  };
}
