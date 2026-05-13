"use client";

import { useEffect } from "react";
import { GoogleStyleCalendar } from "@/components/calendar/google-style-calendar";
import { useAuthStore } from "@/store/use-auth-store";
import { useActivityStore } from "@/store/use-activity-store";

export function ThemesCalendar() {
  const { currentUser } = useAuthStore();
  const { activities, isLoaded, loadActivities } = useActivityStore();

  useEffect(() => {
    if (!isLoaded) {
      loadActivities();
    }
  }, [isLoaded, loadActivities]);

  // Filter activities for user's school
  const filteredActivities = activities.filter((a) => {
    if (!a.schoolName) return true; // Show all-school activities
    return a.schoolName === currentUser?.schoolName;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Theme Calendar</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly themes and planned activities for your school
        </p>
      </div>
      <GoogleStyleCalendar activities={filteredActivities} isAdmin={false} />
    </div>
  );
}
