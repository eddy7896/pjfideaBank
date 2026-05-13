"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, Mail, Lock, Phone, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function OnboardPage() {
  const router = useRouter();
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName.trim()) newErrors.schoolName = "School name required";
    if (!formData.location.trim()) newErrors.location = "Location required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!/^\d{10,}$/.test(formData.phone.replace(/[^\d]/g, "")))
      newErrors.phone = "Valid phone required";
    if (!formData.principalName.trim()) newErrors.principalName = "Principal name required";
    if (!formData.udaiseCode.trim()) newErrors.udaiseCode = "UDAISE code required";
    if (formData.udaiseCode.length !== 11)
      newErrors.udaiseCode = "UDAISE code must be 11 digits";

    if (!formData.teacherName.trim()) newErrors.teacherName = "Teacher name required";
    if (!formData.teacherEmail.trim()) newErrors.teacherEmail = "Email required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.teacherEmail))
      newErrors.teacherEmail = "Valid email required";
    if (formData.teacherPassword.length < 6)
      newErrors.teacherPassword = "Password min 6 characters";
    if (formData.teacherPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create school + teacher account
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
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Register your school
            </h1>
            <p className="text-base text-muted-foreground">
              Set up your school account and create your teacher profile
            </p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border/20 bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* School Information Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  School Information
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    <p className="text-xs text-destructive">{errors.schoolName}</p>
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
                    <p className="text-xs text-destructive">{errors.udaiseCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location/City *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    School Phone *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +91-9876543210"
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

                <div className="space-y-2 sm:col-span-2">
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
                    <p className="text-xs text-destructive">{errors.address}</p>
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
                    <p className="text-xs text-destructive">{errors.principalName}</p>
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
              </div>
            </div>

            {/* Teacher Account Section */}
            <div className="space-y-6 border-t border-border/20 pt-8">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Teacher Account
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    <p className="text-xs text-destructive">{errors.teacherName}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
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
                    <p className="text-xs text-destructive">{errors.teacherEmail}</p>
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
                    <p className="text-xs text-destructive">{errors.teacherPassword}</p>
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
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  Back
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Register"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center border-t border-border/20 pt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
