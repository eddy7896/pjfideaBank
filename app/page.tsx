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
import { ProblemCard } from "@/components/ideabank/problem-card";
import { LearningStep } from "@/components/ideabank/learning-step";
import { HeroCollage } from "@/components/ideabank/hero-collage";
import { PurposeStatement } from "@/components/ideabank/purpose-statement";
import { TeacherResourcePanels } from "@/components/ideabank/teacher-resources";
import { ScrollReveal } from "@/components/ideabank/scroll-reveal";
import { IdeaIllustration, CATEGORY_ICONS } from "@/components/ideabank/illustration";
import { DoodleSpark, DoodleUnderline, DoodleArrow } from "@/components/ideabank/doodle";
import { PROBLEMS, FEATURED_PROBLEM_SLUGS, FEATURED_STORY_SLUG } from "@/lib/ideabank/data";
import { PROBLEM_CATEGORIES } from "@/lib/ideabank/types";

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

  const featuredProblems = FEATURED_PROBLEM_SLUGS.map((slug) => PROBLEMS.find((p) => p.slug === slug)!).filter(Boolean);
  const storyProblem = PROBLEMS.find((p) => p.slug === FEATURED_STORY_SLUG)!;

  function submitSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/problems${params.toString() ? `?${params.toString()}` : ""}`);
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
              Pick a real problem from the bank, or notice your own — then document and track
              your idea through every iteration, from first observation to a tested prototype.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <IdeabankButton href="/problems">Explore Problems</IdeabankButton>
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
            <SearchField
              value={query}
              onChange={setQuery}
              onSubmit={submitSearch}
              placeholder="Search problems by sector or keyword…"
            />
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {TOPIC_CHIPS.map((topic) => (
                <CategoryChip
                  key={topic}
                  label={topic}
                  onClick={() =>
                    router.push(`/problems?category=${encodeURIComponent(TOPIC_TO_CATEGORY[topic])}`)
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
              track how your idea changed after testing — a repository of your own work, not a
              catalogue of everyone else&apos;s.
            </p>
          </div>
        </section>

        {/* Featured problems */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionIntro
              eyebrow="From the problem bank"
              heading="A few problems to start with"
              description="Real, everyday problems across sectors — pick one, or let it point you toward your own."
            />
            <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProblems.map((problem, i) => (
                <ScrollReveal key={problem.id} delay={(i % 3) * 0.08}>
                  <ProblemCard problem={problem} />
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <IdeabankButton href="/problems" variant="secondary">
                See the whole problem bank
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
              description="Every idea you track moves through the same four honest stages."
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

        {/* Browse by sector */}
        <section className="border-y border-[#DED8D3] bg-[#F4F2F1] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <SectionIntro eyebrow="Browse" heading="Problems by sector" />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROBLEM_CATEGORIES.map((category, i) => {
                const Icon = CATEGORY_ICONS[category];
                return (
                  <ScrollReveal key={category} delay={(i % 3) * 0.06}>
                    <Link
                      href={`/problems?category=${encodeURIComponent(category)}`}
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
                        Browse problems
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured problem story */}
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ScrollReveal>
              <IdeaIllustration imageKey={storyProblem.image} className="aspect-[4/3] w-full" iconClassName="h-20 w-20" />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4282A4]">
                {storyProblem.category}
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-[#111111] font-heading">
                {storyProblem.title}
              </h2>

              <dl className="mt-6 flex flex-col gap-4">
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">The problem</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">{storyProblem.problem}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Who&apos;s affected</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">{storyProblem.affectedUsers}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">A question to start with</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#3D3D3D]">
                    {storyProblem.promptQuestions[0]}
                  </dd>
                </div>
              </dl>

              <div className="mt-7">
                <IdeabankButton href={`/problems/${storyProblem.slug}`}>
                  Think it through
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
