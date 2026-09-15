"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { IdeabankButton } from "@/components/ideabank/button";
import { SectionIntro } from "@/components/ideabank/section-intro";
import { SearchField } from "@/components/ideabank/search-field";
import { CategoryChip } from "@/components/ideabank/category-chip";
import { IdeaCard } from "@/components/ideabank/idea-card";
import { LearningStep } from "@/components/ideabank/learning-step";
import { HeroCollage } from "@/components/ideabank/hero-collage";
import { PurposeStatement } from "@/components/ideabank/purpose-statement";
import { TeacherResourcePanels } from "@/components/ideabank/teacher-resources";
import { ScrollReveal } from "@/components/ideabank/scroll-reveal";
import { StageBadge } from "@/components/ideabank/stage-badge";
import { IdeaIllustration, CATEGORY_ICONS } from "@/components/ideabank/illustration";
import { DoodleSpark, DoodleUnderline, DoodleArrow } from "@/components/ideabank/doodle";
import { IDEAS, FEATURED_IDEA_SLUGS, FEATURED_STORY_SLUG } from "@/lib/ideabank/data";
import { IDEA_CATEGORIES } from "@/lib/ideabank/types";

const TOPIC_CHIPS = ["Water", "Agriculture", "Environment", "Accessibility", "School Life", "Community"];

const TOPIC_TO_CATEGORY: Record<string, string> = {
  Water: "Water & Sanitation",
  Agriculture: "Agriculture & Food",
  Environment: "Environment & Climate",
  Accessibility: "Accessibility & Inclusion",
  "School Life": "School & Learning",
  Community: "Community & Safety",
};

