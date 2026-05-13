"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TestData } from "@/types";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface TestFormProps {
  initialData?: TestData;
  onSubmit: (data: TestData) => void;
  isLoading?: boolean;
}

export function TestForm({ initialData, onSubmit, isLoading }: TestFormProps) {
  const [testPlan, setTestPlan] = useState(initialData?.testPlan || "");
  const [results, setResults] = useState(initialData?.results || "");
  const [passed, setPassed] = useState(initialData?.passed ?? true);
  const [failureNotes, setFailureNotes] = useState(initialData?.failureNotes || "");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!testPlan.trim()) newErrors.push("Test plan is required");
    if (!results.trim()) newErrors.push("Results are required");
    if (!passed && !failureNotes.trim()) newErrors.push("Failure notes are required if test failed");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        testPlan: testPlan.trim(),
        results: results.trim(),
        passed,
        failureNotes: !passed ? failureNotes.trim() : undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="plan" className="text-base font-semibold">
          Testing Plan
        </Label>
        <p className="text-sm text-muted-foreground">
          How did you test the prototype? What were the test cases or success criteria?
        </p>
        <Textarea
          id="plan"
          placeholder="e.g., Tested with 10 users over 2 weeks. Success criteria: Users can complete task in under 5 minutes with 90% accuracy..."
          value={testPlan}
          onChange={(e) => setTestPlan(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="results" className="text-base font-semibold">
          Test Results
        </Label>
        <p className="text-sm text-muted-foreground">
          What happened during testing? Include data, observations, and feedback.
        </p>
        <Textarea
          id="results"
          placeholder="e.g., 8 out of 10 users completed the task successfully. Average time: 4 minutes. Feedback: Interface was confusing, need clearer labels..."
          value={results}
          onChange={(e) => setResults(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="mb-4 text-base font-semibold text-emerald-900">Test Outcome</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="outcome"
                checked={passed}
                onChange={() => setPassed(true)}
                className="h-4 w-4"
              />
              <div>
                <span className="font-semibold text-emerald-900">✓ Test Passed</span>
                <p className="text-xs text-emerald-700">Solution works and is ready for deployment</p>
              </div>
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="outcome"
                checked={!passed}
                onChange={() => setPassed(false)}
                className="h-4 w-4"
              />
              <div>
                <span className="font-semibold text-rose-900">✗ Test Failed</span>
                <p className="text-xs text-rose-700">Solution needs refinement, will return to Prototype</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {!passed && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <div className="mb-3 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-900">Refinement Needed</h4>
              <p className="text-sm text-rose-700 mt-1">
                Document what needs to change. The project will return to Prototype stage.
              </p>
            </div>
          </div>
          <Textarea
            placeholder="What changes are needed? What did you learn? How should the solution be improved?"
            value={failureNotes}
            onChange={(e) => setFailureNotes(e.target.value)}
            className="min-h-24"
          />
        </div>
      )}

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
        variant={passed ? "default" : "outline"}
      >
        {isLoading ? "Submitting..." : passed ? "Complete Testing (Passed)" : "Complete Testing (Return to Prototype)"}
      </Button>
    </div>
  );
}
