import { cn } from "@/lib/utils";

interface SectionIntroProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  headingId?: string;
}

export function SectionIntro({
  eyebrow,
  heading,
  description,
  align = "center",
  className,
  headingId,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "mx-0 max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#4282A4]">
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className="text-[clamp(1.875rem,4vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-[#111111] font-heading"
      >
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-[#3D3D3D]">{description}</p>
      )}
    </div>
  );
}
