"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/use-auth-store";
import { useActivityStore } from "@/store/use-activity-store";
import { ActivityReportForm } from "@/components/dashboard/activity-report-form";
import { cn } from "@/lib/utils";

export default function ActivitiesPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { activities, loadActivities, isLoaded } = useActivityStore();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      loadActivities();
    }
  }, [isLoaded, loadActivities]);

  if (!currentUser || (currentUser.role !== "school" && currentUser.role !== "super-admin")) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only schools and super-admin can view activities.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Filter activities by school for non-admin
  let filteredActivities = activities;
  if (currentUser.role === "school") {
    filteredActivities = activities.filter(
      (a) => !a.schoolName || a.schoolName === currentUser.schoolName
    );
  }

  const selectedActivity = selectedActivityId
    ? filteredActivities.find((a) => a.id === selectedActivityId)
    : null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-8 lg:px-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {currentUser.role === "super-admin" ? "Activities Overview" : "My Activities"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {currentUser.role === "super-admin"
              ? "View all activities across schools"
              : "Submit reports for your school activities"}
          </p>
        </div>

        {!selectedActivity ? (
          /* Activities List View */
          <div className="space-y-3 sm:space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="border-border/20 p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedActivityId(activity.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {activity.title}
                        </h2>
                        <Badge variant="outline" className="text-xs w-fit">
                          {monthNames[activity.month]} {activity.date}
                        </Badge>
                      </div>

                      {activity.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                          {activity.description}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {monthNames[activity.month]} {activity.date}, {activity.year}
                        </span>
                        {activity.schoolName && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            {activity.schoolName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                          {activity.theme}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-border/20 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {currentUser.role === "super-admin"
                    ? "No activities scheduled"
                    : "No activities scheduled for your school"}
                </p>
              </Card>
            )}
          </div>
        ) : (
          /* Activity Detail View */
          <div className="space-y-4 sm:space-y-6">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setSelectedActivityId(null)}
              className="gap-2 text-xs sm:text-sm"
            >
              ← Back to Activities
            </Button>

            {/* Activity Header */}
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-foreground break-words">
                    {selectedActivity.title}
                  </h1>
                  {selectedActivity.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedActivity.description}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                      {monthNames[selectedActivity.month]} {selectedActivity.date}, {selectedActivity.year}
                    </span>
                    {selectedActivity.schoolName && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                        {selectedActivity.schoolName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 sm:h-4 w-3 sm:w-4" />
                      {selectedActivity.theme}
                    </span>
                  </div>
                </div>
                <Badge className="w-fit text-xs sm:text-sm">
                  {selectedActivity.theme}
                </Badge>
              </div>
            </div>

            {/* Activity Report Form */}
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Submit Activity Report</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Complete this form to document the activity session details, resources used, and session reflection.
              </p>
              <ActivityReportForm
                activityId={selectedActivity.id}
                activityTitle={selectedActivity.title}
                schoolName={selectedActivity.schoolName || currentUser.schoolName || ""}
                teacherName={currentUser.displayName}
                onSuccess={() => {
                  // Reset to list view
                  setSelectedActivityId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
