"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  BookOpen,
  Check,
  Search,
  X,
  Map,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { INDIAN_STATES_DISTRICTS } from "@/lib/indian-states-districts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/use-auth-store";

export default function PijamPortalPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "onboard">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Onboarding states
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardData, setOnboardData] = useState({
    role: "teacher-trainer" as "teacher-trainer" | "geography-lead",
    teacherName: "",
    teacherEmail: "",
    teacherPassword: "",
    confirmPassword: "",
    location: "",
    assignedLeadId: "",
  });

  const [onboardErrors, setOnboardErrors] = useState<Record<string, string>>({});
  const [geographyLeads, setGeographyLeads] = useState<Array<{ email: string; displayName: string }>>([]);

  // District selector modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch Geography Leads for Teacher Trainer assignment
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/auth/geography-leads");
        if (res.ok) {
          const data = await res.json();
          setGeographyLeads(data);
        }
      } catch (error) {
        console.error("Failed to fetch geography leads", error);
      }
    }
    if (activeTab === "onboard") {
      fetchLeads();
    }
  }, [activeTab]);

  // Search text highlighter helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <strong key={i} className="text-primary font-bold bg-primary/10 px-0.5 rounded">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Onboard wizard steps
  const getStepsForRole = (r: string) => {
    if (r === "teacher-trainer") {
      return [
        { num: 1, title: "Choose Role" },
        { num: 2, title: "Trainer Details" },
        { num: 3, title: "Reporting Details" },
        { num: 4, title: "Review" },
      ];
    } else {
      return [
        { num: 1, title: "Choose Role" },
        { num: 2, title: "Lead Details" },
        { num: 3, title: "Credentials" },
        { num: 4, title: "Review" },
      ];
    }
  };

  const steps = getStepsForRole(onboardData.role);
  const totalOnboardSteps = steps.length;

  const validateOnboardStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const r = onboardData.role;

    if (step === 1) {
      if (!onboardData.role) {
        newErrors.role = "Please select a role to proceed";
      }
    }

    if (r === "teacher-trainer") {
      if (step === 2) {
        if (!onboardData.teacherName.trim()) newErrors.teacherName = "Trainer name required";
        if (!onboardData.location.trim()) newErrors.location = "Assigned Geography (State & District) required";
      }

      if (step === 3) {
        if (!onboardData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardData.teacherEmail))
          newErrors.teacherEmail = "Valid email required";
        if (onboardData.teacherPassword.length < 6)
          newErrors.teacherPassword = "Password min 6 characters";
        if (onboardData.teacherPassword !== onboardData.confirmPassword)
          newErrors.confirmPassword = "Passwords must match";
        if (!onboardData.assignedLeadId) newErrors.assignedLeadId = "Please select an assigned Geography Lead";
      }
    }

    if (r === "geography-lead") {
      if (step === 2) {
        if (!onboardData.teacherName.trim()) newErrors.teacherName = "Lead name required";
        if (!onboardData.location.trim()) newErrors.location = "Designated State required";
      }

      if (step === 3) {
        if (!onboardData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardData.teacherEmail))
          newErrors.teacherEmail = "Valid email required";
        if (onboardData.teacherPassword.length < 6)
          newErrors.teacherPassword = "Password min 6 characters";
        if (onboardData.teacherPassword !== onboardData.confirmPassword)
          newErrors.confirmPassword = "Passwords must match";
      }
    }

    setOnboardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnboardNext = () => {
    if (validateOnboardStep(onboardStep)) {
      setOnboardStep(onboardStep + 1);
      setOnboardErrors({});
    }
  };

  const handleOnboardPrev = () => {
    setOnboardStep(onboardStep - 1);
    setOnboardErrors({});
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);
      if (result.success) {
        toast.success("Successfully logged in!");
        router.push("/dashboard");
      } else {
        setLoginError(result.error || "Login failed. Please verify credentials.");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        role: onboardData.role,
        teacherName: onboardData.teacherName.trim(),
        teacherEmail: onboardData.teacherEmail.trim(),
        teacherPassword: onboardData.teacherPassword,
        location: onboardData.location.trim(),
        assignedLeadId: onboardData.role === "teacher-trainer" ? onboardData.assignedLeadId : undefined,
      };

      const response = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Onboarding failed");
      }

      toast.success(
        `${
          onboardData.role === "teacher-trainer" ? "Teacher Trainer" : "Geography Lead"
        } onboarded successfully! Switch to Sign In to login.`
      );
      
      // Reset onboarding form and switch to login tab
      setOnboardStep(1);
      setOnboardData({
        role: "teacher-trainer",
        teacherName: "",
        teacherEmail: "",
        teacherPassword: "",
        confirmPassword: "",
        location: "",
        assignedLeadId: "",
      });
      setActiveTab("login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Onboarding failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError("");
  };

  // Filter states for modal
  const filteredStates = INDIAN_STATES_DISTRICTS.filter((sd) =>
    sd.state.toLowerCase().includes(searchState.toLowerCase())
  );

  const activeStateData = INDIAN_STATES_DISTRICTS.find(
    (sd) => sd.state === selectedState
  );

  const filteredDistricts = activeStateData
    ? activeStateData.districts.filter((dist) =>
        dist.toLowerCase().includes(searchDistrict.toLowerCase())
      )
    : [];

  const handleConfirmGeography = () => {
    if (onboardData.role === "geography-lead") {
      if (!selectedState) {
        toast.error("Please select a State");
        return;
      }
      setOnboardData({
        ...onboardData,
        location: selectedState,
      });
    } else {
      if (!selectedState || !selectedDistrict) {
        toast.error("Please select both a State and a District");
        return;
      }
      setOnboardData({
        ...onboardData,
        location: `${selectedDistrict}, ${selectedState}`,
      });
    }
    setIsModalOpen(false);
  };

  const isConfirmDisabled =
    onboardData.role === "geography-lead"
      ? !selectedState
      : !selectedState || !selectedDistrict;

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white relative overflow-hidden">
      {/* Dynamic Aesthetic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#4f46e5_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#e11d48_0%,transparent_50%)] opacity-20 pointer-events-none" />

      {/* Top Navbar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-75">
            <Image
              src="/pijam logo.jpeg"
              alt="Pi Jam Logo"
              width={120}
              height={48}
              className="h-8 w-auto rounded-lg brightness-95"
              priority
            />
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Internal Portal
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 items-center justify-center px-4 py-16 z-10">
        <div className="w-full max-w-lg space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
              Pi Jam Foundation Staff
            </h1>
            <p className="text-slate-400 text-sm">
              Manage program geographies, support schools, and view region diagnostics.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-8 relative">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val as "login" | "onboard");
                setOnboardStep(1);
              }}
              className="w-full space-y-6"
            >
              <TabsList className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg text-sm font-semibold py-2.5 transition-all text-slate-400 data-[state=active]:bg-slate-850 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="onboard"
                  className="rounded-lg text-sm font-semibold py-2.5 transition-all text-slate-400 data-[state=active]:bg-slate-850 data-[state=active]:text-white"
                >
                  Join Team
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: STAFF LOGIN */}
              <TabsContent value="login" className="space-y-5 animate-in fade-in-50 duration-200">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                      Work Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourname@pijam.org"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setLoginError("");
                        }}
                        className="pl-10 bg-slate-900/60 border-slate-800 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pass" className="text-sm font-medium text-slate-300">
                      Access Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="pass"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setLoginError("");
                        }}
                        className="pl-10 pr-10 bg-slate-900/60 border-slate-800 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-xs text-rose-400">
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Sign In Internal
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Pi Jam Admin Seed Demo Accounts */}
                <div className="border-t border-slate-800/80 pt-5 space-y-3">
                  <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    Demo Administrator Account
                  </p>
                  <button
                    onClick={() => fillDemoLogin("admin@pijam.org", "admin123")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 text-left transition-all group"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-slate-300 group-hover:text-white">
                        Global Super Admin
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        admin@pijam.org (Password: admin123)
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </TabsContent>

              {/* TAB 2: STAFF ONBOARDING */}
              <TabsContent value="onboard" className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Onboarding Wizard Stepper */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {steps.map((step, idx) => (
                      <div key={step.num} className="flex items-center flex-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                            onboardStep >= step.num
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-slate-850 bg-slate-900 text-slate-500"
                          }`}
                        >
                          {onboardStep > step.num ? <Check className="h-4.5 w-4.5" /> : step.num}
                        </div>
                        {idx < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                              onboardStep > step.num ? "bg-indigo-500" : "bg-slate-850"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-center font-bold text-xs text-slate-300 tracking-wide uppercase">
                    {steps[onboardStep - 1]?.title}
                  </h3>
                </div>

                <form
                  onSubmit={
                    onboardStep === totalOnboardSteps
                      ? handleOnboardSubmit
                      : (e) => {
                          e.preventDefault();
                          handleOnboardNext();
                        }
                  }
                  className="space-y-5"
                >
                  {/* Step 1: Choose Internal Role */}
                  {onboardStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                        Register your access level to manage states or support trainers.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Teacher Trainer Card */}
                        <button
                          type="button"
                          onClick={() => setOnboardData({ ...onboardData, role: "teacher-trainer" })}
                          className={`relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                            onboardData.role === "teacher-trainer"
                              ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]"
                              : "border-slate-850 bg-slate-900/30 hover:border-indigo-500/40 hover:scale-[1.01]"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                              onboardData.role === "teacher-trainer"
                                ? "bg-indigo-500 text-white"
                                : "bg-slate-800 text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400"
                            }`}
                          >
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-200 text-xs block">Teacher Trainer</span>
                          <span className="text-[9px] text-slate-500 mt-1 block leading-normal">
                            Support school admins & review district details.
                          </span>
                        </button>

                        {/* Geography Lead Card */}
                        <button
                          type="button"
                          onClick={() => setOnboardData({ ...onboardData, role: "geography-lead" })}
                          className={`relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                            onboardData.role === "geography-lead"
                              ? "border-rose-500 bg-rose-500/5 scale-[1.02]"
                              : "border-slate-850 bg-slate-900/30 hover:border-rose-500/40 hover:scale-[1.01]"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                              onboardData.role === "geography-lead"
                                ? "bg-rose-500 text-white"
                                : "bg-slate-800 text-slate-400 group-hover:bg-rose-500/10 group-hover:text-rose-500"
                            }`}
                          >
                            <Map className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-200 text-xs block">Geography Lead</span>
                          <span className="text-[9px] text-slate-500 mt-1 block leading-normal">
                            Oversee program operations and state roll-ups.
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Basic Profile & Jurisdiction */}
                  {onboardStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffName" className="text-sm font-medium text-slate-300">
                          Full Name *
                        </Label>
                        <Input
                          id="staffName"
                          placeholder="e.g. Ms. Sarah Johnson"
                          value={onboardData.teacherName}
                          onChange={(e) =>
                            setOnboardData({ ...onboardData, teacherName: e.target.value })
                          }
                          className={`bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl focus:border-indigo-500 ${
                            onboardErrors.teacherName ? "border-rose-500" : ""
                          }`}
                        />
                        {onboardErrors.teacherName && (
                          <p className="text-xs text-rose-400">{onboardErrors.teacherName}</p>
                        )}
                      </div>

                      {/* State & District triggers */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-300">
                          {onboardData.role === "teacher-trainer"
                            ? "Assigned District & State *"
                            : "Designated Overseeing State *"}
                        </Label>
                        <div className="relative">
                          <Input
                            readOnly
                            placeholder={
                              onboardData.role === "geography-lead"
                                ? "Click to select designated State"
                                : "Click to select State & District"
                            }
                            value={onboardData.location}
                            onClick={() => {
                              if (onboardData.location) {
                                if (onboardData.role === "geography-lead") {
                                  setSelectedState(onboardData.location);
                                  setSelectedDistrict("");
                                } else {
                                  const [dist, st] = onboardData.location.split(", ");
                                  setSelectedState(st || "");
                                  setSelectedDistrict(dist || "");
                                }
                              }
                              setIsModalOpen(true);
                            }}
                            className={`cursor-pointer bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl pr-10 focus:border-indigo-500 ${
                              onboardErrors.location ? "border-rose-500" : ""
                            }`}
                          />
                          <MapPin className="absolute right-3.5 top-3 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
                        </div>
                        {onboardErrors.location && (
                          <p className="text-xs text-rose-400">{onboardErrors.location}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Credentials / Reporting Assignments */}
                  {onboardStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffEmail" className="text-sm font-medium text-slate-300">
                          Email Address *
                        </Label>
                        <Input
                          id="staffEmail"
                          type="email"
                          placeholder={
                            onboardData.role === "teacher-trainer" ? "trainer@pijam.org" : "lead@pijam.org"
                          }
                          value={onboardData.teacherEmail}
                          onChange={(e) =>
                            setOnboardData({ ...onboardData, teacherEmail: e.target.value })
                          }
                          className={`bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl focus:border-indigo-500 ${
                            onboardErrors.teacherEmail ? "border-rose-500" : ""
                          }`}
                        />
                        {onboardErrors.teacherEmail && (
                          <p className="text-xs text-rose-400">{onboardErrors.teacherEmail}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="staffPass" className="text-sm font-medium text-slate-300">
                            Password *
                          </Label>
                          <Input
                            id="staffPass"
                            type="password"
                            placeholder="Min 6 chars"
                            value={onboardData.teacherPassword}
                            onChange={(e) =>
                              setOnboardData({ ...onboardData, teacherPassword: e.target.value })
                            }
                            className={`bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl focus:border-indigo-500 ${
                              onboardErrors.teacherPassword ? "border-rose-500" : ""
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staffConfirm" className="text-sm font-medium text-slate-300">
                            Confirm Password *
                          </Label>
                          <Input
                            id="staffConfirm"
                            type="password"
                            placeholder="Confirm password"
                            value={onboardData.confirmPassword}
                            onChange={(e) =>
                              setOnboardData({ ...onboardData, confirmPassword: e.target.value })
                            }
                            className={`bg-slate-900/60 border-slate-800 text-white placeholder-slate-600 rounded-xl focus:border-indigo-500 ${
                              onboardErrors.confirmPassword ? "border-rose-500" : ""
                            }`}
                          />
                        </div>
                        {(onboardErrors.teacherPassword || onboardErrors.confirmPassword) && (
                          <div className="col-span-2">
                            <p className="text-xs text-rose-400">
                              {onboardErrors.teacherPassword || onboardErrors.confirmPassword}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Supervisor dropdown (Only for Teacher Trainer) */}
                      {onboardData.role === "teacher-trainer" && (
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="reportingLead" className="text-sm font-medium text-slate-300">
                            Assigned Geography Lead *
                          </Label>
                          <select
                            id="reportingLead"
                            value={onboardData.assignedLeadId}
                            onChange={(e) =>
                              setOnboardData({ ...onboardData, assignedLeadId: e.target.value })
                            }
                            className={`w-full p-3 rounded-xl border bg-slate-900/60 border-slate-800 text-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                              onboardErrors.assignedLeadId ? "border-rose-500" : ""
                            }`}
                          >
                            <option value="" className="bg-slate-950 text-slate-500">
                              -- Choose Supervising Lead --
                            </option>
                            {geographyLeads.map((lead) => (
                              <option
                                key={lead.email}
                                value={lead.email}
                                className="bg-slate-950 text-slate-200"
                              >
                                {lead.displayName} ({lead.email})
                              </option>
                            ))}
                          </select>
                          {onboardErrors.assignedLeadId && (
                            <p className="text-xs text-rose-400">{onboardErrors.assignedLeadId}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Final Profile Review */}
                  {onboardStep === 4 && (
                    <div className="space-y-4 text-slate-300 text-sm">
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-4">
                        <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-wider">
                          Review Access Level
                        </h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Access Role:</span>
                            <span className="font-bold text-white uppercase text-xs">
                              {onboardData.role === "teacher-trainer"
                                ? "Teacher Trainer (TT)"
                                : "Geography Lead (GL/PL)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Full Name:</span>
                            <span className="font-semibold text-white">{onboardData.teacherName}</span>
                          </div>
                          <div className="col-span-2 border-t border-slate-800/60 pt-2">
                            <span className="text-slate-500 block text-[10px]">Work Email:</span>
                            <span className="font-semibold text-white">{onboardData.teacherEmail}</span>
                          </div>
                          <div className="border-t border-slate-800/60 pt-2">
                            <span className="text-slate-500 block text-[10px]">Jurisdiction:</span>
                            <span className="font-semibold text-white">{onboardData.location}</span>
                          </div>
                          {onboardData.role === "teacher-trainer" && (
                            <div className="border-t border-slate-800/60 pt-2">
                              <span className="text-slate-500 block text-[10px]">Reports To:</span>
                              <span className="font-semibold text-white break-all">
                                {onboardData.assignedLeadId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wizard Footer Navigation */}
                  <div className="flex gap-3 pt-4 border-t border-slate-850">
                    {onboardStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleOnboardPrev}
                        className="flex-1 bg-transparent border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl"
                      >
                        Back
                      </Button>
                    )}
                    {onboardStep < totalOnboardSteps ? (
                      <Button
                        type="submit"
                        className={
                          onboardStep === 1
                            ? "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                            : "flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Join Team"}
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* INDIAN GEOGRAPHY / STATE & DISTRICT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 rounded-t-2xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Map className="h-5 w-5 text-indigo-400" />
                    {onboardData.role === "geography-lead" ? "Select Designated State" : "Select Region Geography"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {onboardData.role === "geography-lead"
                      ? "Choose the state you will oversee as Geography Lead"
                      : "Choose the state and corresponding educational district"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-850 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {/* Left Column: States List */}
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden">
                  <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Search State/UT..."
                        value={searchState}
                        onChange={(e) => setSearchState(e.target.value)}
                        className="pl-9 h-9 text-sm bg-slate-950 border-slate-850 text-white placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((sd) => (
                        <button
                          key={sd.state}
                          type="button"
                          onClick={() => {
                            setSelectedState(sd.state);
                            setSelectedDistrict(""); // Reset district on state change
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                            selectedState === sd.state
                              ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                              : "hover:bg-slate-850/50 text-slate-300 hover:text-white hover:translate-x-1"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className={`h-4 w-4 transition-colors duration-200 ${
                              selectedState === sd.state ? "text-indigo-400" : "text-slate-600 group-hover:text-indigo-400"
                            }`} />
                            <span>{highlightText(sd.state, searchState)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
                              selectedState === sd.state
                                ? "bg-indigo-500 text-white"
                                : "bg-slate-850 text-slate-500 group-hover:bg-indigo-600/20 group-hover:text-indigo-400"
                            }`}>
                              {sd.districts.length}
                            </span>
                            {selectedState === sd.state && (
                              <Check className="h-4 w-4 text-indigo-400" />
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-sm text-slate-500">
                        No states found
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Districts List or State-Level details */}
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden bg-slate-950/20">
                  {onboardData.role === "geography-lead" ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-rose-500/5">
                      <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full mb-4 border border-rose-500/20">
                        <Map className="h-8 w-8 stroke-[1.5]" />
                      </div>
                      <h4 className="font-bold text-white text-sm">State-Level Access</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                        As a Geography Lead, your authority spans the entire state of <strong>{selectedState || "your choice"}</strong>. You will automatically have reporting visibility over all educational districts inside this state.
                      </p>
                      {selectedState && (
                        <div className="mt-6 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                          <Check className="h-3.5 w-3.5 animate-bounce" />
                          Selected State: {selectedState}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border-b border-slate-800">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder={
                              selectedState
                                ? `Search districts in ${selectedState}...`
                                : "Select a state first..."
                            }
                            disabled={!selectedState}
                            value={searchDistrict}
                            onChange={(e) => setSearchDistrict(e.target.value)}
                            className="pl-9 h-9 text-sm bg-slate-950 border-slate-850 text-white placeholder-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {selectedState ? (
                          filteredDistricts.length > 0 ? (
                            filteredDistricts.map((dist) => (
                              <button
                                key={dist}
                                type="button"
                                onClick={() => setSelectedDistrict(dist)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                                  selectedDistrict === dist
                                    ? "bg-indigo-650 text-white font-semibold shadow-md shadow-indigo-650/20"
                                    : "hover:bg-slate-850/50 text-slate-350 hover:text-white hover:translate-x-1"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <MapPin className={`h-4 w-4 transition-all duration-200 ${
                                    selectedDistrict === dist ? "text-white scale-110" : "text-slate-600 group-hover:text-indigo-400 group-hover:scale-110"
                                  }`} />
                                  <span>{highlightText(dist, searchDistrict)}</span>
                                </div>
                                {selectedDistrict === dist && (
                                  <Check className="h-4 w-4 text-white animate-in zoom-in-50" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-8 text-sm text-slate-500">
                              No districts found
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <MapPin className="h-10 w-10 text-slate-600/30 mb-2 stroke-[1.2] animate-bounce" />
                            <p className="text-sm font-medium text-slate-500">
                              Please select a state from the left column to view its educational districts.
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-300">
                  {selectedState ? (
                    onboardData.role === "geography-lead" ? (
                      <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-indigo-400" />
                        Selected State: {selectedState}
                      </span>
                    ) : selectedDistrict ? (
                      <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-indigo-400" />
                        Selected: {selectedDistrict}, {selectedState}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Select a district from the right column</span>
                    )
                  ) : (
                    <span className="text-slate-500 italic">No geography selected yet</span>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none h-9 text-sm bg-transparent border-slate-800 hover:bg-slate-850"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmGeography}
                    disabled={isConfirmDisabled}
                    className="flex-1 sm:flex-none h-9 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-transform active:scale-[0.98]"
                  >
                    Confirm Selection
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
