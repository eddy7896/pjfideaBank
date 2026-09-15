import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { IdeaIllustration } from "@/components/ideabank/illustration";
import { StageBadge } from "@/components/ideabank/stage-badge";
import { SaveButton } from "@/components/ideabank/save-button";
import { BackToResults } from "@/components/ideabank/back-to-results";
import { IdeaCard } from "@/components/ideabank/idea-card";
import { IDEAS, getIdeaBySlug, getRelatedIdeas } from "@/lib/ideabank/data";

export function generateStaticParams() {
  return IDEAS.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);
  if (!idea) return { title: "Idea not found — Ideabank by PiJam" };
  return {
    title: `${idea.title} — Ideabank by PiJam`,
    description: idea.summary,
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

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="italic text-[#3D3D3D]/80">{children}</p>;
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);
  if (!idea) notFound();

  const related = getRelatedIdeas(idea);

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
            <Link href="/explore" className="hover:text-[#15425B]">
              Explore Ideas
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-[#111111]">
              {idea.title}
            </span>
          </nav>

          <div className="mt-4">
            <BackToResults />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <IdeaIllustration
                imageKey={idea.image}
                className="aspect-[4/3] w-full"
                iconClassName="h-20 w-20"
                priority
                sizes="(min-width: 1024px) 560px, 90vw"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4282A4]">{idea.category}</p>
              <h1 className="mt-2 text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-[#111111] font-heading">
                {idea.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <StageBadge stage={idea.stage} />
                <span className="text-sm font-medium text-[#3D3D3D]">
                  {idea.estimatedCost !== null ? `Estimated cost: ~₹${idea.estimatedCost}` : "Cost not estimated"}
                </span>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-[#3D3D3D]">{idea.summary}</p>
              <div className="mt-6">
                <SaveButton slug={idea.slug} title={idea.title} variant="labelled" />
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_320px]">
            <div>
              <Section heading="Problem observed">
                <p>{idea.problem}</p>
              </Section>

              <Section heading="Who experiences it, and where">
                <p className="font-medium text-[#111111]">{idea.affectedUsers}</p>
                <p className="mt-2">{idea.context}</p>
              </Section>

              <Section heading="Proposed solution">
                <p>{idea.proposedSolution}</p>
              </Section>

              <Section heading="Materials and estimated cost">
                {idea.materials.length === 0 ? (
                  <EmptyNote>Materials haven&apos;t been listed yet.</EmptyNote>
                ) : (
                  <>
                    <ul className="flex flex-col gap-2">
                      {idea.materials.map((material) => (
                        <li key={material.name} className="flex items-center justify-between gap-4 border-b border-[#DED8D3] pb-2">
                          <span>{material.name}</span>
                          <span className="font-medium text-[#111111]">
                            {material.costRupees !== null ? `₹${material.costRupees}` : "Not estimated"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 font-semibold text-[#111111]">
                      Total: {idea.estimatedCost !== null ? `~₹${idea.estimatedCost}` : "Not estimated"}
                    </p>
                  </>
                )}
              </Section>

              <Section heading="Prototype steps">
                {idea.prototypeSteps.length === 0 ? (
                  <EmptyNote>This idea hasn&apos;t reached prototyping yet.</EmptyNote>
                ) : (
                  <ol className="flex flex-col gap-3">
                    {idea.prototypeSteps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold text-[#15425B]">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </Section>

              <Section heading="Testing notes">
                {idea.testingNotes ? <p>{idea.testingNotes}</p> : <EmptyNote>Testing notes haven&apos;t been added yet.</EmptyNote>}
              </Section>

              <Section heading="What changed, open questions, and possible improvements">
                {idea.improvements ? (
                  <p>{idea.improvements}</p>
                ) : (
                  <EmptyNote>This idea hasn&apos;t been revisited after feedback yet — that&apos;s the next step.</EmptyNote>
                )}
              </Section>
            </div>

            <aside aria-label="Idea details" className="h-fit rounded-[22px] border border-[#DED8D3] bg-[#F4F2F1] p-6 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold text-[#111111]">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#3D3D3D]">
                    {tag}
                  </span>
                ))}
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-[#DED8D3] pt-14">
              <h2 className="text-2xl font-bold text-[#111111] font-heading">Related ideas</h2>
              <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((relatedIdea) => (
                  <IdeaCard key={relatedIdea.id} idea={relatedIdea} />
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
