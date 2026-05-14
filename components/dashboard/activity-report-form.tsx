"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ActivityReport } from "@/types";

interface ActivityReportFormProps {
  activityId: string;
  activityTitle: string;
  schoolName: string;
  teacherName: string;
  onSuccess?: (report: ActivityReport) => void;
}

export function ActivityReportForm({
  activityId,
  activityTitle,
  schoolName,
  teacherName,
  onSuccess,
}: ActivityReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [materials, setMaterials] = useState<Array<{ name: string; quantityUsed: number; stockStatus: string }>>([
    { name: "", quantityUsed: 0, stockStatus: "Good" },
  ]);

  const [form, setForm] = useState({
    sessionDate: new Date().toISOString().split("T")[0],
    timeIn: "09:00",
    timeOut: "10:00",
    grades: "",
    totalStudents: 0,
    boysCount: 0,
    girlsCount: 0,
    lcmsCode: "",
    topicsLessons: "",
    learningGoal: "",
    safetyBriefing: true,
    ppeWorn: true,
    labCleanup: true,
    incidentNotes: "",
    studentEngagement: "Moderate" as const,
    successes: "",
    challenges: "",
    followUpActions: "",
  });

  const addMaterial = () => {
    setMaterials([...materials, { name: "", quantityUsed: 0, stockStatus: "Good" }]);
  };

  const removeMaterial = (idx: number) => {
    setMaterials(materials.filter((_, i) => i !== idx));
  };

  const updateMaterial = (idx: number, field: string, value: any) => {
    const updated = [...materials];
    updated[idx] = { ...updated[idx], [field]: value };
    setMaterials(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!form.grades.trim() || !form.topicsLessons.trim() || !form.learningGoal.trim()) {
        toast.error("Fill all required fields");
        return;
      }

      const validMaterials = materials.filter((m) => m.name.trim());

      const payload = {
        activityId,
        schoolName,
        teacherName,
        sessionDate: form.sessionDate,
        timeIn: form.timeIn,
        timeOut: form.timeOut,
        grades: form.grades,
        totalStudents: form.totalStudents,
        boysCount: form.boysCount,
        girlsCount: form.girlsCount,
        lcmsCode: form.lcmsCode,
        topicsLessons: form.topicsLessons,
        learningGoal: form.learningGoal,
        materials: validMaterials,
        safetyBriefing: form.safetyBriefing,
        ppeWorn: form.ppeWorn,
        labCleanup: form.labCleanup,
        incidentNotes: form.incidentNotes,
        studentEngagement: form.studentEngagement,
        successes: form.successes,
        challenges: form.challenges,
        followUpActions: form.followUpActions,
        submittedBy: teacherName,
      };

      const res = await fetch("/api/activity-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const report = await res.json();
        toast.success("Activity report submitted");
        setIsOpen(false);
        onSuccess?.(report);
      } else {
        toast.error("Failed to submit report");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        Submit Activity Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Report: {activityTitle}</DialogTitle>
            <DialogDescription>
              Document session details, resources used, and reflections
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">1. General Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sessionDate" className="text-xs">Session Date *</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={form.sessionDate}
                    onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeIn" className="text-xs">Time In</Label>
                  <Input
                    id="timeIn"
                    type="time"
                    value={form.timeIn}
                    onChange={(e) => setForm({ ...form, timeIn: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeOut" className="text-xs">Time Out</Label>
                  <Input
                    id="timeOut"
                    type="time"
                    value={form.timeOut}
                    onChange={(e) => setForm({ ...form, timeOut: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="grades" className="text-xs">Grades/Classes *</Label>
                  <Input
                    id="grades"
                    placeholder="e.g., 8A, 9B"
                    value={form.grades}
                    onChange={(e) => setForm({ ...form, grades: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalStudents" className="text-xs">Total Students</Label>
                  <Input
                    id="totalStudents"
                    type="number"
                    min="0"
                    value={form.totalStudents}
                    onChange={(e) => setForm({ ...form, totalStudents: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="boysCount" className="text-xs">Boys</Label>
                  <Input
                    id="boysCount"
                    type="number"
                    min="0"
                    value={form.boysCount}
                    onChange={(e) => setForm({ ...form, boysCount: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="girlsCount" className="text-xs">Girls</Label>
                  <Input
                    id="girlsCount"
                    type="number"
                    min="0"
                    value={form.girlsCount}
                    onChange={(e) => setForm({ ...form, girlsCount: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="lcmsCode" className="text-xs">LCMS Code</Label>
                  <Input
                    id="lcmsCode"
                    placeholder="Optional"
                    value={form.lcmsCode}
                    onChange={(e) => setForm({ ...form, lcmsCode: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="topicsLessons" className="text-xs">Topics/Lessons Covered *</Label>
                <Textarea
                  id="topicsLessons"
                  placeholder="Describe topics and lessons..."
                  value={form.topicsLessons}
                  onChange={(e) => setForm({ ...form, topicsLessons: e.target.value })}
                  className="min-h-16"
                />
              </div>
            </div>

            {/* Session Objectives */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">2. Session Objectives</h3>
              <Label htmlFor="learningGoal" className="text-xs">Specific Learning Goal *</Label>
              <Textarea
                id="learningGoal"
                placeholder="State the primary learning objective..."
                value={form.learningGoal}
                onChange={(e) => setForm({ ...form, learningGoal: e.target.value })}
                className="min-h-16"
              />
            </div>

            {/* Resources & Inventory */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">3. Resources & Inventory</h3>
                <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                  + Add Material
                </Button>
              </div>
              <div className="space-y-2">
                {materials.map((mat, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Material name"
                        value={mat.name}
                        onChange={(e) => updateMaterial(idx, "name", e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        min="0"
                        value={mat.quantityUsed}
                        onChange={(e) => updateMaterial(idx, "quantityUsed", parseInt(e.target.value))}
                        className="text-xs"
                      />
                      <Select value={mat.stockStatus} onValueChange={(v) => updateMaterial(idx, "stockStatus", v)}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Out">Out</SelectItem>
                        </SelectContent>
                      </Select>
                      {materials.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(idx)}
                          className="text-destructive"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Safety & Hygiene */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">4. Safety & Hygiene</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="safetyBriefing"
                    checked={form.safetyBriefing}
                    onCheckedChange={(v) => setForm({ ...form, safetyBriefing: v as boolean })}
                  />
                  <Label htmlFor="safetyBriefing" className="text-xs">Safety Briefing Conducted</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ppeWorn"
                    checked={form.ppeWorn}
                    onCheckedChange={(v) => setForm({ ...form, ppeWorn: v as boolean })}
                  />
                  <Label htmlFor="ppeWorn" className="text-xs">PPE (Goggles/Gloves) Worn</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="labCleanup"
                    checked={form.labCleanup}
                    onCheckedChange={(v) => setForm({ ...form, labCleanup: v as boolean })}
                  />
                  <Label htmlFor="labCleanup" className="text-xs">Lab Cleanup Completed</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="incidentNotes" className="text-xs">Incident Notes (if any)</Label>
                <Textarea
                  id="incidentNotes"
                  placeholder="Describe any incidents..."
                  value={form.incidentNotes}
                  onChange={(e) => setForm({ ...form, incidentNotes: e.target.value })}
                  className="min-h-12"
                />
              </div>
            </div>

            {/* Session Reflection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">5. Session Reflection</h3>
              <div>
                <Label htmlFor="engagement" className="text-xs">Student Engagement</Label>
                <Select value={form.studentEngagement} onValueChange={(v: any) => setForm({ ...form, studentEngagement: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low (Distracted/Confused)</SelectItem>
                    <SelectItem value="Moderate">Moderate (Steady Work)</SelectItem>
                    <SelectItem value="High">High (Flow State)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="successes" className="text-xs">What worked well and why?</Label>
                <Textarea
                  id="successes"
                  placeholder="Describe successes..."
                  value={form.successes}
                  onChange={(e) => setForm({ ...form, successes: e.target.value })}
                  className="min-h-12"
                />
              </div>
              <div>
                <Label htmlFor="challenges" className="text-xs">Challenges/Blockers</Label>
                <Textarea
                  id="challenges"
                  placeholder="Describe challenges..."
                  value={form.challenges}
                  onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                  className="min-h-12"
                />
              </div>
            </div>

            {/* Follow-up Actions */}
            <div>
              <h3 className="font-semibold text-sm mb-2">6. Follow-up Actions</h3>
              <Label htmlFor="followUp" className="text-xs">Preparation for Next Class</Label>
              <Textarea
                id="followUp"
                placeholder="Describe next steps..."
                value={form.followUpActions}
                onChange={(e) => setForm({ ...form, followUpActions: e.target.value })}
                className="min-h-12"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
