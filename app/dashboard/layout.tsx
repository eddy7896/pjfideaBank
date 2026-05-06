"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  School,
  Building2,
  Calendar,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";

const roleIcons = {
  "super-admin": ShieldCheck,
  school: School,
  "education-dept": Building2,
};

const roleBadgeColors = {
  "super-admin": "bg-primary/10 text-primary border-primary/20",
  school: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "education-dept": "bg-accent/10 text-accent border-accent/20",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const RoleIcon = roleIcons[currentUser.role];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-sm transition-all">
        {/* Logo Area */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-border/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-semibold leading-none tracking-tight text-foreground">
              Pi Jam
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">
              Idea Bank
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname === "/dashboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/themes"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname.startsWith("/dashboard/themes")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Link>

          {currentUser.role === "school" && (
            <Link
              href="/dashboard/submit"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                pathname === "/dashboard/submit"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              <PlusCircle className="h-4 w-4" />
              New Idea
            </Link>
          )}

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname === "/dashboard/settings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>

        {/* User Info & Logout (Bottom) */}
        <div className="border-t border-border/40 p-4">
          <div className="flex flex-col gap-3">
            <Badge
              variant="outline"
              className={cn(
                "w-fit gap-1.5 px-2 py-1 text-xs font-medium",
                roleBadgeColors[currentUser.role]
              )}
            >
              <RoleIcon className="h-3.5 w-3.5" />
              {currentUser.displayName}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground border-border bg-background"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
