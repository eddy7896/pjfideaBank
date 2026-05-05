"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  Menu,
  ShieldCheck,
  School,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/use-auth-store";
import { MOCK_USERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Calendar" },
  { href: "/repository", label: "Repository" },
  { href: "/submit", label: "Submit Idea" },
];

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

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUser } = useAuthStore();
  const RoleIcon = roleIcons[currentUser.role];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            if (link.href === "/submit" && currentUser.role === "education-dept") {
              return null;
            }
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Role Switcher */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="hidden h-9 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 text-sm font-medium transition-colors hover:bg-accent sm:flex">
                  <RoleIcon className="h-4 w-4" />
                  <span className="max-w-[140px] truncate">
                    {currentUser.displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Switch Role
              </p>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
              {MOCK_USERS.map((user) => {
                const Icon = roleIcons[user.role];
                const isSelected =
                  currentUser.displayName === user.displayName;
                return (
                  <DropdownMenuItem
                    key={user.displayName}
                    onClick={() => switchUser(user)}
                    className={cn(
                      "gap-2.5 py-2.5",
                      isSelected && "bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.displayName}
                      </span>
                      <span className="text-xs capitalize text-muted-foreground">
                        {user.role.replace("-", " ")}
                      </span>
                    </div>
                    {isSelected && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-auto text-[10px]",
                          roleBadgeColors[user.role]
                        )}
                      >
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden">
                  <Menu className="h-5 w-5" />
                </button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-indigo-500" />
                  Pi Jam Idea Bank
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2 px-4">
                {navLinks.map((link) => {
                  if (
                    link.href === "/submit" &&
                    currentUser.role === "education-dept"
                  ) {
                    return null;
                  }
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="my-3 h-px bg-border" />

                <p className="px-4 text-xs font-medium text-muted-foreground">
                  Switch Role
                </p>
                {MOCK_USERS.map((user) => {
                  const Icon = roleIcons[user.role];
                  const isSelected =
                    currentUser.displayName === user.displayName;
                  return (
                    <button
                      key={user.displayName}
                      onClick={() => switchUser(user)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-left text-sm transition-all",
                        isSelected
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {user.displayName}
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
