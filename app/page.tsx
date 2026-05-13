import Link from "next/link";
import Image from "next/image";
import {
  Lightbulb,
  BookOpen,
  Users,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
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
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[800px] w-[800px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-8 border border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Built by Pi Jam Foundation</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-tight">
              A Repository of Ideas and Solutions
            </h1>

            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Pi Jam Idea Bank is a collaborative platform where students identify, document, and develop solutions to real-world problems in their communities. Built for schools and educators to nurture computational thinking and design-driven problem solving.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore the Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-8 text-base font-semibold text-primary transition-all hover:bg-primary/10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border/50 bg-card py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">What is Idea Bank?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A centralized platform for schools to foster innovation, collaboration, and problem-solving among students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Identify & Document",
                desc: "Students identify real-world problems in their communities and document them with context, research, and potential solutions."
              },
              {
                icon: Users,
                title: "Collaborate & Build",
                desc: "Teams work together to develop prototypes and solutions. Track progress, share resources, and iterate based on feedback."
              },
              {
                icon: Target,
                title: "Create Impact",
                desc: "Transform ideas into tangible projects that solve community problems. Measure impact and scale successful solutions across schools."
              }
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border/50 bg-background p-8 hover:border-primary/30 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">A structured process inspired by design thinking and computational problem solving</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Observe", desc: "Identify community challenges" },
              { num: "2", title: "Define", desc: "Document problem statements" },
              { num: "3", title: "Ideate", desc: "Brainstorm and develop solutions" },
              { num: "4", title: "Build", desc: "Prototype and test implementations" }
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="rounded-2xl border border-primary/20 bg-card p-6 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white mb-4">
                    {step.num}
                  </div>
                  <h4 className="text-lg font-heading font-bold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {step.num !== "4" && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Building the Future</h2>
            <p className="text-primary-foreground/80 text-lg">Pi Jam Idea Bank is growing to support schools across India</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-16 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-2">500+</div>
              <div className="text-lg text-primary-foreground/80 font-medium">Ideas Shared</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-2">50+</div>
              <div className="text-lg text-primary-foreground/80 font-medium">Schools Connected</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Pi Jam */}
      <section className="py-24 bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-background p-10 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">About Pi Jam Foundation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Pi Jam Foundation is dedicated to building ecosystems that enable future-ready problem solvers. We believe in the power of computational thinking and design-driven education to transform how students approach challenges.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Idea Bank is our platform for democratizing problem identification and solution development across schools, enabling students to learn by doing, collaborate with peers, and create measurable impact in their communities.
                </p>
                <a
                  href="https://thepijam.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Learn more about Pi Jam
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground mb-6">
            Ready to start solving problems?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join schools across India building the next generation of problem solvers
          </p>
          <Link
            href="/login"
            className="inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-10 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary/90 hover:-translate-y-0.5"
          >
            Explore Idea Bank
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Pi Jam Idea Bank</h4>
              <p className="text-sm text-muted-foreground">A repository of ideas and solutions for problem-solving education</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://thepijam.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">Pi Jam Foundation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">Support for schools and educators</p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2026 Pi Jam Idea Bank. Developed by Pi Jam Foundation. Visit <a href="https://thepijam.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">thepijam.org</a> for more.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
