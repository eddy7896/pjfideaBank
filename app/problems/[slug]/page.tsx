import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { IdeabankButton } from "@/components/ideabank/button";
import { IdeaIllustration } from "@/components/ideabank/illustration";
import { SaveButton } from "@/components/ideabank/save-button";
import { BackToResults } from "@/components/ideabank/back-to-results";
import { ProblemCard } from "@/components/ideabank/problem-card";
import { PROBLEMS, getProblemBySlug, getRelatedProblems } from "@/lib/ideabank/data";

export function generateStaticParams() {
  return PROBLEMS.map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return { title: "Problem not found — Ideabank by PiJam" };
  return {
    title: `${problem.title} — Ideabank by PiJam`,
    description: problem.summary,
  };
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#DED8D3] py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold text-[#111111] font-heading">{heading}</h2>
      <div className="mt-3 max-w-[68ch] text-[16px] leading-relaxed text-[#3D3D3D]">{children}</div>
    </section>
  );
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) notFound();

  const related = getRelatedProblems(problem);

  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#3D3D3D]">
            <Link href="/" className="hover:text-[#15425B]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/problems" className="hover:text-[#15425B]">
              Problem Bank
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-[#111111]">
              {problem.title}
            </span>
          </nav>

          <div className="mt-4">
            <BackToResults />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <IdeaIllustration imageKey={problem.image} className="aspect-[4/3] w-full" iconClassName="h-20 w-20" priority sizes="(min-width: 1024px) 560px, 90vw" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4282A4]">{problem.category}</p>
              <h1 className="mt-2 text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-[#111111] font-heading">
                {problem.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#3D3D3D]">{problem.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <SaveButton slug={problem.slug} title={problem.title} variant="labelled" />
                <IdeabankButton href="/dashboard">
                  Have an idea? Start tracking it
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </IdeabankButton>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
            <div>
              <Section heading="The problem">
                <p>{problem.problem}</p>
              </Section>

              <Section heading="Who experiences it, and where">
                <p className="font-medium text-[#111111]">{problem.affectedUsers}</p>
                <p className="mt-2">{problem.context}</p>
              </Section>

              <Section heading="Questions to get you started">
                <ul className="flex flex-col gap-3">
                  {problem.promptQuestions.map((question, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-semibold text-[#15425B]">{i + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            <aside aria-label="Problem details" className="h-fit rounded-[22px] border border-[#DED8D3] bg-[#F4F2F1] p-6 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold text-[#111111]">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#3D3D3D]">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-[#3D3D3D]">
                No one has a ready-made answer for this one — that&apos;s the point. Document your
                own approach, materials, and testing notes as you go, in your dashboard.
              </p>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-[#DED8D3] pt-14">
              <h2 className="text-2xl font-bold text-[#111111] font-heading">Related problems</h2>
              <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((relatedProblem) => (
                  <ProblemCard key={relatedProblem.id} problem={relatedProblem} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <IdeabankFooter />
    </div>
  );
}
