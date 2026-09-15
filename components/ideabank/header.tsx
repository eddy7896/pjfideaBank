"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { IdeabankLogo } from "./logo";
import { IdeabankButton } from "./button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/explore", label: "Explore Ideas" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#for-teachers", label: "For Teachers" },
];

export function IdeabankHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/95 backdrop-blur-sm transition-shadow duration-200",
        scrolled ? "border-b border-[#DED8D3] shadow-[0_2px_12px_-8px_rgba(17,17,17,0.2)]" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4] rounded-lg">
          <IdeabankLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-[15px] font-medium text-[#111111] transition-colors hover:text-[#15425B]"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#4282A4] transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="text-sm font-medium text-[#3D3D3D] hover:text-[#111111]">
            Sign In
          </Link>
          <IdeabankButton href="/share" size="sm">
            Share an Idea
          </IdeabankButton>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#111111] hover:bg-[#F4F2F1] lg:hidden"
              />
            }
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>
                <IdeabankLogo />
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Primary" className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="min-h-11 rounded-xl px-3 py-3 text-base font-medium text-[#111111] hover:bg-[#F4F2F1]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="min-h-11 rounded-xl px-3 py-3 text-base font-medium text-[#3D3D3D] hover:bg-[#F4F2F1]"
              >
                Sign In
              </Link>
            </nav>
            <div className="mt-auto p-4">
              <IdeabankButton href="/share" className="w-full">
                Share an Idea
              </IdeabankButton>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
