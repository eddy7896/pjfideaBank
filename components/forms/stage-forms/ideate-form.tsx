"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IdeateData } from "@/types";
import { X, Plus, AlertCircle } from "lucide-react";

interface IdeateFormProps {
  initialData?: IdeateData;
  onSubmit: (data: IdeateData) => void;
  isLoading?: boolean;
}

export function IdeateForm({ initialData, onSubmit, isLoading }: IdeateFormProps) {
  const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>(
    initialData?.brainstormIdeas || []
  );
  const [newIdea, setNewIdea] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(initialData?.selectedIdea || "");
  const [selectionReason, setSelectionReason] = useState(initialData?.selectionReason || "");
  const [constraints, setConstraints] = useState<string[]>(initialData?.constraints || []);
  const [newConstraint, setNewConstraint] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (brainstormIdeas.length < 3) newErrors.push("Brainstorm at least 3 ideas");
    if (!selectedIdea) newErrors.push("Select the chosen idea");
    if (!selectionReason.trim()) newErrors.push("Explain why this idea was selected");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        brainstormIdeas,
        selectedIdea,
        selectionReason: selectionReason.trim(),
        constraints: constraints.filter((c) => c.trim()).map((c) => c.trim()),
      });
    }
  };

  const addIdea = () => {
    if (newIdea.trim()) {
      setBrainstormIdeas([...brainstormIdeas, newIdea.trim()]);
      setNewIdea("");
    }
  };

  const removeIdea = (index: number) => {
    setBrainstormIdeas(brainstormIdeas.filter((_, i) => i !== index));
    if (selectedIdea === brainstormIdeas[index]) {
      setSelectedIdea("");
    }
  };

  const addConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint("");
    }
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">
          Brainstorm Ideas (min 3 required)
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add an idea..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addIdea()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIdea}
              disabled={!newIdea.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {brainstormIdeas.length > 0 && (
            <div className="space-y-2">
              {brainstormIdeas.map((idea, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3"
                >
                  <span className="text-sm">{idea}</span>
                  <button
                    onClick={() => removeIdea(i)}
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

      <div className="space-y-2">
        <Label htmlFor="selected" className="text-base font-semibold">
          Chosen Solution
        </Label>
        <Select value={selectedIdea || ""} onValueChange={(val) => setSelectedIdea(val || "")}>
          <SelectTrigger id="selected">
            <SelectValue placeholder="Select the idea to move forward with" />
          </SelectTrigger>
          <SelectContent>
            {brainstormIdeas.map((idea) => (
              <SelectItem key={idea} value={idea}>
                {idea}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-base font-semibold">
          Why This Idea?
        </Label>
        <Textarea
          id="reason"
          placeholder="Explain the selection criteria and why this idea beats the others..."
          value={selectionReason}
          onChange={(e) => setSelectionReason(e.target.value)}
          className="min-h-24"
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h3 className="mb-4 text-base font-semibold">Known Constraints</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a constraint (budget, time, materials, etc)..."
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addConstraint()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addConstraint}
              disabled={!newConstraint.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {constraints.length > 0 && (
            <div className="space-y-2">
              {constraints.map((constraint, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3"
                >
                  <span className="text-sm">{constraint}</span>
                  <button
                    onClick={() => removeConstraint(i)}
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
        {isLoading ? "Submitting..." : "Complete Ideate Stage"}
      </Button>
    </div>
  );
}
