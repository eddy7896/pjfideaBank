"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  School,
  Building2,
  Calendar,
  Settings,
  Folder,
  Users as UsersIcon,
  BarChart3,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { useTeamStore } from "@/store/use-team-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useActivityStore } from "@/store/use-activity-store";
import { cn } from "@/lib/utils";

const roleIcons: Record<string, typeof ShieldCheck> = {
  "super-admin": ShieldCheck,
  school: School,
  "sed-department": Building2,
  student: UsersIcon,
};

const roleBadgeColors: Record<string, string> = {
  "super-admin": "bg-primary/10 text-primary border-primary/20",
  school: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "sed-department": "bg-accent/10 text-accent border-accent/20",
  student: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout, hydrate } = useAuthStore();
  const { loadTeams } = useTeamStore();
  const { loadIdeas } = useIdeaStore();
  const { loadActivities } = useActivityStore();
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    hydrate().finally(() => setHydrated(true));
  }, [hydrate]);

  useEffect(() => {
    if (mounted && hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const seed = async () => {
        try {
          await fetch("/api/seed", {
            method: "POST",
            headers: { "Authorization": "Bearer seed-token-pijam" },
          });
        } catch (e) {
          // Seed may fail if data exists, that's ok
        }
        loadTeams();
        loadIdeas();
        loadActivities();
      };
      seed();
    }
  }, [mounted, isAuthenticated, loadTeams, loadIdeas, loadActivities]);

  if (!mounted || !hydrated || !isAuthenticated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const RoleIcon = roleIcons[currentUser.role] || ShieldCheck;

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border/40 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-sm font-heading font-bold text-foreground">Pi Jam</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-sm transition-all",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="md:hidden pt-14" />
        {/* Logo Area */}
        <div className="flex h-24 shrink-0 items-center justify-center px-6 border-b border-border/40">
          <Image
            src="/pijam logo.jpeg"
            alt="Pi Jam Logo"
            width={150}
            height={60}
            className="rounded-lg"
            priority
          />
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
              pathname === "/dashboard"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/calendar"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
              pathname === "/dashboard/calendar"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Link>

          {currentUser.role === "school" && (
            <>
              <Link
                href="/dashboard/activities"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/activities"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <FileText className="h-4 w-4" />
                Activities
              </Link>

              <Link
                href="/dashboard/teams"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/teams"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <UsersIcon className="h-4 w-4" />
                Teams
              </Link>

              <Link
                href="/dashboard/projects"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname.startsWith("/dashboard/projects")
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <Folder className="h-4 w-4" />
                Projects
              </Link>

              <Link
                href="/dashboard/submit"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/submit"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <PlusCircle className="h-4 w-4" />
                New Idea
              </Link>
            </>
          )}

          {currentUser.role === "super-admin" && (
            <>
              <Link
                href="/dashboard/admin/users"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname.startsWith("/dashboard/admin/users")
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin · Users
              </Link>
              <Link
                href="/dashboard/activities"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/activities"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <FileText className="h-4 w-4" />
                Activities
              </Link>
              <Link
                href="/dashboard/schools"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/schools"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <School className="h-4 w-4" />
                Schools
              </Link>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  pathname === "/dashboard/analytics"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
            </>
          )}

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
              pathname === "/dashboard/settings"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
