import { cn } from "@/lib/utils";

/** Original Ideabank wordmark: a simple idea-card/notebook glyph plus "by PiJam". */
export function IdeabankLogo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={cn("h-8 w-8 shrink-0", markClassName)}
      >
        <rect x="3" y="4" width="26" height="24" rx="6" fill="#15425B" />
        <rect x="8" y="10" width="12" height="2.4" rx="1.2" fill="#8DE3F6" />
        <rect x="8" y="15" width="16" height="2.4" rx="1.2" fill="#FFFFFF" fillOpacity="0.55" />
        <circle cx="24" cy="22" r="4.5" fill="#F4C66B" />
        <path
          d="M22.3 22.6L23.5 23.8L26 21.2"
          stroke="#15425B"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-[#111111] font-heading">
          Ideabank
        </span>
        <span className="text-[11px] font-medium tracking-wide text-[#3D3D3D]">by PiJam</span>
      </span>
    </span>
  );
}
