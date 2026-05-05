import Link from "next/link";
import {
  Lightbulb,
  CalendarDays,
  Brain,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none tracking-tight">Pi Jam</h1>
              <p className="text-xs text-muted-foreground">Idea Bank</p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Design Thinking for Schools
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Where Student Ideas
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Become Reality
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Track and nurture student project ideas through the Design Thinking
              framework. A thematic calendar-driven repository connecting schools,
              students, and educators.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-8 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              >
                Learn More
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/40 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything You Need to Manage Ideas
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From submission to testing — track every stage of the innovation journey.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                title: "Thematic Calendar",
                desc: "12 monthly themes guide student ideation — from Sustainability to Space Exploration.",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: Brain,
                title: "Design Thinking Pipeline",
                desc: "Track ideas through Empathize → Define → Ideate → Prototype → Test stages.",
                gradient: "from-purple-500 to-fuchsia-600",
              },
              {
                icon: Users,
                title: "Multi-Role Access",
                desc: "Schools submit ideas, Admins oversee progress, Education Dept reviews outcomes.",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Visualize idea distribution by stage, theme, and school with real-time analytics.",
                gradient: "from-orange-500 to-red-600",
              },
              {
                icon: GraduationCap,
                title: "School Portals",
                desc: "Each school gets their own space to manage projects and track Design Thinking progress.",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                icon: Shield,
                title: "Role-Based Security",
                desc: "Schools edit their own ideas. Admins and Edu Dept have read-only oversight access.",
                gradient: "from-rose-500 to-pink-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="mt-4 text-base font-semibold">{feature.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How It Works
            </h3>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Choose a Theme", desc: "Pick a monthly theme from the calendar to focus your project." },
              { step: "02", title: "Submit Your Idea", desc: "Schools describe their problem statement and target audience." },
              { step: "03", title: "Track Progress", desc: "Move ideas through Design Thinking stages from Empathize to Test." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-xl font-bold text-indigo-600">
                  {item.step}
                </div>
                <h4 className="mt-4 text-base font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to Start?
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-indigo-200">
            Sign in with demo credentials to explore the full platform.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50"
          >
            Sign In Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2026 Pi Jam Idea Bank. Built for educators by makers.
          </p>
        </div>
      </footer>
    </div>
  );
}
