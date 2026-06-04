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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { INDIAN_STATES_DISTRICTS } from "@/lib/indian-states-districts";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/landing/animated-background";


export default function PijamPortalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding states
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardData, setOnboardData] = useState({
    role: "teacher-trainer" as "teacher-trainer" | "geography-lead",
    teacherName: "",
    teacherEmail: "",
    teacherPassword: "",
    confirmPassword: "",
    location: "",
    locations: [] as string[],
    assignedLeadId: "",
  });

  const [onboardErrors, setOnboardErrors] = useState<Record<string, string>>({});
  const [geographyLeads, setGeographyLeads] = useState<
    Array<{
      id: number;
      email: string;
      displayName: string;
      geographyName: string | null;
      geographyCode: string | null;
      subGeographies: { id: string; name: string }[];
    }>
  >([]);

  // District selector modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

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
    fetchLeads();
  }, []);

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
        { num: 4, title: "Review Details" },
      ];
    } else {
      return [
        { num: 1, title: "Choose Role" },
        { num: 2, title: "Lead Details" },
        { num: 3, title: "Credentials" },
        { num: 4, title: "Review Details" },
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
        if (onboardData.locations.length === 0 && !onboardData.location.trim()) newErrors.location = "Assigned Geography (State & District) required";
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

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        role: onboardData.role,
        teacherName: onboardData.teacherName.trim(),
        teacherEmail: onboardData.teacherEmail.trim(),
        teacherPassword: onboardData.teacherPassword,
        location: onboardData.locations.length > 0 ? onboardData.locations[0] : onboardData.location.trim(),
        locations: onboardData.locations,
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
        } onboarded successfully! Redirecting to login...`
      );
      
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Onboarding failed");
    } finally {
      setIsLoading(false);
    }
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
        locations: [selectedState],
      });
    } else {
      if (!selectedState || selectedDistricts.length === 0) {
        toast.error("Please select both a State and at least one District");
        return;
      }
      const newLocations = selectedDistricts.map(dist => `${dist}, ${selectedState}`);
      setOnboardData({
        ...onboardData,
        location: newLocations[0],
        locations: newLocations,
      });
    }
    setIsModalOpen(false);
  };

  const isConfirmDisabled =
    onboardData.role === "geography-lead"
      ? !selectedState
      : !selectedState || selectedDistricts.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Internal Portal
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl space-y-8"
        >
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Pi Jam Staff Onboarding
            </h1>
            <p className="text-sm text-muted-foreground">
              Register as a Geography Lead or Teacher Trainer to manage program operations.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="rounded-2xl border border-border/40 bg-card/85 backdrop-blur-md shadow-2xl p-8 transition-all duration-300 hover:border-primary/20">
            {/* Onboarding Wizard Stepper */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={step.num} className="flex items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                        onboardStep >= step.num
                          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                          : "border-border/60 bg-card text-muted-foreground"
                      }`}
                    >
                      {onboardStep > step.num ? <Check className="h-4 w-4" /> : step.num}
                    </motion.div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition-all duration-300 rounded-full ${
                          onboardStep > step.num ? "bg-primary" : "bg-border/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <h3 className="text-center font-bold text-xs text-slate-700 tracking-wide uppercase">
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
                  <p className="text-[11px] text-slate-450 text-center leading-relaxed font-medium">
                    Register your access level to manage states or support trainers.
                  </p>

                  <div className="flex justify-center max-w-sm mx-auto">
                    {/* Teacher Trainer Card */}
                    <button
                      type="button"
                      onClick={() => setOnboardData({ ...onboardData, role: "teacher-trainer" })}
                      className={`w-full relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                        onboardData.role === "teacher-trainer"
                          ? "border-primary bg-primary/5 scale-[1.02] shadow-sm shadow-primary/5"
                          : "border-border bg-slate-50/30 hover:border-primary/45 hover:scale-[1.01]"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                          onboardData.role === "teacher-trainer"
                            ? "bg-primary text-white"
                            : "bg-slate-200/80 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-xs block">Teacher Trainer</span>
                      <span className="text-[9px] text-slate-500 mt-1 block leading-normal font-medium">
                        Support school admins & review district details.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Profile & Jurisdiction */}
              {onboardStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffName" className="text-sm font-semibold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      id="staffName"
                      placeholder="e.g. Ms. Sarah Johnson"
                      value={onboardData.teacherName}
                      onChange={(e) =>
                        setOnboardData({ ...onboardData, teacherName: e.target.value })
                      }
                      className={`bg-card/50 backdrop-blur-sm border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:border-primary ${
                        onboardErrors.teacherName ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                    />
                    {onboardErrors.teacherName && (
                      <p className="text-xs text-destructive">{onboardErrors.teacherName}</p>
                    )}
                  </div>

                  {/* State & District triggers */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      {onboardData.role === "teacher-trainer"
                        ? "Assigned District & State *"
                        : "Designated Overseeing State *"}
                    </Label>
                    <div className="relative">
                      <div
                        onClick={() => {
                          if (onboardData.role === "geography-lead") {
                            if (onboardData.location) setSelectedState(onboardData.location);
                          } else if (onboardData.locations.length > 0) {
                            const [, st] = onboardData.locations[0].split(", ");
                            setSelectedState(st || "");
                            setSelectedDistricts(onboardData.locations.map(loc => loc.split(", ")[0]));
                          }
                          setIsModalOpen(true);
                        }}
                        className={`cursor-pointer min-h-[44px] p-2 bg-card/50 backdrop-blur-sm border-slate-200 text-slate-800 rounded-xl pr-10 border hover:border-primary transition-colors flex flex-wrap gap-1.5 items-center ${
                          onboardErrors.location ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      >
                        {(onboardData.locations.length === 0 && !onboardData.location) && (
                          <span className="text-slate-400 pl-2 text-sm">
                            {onboardData.role === "geography-lead" ? "Click to select designated State" : "Click to select State & District(s)"}
                          </span>
                        )}
                        {onboardData.role === "geography-lead" && onboardData.location && (
                          <span className="pl-2 text-sm">{onboardData.location}</span>
                        )}
                        {onboardData.role === "teacher-trainer" && onboardData.locations.map(loc => (
                          <span key={loc} className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-1 rounded-md border border-primary/20">
                            {loc.split(', ')[0]}
                          </span>
                        ))}
                      </div>
                      <MapPin className="absolute right-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                    </div>
                    {onboardErrors.location && (
                      <p className="text-xs text-destructive">{onboardErrors.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Credentials / Reporting Assignments */}
              {onboardStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffEmail" className="text-sm font-semibold text-slate-700">
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
                      className={`bg-card/50 backdrop-blur-sm border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:border-primary ${
                        onboardErrors.teacherEmail ? "border-destructive focus-visible:ring-destructive" : ""
                      }`}
                    />
                    {onboardErrors.teacherEmail && (
                      <p className="text-xs text-destructive">{onboardErrors.teacherEmail}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="staffPass" className="text-sm font-semibold text-slate-700">
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
                        className={`bg-card/50 backdrop-blur-sm border-slate-200 text-slate-850 placeholder-slate-400 rounded-xl focus:border-primary ${
                          onboardErrors.teacherPassword ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staffConfirm" className="text-sm font-semibold text-slate-700">
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
                        className={`bg-card/50 backdrop-blur-sm border-slate-200 text-slate-850 placeholder-slate-400 rounded-xl focus:border-primary ${
                          onboardErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      />
                    </div>
                    {(onboardErrors.teacherPassword || onboardErrors.confirmPassword) && (
                      <div className="col-span-2">
                        <p className="text-xs text-destructive font-medium">
                          {onboardErrors.teacherPassword || onboardErrors.confirmPassword}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Supervisor dropdown (Only for Teacher Trainer) */}
                  {onboardData.role === "teacher-trainer" && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="reportingLead" className="text-sm font-semibold text-slate-700">
                        Assigned Geography Lead *
                      </Label>
                      <select
                        id="reportingLead"
                        value={onboardData.assignedLeadId}
                        onChange={(e) =>
                          setOnboardData({ ...onboardData, assignedLeadId: e.target.value })
                        }
                        className={`w-full p-3 rounded-xl border bg-card/50 backdrop-blur-sm border-slate-200 text-slate-700 text-sm focus:ring-1 focus:ring-primary focus:border-primary ${
                          onboardErrors.assignedLeadId ? "border-destructive focus:ring-destructive" : ""
                        }`}
                      >
                        <option value="" className="bg-card text-slate-400">
                          -- Choose Supervising Lead --
                        </option>
                        {geographyLeads.map((lead) => {
                          const scope = lead.subGeographies.length
                            ? lead.subGeographies.map((s) => s.name).join(", ")
                            : lead.geographyName
                              ? `${lead.geographyName} (state-wide)`
                              : "no scope";
                          return (
                            <option
                              key={lead.id}
                              value={String(lead.id)}
                              className="bg-card text-slate-800 font-semibold"
                            >
                              {lead.displayName} — {scope}
                            </option>
                          );
                        })}
                      </select>
                      {onboardErrors.assignedLeadId && (
                        <p className="text-xs text-destructive">{onboardErrors.assignedLeadId}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Final Profile Review */}
              {onboardStep === 4 && (
                <div className="space-y-4 text-slate-800 text-sm">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4 shadow-sm">
                    <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
                      Review Access Level
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-slate-700">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Access Role:</span>
                        <span className="font-bold text-slate-800 uppercase text-xs">
                          {onboardData.role === "teacher-trainer"
                            ? "Teacher Trainer (TT)"
                            : "Geography Lead (GL)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Full Name:</span>
                        <span className="font-semibold text-slate-800">{onboardData.teacherName}</span>
                      </div>
                      <div className="col-span-2 border-t border-slate-200/40 pt-2">
                        <span className="text-slate-500 block text-[10px]">Work Email:</span>
                        <span className="font-semibold text-slate-800">{onboardData.teacherEmail}</span>
                      </div>
                      <div className="border-t border-slate-200/40 pt-2">
                        <span className="text-slate-500 block text-[10px]">Jurisdiction:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {onboardData.locations && onboardData.locations.length > 0 ? (
                            onboardData.locations.map(loc => (
                              <span key={loc} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                                {loc}
                              </span>
                            ))
                          ) : (
                            <span className="font-semibold text-slate-800">{onboardData.location}</span>
                          )}
                        </div>
                      </div>
                      {onboardData.role === "teacher-trainer" && (
                        <div className="border-t border-slate-200/40 pt-2">
                          <span className="text-slate-500 block text-[10px]">Reports To:</span>
                          <span className="font-semibold text-slate-800 break-all text-xs">
                            {onboardData.assignedLeadId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Footer Navigation */}
              <div className="flex gap-3 pt-4 border-t border-border/20">
                {onboardStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOnboardPrev}
                    className="flex-1 rounded-xl shadow-sm text-sm"
                  >
                    Back
                  </Button>
                )}
                {onboardStep < totalOnboardSteps ? (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] text-sm"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Join Team"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Already registered?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-bold hover:underline"
              >
                Sign in to Platform
              </Link>
            </p>
            <p className="text-xs text-slate-400">
              Registering a school instead?{" "}
              <Link
                href="/onboard"
                className="text-primary hover:text-primary/80 font-bold hover:underline"
              >
                Register your school
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* INDIAN GEOGRAPHY / STATE & DISTRICT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl bg-white border border-slate-200/50 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card rounded-t-2xl">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    {onboardData.role === "geography-lead" ? "Select Designated State" : "Select Region Geography"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {onboardData.role === "geography-lead"
                      ? "Choose the state you will oversee as Geography Lead"
                      : "Choose the state and corresponding educational district"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/20">
                {/* Left Column: States List */}
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden">
                  <div className="p-4 border-b border-border/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search State/UT..."
                        value={searchState}
                        onChange={(e) => setSearchState(e.target.value)}
                        className="pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
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
                            setSelectedDistricts([]); // Reset districts on state change
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                            selectedState === sd.state
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-accent/5 text-foreground hover:text-primary hover:translate-x-1"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className={`h-4 w-4 transition-colors duration-200 ${
                              selectedState === sd.state ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"
                            }`} />
                            <span>{highlightText(sd.state, searchState)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
                              selectedState === sd.state
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}>
                              {sd.districts.length}
                            </span>
                            {selectedState === sd.state && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No states found
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Districts List or State-Level details */}
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden bg-slate-50/30">
                  {onboardData.role === "geography-lead" ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-primary/5">
                      <div className="p-4 bg-primary/10 text-primary rounded-full mb-4 border border-primary/20">
                        <Map className="h-8 w-8 stroke-[1.5]" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">State-Level Access</h4>
                      <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed font-medium">
                        As a Geography Lead, your authority spans the entire state of <strong>{selectedState || "your choice"}</strong>. You will automatically have reporting visibility over all educational districts inside this state.
                      </p>
                      {selectedState && (
                        <div className="mt-6 px-4 py-2 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in zoom-in-95 shadow-sm">
                          <Check className="h-3.5 w-3.5" />
                          Selected State: {selectedState}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border-b border-border/10">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={
                              selectedState
                                ? `Search districts in ${selectedState}...`
                                : "Select a state first..."
                            }
                            disabled={!selectedState}
                            value={searchDistrict}
                            onChange={(e) => setSearchDistrict(e.target.value)}
                            className="pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
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
                                onClick={() => {
                                  if (selectedDistricts.includes(dist)) {
                                    setSelectedDistricts(selectedDistricts.filter(d => d !== dist));
                                  } else {
                                    setSelectedDistricts([...selectedDistricts, dist]);
                                  }
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                                  selectedDistricts.includes(dist)
                                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                                    : "hover:bg-accent/5 text-slate-700 hover:text-primary hover:translate-x-1"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <MapPin className={`h-4 w-4 transition-all duration-200 ${
                                    selectedDistricts.includes(dist) ? "text-white scale-110" : "text-muted-foreground/60 group-hover:text-primary"
                                  }`} />
                                  <span>{highlightText(dist, searchDistrict)}</span>
                                </div>
                                {selectedDistricts.includes(dist) && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                              No districts found
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <MapPin className="h-10 w-10 text-muted-foreground/30 mb-2 stroke-[1.2]" />
                            <p className="text-sm font-medium text-muted-foreground">
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
              <div className="px-6 py-4 border-t border-border/20 bg-card rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-700">
                  {selectedState ? (
                    onboardData.role === "geography-lead" ? (
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-primary" />
                        Selected State: {selectedState}
                      </span>
                    ) : selectedDistricts.length > 0 ? (
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-primary" />
                        Selected {selectedDistricts.length} District(s) in {selectedState}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Select district(s) from the right column</span>
                    )
                  ) : (
                    <span className="text-muted-foreground italic">No geography selected yet</span>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmGeography}
                    disabled={isConfirmDisabled}
                    className="flex-1 sm:flex-none h-9 text-sm font-semibold shadow-md shadow-primary/10 transition-transform active:scale-[0.98]"
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
