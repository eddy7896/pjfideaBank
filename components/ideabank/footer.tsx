import Link from "next/link";
import { IdeabankLogo } from "./logo";

const EXPLORE_LINKS = [
  { href: "/problems", label: "Problem Bank" },
  { href: "/dashboard", label: "Share an Idea" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#for-teachers", label: "For Teachers" },
];

export function IdeabankFooter() {
  return (
    <footer className="border-t border-[#DED8D3] bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <IdeabankLogo />
            <p className="mt-4 text-sm leading-relaxed text-[#3D3D3D]">
              Ideabank is a place for students and teachers to notice problems, and track how
              their own idea grows through observation, prototyping, and testing.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <span className="mb-1 text-sm font-semibold text-[#111111]">Explore</span>
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-11 text-sm text-[#3D3D3D] hover:text-[#15425B] sm:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <span className="mb-1 text-sm font-semibold text-[#111111]">PiJam</span>
            <a
              href="https://thepijam.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#3D3D3D] hover:text-[#15425B]"
            >
              thepijam.org
            </a>
            <Link href="/login" className="text-sm text-[#3D3D3D] hover:text-[#15425B]">
              Staff &amp; school sign in
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-[#DED8D3] pt-6">
          <p className="text-sm text-[#3D3D3D]">© 2026 Ideabank by PiJam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
