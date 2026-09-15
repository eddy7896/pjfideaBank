import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Problem } from "@/lib/ideabank/types";
import { IdeaIllustration } from "./illustration";
import { SaveButton } from "./save-button";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[22px] border border-[#DED8D3] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#4282A4] hover:shadow-[0_12px_32px_-16px_rgba(17,17,17,0.25)]">
      <div className="relative mb-5 overflow-hidden rounded-[16px]">
        <IdeaIllustration
          imageKey={problem.image}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.025]"
        />
      </div>

      <span className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#4282A4]">
        {problem.category}
      </span>

      <h3 className="text-[22px] font-semibold leading-snug text-[#111111]">
        <Link
          href={`/problems/${problem.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4] focus-visible:ring-offset-2 rounded"
        >
          {problem.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#3D3D3D]">{problem.summary}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="relative z-10 inline-flex items-center gap-1 text-sm font-semibold text-[#15425B]">
          Think it through
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
        <SaveButton slug={problem.slug} title={problem.title} />
      </div>
    </article>
  );
}
