"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Phone, MapPin, Building2, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function OnboardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const steps = [
    { num: 1, title: "School Basics" },
    { num: 2, title: "School Details" },
    { num: 3, title: "Teacher Account" },
    { num: 4, title: "Review" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.schoolName.trim()) newErrors.schoolName = "School name required";
      if (!formData.udaiseCode.trim()) newErrors.udaiseCode = "UDAISE code required";
      if (formData.udaiseCode.length !== 11)
        newErrors.udaiseCode = "UDAISE code must be 11 digits";
      if (!formData.location.trim()) newErrors.location = "Location required";
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
      const response = await fetch("/api/auth/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Onboarding failed");
      }

      toast.success("School onboarded successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Onboarding failed"
      );
    } finally {
      setIsLoading(false);
    }
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
            />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl space-y-10">
          {/* Stepper */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium text-sm ${
                      currentStep >= step.num
                        ? "border-primary bg-primary text-white"
                        : "border-border/40 text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.num
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
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
          <div className="rounded-xl border border-border/20 bg-white p-8">
          <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
            {/* Step 1: School Basics */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName" className="text-sm font-medium">School Name *</Label>
                  <Input id="schoolName" placeholder="e.g., Springfield High School" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className={errors.schoolName ? "border-destructive" : ""} />
                  {errors.schoolName && <p className="text-xs text-destructive">{errors.schoolName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="udaiseCode" className="text-sm font-medium">UDAISE Code (11 digits) *</Label>
                  <Input id="udaiseCode" placeholder="12345678901" value={formData.udaiseCode} onChange={(e) => setFormData({ ...formData, udaiseCode: e.target.value })} maxLength={11} className={errors.udaiseCode ? "border-destructive" : ""} />
                  {errors.udaiseCode && <p className="text-xs text-destructive">{errors.udaiseCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location/City *</Label>
                  <Input id="location" placeholder="e.g., Mumbai" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={errors.location ? "border-destructive" : ""} />
                  {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                </div>
              </div>
            )}

            {/* Step 2: School Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">School Address *</Label>
                  <Input id="address" placeholder="e.g., 123 School Street, District" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={errors.address ? "border-destructive" : ""} />
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">School Phone *</Label>
                  <Input id="phone" placeholder="e.g., +91-9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={errors.phone ? "border-destructive" : ""} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principalName" className="text-sm font-medium">Principal Name *</Label>
                  <Input id="principalName" placeholder="e.g., Dr. John Smith" value={formData.principalName} onChange={(e) => setFormData({ ...formData, principalName: e.target.value })} className={errors.principalName ? "border-destructive" : ""} />
                  {errors.principalName && <p className="text-xs text-destructive">{errors.principalName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">School Website (Optional)</Label>
                  <Input id="website" type="url" placeholder="e.g., https://www.school.edu" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
              </div>
            )}

            {/* Step 3: Teacher Account */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName" className="text-sm font-medium">Teacher Name *</Label>
                  <Input id="teacherName" placeholder="e.g., Ms. Sarah Johnson" value={formData.teacherName} onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })} className={errors.teacherName ? "border-destructive" : ""} />
                  {errors.teacherName && <p className="text-xs text-destructive">{errors.teacherName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail" className="text-sm font-medium">Email Address *</Label>
                  <Input id="teacherEmail" type="email" placeholder="e.g., teacher@school.edu" value={formData.teacherEmail} onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })} className={errors.teacherEmail ? "border-destructive" : ""} />
                  {errors.teacherEmail && <p className="text-xs text-destructive">{errors.teacherEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherPassword" className="text-sm font-medium">Password *</Label>
                  <Input id="teacherPassword" type="password" placeholder="Minimum 6 characters" value={formData.teacherPassword} onChange={(e) => setFormData({ ...formData, teacherPassword: e.target.value })} className={errors.teacherPassword ? "border-destructive" : ""} />
                  {errors.teacherPassword && <p className="text-xs text-destructive">{errors.teacherPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={errors.confirmPassword ? "border-destructive" : ""} />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6 text-sm">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">School Information</h3>
                  <div className="grid gap-3 text-sm">
                    <div><span className="text-muted-foreground">School Name:</span> {formData.schoolName}</div>
                    <div><span className="text-muted-foreground">UDAISE Code:</span> {formData.udaiseCode}</div>
                    <div><span className="text-muted-foreground">Location:</span> {formData.location}</div>
                    <div><span className="text-muted-foreground">Address:</span> {formData.address}</div>
                    <div><span className="text-muted-foreground">Phone:</span> {formData.phone}</div>
                    <div><span className="text-muted-foreground">Principal:</span> {formData.principalName}</div>
                    {formData.website && <div><span className="text-muted-foreground">Website:</span> {formData.website}</div>}
                  </div>
                </div>
                <div className="border-t border-border/20 pt-6 space-y-3">
                  <h3 className="font-semibold text-foreground">Teacher Information</h3>
                  <div className="grid gap-3 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {formData.teacherName}</div>
                    <div><span className="text-muted-foreground">Email:</span> {formData.teacherEmail}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-6">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrev} className="flex-1">
                  Back
                </Button>
              )}
              {currentStep < 4 && (
                <Button type="submit" className={currentStep === 1 ? "w-full" : "flex-1"}>
                  Next
                </Button>
              )}
              {currentStep === 4 && (
                <>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Complete Registration"}
                  </Button>
                </>
              )}
            </div>

            {currentStep === 1 && (
              <p className="text-xs text-muted-foreground text-center border-t border-border/20 pt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in
                </Link>
              </p>
            )}
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
