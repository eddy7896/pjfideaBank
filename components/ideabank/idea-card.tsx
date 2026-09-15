import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Idea } from "@/lib/ideabank/types";
import { IdeaIllustration } from "./illustration";
import { StageBadge } from "./stage-badge";
import { SaveButton } from "./save-button";

interface IdeaCardProps {
  idea: Idea;
  className?: string;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[22px] border border-[#DED8D3] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#4282A4] hover:shadow-[0_12px_32px_-16px_rgba(17,17,17,0.25)]">
      <div className="relative mb-5 overflow-hidden rounded-[16px]">
        <IdeaIllustration
          imageKey={idea.image}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.025]"
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#4282A4]">
          {idea.category}
        </span>
        <StageBadge stage={idea.stage} />
      </div>

      <h3 className="text-[22px] font-semibold leading-snug text-[#111111]">
        <Link
          href={`/ideas/${idea.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4] focus-visible:ring-offset-2 rounded"
        >
          {idea.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#3D3D3D]">{idea.summary}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#3D3D3D]">
          {idea.estimatedCost !== null ? `~₹${idea.estimatedCost}` : "Not estimated"}
        </span>
        <div className="relative z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#15425B]">
            View Idea
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <SaveButton slug={idea.slug} title={idea.title} />
        </div>
      </div>
    </article>
  );
}
