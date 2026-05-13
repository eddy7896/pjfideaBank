"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const { login, loginStudent } = useAuthStore();
  const { teams } = useTeamStore();

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

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
      setLoading(false);
    }, 400);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    setStudentLoading(true);

    setTimeout(() => {
      const result = loginStudent(teamId, pin);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setStudentError(result.error || "Login failed");
      }
      setStudentLoading(false);
    }, 400);
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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="border-b border-border/20 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <Image
              src="/pijam logo.jpeg"
              alt="Pijam"
              width={120}
              height={48}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Login Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="text-base text-muted-foreground">
              Access the Idea Bank dashboard
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="teacher" className="rounded-xl border border-border/20 bg-white">
            <TabsList className="w-full justify-start rounded-none border-b border-border/20 p-0 bg-white">
              <TabsTrigger value="teacher" className="rounded-none flex-1 text-sm font-medium">
                Teacher
              </TabsTrigger>
              <TabsTrigger value="student" className="rounded-none flex-1 text-sm font-medium">
                Student
              </TabsTrigger>
            </TabsList>

            {/* Teacher Login */}
            <TabsContent value="teacher" className="p-6 space-y-4">
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
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
                <p className="text-xs font-medium text-muted-foreground">Demo accounts</p>
                <div className="space-y-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      onClick={() => fillCredentials(cred.email, cred.password)}
                      className={`flex items-start gap-3 rounded-lg border border-border/20 p-3 text-left transition-all hover:border-border/40 hover:bg-muted/30 ${
                        email === cred.email ? "border-primary/50 bg-primary/5" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{cred.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {cred.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Student Login */}
            <TabsContent value="student" className="p-6 space-y-4">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamId" className="text-sm font-medium">
                    Team ID
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="teamId"
                      type="text"
                      placeholder="e.g., TM-ABC123"
                      value={teamId}
                      onChange={(e) => { setTeamId(e.target.value.toUpperCase()); setStudentError(""); }}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-sm font-medium">
                    6-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pin"
                      type="password"
                      placeholder="000000"
                      value={pin}
                      onChange={(e) => { setPin(e.target.value); setStudentError(""); }}
                      className="pl-9 text-center tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {studentError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {studentError}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" size="lg" disabled={studentLoading}>
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
                  <p className="text-xs font-medium text-muted-foreground">Demo teams</p>
                  <div className="space-y-2">
                    {teams.slice(0, 2).map((team) => (
                      <button
                        key={team.id}
                        onClick={() => fillStudentCredentials(team.id, team.pin)}
                        className={`flex items-start gap-3 rounded-lg border border-border/20 p-3 text-left transition-all hover:border-border/40 hover:bg-muted/30 ${
                          teamId === team.id ? "border-primary/50 bg-primary/5" : ""
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{team.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
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
          <div className="border-t border-border/20 p-6 text-center text-sm text-muted-foreground space-y-2">
            <p>
              Don't have a school account?{" "}
              <Link href="/onboard" className="text-primary hover:text-primary/80 font-medium">
                Register your school
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
