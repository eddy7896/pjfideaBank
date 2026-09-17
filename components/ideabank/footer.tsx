import Link from "next/link";
import { IdeabankLogo } from "./logo";

const EXPLORE_LINKS = [
  { href: "/problems", label: "Problem Bank" },
  { href: "/dashboard", label: "Share an Idea" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#for-teachers", label: "For Teachers" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/eula", label: "End User License" },
];

const TRUST_LINKS = [
  { href: "/child-safety", label: "Child Safety Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/accessibility", label: "Accessibility" },
];

export function IdeabankFooter() {
  return (
    <footer className="border-t border-[#DED8D3] bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 max-w-sm sm:col-span-1">
            <IdeabankLogo />
            <p className="mt-4 text-sm leading-relaxed text-[#3D3D3D]">
              Ideabank is a place for students and teachers to notice problems, and track how
              their own idea grows through observation, prototyping, and testing.
            </p>
            <a
              href="https://thepijam.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-[#3D3D3D] hover:text-[#15425B]"
            >
              thepijam.org
            </a>
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
            <Link href="/login" className="min-h-11 text-sm text-[#3D3D3D] hover:text-[#15425B] sm:min-h-0">
              Staff &amp; school sign in
            </Link>
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-2">
            <span className="mb-1 text-sm font-semibold text-[#111111]">Legal</span>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-11 text-sm text-[#3D3D3D] hover:text-[#15425B] sm:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Trust and safety" className="flex flex-col gap-2">
            <span className="mb-1 text-sm font-semibold text-[#111111]">Trust &amp; Safety</span>
            {TRUST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-11 text-sm text-[#3D3D3D] hover:text-[#15425B] sm:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-[#DED8D3] pt-6">
          <p className="text-sm text-[#3D3D3D]">© 2026 Ideabank by PiJam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
