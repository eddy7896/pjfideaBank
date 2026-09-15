"use client";

import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { motion } from "framer-motion";
import { ScrollRevealHeadline } from "@/components/landing/scroll-reveal-headline";
import { TypewriterHeadline } from "@/components/landing/typewriter-headline";
import { StatCounter } from "@/components/landing/stat-counter";
import { TiltCard } from "@/components/landing/tilt-card";

// Grounded in real idea titles from the platform (see prisma/seed.ts) —
// each line is "the problem a team started with" -> "what they shipped".
const HERO_EXAMPLES = [
  "A dark study table becomes Solar Powered Desk Lamps",
  "A stuck homework question becomes an AI Homework Helper Chatbot",
  "An unlit street becomes a Neighborhood Safety Mapping App",
  "A quiet classroom becomes a Mental Health Check-In Kiosk",
  "A dry monsoon tank becomes a Rainwater Harvesting Tracker",
  "A missed school bus becomes Smart School Bus Routing",
] as const;

// Brand-register display face — scoped to this page only via the
// .variable class below, never touches the product surface's font-sans.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const PIPELINE = [
  {
    stage: "Empathize",
    verb: "Notice the problem",
    detail:
      "Who's affected, when, where, how. Then five whys, one after another, until you hit the real cause instead of the obvious one.",
    example: "Neighborhood Safety Mapping App",
  },
  {
    stage: "Define",
    verb: "Name it precisely",
    detail:
      "One How-Might-We sentence. A real persona, not a demographic. A need statement specific enough to actually fail.",
    example: "Mental Health Check-In Kiosk",
  },
  {
    stage: "Ideate",
    verb: "Generate, then choose",
    detail:
      "Brainstorm without judging it. Pick one. Write down why — and what constraints it has to work inside.",
    example: "Community Skill-Share Platform",
  },
  {
    stage: "Prototype",
    verb: "Build the rough version",
    detail:
      "List the tools. Log every iteration: what changed, what broke, what got learned from the breaking.",
    example: "Solar Powered Desk Lamps",
  },
  {
    stage: "Test",
    verb: "Put it in front of people",
    detail:
      "Real users, real feedback. Pass moves forward. Fail sends it back to Prototype — on purpose, not as a setback.",
    example: "AI Homework Helper Chatbot",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function LandingPage() {
  return (
    <div className={`${bricolage.variable} min-h-screen bg-[#FAFBFC] text-[#161B22]`}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#DFE4EA] bg-[#FAFBFC]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/pijam logo.jpeg"
              alt="Pi Jam Logo"
              width={150}
              height={60}
              className="rounded-lg"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/pijam"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#DFE4EA] bg-white px-4 text-sm font-medium text-[#161B22] transition-colors hover:bg-[#F0F3F6]"
            >
              Staff Portal
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg bg-[#5BA4C7] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4C92B5]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[#5BA4C7]"
          >
            Pi Jam Foundation · Design Thinking for Schools
          </motion.p>

          <ScrollRevealHeadline
            text="IDEAS BECOME INNOVATIONS"
            className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight text-[#161B22] sm:text-[8vw] lg:text-[5.5rem]"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mt-8 flex min-h-[3.5em] max-w-3xl items-start justify-center px-2 sm:min-h-[2.5em]"
          >
            <TypewriterHeadline
              phrases={HERO_EXAMPLES}
              className="text-lg leading-relaxed text-[#56606B] sm:text-xl"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#5BA4C7] px-8 text-base font-semibold text-white transition-all hover:bg-[#4C92B5] active:scale-[0.98]"
            >
              Explore the Platform
            </Link>
            <a
              href="#pipeline"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#DFE4EA] bg-white px-8 text-base font-semibold text-[#161B22] transition-colors hover:bg-[#F0F3F6]"
            >
              See the Five Stages
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bridge line */}
      <section className="border-y border-[#DFE4EA] bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xl font-medium leading-snug text-[#161B22]">
            Every real solution starts as something a student noticed —
            <span className="text-[#5BA4C7]"> not a lesson plan.</span>
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="font-display text-4xl font-bold tracking-tight text-[#161B22] sm:text-5xl">
              Five stages. One real problem, start to finish.
            </h2>
            <p className="mt-4 text-lg text-[#56606B]">
              The same structured pipeline every idea on this platform actually moves
              through — not a metaphor, the literal workflow.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PIPELINE.map((step, i) => (
              <motion.div
                key={step.stage}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                style={{ perspective: "800px" }}
              >
                <TiltCard
                  className="flex h-full flex-col rounded-2xl border p-6"
                  style={{
                    borderColor: `var(--stage-${step.stage.toLowerCase()}-border)`,
                    backgroundColor: `var(--stage-${step.stage.toLowerCase()}-soft)`,
                  }}
                >
                  <span className="font-mono text-xs font-semibold tracking-wide text-[#56606B]">
                    0{i + 1}
                  </span>
                  <h3
                    className="mt-3 text-lg font-bold"
                    style={{ color: `var(--stage-${step.stage.toLowerCase()})` }}
                  >
                    {step.stage}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#161B22]">{step.verb}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#56606B]">
                    {step.detail}
                  </p>
                  <p className="mt-4 border-t border-black/10 pt-3 text-xs text-[#56606B]">
                    e.g. <span className="font-medium text-[#161B22]">{step.example}</span>
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — honest, structural facts about the platform itself */}
      <section className="border-y border-[#DFE4EA] bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            <StatCounter value={5} label="Design Thinking Stages" />
            <StatCounter value={7} label="Roles, One Workspace" />
            <StatCounter value={36} label="States & UTs Mapped" />
          </div>
        </div>
      </section>

      {/* Paths in */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <h2 className="font-display text-4xl font-bold tracking-tight text-[#161B22] sm:text-5xl">
              Three ways in
            </h2>
          </motion.div>

          <div className="divide-y divide-[#DFE4EA] border-y border-[#DFE4EA]">
            {[
              {
                title: "Onboard your school",
                desc: "Register your school and start logging student teams and their ideas.",
                href: "/onboard",
                cta: "Register a school",
              },
              {
                title: "Join as Pi Jam staff",
                desc: "Teacher Trainers and Geography Leads register through the staff portal.",
                href: "/pijam",
                cta: "Staff registration",
              },
              {
                title: "Already have an account",
                desc: "Sign in as a school admin, staff member, or a student team with your PIN.",
                href: "/login",
                cta: "Sign in",
              },
            ].map((path, i) => (
              <motion.div
                key={path.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={path.href}
                  className="flex flex-col items-start justify-between gap-2 py-6 transition-colors hover:bg-[#F0F3F6] sm:flex-row sm:items-center sm:gap-8 sm:px-4"
                >
                  <span className="font-mono text-xs font-semibold text-[#56606B]">0{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#161B22]">{path.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#56606B]">{path.desc}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#5BA4C7]">{path.cta}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-[#DFE4EA] bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="font-display text-2xl font-bold text-[#161B22]">About Pi Jam Foundation</h3>
          <p className="mt-4 leading-relaxed text-[#56606B]">
            Pi Jam Foundation builds ecosystems for future-ready problem solvers, using
            computational thinking and design-driven education to change how students
            approach the problems actually in front of them.
          </p>
          <a
            href="https://thepijam.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-[#5BA4C7] underline decoration-[#5BA4C7]/40 underline-offset-4 hover:decoration-[#5BA4C7]"
          >
            Learn more about Pi Jam
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFBFC] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[#56606B]">
            © 2026 Pi Jam Idea Bank. Developed by Pi Jam Foundation. Visit{" "}
            <a href="https://thepijam.org" target="_blank" rel="noopener noreferrer" className="text-[#5BA4C7] hover:underline">
              thepijam.org
            </a>{" "}
            for more.
          </p>
        </div>
      </footer>
    </div>
  );
}
