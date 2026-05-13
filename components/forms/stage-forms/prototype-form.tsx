"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { PrototypeData, IterationEntry } from "@/types";
import { X, Plus, AlertCircle } from "lucide-react";

interface PrototypeFormProps {
  initialData?: PrototypeData;
  onSubmit: (data: PrototypeData) => void;
  isLoading?: boolean;
}

export function PrototypeForm({ initialData, onSubmit, isLoading }: PrototypeFormProps) {
  const [toolsRequired, setToolsRequired] = useState<string[]>(initialData?.toolsRequired || []);
  const [newTool, setNewTool] = useState("");
  const [steps, setSteps] = useState<string[]>(initialData?.steps || []);
  const [newStep, setNewStep] = useState("");
  const [iterations, setIterations] = useState<IterationEntry[]>(initialData?.iterations || []);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (toolsRequired.length === 0) newErrors.push("List at least one tool/material");
    if (steps.length === 0) newErrors.push("Document at least one build step");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        toolsRequired: toolsRequired.filter((t) => t.trim()),
        steps: steps.filter((s) => s.trim()),
        iterations,
      });
    }
  };

  const addTool = () => {
    if (newTool.trim()) {
      setToolsRequired([...toolsRequired, newTool.trim()]);
      setNewTool("");
    }
  };

  const removeTool = (index: number) => {
    setToolsRequired(toolsRequired.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, newStep.trim()]);
      setNewStep("");
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addIteration = () => {
    setIterations([
      ...iterations,
      {
        id: crypto.randomUUID(),
        description: "",
        outcome: "",
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateIteration = (
    index: number,
    field: "description" | "outcome",
    value: string
  ) => {
    const updated = [...iterations];
    updated[index] = { ...updated[index], [field]: value };
    setIterations(updated);
  };

  const removeIteration = (index: number) => {
    setIterations(iterations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">Tools & Materials Required</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add tool or material (e.g., Solar panel, Arduino)..."
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTool()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTool}
              disabled={!newTool.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {toolsRequired.length > 0 && (
            <div className="space-y-2">
              {toolsRequired.map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3"
                >
                  <span className="text-sm">• {tool}</span>
                  <button
                    onClick={() => removeTool(i)}
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

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">Build Steps (Ordered)</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add step..."
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addStep()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
              disabled={!newStep.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {steps.length > 0 && (
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3"
                >
                  <span className="text-sm">
                    <span className="font-semibold text-primary">Step {i + 1}:</span> {step}
                  </span>
                  <button
                    onClick={() => removeStep(i)}
                    className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Iterations & Testing</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIteration}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Iteration
          </Button>
        </div>

        {iterations.length > 0 && (
          <div className="space-y-4">
            {iterations.map((iter, i) => (
              <div
                key={iter.id}
                className="space-y-3 rounded-lg border border-border/50 bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Iteration {i + 1}</h4>
                  <button
                    onClick={() => removeIteration(i)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-semibold">Description</Label>
                    <Textarea
                      placeholder="What was tried in this iteration?"
                      value={iter.description}
                      onChange={(e) => updateIteration(i, "description", e.target.value)}
                      className="min-h-16 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Outcome</Label>
                    <Textarea
                      placeholder="What was the result? What did you learn?"
                      value={iter.outcome}
                      onChange={(e) => updateIteration(i, "outcome", e.target.value)}
                      className="min-h-16 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Date</Label>
                    <Input
                      type="date"
                      value={iter.date}
                      onChange={(e) =>
                        updateIteration(i, "description", iter.description)
                      }
                      disabled
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        {isLoading ? "Submitting..." : "Complete Prototype Stage"}
      </Button>
    </div>
  );
}
