"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActivityStore } from "@/store/use-activity-store";
import { useAuthStore } from "@/store/use-auth-store";
import type { ThemeMonth } from "@/types";

interface AdminActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: { date: number; month: number; year: number } | null;
  themes: ThemeMonth[];
}

export function AdminActivityForm({ isOpen, onClose, selectedDate, themes }: AdminActivityFormProps) {
  const { currentUser } = useAuthStore();
  const { createActivity } = useActivityStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<string>("");
  const [scope, setScope] = useState<"system" | "geography">(
    currentUser?.role === "geography-lead" ? "geography" : "system"
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Auto-select theme when date changes
  useEffect(() => {
    if (selectedDate && isOpen) {
      const defaultTheme = themes.find(t => t.month === MONTH_NAMES[selectedDate.month])?.theme;
      if (defaultTheme) {
        setTheme(defaultTheme);
      }
    }
  }, [selectedDate, isOpen, themes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !title.trim() || !theme) return;
    
    setIsSubmitting(true);
    setError(null);

    const scheduledDate = new Date(
      Date.UTC(selectedDate.year, selectedDate.month, selectedDate.date)
    ).toISOString();

    const geographyId = scope === "geography" ? (currentUser?.geographyId || undefined) : undefined;

    try {
      await createActivity({
        id: `act-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        theme,
        scheduledDate,
        geographyId,
        subGeographyId: undefined,
        schoolName: undefined,
      });
      
      setTitle("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuperAdmin = currentUser?.role === "super-admin" || currentUser?.role === "program-lead";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
        </DialogHeader>
        
        {selectedDate && (
          <p className="text-sm text-muted-foreground mb-4">
            Scheduling for: {MONTH_NAMES[selectedDate.month]} {selectedDate.date}, {selectedDate.year}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Brainstorming Session"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme *</Label>
            <Select value={theme} onValueChange={setTheme} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.id} value={t.theme}>
                    {t.theme} ({t.month})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or instructions for this activity..."
              rows={3}
            />
          </div>

          {isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Select value={scope} onValueChange={(val: "system" | "geography") => setScope(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System-wide (All Schools)</SelectItem>
                  {currentUser?.geographyId && (
                    <SelectItem value="geography">Geography-specific (My Geography)</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Geography-specific activities will only be visible to schools in your assigned region.
              </p>
            </div>
          )}
          
          {currentUser?.role === "geography-lead" && (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              This activity will be scoped to your assigned geography.
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !theme || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
