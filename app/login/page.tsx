"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/use-auth-store";
import { useTeamStore } from "@/store/use-team-store";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { motion } from "framer-motion";


export default function LoginPage() {
  const router = useRouter();
  const { login, loginStudent } = useAuthStore();
  const { teams, loadTeams } = useTeamStore();

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Teacher login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Student login
  const [teamId, setTeamId] = useState("");
  const [pin, setPin] = useState("");
  const [studentError, setStudentError] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    setStudentLoading(true);

    try {
      const result = await loginStudent(teamId, pin);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setStudentError(result.error || "Login failed");
      }
    } catch (err) {
      setStudentError("An unexpected error occurred during login.");
    } finally {
      setStudentLoading(false);
    }
  };

  const fillCredentials = (credEmail: string, credPassword: string) => {
    setEmail(credEmail);
    setPassword(credPassword);
    setError("");
  };

  const fillStudentCredentials = (tId: string, tPin: string) => {
    setTeamId(tId);
    setPin(tPin);
    setStudentError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Top bar / Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-75">
            <Image
              src="/pijam logo.jpeg"
              alt="Pi Jam Logo"
              width={150}
              height={60}
              className="rounded-lg"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Access the Idea Bank dashboard
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="teacher"
            className="rounded-2xl border border-border/40 bg-card/85 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-primary/20 overflow-hidden"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-border/30 p-0 bg-muted/40">
              <TabsTrigger
                value="teacher"
                className="rounded-none flex-1 text-sm font-semibold py-3 data-[state=active]:bg-card data-[state=active]:text-primary transition-all"
              >
                School Admin / Teacher
              </TabsTrigger>
              <TabsTrigger
                value="student"
                className="rounded-none flex-1 text-sm font-semibold py-3 data-[state=active]:bg-card data-[state=active]:text-primary transition-all"
              >
                Student
              </TabsTrigger>
            </TabsList>

            {/* Teacher Login */}
            <TabsContent value="teacher" className="p-6 space-y-4 outline-none">
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className="pl-10 pr-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] py-6 text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Teacher Credentials */}
              <div className="space-y-3 border-t border-border/20 pt-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Demo Accounts
                </p>
                <div className="space-y-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      onClick={() => fillCredentials(cred.email, cred.password)}
                      className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] ${
                        email === cred.email ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-slate-50/30"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">{cred.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500 font-medium">
                          {cred.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Student Login */}
            <TabsContent value="student" className="p-6 space-y-4 outline-none">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamId" className="text-sm font-semibold text-slate-700">
                    Team ID
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      id="teamId"
                      type="text"
                      placeholder="e.g., TM-ABC123"
                      value={teamId}
                      onChange={(e) => {
                        setTeamId(e.target.value.toUpperCase());
                        setStudentError("");
                      }}
                      className="pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-sm font-semibold text-slate-700">
                    6-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      id="pin"
                      type="password"
                      placeholder="000000"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setStudentError("");
                      }}
                      className="pl-10 text-center tracking-widest bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 font-semibold"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {studentError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive font-medium"
                  >
                    {studentError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] py-6 text-sm"
                  disabled={studentLoading}
                >
                  {studentLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Student Credentials */}
              {teams.length > 0 && (
                <div className="space-y-3 border-t border-border/20 pt-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Demo Teams
                  </p>
                  <div className="space-y-2">
                    {teams.slice(0, 2).map((team) => (
                      <button
                        key={team.id}
                        onClick={() => fillStudentCredentials(team.id, team.pin)}
                        className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] ${
                          teamId === team.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-slate-50/30"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800">{team.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500 font-medium">
                            {team.id} • PIN: {team.pin}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 space-y-2 pt-2">
            <p>
              Don't have a school account?{" "}
              <Link href="/onboard" className="text-primary hover:text-primary/80 font-bold hover:underline">
                Register your school
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

