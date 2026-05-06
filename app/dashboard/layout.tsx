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
  "super-admin": "bg-indigo-100 text-indigo-700 border-indigo-200",
  school: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "education-dept": "bg-amber-100 text-amber-700 border-amber-200",
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const RoleIcon = roleIcons[currentUser.role];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold leading-none tracking-tight">
                Pi Jam
              </h1>
              <p className="text-xs text-muted-foreground">Idea Bank</p>
            </div>
          </Link>

          {/* Center Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                pathname === "/dashboard"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            {currentUser.role === "school" && (
              <Link
                href="/dashboard/submit"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                  pathname === "/dashboard/submit"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <PlusCircle className="h-4 w-4" />
                New Idea
              </Link>
            )}
            <Link
              href="/dashboard/themes"
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                pathname === "/dashboard/themes"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </nav>

          {/* Right: User info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 py-1 text-xs font-medium",
                  roleBadgeColors[currentUser.role]
                )}
              >
                <RoleIcon className="h-3 w-3" />
                {currentUser.displayName}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
