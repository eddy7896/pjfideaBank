"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleStyleCalendar } from "@/components/calendar/google-style-calendar";
import { useAuthStore } from "@/store/use-auth-store";
import { useActivityStore } from "@/store/use-activity-store";
import { toast } from "sonner";

interface NewActivityForm {
  title: string;
  description: string;
  schoolName: string;
}

export default function CalendarPage() {
  const { currentUser } = useAuthStore();
  const { activities, loadActivities, createActivity } = useActivityStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ date: number; month: number; year: number } | null>(null);
  const [formData, setFormData] = useState<NewActivityForm>({
    title: "",
    description: "",
    schoolName: "",
  });

  const isAdmin = currentUser?.role === "super-admin";

  const handleAddActivity = async (date: number, month: number, year: number) => {
    if (!isAdmin) return;
    setSelectedDate({ date, month, year });
    setIsAddModalOpen(true);
  };

  const handleSubmitActivity = async () => {
    if (!selectedDate || !formData.title.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const theme = getThemeForMonth(selectedDate.month);
      await createActivity({
        id: crypto.randomUUID(),
        date: selectedDate.date,
        month: selectedDate.month,
        year: selectedDate.year,
        title: formData.title.trim(),
        theme,
        schoolName: formData.schoolName || undefined,
        description: formData.description || undefined,
      });

      toast.success("Activity created");
      setIsAddModalOpen(false);
      setFormData({ title: "", description: "", schoolName: "" });
      loadActivities();
    } catch (error) {
      toast.error("Failed to create activity");
    }
  };

  const getThemeForMonth = (month: number) => {
    const themes = [
      "Local Problems", "Sustainability", "EdTech", "Health & Wellness",
      "Social Impact", "Environmental", "Innovation", "Community",
      "Technology", "Culture", "Education", "Sustainability"
    ];
    return themes[month] || "General";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Theme Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monthly themes and planned activities
            </p>
          </div>
          {isAdmin && (
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity (via calendar)
            </Button>
          )}
        </div>

        {/* Calendar */}
        <GoogleStyleCalendar
          activities={activities}
          onAddActivity={isAdmin ? handleAddActivity : undefined}
          isAdmin={isAdmin}
        />
      </div>

      {/* Add Activity Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              {selectedDate && `${selectedDate.date} - Add an activity for students or schools`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., Sustainability Challenge"
              />
            </div>

            <div>
              <Label htmlFor="school">School Name (optional)</Label>
              <Input
                id="school"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="Leave blank for all schools"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about this activity..."
                className="min-h-20"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitActivity}>
                Create Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
