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
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      loadActivities();
    }
  }, [isLoaded, loadActivities]);

  useEffect(() => {
    if (currentUser && currentUser.role !== "school" && currentUser.role !== "student") {
      setLoadingReports(true);
      fetch("/api/activity-reports")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReports(data);
          }
        })
        .catch((err) => console.error("Failed to load activity reports:", err))
        .finally(() => setLoadingReports(false));
    }
  }, [currentUser]);

  if (!currentUser || currentUser.role === "student") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Students do not have access to view activities.
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
            {currentUser.role === "school" && (
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
            )}

            {/* Submitted Reports Listing (Staff/Observers) */}
            {currentUser.role !== "school" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Submitted Reports</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                    Review classroom logs, student attendance, material utilization, and safety audit checkmarks.
                  </p>

                  {loadingReports ? (
                    <div className="py-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Loading reports...
                    </div>
                  ) : (() => {
                    const activityReports = reports.filter((r) => r.activityId === selectedActivity.id);
                    return activityReports.length > 0 ? (
                      <div className="space-y-6">
                        {activityReports.map((rep) => (
                          <Card key={rep.id} className="border-border/40 p-6 bg-slate-50/50 hover:bg-slate-50/80 transition-all">
                            {/* Report Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-4 mb-4">
                              <div>
                                <h3 className="font-bold text-slate-800 text-base">{rep.schoolName}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Submitted by {rep.submittedBy || rep.teacherName} on {new Date(rep.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline" className="w-fit text-xs bg-primary/5 text-primary border-primary/20">
                                Session Date: {rep.sessionDate}
                              </Badge>
                            </div>

                            {/* Grid Metadata */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs sm:text-sm mb-6 bg-white rounded-lg p-4 border border-slate-200/50">
                              <div>
                                <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Timing</p>
                                <p className="font-semibold text-slate-700 mt-1">{rep.timeIn} - {rep.timeOut}</p>
                              </div>
                              <div>
                                <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Grades Covered</p>
                                <p className="font-semibold text-slate-700 mt-1">{rep.grades}</p>
                              </div>
                              <div>
                                <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Attendance</p>
                                <p className="font-semibold text-slate-700 mt-1">
                                  {rep.totalStudents} total ({rep.boysCount} Boys · {rep.girlsCount} Girls)
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Engagement</p>
                                <Badge className={cn("mt-1 text-xs text-white", 
                                  rep.studentEngagement === "High" ? "bg-emerald-500" :
                                  rep.studentEngagement === "Moderate" ? "bg-amber-500" : "bg-red-500"
                                )}>
                                  {rep.studentEngagement}
                                </Badge>
                              </div>
                            </div>

                            {/* Lessons & Objectives */}
                            <div className="space-y-4 mb-6">
                              <div>
                                <h4 className="font-bold text-slate-805 text-sm">Lesson Topics Covered</h4>
                                <p className="text-slate-600 text-sm mt-1 bg-white p-3 rounded-lg border border-slate-100 italic leading-relaxed">{rep.topicsLessons}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-805 text-sm">Primary Learning Goal</h4>
                                <p className="text-slate-600 text-sm mt-1 bg-white p-3 rounded-lg border border-slate-100 italic leading-relaxed">{rep.learningGoal}</p>
                              </div>
                            </div>

                            {/* Safety Auditing Checkboxes */}
                            <div className="mb-6 p-4 rounded-xl bg-slate-100/50 border border-slate-200/40">
                              <h4 className="font-bold text-slate-805 text-xs uppercase tracking-wider mb-3">🛠️ Lab Safety & Hygiene Audit</h4>
                              <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                  <span className={rep.safetyBriefing ? "text-emerald-500 font-bold" : "text-slate-350"}>
                                    {rep.safetyBriefing ? "✓" : "✗"}
                                  </span>
                                  <span className="font-medium text-slate-600">Safety Briefing</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                  <span className={rep.ppeWorn ? "text-emerald-500 font-bold" : "text-slate-350"}>
                                    {rep.ppeWorn ? "✓" : "✗"}
                                  </span>
                                  <span className="font-medium text-slate-600">PPE Worn</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                  <span className={rep.labCleanup ? "text-emerald-500 font-bold" : "text-slate-350"}>
                                    {rep.labCleanup ? "✓" : "✗"}
                                  </span>
                                  <span className="font-medium text-slate-600">Lab Cleaned</span>
                                </div>
                              </div>
                              {rep.incidentNotes && (
                                <div className="mt-3 text-xs text-red-600 font-medium">
                                  <strong className="text-red-700">Incident Notes: </strong> {rep.incidentNotes}
                                </div>
                              )}
                            </div>

                            {/* Materials utilized */}
                            {rep.materials && Array.isArray(rep.materials) && rep.materials.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-bold text-slate-805 text-xs uppercase tracking-wider mb-2">📦 Materials Utilized</h4>
                                <div className="flex flex-wrap gap-2">
                                  {rep.materials.map((m: any, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border border-slate-200/50">
                                      {m.name} (Qty: {m.quantityUsed}) · Status: {m.stockStatus}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Reflections */}
                            <div className="grid gap-4 sm:grid-cols-3 border-t border-slate-200/40 pt-4 text-xs sm:text-sm">
                              <div>
                                <strong className="text-slate-700 font-semibold block mb-1">What Worked Well:</strong>
                                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{rep.successes}</p>
                              </div>
                              <div>
                                <strong className="text-slate-700 font-semibold block mb-1">Challenges & Blocker:</strong>
                                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{rep.challenges}</p>
                              </div>
                              <div>
                                <strong className="text-slate-700 font-semibold block mb-1">Next Preparation:</strong>
                                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{rep.followUpActions}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl p-8 bg-slate-50/50">
                        No educator reports have been submitted for this classroom activity yet.
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
