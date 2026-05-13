"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { DefineData } from "@/types";
import { X, Plus, AlertCircle } from "lucide-react";

interface DefineFormProps {
  initialData?: DefineData;
  onSubmit: (data: DefineData) => void;
  isLoading?: boolean;
}

export function DefineForm({ initialData, onSubmit, isLoading }: DefineFormProps) {
  const [problemStatement, setProblemStatement] = useState(initialData?.problemStatement || "");
  const [userPersona, setUserPersona] = useState(initialData?.userPersona || "");
  const [needStatement, setNeedStatement] = useState(initialData?.needStatement || "");
  const [insights, setInsights] = useState<string[]>(initialData?.insights || []);
  const [newInsight, setNewInsight] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!problemStatement.trim()) newErrors.push("Problem statement is required");
    if (!userPersona.trim()) newErrors.push("User persona is required");
    if (!needStatement.trim()) newErrors.push("Need statement is required");
    if (insights.length === 0) newErrors.push("At least one insight is required");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        problemStatement: problemStatement.trim(),
        userPersona: userPersona.trim(),
        needStatement: needStatement.trim(),
        insights: insights.filter((i) => i.trim()).map((i) => i.trim()),
      });
    }
  };

  const addInsight = () => {
    if (newInsight.trim()) {
      setInsights([...insights, newInsight.trim()]);
      setNewInsight("");
    }
  };

  const removeInsight = (index: number) => {
    setInsights(insights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="problem" className="text-base font-semibold">
          How Might We (HMW) Statement
        </Label>
        <p className="text-sm text-muted-foreground">Reframe the problem as an opportunity</p>
        <Textarea
          id="problem"
          placeholder="How might we... (reframe the problem positively)"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          className="min-h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="persona" className="text-base font-semibold">
          User Persona
        </Label>
        <p className="text-sm text-muted-foreground">Who is the primary user you're solving for?</p>
        <Textarea
          id="persona"
          placeholder="Describe your primary user: demographics, needs, pain points, goals..."
          value={userPersona}
          onChange={(e) => setUserPersona(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="need" className="text-base font-semibold">
          Need Statement
        </Label>
        <p className="text-sm text-muted-foreground">Format: "User needs to ___ because ___"</p>
        <Textarea
          id="need"
          placeholder="e.g., User needs to have access to mentorship because they lack guidance on career options"
          value={needStatement}
          onChange={(e) => setNeedStatement(e.target.value)}
          className="min-h-20"
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">Key Insights from Empathy</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add an insight..."
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addInsight()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInsight}
              disabled={!newInsight.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {insights.length > 0 && (
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3"
                >
                  <span className="text-sm">{insight}</span>
                  <button
                    onClick={() => removeInsight(i)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
        {isLoading ? "Submitting..." : "Complete Define Stage"}
      </Button>
    </div>
  );
}
