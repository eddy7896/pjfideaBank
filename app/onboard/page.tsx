"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Phone, MapPin, Building2, BookOpen, Check, Search, X, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { INDIAN_STATES_DISTRICTS } from "@/lib/indian-states-districts";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "school" as "school" | "teacher-trainer" | "geography-lead",
    schoolName: "",
    location: "",
    address: "",
    phone: "",
    website: "",
    principalName: "",
    udaiseCode: "",
    teacherName: "",
    teacherEmail: "",
    teacherPassword: "",
    confirmPassword: "",
    assignedLeadId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const getStepsForRole = (r: string) => {
    if (r === "school") {
      return [
        { num: 1, title: "Choose Role" },
        { num: 2, title: "School Basics" },
        { num: 3, title: "School Details" },
        { num: 4, title: "Teacher Account" },
        { num: 5, title: "Review" },
      ];
    } else if (r === "teacher-trainer") {
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

  const steps = getStepsForRole(formData.role);
  const totalSteps = steps.length;
  const isFinalStep = currentStep === totalSteps;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const r = formData.role;

    if (step === 1) {
      if (!formData.role) {
        newErrors.role = "Please select a role to proceed";
      }
    }

    if (r === "school") {
      if (step === 2) {
        if (!formData.schoolName.trim()) newErrors.schoolName = "School name required";
        if (!formData.udaiseCode.trim()) newErrors.udaiseCode = "UDAISE code required";
        if (formData.udaiseCode.length !== 11)
          newErrors.udaiseCode = "UDAISE code must be 11 digits";
        if (!formData.location.trim()) newErrors.location = "Geography (State & District) required";
      }

      if (step === 3) {
        if (!formData.address.trim()) newErrors.address = "Address required";
        if (!formData.phone.trim()) newErrors.phone = "Phone required";
        if (!/^\d{10,}$/.test(formData.phone.replace(/[^\d]/g, "")))
          newErrors.phone = "Valid phone required";
        if (!formData.principalName.trim()) newErrors.principalName = "Principal name required";
      }

      if (step === 4) {
        if (!formData.teacherName.trim()) newErrors.teacherName = "Teacher name required";
        if (!formData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail))
          newErrors.teacherEmail = "Valid email required";
        if (formData.teacherPassword.length < 6)
          newErrors.teacherPassword = "Password min 6 characters";
        if (formData.teacherPassword !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords must match";
      }
    }

    if (r === "teacher-trainer") {
      if (step === 2) {
        if (!formData.teacherName.trim()) newErrors.teacherName = "Trainer name required";
        if (!formData.location.trim()) newErrors.location = "Assigned Geography (State & District) required";
      }

      if (step === 3) {
        if (!formData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail))
          newErrors.teacherEmail = "Valid email required";
        if (formData.teacherPassword.length < 6)
          newErrors.teacherPassword = "Password min 6 characters";
        if (formData.teacherPassword !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords must match";
        if (!formData.assignedLeadId) newErrors.assignedLeadId = "Please select an assigned Geography Lead";
      }
    }

    if (r === "geography-lead") {
      if (step === 2) {
        if (!formData.teacherName.trim()) newErrors.teacherName = "Lead name required";
        if (!formData.location.trim()) newErrors.location = "Designated State required";
      }

      if (step === 3) {
        if (!formData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail))
          newErrors.teacherEmail = "Valid email required";
        if (formData.teacherPassword.length < 6)
          newErrors.teacherPassword = "Password min 6 characters";
        if (formData.teacherPassword !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords must match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const payload: any = {
        role: formData.role,
        teacherName: formData.teacherName.trim(),
        teacherEmail: formData.teacherEmail.trim(),
        teacherPassword: formData.teacherPassword,
      };

      if (formData.role === "school") {
        payload.schoolName = formData.schoolName.trim();
        payload.location = formData.location.trim();
        payload.address = formData.address.trim();
        payload.phone = formData.phone.trim();
        payload.website = formData.website.trim();
        payload.principalName = formData.principalName.trim();
        payload.udaiseCode = formData.udaiseCode.trim();
      } else if (formData.role === "teacher-trainer") {
        payload.location = formData.location.trim();
        payload.assignedLeadId = formData.assignedLeadId;
      } else if (formData.role === "geography-lead") {
        payload.location = formData.location.trim();
      }

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
          formData.role === "school"
            ? "School"
            : formData.role === "teacher-trainer"
            ? "Teacher Trainer"
            : "Geography Lead"
        } onboarded successfully! Redirecting to login...`
      );
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Onboarding failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter states
  const filteredStates = INDIAN_STATES_DISTRICTS.filter((sd) =>
    sd.state.toLowerCase().includes(searchState.toLowerCase())
  );

  // Find districts for active state
  const activeStateData = INDIAN_STATES_DISTRICTS.find(
    (sd) => sd.state === selectedState
  );

  const filteredDistricts = activeStateData
    ? activeStateData.districts.filter((dist) =>
        dist.toLowerCase().includes(searchDistrict.toLowerCase())
      )
    : [];

  const handleConfirmGeography = () => {
    if (formData.role === "geography-lead") {
      if (!selectedState) {
        toast.error("Please select a State");
        return;
      }
      setFormData({
        ...formData,
        location: selectedState,
      });
    } else {
      if (!selectedState || !selectedDistrict) {
        toast.error("Please select both a State and a District");
        return;
      }
      setFormData({
        ...formData,
        location: `${selectedDistrict}, ${selectedState}`,
      });
    }
    setIsModalOpen(false);
  };

  const isConfirmDisabled =
    formData.role === "geography-lead"
      ? !selectedState
      : !selectedState || !selectedDistrict;

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
              className="h-8 w-auto rounded-lg"
            />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Stepper */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium text-sm transition-all duration-300 ${
                      currentStep >= step.num
                        ? "border-primary bg-primary text-white"
                        : "border-border/40 text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="h-5 w-5 animate-in zoom-in-50" />
                    ) : (
                      step.num
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step.num ? "bg-primary" : "bg-border/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {steps[currentStep - 1]?.title}
              </h2>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border/20 bg-white p-8 shadow-sm">
            <form
              onSubmit={
                isFinalStep
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
              className="space-y-8"
            >
              {/* Step 1: Choose Role */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-1 mb-2">
                    <p className="text-xs text-muted-foreground">Select the pathway that matches your level of access.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* School Admin Card */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "school" })}
                      className={`relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                        formData.role === "school"
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.02]"
                          : "border-border/30 hover:border-primary/50 hover:bg-slate-50/50 hover:scale-[1.01]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                        formData.role === "school" ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs block">School Admin</span>
                      <span className="text-[10px] text-slate-500 mt-1 block leading-relaxed">
                        Register a school, manage student teams and project submissions.
                      </span>
                    </button>

                    {/* Teacher Trainer Card */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "teacher-trainer" })}
                      className={`relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                        formData.role === "teacher-trainer"
                          ? "border-emerald-600 bg-emerald-50/10 shadow-md shadow-emerald-600/5 scale-[1.02]"
                          : "border-border/30 hover:border-emerald-600/50 hover:bg-slate-50/50 hover:scale-[1.01]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                        formData.role === "teacher-trainer" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-600/10 group-hover:text-emerald-600"
                      }`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs block">Teacher Trainer</span>
                      <span className="text-[10px] text-slate-500 mt-1 block leading-relaxed">
                        Support regional schools, monitor progress, and review district ideas.
                      </span>
                    </button>

                    {/* Geography Lead Card */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "geography-lead" })}
                      className={`relative flex flex-col items-center p-5 rounded-xl border-2 text-center transition-all duration-300 group ${
                        formData.role === "geography-lead"
                          ? "border-rose-600 bg-rose-50/10 shadow-md shadow-rose-600/5 scale-[1.02]"
                          : "border-border/30 hover:border-rose-600/50 hover:bg-slate-50/50 hover:scale-[1.01]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-full mb-3 transition-colors duration-300 ${
                        formData.role === "geography-lead" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-rose-600/10 group-hover:text-rose-600"
                      }`}>
                        <Map className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs block">Geography Lead</span>
                      <span className="text-[10px] text-slate-500 mt-1 block leading-relaxed">
                        Oversee program implementations and coordinate trainers across a state.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Basics / Profile Info */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {formData.role === "school" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="schoolName" className="text-sm font-medium">
                          School Name *
                        </Label>
                        <Input
                          id="schoolName"
                          placeholder="e.g., Springfield High School"
                          value={formData.schoolName}
                          onChange={(e) =>
                            setFormData({ ...formData, schoolName: e.target.value })
                          }
                          className={errors.schoolName ? "border-destructive" : ""}
                        />
                        {errors.schoolName && (
                          <p className="text-xs text-destructive">
                            {errors.schoolName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="udaiseCode" className="text-sm font-medium">
                          UDAISE Code (11 digits) *
                        </Label>
                        <Input
                          id="udaiseCode"
                          placeholder="12345678901"
                          value={formData.udaiseCode}
                          onChange={(e) =>
                            setFormData({ ...formData, udaiseCode: e.target.value })
                          }
                          maxLength={11}
                          className={errors.udaiseCode ? "border-destructive" : ""}
                        />
                        {errors.udaiseCode && (
                          <p className="text-xs text-destructive">
                            {errors.udaiseCode}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="teacherName" className="text-sm font-medium">
                        {formData.role === "teacher-trainer" ? "Trainer Full Name *" : "Geography Lead Full Name *"}
                      </Label>
                      <Input
                        id="teacherName"
                        placeholder="e.g., Ms. Sarah Johnson"
                        value={formData.teacherName}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherName: e.target.value })
                        }
                        className={errors.teacherName ? "border-destructive" : ""}
                      />
                      {errors.teacherName && (
                        <p className="text-xs text-destructive">
                          {errors.teacherName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Geography picker */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {formData.role === "school"
                        ? "Geography (State & District) *"
                        : formData.role === "teacher-trainer"
                        ? "Assigned Geography (State & District) *"
                        : "Designated State *"}
                    </Label>
                    <div className="relative">
                      <Input
                        readOnly
                        placeholder={
                          formData.role === "geography-lead"
                            ? "Click to select designated State"
                            : "Click to select State & District"
                        }
                        value={formData.location}
                        onClick={() => {
                          if (formData.location) {
                            if (formData.role === "geography-lead") {
                              setSelectedState(formData.location);
                              setSelectedDistrict("");
                            } else {
                              const [dist, st] = formData.location.split(", ");
                              setSelectedState(st || "");
                              setSelectedDistrict(dist || "");
                            }
                          }
                          setIsModalOpen(true);
                        }}
                        className={`cursor-pointer bg-background pr-10 ${
                          errors.location ? "border-destructive" : ""
                        }`}
                      />
                      <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {errors.location && (
                      <p className="text-xs text-destructive">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: School Details OR Accounts & Reporting */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {formData.role === "school" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">
                          School Address *
                        </Label>
                        <Input
                          id="address"
                          placeholder="e.g., 123 School Street, District"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive">
                            {errors.address}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          School Phone *
                        </Label>
                        <Input
                          id="phone"
                          placeholder="e.g., 9876543210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="principalName" className="text-sm font-medium">
                          Principal Name *
                        </Label>
                        <Input
                          id="principalName"
                          placeholder="e.g., Dr. John Smith"
                          value={formData.principalName}
                          onChange={(e) =>
                            setFormData({ ...formData, principalName: e.target.value })
                          }
                          className={errors.principalName ? "border-destructive" : ""}
                        />
                        {errors.principalName && (
                          <p className="text-xs text-destructive">
                            {errors.principalName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-medium">
                          School Website (Optional)
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="e.g., https://www.school.edu"
                          value={formData.website}
                          onChange={(e) =>
                            setFormData({ ...formData, website: e.target.value })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Credentials fields for Trainer/Lead */}
                      <div className="space-y-2">
                        <Label htmlFor="teacherEmail" className="text-sm font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="teacherEmail"
                          type="email"
                          placeholder={formData.role === "teacher-trainer" ? "trainer@pijam.org" : "lead@pijam.org"}
                          value={formData.teacherEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, teacherEmail: e.target.value })
                          }
                          className={errors.teacherEmail ? "border-destructive" : ""}
                        />
                        {errors.teacherEmail && (
                          <p className="text-xs text-destructive">
                            {errors.teacherEmail}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacherPassword" className="text-sm font-medium">
                          Password *
                        </Label>
                        <Input
                          id="teacherPassword"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={formData.teacherPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, teacherPassword: e.target.value })
                          }
                          className={errors.teacherPassword ? "border-destructive" : ""}
                        />
                        {errors.teacherPassword && (
                          <p className="text-xs text-destructive">
                            {errors.teacherPassword}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                          className={errors.confirmPassword ? "border-destructive" : ""}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-destructive">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Reporting Lead dropdown (ONLY for Teacher Trainer) */}
                      {formData.role === "teacher-trainer" && (
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="assignedLeadId" className="text-sm font-medium flex items-center gap-1">
                            Assigned Geography Lead *
                          </Label>
                          <select
                            id="assignedLeadId"
                            value={formData.assignedLeadId}
                            onChange={(e) => setFormData({ ...formData, assignedLeadId: e.target.value })}
                            className={`w-full p-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary ${
                              errors.assignedLeadId ? "border-destructive" : "border-border/30"
                            }`}
                          >
                            <option value="">-- Select Reporting Lead --</option>
                            {geographyLeads.map((lead) => (
                              <option key={lead.email} value={lead.email}>
                                {lead.displayName} ({lead.email})
                              </option>
                            ))}
                          </select>
                          {errors.assignedLeadId && (
                            <p className="text-xs text-destructive">{errors.assignedLeadId}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground italic">
                            Teacher Trainers must report to an existing regional Geography Lead to complete onboarding.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Teacher Account (only for School Admin) OR Review (for TT / GL) */}
              {currentStep === 4 && (
                formData.role === "school" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacherName" className="text-sm font-medium">
                        Teacher Name *
                      </Label>
                      <Input
                        id="teacherName"
                        placeholder="e.g., Ms. Sarah Johnson"
                        value={formData.teacherName}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherName: e.target.value })
                        }
                        className={errors.teacherName ? "border-destructive" : ""}
                      />
                      {errors.teacherName && (
                        <p className="text-xs text-destructive">
                          {errors.teacherName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherEmail" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="teacherEmail"
                        type="email"
                        placeholder="e.g., teacher@school.edu"
                        value={formData.teacherEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherEmail: e.target.value })
                        }
                        className={errors.teacherEmail ? "border-destructive" : ""}
                      />
                      {errors.teacherEmail && (
                        <p className="text-xs text-destructive">
                          {errors.teacherEmail}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherPassword" className="text-sm font-medium">
                        Password *
                      </Label>
                      <Input
                        id="teacherPassword"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={formData.teacherPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherPassword: e.target.value })
                        }
                        className={errors.teacherPassword ? "border-destructive" : ""}
                      />
                      {errors.teacherPassword && (
                        <p className="text-xs text-destructive">
                          {errors.teacherPassword}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Review Step for Teacher Trainer / Geography Lead */
                  <div className="space-y-6 text-sm">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-base">
                        <Check className="h-5 w-5 text-emerald-600" />
                        Review Onboarding Profile
                      </h3>
                      
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/5 p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground block text-xs">Access Role:</span>
                            <span className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                              {formData.role === "teacher-trainer" ? "Teacher Trainer (TT)" : "Geography Lead (GL/PL)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">Full Name:</span>
                            <span className="font-semibold text-slate-800">{formData.teacherName}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground block text-xs">Email Address:</span>
                            <span className="font-semibold text-slate-800">{formData.teacherEmail}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">
                              {formData.role === "teacher-trainer" ? "Assigned Region:" : "Overseeing State:"}
                            </span>
                            <span className="font-semibold text-slate-800">{formData.location}</span>
                          </div>
                          {formData.role === "teacher-trainer" && (
                            <div>
                              <span className="text-muted-foreground block text-xs">Reporting To:</span>
                              <span className="font-semibold text-slate-800">{formData.assignedLeadId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Step 5: School Admin Review & Complete */}
              {currentStep === 5 && formData.role === "school" && (
                <div className="space-y-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-base">
                      <Check className="h-5 w-5 text-primary" />
                      Review School Registration
                    </h3>
                    
                    <div className="rounded-xl border border-primary/20 bg-slate-50/50 p-5 space-y-5">
                      <div>
                        <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">School Information</h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          <div>
                            <span className="text-muted-foreground block text-[11px]">School Name:</span>
                            <span className="font-semibold text-slate-800">{formData.schoolName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">UDAISE Code:</span>
                            <span className="font-semibold text-slate-800">{formData.udaiseCode}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Geography:</span>
                            <span className="font-semibold text-slate-800">{formData.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Phone:</span>
                            <span className="font-semibold text-slate-800">{formData.phone}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground block text-[11px]">Address:</span>
                            <span className="font-semibold text-slate-800">{formData.address}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Principal:</span>
                            <span className="font-semibold text-slate-800">{formData.principalName}</span>
                          </div>
                          {formData.website && (
                            <div>
                              <span className="text-muted-foreground block text-[11px]">Website:</span>
                              <span className="font-semibold text-slate-800">{formData.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-200/60 pt-4">
                        <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Teacher Administrator</h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Teacher Name:</span>
                            <span className="font-semibold text-slate-800">{formData.teacherName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[11px]">Email Address:</span>
                            <span className="font-semibold text-slate-800">{formData.teacherEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                {currentStep < totalSteps && (
                  <Button
                    type="submit"
                    className={currentStep === 1 ? "w-full bg-primary hover:bg-primary/95 text-white" : "flex-1"}
                  >
                    Next
                  </Button>
                )}
                {isFinalStep && (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/95 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Complete Registration"}
                  </Button>
                )}
              </div>

              {currentStep === 1 && (
                <p className="text-xs text-muted-foreground text-center border-t border-border/20 pt-6">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* INDIAN GEOGRAPHY / DISTRICT SELECTION MODAL */}
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
              className="relative w-full max-w-3xl bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card rounded-t-2xl">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary animate-pulse" />
                    {formData.role === "geography-lead" ? "Select Designated State" : "Select Region Geography"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formData.role === "geography-lead"
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
                        className="pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
                              ? "bg-primary/10 text-primary font-semibold shadow-sm"
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
                                : "bg-slate-100 dark:bg-slate-800 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}>
                              {sd.districts.length}
                            </span>
                            {selectedState === sd.state && (
                              <Check className="h-4 w-4 text-primary animate-in zoom-in-50" />
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
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden bg-slate-50/30 dark:bg-slate-950/10">
                  {formData.role === "geography-lead" ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-rose-50/10">
                      <div className="p-4 bg-rose-100 text-rose-600 rounded-full mb-4">
                        <Map className="h-8 w-8 stroke-[1.5]" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">State-Level Access</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                        As a Geography Lead, your authority spans the entire state of <strong>{selectedState || "your choice"}</strong>. You will automatically have reporting visibility over all educational districts inside this state.
                      </p>
                      {selectedState && (
                        <div className="mt-6 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/50 flex items-center gap-1.5 animate-in fade-in zoom-in-95">
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
                            className="pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {selectedState ? (
                          filteredDistricts.length > 0 ? (
                            filteredDistricts.map((dist) => (
                              <button
                                key={dist}
                                type="button"
                                onClick={() => setSelectedDistrict(dist)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                                  selectedDistrict === dist
                                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                                    : "hover:bg-accent/5 text-foreground hover:text-primary hover:translate-x-1"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <MapPin className={`h-4 w-4 transition-all duration-200 ${
                                    selectedDistrict === dist ? "text-white scale-110" : "text-muted-foreground/60 group-hover:text-primary group-hover:scale-110"
                                  }`} />
                                  <span>{highlightText(dist, searchDistrict)}</span>
                                </div>
                                {selectedDistrict === dist && (
                                  <Check className="h-4 w-4 text-white animate-in zoom-in-50" />
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
                            <MapPin className="h-10 w-10 text-muted-foreground/30 mb-2 stroke-[1.2] animate-bounce" />
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
                <div className="text-sm text-foreground">
                  {selectedState ? (
                    formData.role === "geography-lead" ? (
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-primary" />
                        Selected State: {selectedState}
                      </span>
                    ) : selectedDistrict ? (
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-primary" />
                        Selected: {selectedDistrict}, {selectedState}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Select a district from the right column</span>
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
