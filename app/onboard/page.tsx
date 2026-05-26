"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Phone, MapPin, Building2, Check, Search, X, Map, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { INDIAN_STATES_DISTRICTS } from "@/lib/indian-states-districts";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/landing/animated-background";


export default function OnboardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "school" as const,
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // District selector modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

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

  const steps = [
    { num: 1, title: "School Basics" },
    { num: 2, title: "School Details" },
    { num: 3, title: "Teacher Account" },
    { num: 4, title: "Review Details" },
  ];

  const totalSteps = steps.length;
  const isFinalStep = currentStep === totalSteps;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.schoolName.trim()) newErrors.schoolName = "School name required";
      if (!formData.udaiseCode.trim()) newErrors.udaiseCode = "UDAISE code required";
      if (formData.udaiseCode.length !== 11)
        newErrors.udaiseCode = "UDAISE code must be 11 digits";
      if (!formData.location.trim()) newErrors.location = "Geography (State & District) required";
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address required";
      if (!formData.phone.trim()) newErrors.phone = "Phone required";
      if (!/^\d{10,}$/.test(formData.phone.replace(/[^\d]/g, "")))
        newErrors.phone = "Valid phone required";
      if (!formData.principalName.trim()) newErrors.principalName = "Principal name required";
    }

    if (step === 3) {
      if (!formData.teacherName.trim()) newErrors.teacherName = "Teacher name required";
      if (!formData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail))
        newErrors.teacherEmail = "Valid email required";
      if (formData.teacherPassword.length < 6)
        newErrors.teacherPassword = "Password min 6 characters";
      if (formData.teacherPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords must match";
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
      const payload = {
        role: "school",
        schoolName: formData.schoolName.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        principalName: formData.principalName.trim(),
        udaiseCode: formData.udaiseCode.trim(),
        teacherName: formData.teacherName.trim(),
        teacherEmail: formData.teacherEmail.trim(),
        teacherPassword: formData.teacherPassword,
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

      toast.success("School onboarded successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Onboarding failed");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!selectedState || !selectedDistrict) {
      toast.error("Please select both a State and a District");
      return;
    }
    setFormData({
      ...formData,
      location: `${selectedDistrict}, ${selectedState}`,
    });
    setIsModalOpen(false);
  };

  const isConfirmDisabled = !selectedState || !selectedDistrict;

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

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl space-y-8"
        >
          {/* Stepper */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-sm transition-all duration-300 ${
                      currentStep >= step.num
                        ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                        : "border-border/60 bg-card text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="h-5 w-5 animate-in zoom-in-50" />
                    ) : (
                      step.num
                    )}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 rounded-full ${
                        currentStep > step.num ? "bg-primary" : "bg-border/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-heading font-bold text-foreground">
                {steps[currentStep - 1]?.title}
              </h2>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-border/40 bg-card/85 backdrop-blur-md shadow-2xl p-8 transition-all duration-300 hover:border-primary/20">
            <form
              onSubmit={
                isFinalStep
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
              className="space-y-6"
            >
              {/* Step 1: School Basics */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-sm font-semibold text-slate-700">
                      School Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                      <Input
                        id="schoolName"
                        placeholder="e.g., Springfield High School"
                        value={formData.schoolName}
                        onChange={(e) =>
                          setFormData({ ...formData, schoolName: e.target.value })
                        }
                        className={`pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.schoolName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-xs text-destructive">{errors.schoolName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="udaiseCode" className="text-sm font-semibold text-slate-700">
                      UDAISE Code (11 digits) *
                    </Label>
                    <Input
                      id="udaiseCode"
                      placeholder="12345678901"
                      value={formData.udaiseCode}
                      onChange={(e) =>
                        setFormData({ ...formData, udaiseCode: e.target.value.replace(/[^\d]/g, "") })
                      }
                      maxLength={11}
                      className={`bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.udaiseCode ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.udaiseCode && (
                      <p className="text-xs text-destructive">{errors.udaiseCode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Geography (State & District) *
                    </Label>
                    <div className="relative">
                      <Input
                        readOnly
                        placeholder="Click to select State & District"
                        value={formData.location}
                        onClick={() => {
                          if (formData.location) {
                            const [dist, st] = formData.location.split(", ");
                            setSelectedState(st || "");
                            setSelectedDistrict(dist || "");
                          }
                          setIsModalOpen(true);
                        }}
                        className={`cursor-pointer pr-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.location ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                      <MapPin className="absolute right-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                    </div>
                    {errors.location && (
                      <p className="text-xs text-destructive">{errors.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: School Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                      School Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 School Street, District"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={`bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                      School Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                      <Input
                        id="phone"
                        placeholder="e.g., 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value.replace(/[^\d]/g, "") })
                        }
                        className={`pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principalName" className="text-sm font-semibold text-slate-700">
                      Principal Full Name *
                    </Label>
                    <Input
                      id="principalName"
                      placeholder="e.g., Dr. John Smith"
                      value={formData.principalName}
                      onChange={(e) =>
                        setFormData({ ...formData, principalName: e.target.value })
                      }
                      className={`bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.principalName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.principalName && (
                      <p className="text-xs text-destructive">{errors.principalName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-semibold text-slate-700">
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
                      className="bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Teacher Account Credentials */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherName" className="text-sm font-semibold text-slate-700">
                      Teacher Administrator Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                      <Input
                        id="teacherName"
                        placeholder="e.g., Ms. Sarah Johnson"
                        value={formData.teacherName}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherName: e.target.value })
                        }
                        className={`pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.teacherName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    {errors.teacherName && (
                      <p className="text-xs text-destructive">{errors.teacherName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherEmail" className="text-sm font-semibold text-slate-700">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-450 pointer-events-none" />
                      <Input
                        id="teacherEmail"
                        type="email"
                        placeholder="e.g., teacher@school.edu"
                        value={formData.teacherEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherEmail: e.target.value })
                        }
                        className={`pl-10 bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.teacherEmail ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    {errors.teacherEmail && (
                      <p className="text-xs text-destructive">{errors.teacherEmail}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacherPassword" className="text-sm font-semibold text-slate-700">
                        Password *
                      </Label>
                      <Input
                        id="teacherPassword"
                        type="password"
                        placeholder="Min 6 chars"
                        value={formData.teacherPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, teacherPassword: e.target.value })
                        }
                        className={`bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.teacherPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
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
                        className={`bg-card/50 backdrop-blur-sm border-slate-200 focus-visible:ring-primary rounded-xl transition-all duration-200 text-slate-800 placeholder-slate-400 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                    {(errors.teacherPassword || errors.confirmPassword) && (
                      <div className="col-span-2">
                        <p className="text-xs text-destructive font-medium">
                          {errors.teacherPassword || errors.confirmPassword}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Final Review & Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-4 text-sm text-slate-800">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4 shadow-sm">
                    <div>
                      <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">School Information</h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-slate-500 block text-[11px]">School Name:</span>
                          <span className="font-bold text-slate-800">{formData.schoolName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">UDAISE Code:</span>
                          <span className="font-bold text-slate-800">{formData.udaiseCode}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Geography:</span>
                          <span className="font-semibold text-slate-800">{formData.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Phone:</span>
                          <span className="font-semibold text-slate-800">{formData.phone}</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-200/40 pt-2">
                          <span className="text-slate-500 block text-[11px]">Address:</span>
                          <span className="font-medium text-slate-800">{formData.address}</span>
                        </div>
                        <div className="border-t border-slate-200/40 pt-2">
                          <span className="text-slate-500 block text-[11px]">Principal:</span>
                          <span className="font-semibold text-slate-800">{formData.principalName}</span>
                        </div>
                        {formData.website && (
                          <div className="border-t border-slate-200/40 pt-2">
                            <span className="text-slate-500 block text-[11px]">Website:</span>
                            <span className="font-semibold text-slate-800">{formData.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200/40 pt-3">
                      <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Teacher Administrator</h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Teacher Name:</span>
                          <span className="font-bold text-slate-800">{formData.teacherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Email Address:</span>
                          <span className="font-bold text-slate-850 break-all">{formData.teacherEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex gap-3 pt-4 border-t border-border/20">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    className="flex-1 rounded-xl shadow-sm text-sm"
                  >
                    Back
                  </Button>
                )}
                {currentStep < totalSteps ? (
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
                    {isLoading ? "Submitting..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* INDIAN GEOGRAPHY SELECTOR MODAL */}
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
                    Select Region Geography
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose the state and corresponding educational district
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
                            setSelectedDistrict("");
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

                {/* Right Column: Districts List */}
                <div className="flex flex-col h-[50vh] md:h-[60vh] overflow-hidden bg-slate-50/30">
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
                            onClick={() => setSelectedDistrict(dist)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                              selectedDistrict === dist
                                ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                                : "hover:bg-accent/5 text-foreground hover:text-primary hover:translate-x-1"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <MapPin className={`h-4 w-4 transition-all duration-200 ${
                                selectedDistrict === dist ? "text-white scale-110" : "text-muted-foreground/60 group-hover:text-primary"
                              }`} />
                              <span>{highlightText(dist, searchDistrict)}</span>
                            </div>
                            {selectedDistrict === dist && (
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
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-border/20 bg-card rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-foreground">
                  {selectedState && selectedDistrict ? (
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-primary" />
                      Selected: {selectedDistrict}, {selectedState}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Select a state & district to confirm</span>
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
