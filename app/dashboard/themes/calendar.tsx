"use client";

import { useEffect } from "react";
import { GoogleStyleCalendar } from "@/components/calendar/google-style-calendar";
import { useAuthStore } from "@/store/use-auth-store";
import { useActivityStore } from "@/store/use-activity-store";
import { useThemeStore } from "@/store/use-theme-store";

export function ThemesCalendar() {
  const { currentUser } = useAuthStore();
  const { activities, isLoaded, loadActivities } = useActivityStore();
  const { themes, isLoaded: themesLoaded, loadThemes } = useThemeStore();

  useEffect(() => {
    if (!isLoaded) {
      loadActivities();
    }
    if (!themesLoaded) {
      loadThemes();
    }
  }, [isLoaded, loadActivities, themesLoaded, loadThemes]);

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
      <GoogleStyleCalendar activities={filteredActivities} themes={themes} isAdmin={false} />
    </div>
  );
}