const LEARNING_STEPS = [
  {
    number: "01",
    hindi: "सोचो",
    english: "Think",
    description: "Notice patterns and ask useful questions about what isn't working around you.",
  },
  {
    number: "02",
    hindi: "समझो",
    english: "Understand",
    description: "Listen to the people affected and understand the problem from their side of it.",
  },
  {
    number: "03",
    hindi: "बनाओ",
    english: "Build",
    description: "Sketch, experiment, and put together a rough first version worth testing.",
  },
  {
    number: "04",
    hindi: "बदलो",
    english: "Change",
    description: "Test it with real people, learn from what breaks, and improve it.",
  },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Water & Sanitation": "Leaks, access, quality, and everyday water use around school and home.",
  "Agriculture & Food": "Growing, storing, and handling food, from kitchen gardens to family farms.",
  "Environment & Climate": "Weather, waste, biodiversity, and the systems around us changing.",
  "Accessibility & Inclusion": "Making spaces and tools work for people of every ability.",
  "School & Learning": "The everyday friction of classrooms, corridors, and school routines.",
  "Community & Safety": "Shared spaces, roads, and the small things that keep a neighbourhood safe.",
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const featuredIdeas = FEATURED_IDEA_SLUGS.map((slug) => IDEAS.find((i) => i.slug === slug)!).filter(Boolean);
  const storyIdea = IDEAS.find((i) => i.slug === FEATURED_STORY_SLUG)!;

  function submitSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
          <div className="mx-auto max-w-[1240px] text-center">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#4282A4]">
              Ideabank by PiJam
            </p>

            <h1 className="relative mx-auto max-w-4xl text-[clamp(2.375rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-[#111111] font-heading">
              Small observations.
              <br />
              Ideas that make a difference.
              <DoodleSpark className="absolute -right-2 top-0 hidden sm:block lg:-right-8" />
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#3D3D3D] sm:text-xl">
              Explore everyday challenges, learn from young creators, and turn your own
              questions into ideas worth building.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <IdeabankButton href="/explore">Explore Ideas</IdeabankButton>
              <IdeabankButton href="/dashboard" variant="secondary">
                Share an Idea
              </IdeabankButton>
            </div>

            <div className="mt-14">
              <HeroCollage />
            </div>
          </div>
        </section>

        {/* Search and discovery entry */}
        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            <SearchField value={query} onChange={setQuery} onSubmit={submitSearch} />
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {TOPIC_CHIPS.map((topic) => (
                <CategoryChip
                  key={topic}
                  label={topic}
                  onClick={() =>
                    router.push(`/explore?category=${encodeURIComponent(TOPIC_TO_CATEGORY[topic])}`)
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Purpose statement */}
        <section className="border-y border-[#DED8D3] bg-[#F4F2F1] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <PurposeStatement />
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[#3D3D3D]">
              Ideabank is a place to write down what you noticed, sketch what you tried, and
              share how it changed after testing — so the next student doesn&apos;t have to
              start from nothing.
            </p>
          </div>
        </section>

        {/* Featured ideas */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionIntro
              eyebrow="From the bank"
              heading="A few ideas to start with"
              description="Demonstration examples showing how an idea moves from a noticed problem toward a tested prototype."
            />
            <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featuredIdeas.map((idea, i) => (
                <ScrollReveal key={idea.id} delay={(i % 3) * 0.08}>
                  <IdeaCard idea={idea} />
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <IdeabankButton href="/explore" variant="secondary">
                See all ideas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </IdeabankButton>
            </div>
          </div>
        </section>

        {/* Learning journey */}
        <section id="how-it-works" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionIntro
              eyebrow="How it works"
              heading="A journey, not a straight line"
              description="Every idea in the bank moves through the same four honest stages."
            />
            <div className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {LEARNING_STEPS.map((step, i) => (
                <ScrollReveal key={step.number} delay={i * 0.08} className="relative">
                  <LearningStep {...step} />
                  {i < LEARNING_STEPS.length - 1 && (
                    <DoodleArrow className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 lg:block" />
                  )}
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by theme */}
        <section className="border-y border-[#DED8D3] bg-[#F4F2F1] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionIntro eyebrow="Browse" heading="Explore by theme" />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {IDEA_CATEGORIES.map((category, i) => {
                const Icon = CATEGORY_ICONS[category];
                return (
                  <ScrollReveal key={category} delay={(i % 3) * 0.06}>
                    <Link
                      href={`/explore?category=${encodeURIComponent(category)}`}
                      className="group flex h-full flex-col rounded-[22px] border border-[#DED8D3] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#4282A4] hover:shadow-[0_12px_32px_-16px_rgba(17,17,17,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4]"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF7FA] text-[#15425B]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-[#111111]">{category}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#3D3D3D]">
                        {CATEGORY_DESCRIPTIONS[category]}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4282A4]">
                        Browse ideas
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured idea story */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ScrollReveal>
              <IdeaIllustration imageKey={storyIdea.image} className="aspect-[4/3] w-full" iconClassName="h-20 w-20" />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4282A4]">
                {storyIdea.category}
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-[#111111] font-heading">
                {storyIdea.title}
              </h2>
              <div className="mt-2">
                <StageBadge stage={storyIdea.stage} />
              </div>

              <dl className="mt-6 flex flex-col gap-4">
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Observation</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">{storyIdea.problem}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Proposed approach</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">{storyIdea.proposedSolution}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Next experiment</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">
                    {storyIdea.improvements ?? "Testing notes and next steps are still being documented."}
                  </dd>
                </div>
              </dl>

              <div className="mt-7">
                <IdeabankButton href={`/ideas/${storyIdea.slug}`}>
                  Explore the idea
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </IdeabankButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Teacher support */}
        <section id="for-teachers" className="scroll-mt-20 border-y border-[#DED8D3] bg-[#F4F2F1] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-2xl text-center">
              <DoodleUnderline className="mx-auto mb-4 w-24" />
              <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.15] tracking-tight text-[#111111] font-heading">
                Make room for the next good question.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3D3D3D]">
                Practical starting points for bringing observation and iteration into a
                regular class period.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <TeacherResourcePanels />
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-[#15425B] px-8 py-16 text-center sm:px-16 sm:py-20">
            <h2 className="text-[clamp(1.875rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-white font-heading">
              What did you notice today?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              A small observation could be the beginning of your next project.
            </p>
            <div className="mt-9">
              <IdeabankButton href="/dashboard" variant="cyan">
                Share an Idea
              </IdeabankButton>
            </div>
          </div>
        </section>
      </main>

      <IdeabankFooter />
    </div>
  );
}
