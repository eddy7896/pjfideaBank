import { Settings, ShieldCheck, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Email Preferences
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-heading font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your account details. Since you are using demo credentials, some fields are read-only.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="displayName" className="font-semibold text-foreground">Display Name</Label>
                <Input id="displayName" defaultValue="Demo User" disabled className="bg-muted/50" />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-semibold text-foreground">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled className="bg-muted/50" />
              </div>
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
