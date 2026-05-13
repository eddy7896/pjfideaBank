"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  School,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const roleIcons = {
  "super-admin": ShieldCheck,
  school: School,
  "education-dept": Building2,
};

const roleColors = {
  "super-admin": "border-indigo-200 bg-indigo-50 hover:border-indigo-300",
  school: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
  "education-dept": "border-amber-200 bg-amber-50 hover:border-amber-300",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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

  const fillCredentials = (credEmail: string, credPassword: string) => {
    setEmail(credEmail);
    setPassword(credPassword);
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Top bar */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Image
              src="/pijam logo.jpeg"
              alt="Pi Jam Logo"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-sm font-semibold">Pi Jam Idea Bank</span>
          </Link>
        </div>
      </div>

      {/* Login Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access the Idea Bank dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          {/* Demo Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">
                Demo Credentials
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {DEMO_CREDENTIALS.map((cred) => {
                const Icon = roleIcons[cred.user.role];
                return (
                  <button
                    key={cred.email}
                    onClick={() => fillCredentials(cred.email, cred.password)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                      roleColors[cred.user.role],
                      email === cred.email && "ring-2 ring-indigo-400"
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{cred.label}</p>
                      <p className="mt-0.5 truncate text-[11px] opacity-60">
                        {cred.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Click a card above to auto-fill credentials, then press Sign In.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
