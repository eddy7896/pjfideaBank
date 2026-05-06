"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/use-theme-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useIdeaStore } from "@/store/use-idea-store";
import {
  Calendar, Plus, Trash2, ShieldAlert, Pencil, X, Check,
  RotateCcw, Sparkles, Eye,
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "@/components/shared/icon-picker";
import { GradientPicker } from "@/components/shared/gradient-picker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ThemeMonth } from "@/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MapPin, Leaf, GraduationCap, HeartPulse, Users, CloudSun,
  Palette, Briefcase, Bus, Scale, Rocket, Globe, Calendar,
  Lightbulb, BookOpen, Music, Camera, Wrench, Shield, Zap,
  Flame, Snowflake, Sun, Moon, Star, Heart, Smile, Coffee,
  Code, Gamepad2, Microscope, Trophy,
};

export default function ThemesPage() {
  const { themes, addTheme, removeTheme, updateTheme, resetToDefaults } = useThemeStore();
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const router = useRouter();

  const [editingMonth, setEditingMonth] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ThemeMonth>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [newTheme, setNewTheme] = useState<Partial<ThemeMonth>>({
    month: "",
    shortMonth: "",
    theme: "",
    description: "",
    icon: "Calendar",
    gradient: "from-indigo-500 to-purple-600",
  });

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "super-admin";

  const startEdit = (tm: ThemeMonth) => {
    setEditingMonth(tm.month);
    setEditForm({ ...tm });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingMonth(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editForm.theme || !editForm.description || !editingMonth) {
      toast.error("Theme name and description are required");
      return;
    }
    updateTheme(editingMonth, editForm as ThemeMonth);
    toast.success(`${editingMonth} theme updated`);
    setEditingMonth(null);
    setEditForm({});
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.month || !newTheme.shortMonth || !newTheme.theme || !newTheme.description) {
      toast.error("Please fill all required fields");
      return;
    }

    // Check for duplicate months
    if (themes.some((t) => t.month.toLowerCase() === newTheme.month!.toLowerCase())) {
      toast.error("A theme for this month already exists");
      return;
    }

    addTheme(newTheme as ThemeMonth);
    toast.success("Theme added successfully!");
    setNewTheme({
      month: "",
      shortMonth: "",
      theme: "",
      description: "",
      icon: "Calendar",
      gradient: "from-indigo-500 to-purple-600",
    });
    setShowAddForm(false);
  };

  const handleDelete = (month: string) => {
    removeTheme(month);
    toast.success(`${month} theme removed`);
    setDeleteConfirm(null);
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success("Calendar reset to defaults");
  };

  const getIdeaCount = (theme: string) => {
    return ideas.filter((i) => i.theme.toLowerCase().includes(theme.toLowerCase())).length;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Thematic Calendar Creator
            </h1>
            <p className="text-sm text-muted-foreground">
              Design the yearly thematic calendar for all schools · {themes.length} themes
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => { setShowAddForm(!showAddForm); setEditingMonth(null); }}
            >
              <Plus className="h-4 w-4" />
              Add Theme
            </Button>
          </div>
        )}
      </div>

      {/* Add New Theme Form (collapsible) */}
      {showAddForm && (
        <div className="mb-8 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-6 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <h2 className="text-base font-semibold">Add New Theme</h2>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleAddTheme}>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Month Name *</Label>
                    <Input
                      placeholder="e.g. January"
                      value={newTheme.month}
                      onChange={(e) => setNewTheme({ ...newTheme, month: e.target.value })}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Short Name *</Label>
                    <Input
                      placeholder="e.g. Jan"
                      value={newTheme.shortMonth}
                      onChange={(e) => setNewTheme({ ...newTheme, shortMonth: e.target.value })}
                      className="bg-background"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Theme Name *</Label>
                  <Input
                    placeholder="e.g. Sustainability"
                    value={newTheme.theme}
                    onChange={(e) => setNewTheme({ ...newTheme, theme: e.target.value })}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description *</Label>
                  <Textarea
                    placeholder="Brief description of this month's theme..."
                    value={newTheme.description}
                    onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                    className="bg-background"
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Right: visual pickers + preview */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Icon</Label>
                  <IconPicker
                    value={newTheme.icon || "Calendar"}
                    onChange={(icon) => setNewTheme({ ...newTheme, icon })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Gradient</Label>
                  <GradientPicker
                    value={newTheme.gradient || "from-indigo-500 to-purple-600"}
                    onChange={(gradient) => setNewTheme({ ...newTheme, gradient })}
                  />
                </div>
              </div>
            </div>

            {/* Preview + Submit */}
            <div className="mt-6 flex items-center justify-between border-t border-indigo-200/50 pt-5">
              {/* Mini preview */}
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-lg bg-gradient-to-br px-3",
                    newTheme.gradient || "from-indigo-500 to-purple-600"
                  )}
                >
                  {(() => {
                    const PreviewIcon = iconMap[newTheme.icon || "Calendar"] || Calendar;
                    return <PreviewIcon className="h-4 w-4 text-white" />;
                  })()}
                  <span className="text-xs font-semibold text-white">
                    {newTheme.shortMonth || "Mon"}: {newTheme.theme || "Theme Name"}
                  </span>
                </div>
              </div>
              <Button type="submit" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Theme
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map((tm) => {
          const Icon = iconMap[tm.icon] || Globe;
          const isEditing = editingMonth === tm.month;
          const isDeleting = deleteConfirm === tm.month;
          const ideaCount = getIdeaCount(tm.theme);

          if (isEditing) {
            return (
              <div
                key={tm.month}
                className="rounded-xl border-2 border-indigo-300 bg-card shadow-lg shadow-indigo-500/10 overflow-hidden animate-in fade-in duration-200"
              >
                {/* Live preview header */}
                <div
                  className={cn(
                    "relative flex h-20 items-end bg-gradient-to-br p-3",
                    editForm.gradient || tm.gradient
                  )}
                >
                  {(() => {
                    const EditIcon = iconMap[editForm.icon || tm.icon] || Globe;
                    return <EditIcon className="h-6 w-6 text-white/80" />;
                  })()}
                  <span className="ml-2 text-xs font-bold text-white/60 uppercase tracking-wider">
                    {editForm.shortMonth || tm.shortMonth}
                  </span>
                  <div className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-white/10" />
                </div>

                {/* Edit form */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Theme Name</Label>
                    <Input
                      value={editForm.theme || ""}
                      onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Icon</Label>
                    <IconPicker
                      value={editForm.icon || "Calendar"}
                      onChange={(icon) => setEditForm({ ...editForm, icon })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Gradient</Label>
                    <GradientPicker
                      value={editForm.gradient || "from-indigo-500 to-purple-600"}
                      onChange={(gradient) => setEditForm({ ...editForm, gradient })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1 gap-1" onClick={saveEdit}>
                      <Check className="h-3.5 w-3.5" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={tm.month}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            >
              {/* Gradient header */}
              <div
                className={cn(
                  "relative flex h-24 flex-col justify-between bg-gradient-to-br p-3",
                  tm.gradient
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    {tm.shortMonth}
                  </span>
                  {ideaCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      {ideaCount} {ideaCount === 1 ? "idea" : "ideas"}
                    </span>
                  )}
                </div>
                <Icon className="h-7 w-7 text-white/80" />

                {/* Decorative circles */}
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {tm.month}
                    </p>
                    <h3 className="mt-0.5 text-base font-semibold text-foreground truncate">
                      {tm.theme}
                    </h3>
                  </div>
                  {/* Action buttons */}
                  {isAdmin && (
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(tm)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-indigo-600 transition-colors"
                        title="Edit theme"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tm.month)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Remove theme"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {tm.description}
                </p>
              </div>

              {/* Delete confirmation overlay */}
              {isDeleting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
                  <Trash2 className="h-6 w-6 text-destructive" />
                  <p className="text-sm font-semibold">Delete {tm.month}?</p>
                  <p className="text-xs text-muted-foreground px-4 text-center">
                    This will remove the theme permanently.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1 text-xs"
                      onClick={() => handleDelete(tm.month)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Card (placeholder) */}
        {isAdmin && !showAddForm && (
          <button
            onClick={() => { setShowAddForm(true); setEditingMonth(null); }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 bg-muted/20 py-12 text-muted-foreground transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">Add New Theme</span>
          </button>
        )}
      </div>
    </div>
  );
}
