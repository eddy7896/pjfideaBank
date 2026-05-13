"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmpathizeData } from "@/types";
import { AlertCircle } from "lucide-react";

interface EmpathizeFormProps {
  initialData?: EmpathizeData;
  onSubmit: (data: EmpathizeData) => void;
  isLoading?: boolean;
}

export function EmpathizeForm({ initialData, onSubmit, isLoading }: EmpathizeFormProps) {
  const [what, setWhat] = useState(initialData?.what || "");
  const [when, setWhen] = useState(initialData?.when || "");
  const [where, setWhere] = useState(initialData?.where || "");
  const [who, setWho] = useState(initialData?.who || "");
  const [how, setHow] = useState(initialData?.how || "");
  const [whys, setWhys] = useState<string[]>(initialData?.whys || ["", "", "", "", ""]);
  const [rootCause, setRootCause] = useState(initialData?.rootCause || "");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!what.trim()) newErrors.push("What is missing");
    if (!when.trim()) newErrors.push("When is missing");
    if (!where.trim()) newErrors.push("Where is missing");
    if (!who.trim()) newErrors.push("Who is missing");
    if (!how.trim()) newErrors.push("How is missing");
    if (whys.some((w) => !w.trim())) newErrors.push("All 5 Whys must be filled");
    if (!rootCause.trim()) newErrors.push("Root cause is missing");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        what: what.trim(),
        when: when.trim(),
        where: where.trim(),
        who: who.trim(),
        how: how.trim(),
        whys: whys.map((w) => w.trim()),
        rootCause: rootCause.trim(),
      });
    }
  };

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="what" className="text-base font-semibold">
          What is the problem?
        </Label>
        <Textarea
          id="what"
          placeholder="Describe the problem you've identified..."
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          className="min-h-20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="when" className="text-base font-semibold">
            When does it occur?
          </Label>
          <Textarea
            id="when"
            placeholder="e.g., During winter months, after school hours..."
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="where" className="text-base font-semibold">
            Where does it happen?
          </Label>
          <Textarea
            id="where"
            placeholder="e.g., In classrooms, on school buses..."
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="who" className="text-base font-semibold">
            Who is affected?
          </Label>
          <Textarea
            id="who"
            placeholder="e.g., Students, teachers, administrators..."
            value={who}
            onChange={(e) => setWho(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="how" className="text-base font-semibold">
            How does it affect them?
          </Label>
          <Textarea
            id="how"
            placeholder="e.g., Increases costs, reduces productivity..."
            value={how}
            onChange={(e) => setHow(e.target.value)}
            className="min-h-20"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">5 Whys Analysis</h3>
        <div className="space-y-3">
          {whys.map((why, i) => (
            <div key={i} className="space-y-1.5">
              <Label htmlFor={`why-${i}`} className="text-sm">
                Why #{i + 1}
              </Label>
              <Textarea
                id={`why-${i}`}
                placeholder={`Answer: Why...${i > 0 ? " (based on Why #" + i + ")" : ""}`}
                value={why}
                onChange={(e) => updateWhy(i, e.target.value)}
                className="min-h-16"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="root-cause" className="text-base font-semibold">
          Root Cause (concluded from 5 Whys)
        </Label>
        <Textarea
          id="root-cause"
          placeholder="Based on your 5 Why analysis, what is the fundamental root cause?"
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          className="min-h-24"
        />
      </div>

      {errors.length > 0 && (
        <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {errors.map((error, i) => (
                <p key={i} className="text-sm text-rose-700">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Submitting..." : "Complete Empathize Stage"}
      </Button>
    </div>
  );
}
