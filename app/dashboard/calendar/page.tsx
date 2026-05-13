"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleStyleCalendar } from "@/components/calendar/google-style-calendar";
import { useAuthStore } from "@/store/use-auth-store";
import { useActivityStore } from "@/store/use-activity-store";
import { useThemeStore } from "@/store/use-theme-store";
import { toast } from "sonner";

export default function CalendarPage() {
  const { currentUser } = useAuthStore();
  const { activities, loadActivities, createActivity, deleteActivity } = useActivityStore();
  const { themes, updateTheme } = useThemeStore();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ date: number; month: number; year: number } | null>(null);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);

  const [themeForm, setThemeForm] = useState({
    theme: "",
    description: "",
  });

  const [activityForm, setActivityForm] = useState({
    title: "",
    description: "",
    schoolName: "",
  });

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const isAdmin = currentUser?.role === "super-admin";

  const handleEditTheme = (monthIndex: number) => {
    const theme = themes[monthIndex];
    if (theme) {
      setSelectedMonth(monthIndex);
      setThemeForm({
        theme: theme.theme,
        description: theme.description,
      });
      setIsThemeModalOpen(true);
    }
  };

  const handleSaveTheme = async () => {
    if (!themeForm.theme.trim() || selectedMonth === null) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const original = themes[selectedMonth];
      updateTheme(original.month, {
        month: original.month,
        shortMonth: original.shortMonth,
        theme: themeForm.theme,
        description: themeForm.description,
        icon: original.icon,
        gradient: original.gradient,
      });

      toast.success("Theme updated");
      setIsThemeModalOpen(false);
      setSelectedMonth(null);
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  const handleAddActivity = (date: number, month: number, year: number) => {
    setSelectedDate({ date, month, year });
    setActivityForm({ title: "", description: "", schoolName: "" });
    setIsActivityModalOpen(true);
  };

  const handleSubmitActivity = async () => {
    if (!selectedDate || !activityForm.title.trim()) {
      toast.error("Please fill in activity title");
      return;
    }

    try {
      const theme = themes[selectedDate.month]?.theme || "General";
      await createActivity({
        id: crypto.randomUUID(),
        date: selectedDate.date,
        month: selectedDate.month,
        year: selectedDate.year,
        title: activityForm.title.trim(),
        theme,
        schoolName: activityForm.schoolName || undefined,
        description: activityForm.description || undefined,
      });

      toast.success("Activity created");
      setIsActivityModalOpen(false);
      setActivityForm({ title: "", description: "", schoolName: "" });
      await useActivityStore.getState().loadActivities();
    } catch (error) {
      toast.error("Failed to create activity");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivity(id);
      toast.success("Activity deleted");
      setDeleteActivityId(null);
      await useActivityStore.getState().loadActivities();
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isAdmin ? "Theme Calendar Manager" : "Theme Calendar"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Set monthly themes and manage activities for schools" : "View upcoming activities and monthly themes"}
          </p>
        </div>

        {isAdmin && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Monthly Themes</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {themes.map((theme, idx) => (
                <Card key={theme.month} className="border-border/20 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground">{theme.shortMonth}</p>
                      <p className="text-sm font-semibold text-foreground line-clamp-2">{theme.theme}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTheme(idx)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Activities Calendar</h2>
            {isAdmin && <p className="text-xs text-muted-foreground">Click dates to add activities</p>}
          </div>
          <GoogleStyleCalendar activities={activities} onAddActivity={isAdmin ? handleAddActivity : undefined} isAdmin={isAdmin} />
        </div>

        {activities.length > 0 && isAdmin && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Activities</h2>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {activities.slice(0, 10).map((activity) => {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (
                  <Card key={activity.id} className="border-border/20 p-3 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary whitespace-nowrap">
                          {activity.date} {monthNames[activity.month]}
                        </span>
                        {activity.schoolName && (
                          <span className="text-xs text-muted-foreground truncate">{activity.schoolName}</span>
                        )}
                      </div>
                      <p className="font-medium text-foreground text-sm">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                      )}
                      <p className="text-xs text-primary mt-1">{activity.theme}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteActivityId(activity.id)}
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 flex-shrink-0 ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isAdmin && <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Theme</DialogTitle>
            <DialogDescription>
              Update theme for {selectedMonth !== null ? themes[selectedMonth]?.month : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-name">Theme Name *</Label>
              <Input
                id="theme-name"
                value={themeForm.theme}
                onChange={(e) => setThemeForm({ ...themeForm, theme: e.target.value })}
                placeholder="E.g., Sustainability"
              />
            </div>

            <div>
              <Label htmlFor="theme-desc">Description</Label>
              <Textarea
                id="theme-desc"
                value={themeForm.description}
                onChange={(e) => setThemeForm({ ...themeForm, description: e.target.value })}
                placeholder="Describe this month's theme..."
                className="min-h-20"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsThemeModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTheme}>
                Save Theme
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>}

      {isAdmin && <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              {selectedDate && `${selectedDate.date} - Create an activity for students or schools`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="activity-title">Activity Title *</Label>
              <Input
                id="activity-title"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                placeholder="E.g., Sustainability Challenge"
              />
            </div>

            <div>
              <Label htmlFor="activity-school">School Name (optional)</Label>
              <Input
                id="activity-school"
                value={activityForm.schoolName}
                onChange={(e) => setActivityForm({ ...activityForm, schoolName: e.target.value })}
                placeholder="Leave blank for all schools"
              />
            </div>

            <div>
              <Label htmlFor="activity-desc">Description (optional)</Label>
              <Textarea
                id="activity-desc"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                placeholder="Details about this activity..."
                className="min-h-20"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitActivity}>
                Create Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>}

      {isAdmin && <Dialog open={deleteActivityId !== null} onOpenChange={(open) => !open && setDeleteActivityId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteActivityId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteActivityId && handleDeleteActivity(deleteActivityId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}
