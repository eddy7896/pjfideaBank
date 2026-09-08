"use client";

import { ShieldCheck, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/use-auth-store";

const ROLE_LABELS: Record<string, string> = {
  "super-admin": "Super Admin",
  "program-lead": "Program Lead",
  "geography-lead": "Geography Lead",
  "teacher-trainer": "Teacher Trainer",
  school: "School Admin",
  "sed-department": "SED Department",
  student: "Student Team",
};

export default function SettingsPage() {
  const { currentUser } = useAuthStore();

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account preferences and notification settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar for settings (could be tabs) */}
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start font-medium">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Account Security
          </Button>
          <Button variant="ghost" disabled className="w-full justify-between text-muted-foreground">
            <span className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Preferences
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Soon</span>
          </Button>
          <Button variant="ghost" disabled className="w-full justify-between text-muted-foreground">
            <span className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Soon</span>
          </Button>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-heading font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your account details. Fields here are managed by your Pi Jam administrator.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="displayName" className="font-semibold text-foreground">Display Name</Label>
                <Input id="displayName" value={currentUser?.displayName ?? ""} disabled className="bg-muted/50" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
                <Input id="email" type="email" value={currentUser?.email ?? ""} disabled className="bg-muted/50" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="role" className="font-semibold text-foreground">Role</Label>
                <Input
                  id="role"
                  value={currentUser ? (ROLE_LABELS[currentUser.role] ?? currentUser.role) : ""}
                  disabled
                  className="bg-muted/50"
                />
              </div>

              {currentUser?.schoolName && (
                <div className="grid gap-3">
                  <Label htmlFor="school" className="font-semibold text-foreground">School</Label>
                  <Input id="school" value={currentUser.schoolName} disabled className="bg-muted/50" />
                </div>
              )}
            </div>

            <div className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end">
              <Button disabled>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
