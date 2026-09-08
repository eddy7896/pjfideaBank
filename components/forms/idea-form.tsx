"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Sparkles, Loader2 } from "lucide-react";
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
import { useIdeaStore } from "@/store/use-idea-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useThemeStore } from "@/store/use-theme-store";
import { useTeamStore } from "@/store/use-team-store";
import { toast } from "sonner";

export function IdeaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledTheme = searchParams.get("theme") || "";
  const { addIdea } = useIdeaStore();
  const { currentUser } = useAuthStore();
  const { themes } = useThemeStore();
  const { getTeamsBySchool } = useTeamStore();

  const schoolTeams = currentUser?.role === "school" && currentUser.schoolName
    ? getTeamsBySchool(currentUser.schoolName)
    : [];

  const [formData, setFormData] = useState({
    title: "",
    theme: prefilledTheme
      ? themes.find((tm) =>
          tm.theme.toLowerCase() === prefilledTheme.toLowerCase()
        )
        ? `${themes.find((tm) => tm.theme.toLowerCase() === prefilledTheme.toLowerCase())!.month}: ${prefilledTheme}`
        : ""
      : "",
    teamId: "",
    studentTeam: "",
    problemStatement: "",
    targetAudience: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.theme) newErrors.theme = "Please select a theme";
    if (!formData.teamId) newErrors.teamId = "Please select a team";
    if (!formData.problemStatement.trim())
      newErrors.problemStatement = "Problem statement is required";
    if (formData.problemStatement.trim().length < 20)
      newErrors.problemStatement = "Please provide at least 20 characters";
    if (!formData.targetAudience.trim())
      newErrors.targetAudience = "Target audience is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    const schoolName =
      currentUser?.role === "school"
        ? currentUser.schoolName!
        : "Admin Submission";

    const selectedTeam = schoolTeams.find((t) => t.id === formData.teamId);

    setIsSubmitting(true);
    const result = await addIdea({
      schoolName,
      title: formData.title.trim(),
      theme: formData.theme,
      teamId: formData.teamId,
      studentTeam: selectedTeam?.name || formData.studentTeam.trim(),
      problemStatement: formData.problemStatement.trim(),
      targetAudience: formData.targetAudience.trim(),
    });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Failed to submit idea", {
        description: "Nothing was saved. Fix the issue and try again.",
      });
      return;
    }

    toast.success("Idea submitted successfully!", {
      description: `"${formData.title}" has been added to the Empathize stage.`,
    });

    setFormData({
      title: "",
      theme: "",
      teamId: "",
      studentTeam: "",
      problemStatement: "",
      targetAudience: "",
    });

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Project Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Solar Powered Desk Lamps"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="text-sm font-medium">
          Associated Theme <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.theme}
          onValueChange={(value) =>
            setFormData({ ...formData, theme: value ?? "" })
          }
        >
          <SelectTrigger
            id="theme"
            className={errors.theme ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select a monthly theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((tm) => (
              <SelectItem
                key={tm.month}
                value={`${tm.month}: ${tm.theme}`}
              >
                {tm.month}: {tm.theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.theme && (
          <p className="text-xs text-destructive">{errors.theme}</p>
        )}
      </div>

      {/* Team Selection */}
      <div className="space-y-2">
        <Label htmlFor="teamId" className="text-sm font-medium">
          Student Team <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.teamId}
          onValueChange={(value) =>
            setFormData({ ...formData, teamId: value || "" })
          }
        >
          <SelectTrigger
            id="teamId"
            className={errors.teamId ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {schoolTeams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.teamId && (
          <p className="text-xs text-destructive">{errors.teamId}</p>
        )}
        {schoolTeams.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No teams yet.{" "}
            <Link
              href="/dashboard/teams"
              className="font-medium text-primary underline underline-offset-2"
            >
              Create one first
            </Link>
            , then come back here.
          </p>
        )}
      </div>

      {/* Problem Statement */}
      <div className="space-y-2">
        <Label htmlFor="problemStatement" className="text-sm font-medium">
          Problem Statement <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="problemStatement"
          placeholder="Describe the problem your project aims to solve..."
          rows={4}
          value={formData.problemStatement}
          onChange={(e) =>
            setFormData({ ...formData, problemStatement: e.target.value })
          }
          className={errors.problemStatement ? "border-destructive" : ""}
        />
        <div className="flex items-center justify-between">
          {errors.problemStatement ? (
            <p className="text-xs text-destructive">
              {errors.problemStatement}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {formData.problemStatement.length} chars
          </span>
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-sm font-medium">
          Target Audience <span className="text-destructive">*</span>
        </Label>
        <Input
          id="targetAudience"
          placeholder="e.g., Middle school students (ages 11-14)"
          value={formData.targetAudience}
          onChange={(e) =>
            setFormData({ ...formData, targetAudience: e.target.value })
          }
          className={errors.targetAudience ? "border-destructive" : ""}
        />
        {errors.targetAudience && (
          <p className="text-xs text-destructive">{errors.targetAudience}</p>
        )}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Automatic Stage Assignment
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            All new ideas start at the <strong>Empathize</strong> stage. You can
            advance them through the Design Thinking stages in the Repository.
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Idea
          </>
        )}
      </Button>
    </form>
  );
}
