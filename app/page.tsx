"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Target,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { HeroIllustration } from "@/components/landing/hero-illustration";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
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
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:bg-muted"
            >
              Staff Portal
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6"
              >
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">By Pi Jam Foundation</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl font-heading font-bold tracking-tight text-foreground leading-tight"
              >
                The Idea Bank for Problem Solvers
              </motion.h1>

              <motion.p
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 text-lg text-muted-foreground leading-relaxed"
              >
                A collaborative repository where students identify real-world problems, develop solutions, and create measurable impact. Built for schools that nurture computational thinking and design-driven innovation.
              </motion.p>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Explore Platform
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:bg-muted"
                >
                  Learn More
                </a>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-10 flex flex-col gap-3"
              >
                {[
                  "Identify and document real problems",
                  "Collaborate on innovative solutions",
                  "Track impact across schools",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Illustration */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <HeroIllustration />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">What is Idea Bank?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A centralized platform for schools to foster innovation, collaboration, and problem-solving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Identify & Document",
                desc: "Students identify real-world problems and document them with context, research, and solutions."
              },
              {
                icon: Users,
                title: "Collaborate & Build",
                desc: "Teams develop prototypes together. Track progress, share resources, iterate on feedback."
              },
              {
                icon: Target,
                title: "Create Impact",
                desc: "Transform ideas into projects that solve community problems. Measure and scale success."
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-border/50 bg-card p-8 hover:border-primary/30 transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 bg-card border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Design thinking approach to problem solving</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Observe", desc: "Identify community challenges" },
              { num: "2", title: "Define", desc: "Document problem statements" },
              { num: "3", title: "Ideate", desc: "Brainstorm solutions" },
              { num: "4", title: "Build", desc: "Prototype and test" }
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="rounded-2xl border border-border bg-background p-6 text-center h-full flex flex-col items-center justify-center">
                  <motion.div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.num}
                  </motion.div>
                  <h4 className="text-lg font-heading font-bold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-heading font-bold mb-4">Building the Future</h2>
            <p className="text-primary-foreground/80 text-lg">Pi Jam Idea Bank is growing to support schools across India</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 md:gap-16 text-center">
            {[
              { value: "500+", label: "Ideas Shared" },
              { value: "50+", label: "Schools Connected" },
            ].map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-2">{stat.value}</div>
                <div className="text-lg text-primary-foreground/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Pi Jam */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-2xl border border-border/50 bg-card p-10 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">About Pi Jam Foundation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Pi Jam Foundation is dedicated to building ecosystems that enable future-ready problem solvers. We believe in the power of computational thinking and design-driven education to transform how students approach challenges.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Idea Bank is our platform for democratizing problem identification and solution development across schools, enabling students to learn by doing, collaborate with peers, and create measurable impact.
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
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-border/50">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground mb-6">
              Ready to start solving problems?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join schools across India building the next generation of problem solvers
            </p>
            <Link
              href="/login"
              className="inline-flex h-14 items-center gap-2 rounded-lg bg-primary px-10 text-base font-semibold text-white transition-all hover:bg-primary/90"
            >
              Explore Idea Bank
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
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
                <li>
                  <Link href="/pijam" className="text-muted-foreground hover:text-primary transition inline-flex items-center gap-1.5">
                    Staff Portal
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">Internal</span>
                  </Link>
                </li>
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
