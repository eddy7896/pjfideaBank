import Link from "next/link";
import {
  Lightbulb,
  ArrowRight,
  Eye,
  Send,
  Wrench,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold leading-none tracking-tight text-foreground">Pi Jam</h1>
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
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Empower the Next Generation of
                <span className="text-primary block mt-2">Problem Solvers</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Track and nurture student project ideas through the Design Thinking framework. Connect schools and educators in a unified, thematic computing curriculum.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 text-sm font-medium text-foreground transition-all hover:bg-accent/10 hover:text-accent hover:border-accent/30"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Abstract Geometric Illustration */}
            <div className="relative h-[400px] w-full flex items-center justify-center">
              <div className="relative w-[320px] h-[320px] animate-spin-slow">
                {/* Center Core */}
                <div className="absolute inset-[30%] bg-primary rounded-2xl rotate-12 shadow-2xl shadow-primary/40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm -rotate-12" />
                </div>
                {/* Orbiting Elements */}
                <div className="absolute top-0 left-1/2 -ml-8 w-16 h-16 bg-accent rounded-full shadow-lg shadow-accent/40" />
                <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-indigo-300 rounded-lg shadow-lg rotate-45" />
                <div className="absolute top-1/4 left-0 w-10 h-10 bg-purple-400 rounded-full shadow-lg" />
                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full text-border/50" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="158" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                  <circle cx="160" cy="160" r="100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="how-it-works" className="border-t border-border/50 bg-card py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-heading font-bold text-foreground">The Design Thinking Process</h3>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">A structured approach to computational problem solving.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border/80" />

            {[
              { 
                title: "Observe", 
                desc: "Identify community problems and empathize with users. Find real-world challenges waiting for a tech solution.",
                icon: Eye,
                color: "text-primary",
                bg: "bg-primary/10"
              },
              { 
                title: "Submit", 
                desc: "Define the problem statement and ideate solutions. Submit the concept to the Idea Bank under a monthly theme.",
                icon: Send,
                color: "text-accent",
                bg: "bg-accent/10"
              },
              { 
                title: "Build", 
                desc: "Prototype and test the solution. Refine the project iteratively until it delivers measurable impact.",
                icon: Wrench,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              }
            ].map((step, i) => (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-6 shadow-sm border border-card`}>
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <h4 className="text-xl font-heading font-bold text-foreground mb-3">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Counters */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 gap-8 md:gap-16 text-center divide-x divide-primary-foreground/20">
            <div>
              <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-2">1,248</div>
              <div className="text-lg md:text-xl text-primary-foreground/80 font-medium">Ideas Submitted</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-2">86</div>
              <div className="text-lg md:text-xl text-primary-foreground/80 font-medium">Active Schools</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-24 bg-card">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Ready to empower your students?
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Sign in with demo credentials to explore the platform.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-10 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary/90 hover:-translate-y-0.5"
          >
            Sign In Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © 2026 Pi Jam Idea Bank. Built for educators by makers.
          </p>
        </div>
      </footer>
    </div>
  );
}
