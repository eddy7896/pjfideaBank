"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, fieldDescribedBy } from "./form-field";
import { IdeabankButton } from "./button";
import { StageBadge } from "./stage-badge";
import { PROBLEM_CATEGORIES, IDEA_STAGES, type IdeaStage } from "@/lib/ideabank/types";
import {
  readShareDraft,
  writeShareDraft,
  clearShareDraft,
  saveSubmittedIdea,
  type ShareIdeaDraft,
} from "@/lib/ideabank/storage";
import { cn } from "@/lib/utils";

const EMPTY_DRAFT: ShareIdeaDraft = {
  title: "",
  category: "",
  problem: "",
  affectedUsers: "",
  context: "",
  proposedSolution: "",
  stage: "",
  materials: "",
  estimatedCost: "",
  whatWasTried: "",
  whatWasLearned: "",
  imageDataUrl: null,
};

const STEPS = [
  { key: "observe", label: "Observe the problem" },
  { key: "describe", label: "Describe the idea" },
  { key: "prototype", label: "Add prototype details" },
  { key: "review", label: "Review the draft" },
] as const;

type Errors = Partial<Record<keyof ShareIdeaDraft, string>>;

function validateStep(step: number, data: ShareIdeaDraft): Errors {
  const errors: Errors = {};
  if (step === 0) {
    if (!data.title.trim()) errors.title = "Give your idea a short, specific title.";
    if (!data.category) errors.category = "Choose the category that fits best.";
    if (!data.problem.trim()) errors.problem = "Describe the problem you noticed.";
    if (!data.affectedUsers.trim()) errors.affectedUsers = "Say who this affects.";
    if (!data.context.trim()) errors.context = "Say where or when this happens.";
  }
  if (step === 1) {
    if (!data.proposedSolution.trim()) errors.proposedSolution = "Describe your proposed approach.";
    if (!data.stage) errors.stage = "Choose the stage this idea is currently at.";
  }
  return errors;
}

export function ShareWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ShareIdeaDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Errors>({});
  const [restored, setRestored] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const draft = readShareDraft();
    if (draft) {
      setData(draft);
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!submitted) writeShareDraft(data);
  }, [data, submitted]);

  function update<K extends keyof ShareIdeaDraft>(key: K, value: ShareIdeaDraft[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleContinue() {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("imageDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    saveSubmittedIdea(data);
    clearShareDraft();
    setSubmitted(true);
  }

  function handleStartOver() {
    setData(EMPTY_DRAFT);
    setStep(0);
    setSubmitted(false);
    setRestored(false);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-[24px] border border-[#DED8D3] bg-[#EDF7FA] p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#15425B] text-white">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-[#111111] font-heading">Demo submission saved</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#3D3D3D]">
          &quot;{data.title}&quot; was saved to this device only. Ideabank&apos;s frontend demo has no
          server yet, so nothing was sent anywhere else — this shows how the idea would look
          once documented.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <IdeabankButton href="/problems" variant="secondary">
            Back to Problem Bank
          </IdeabankButton>
          <IdeabankButton onClick={handleStartOver}>Share another idea</IdeabankButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {restored && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#DED8D3] bg-[#F4F2F1] px-5 py-3 text-sm text-[#3D3D3D]">
          <span>Continuing your draft, saved earlier on this device.</span>
          <button type="button" onClick={handleStartOver} className="font-semibold text-[#4282A4] hover:underline">
            Start over
          </button>
        </div>
      )}

      <ol className="mb-10 flex items-center gap-2 sm:gap-4" aria-label="Form progress">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  i < step && "bg-[#15425B] text-white",
                  i === step && "bg-[#4282A4] text-white",
                  i > step && "bg-[#F4F2F1] text-[#3D3D3D]"
                )}
              >
                {i < step ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className={cn("hidden text-center text-xs font-medium sm:block", i === step ? "text-[#111111]" : "text-[#3D3D3D]")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="h-[2px] flex-1 bg-[#DED8D3]" aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">
        Step {step + 1} of {STEPS.length}: {STEPS[step].label}
      </p>

      <div className="rounded-[24px] border border-[#DED8D3] bg-white p-6 sm:p-9">
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <FormField id="title" label="Idea title" required error={errors.title} hint="A short, specific name — e.g. &quot;School Tap Water Saver&quot;.">
              <Input
                id="title"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                aria-invalid={!!errors.title}
                aria-describedby={fieldDescribedBy("title", true, errors.title)}
                className="h-12 rounded-[14px] px-4 text-base"
              />
            </FormField>

            <FormField id="category" label="Category" required error={errors.category}>
              <select
                id="category"
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                aria-invalid={!!errors.category}
                aria-describedby={fieldDescribedBy("category", undefined, errors.category)}
                className="h-12 rounded-[14px] border border-[#DED8D3] bg-white px-4 text-base text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4]"
              >
                <option value="">Choose a category</option>
                {PROBLEM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="problem"
              label="Problem description"
              required
              error={errors.problem}
              hint="What did you notice? One or two sentences is enough to start."
            >
              <Textarea
                id="problem"
                value={data.problem}
                onChange={(e) => update("problem", e.target.value)}
                aria-invalid={!!errors.problem}
                aria-describedby={fieldDescribedBy("problem", true, errors.problem)}
                className="min-h-28 rounded-[14px] px-4 py-3 text-base"
              />
            </FormField>

            <FormField id="affectedUsers" label="Who is affected" required error={errors.affectedUsers} hint="Who experiences this problem?">
              <Input
                id="affectedUsers"
                value={data.affectedUsers}
                onChange={(e) => update("affectedUsers", e.target.value)}
                aria-invalid={!!errors.affectedUsers}
                className="h-12 rounded-[14px] px-4 text-base"
              />
            </FormField>

            <FormField id="context" label="Where or when it happens" required error={errors.context}>
              <Input
                id="context"
                value={data.context}
                onChange={(e) => update("context", e.target.value)}
                aria-invalid={!!errors.context}
                className="h-12 rounded-[14px] px-4 text-base"
              />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <FormField
              id="proposedSolution"
              label="Proposed approach"
              required
              error={errors.proposedSolution}
              hint="What's your first idea for addressing it, in plain language?"
            >
              <Textarea
                id="proposedSolution"
                value={data.proposedSolution}
                onChange={(e) => update("proposedSolution", e.target.value)}
                aria-invalid={!!errors.proposedSolution}
                className="min-h-32 rounded-[14px] px-4 py-3 text-base"
              />
            </FormField>

            <FormField id="stage" label="Current stage" required error={errors.stage}>
              <div className="flex flex-wrap gap-2.5">
                {IDEA_STAGES.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => update("stage", stage as IdeaStage)}
                    aria-pressed={data.stage === stage}
                    className={cn(
                      "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      data.stage === stage
                        ? "border-[#15425B] bg-[#15425B] text-white"
                        : "border-[#DED8D3] bg-white text-[#111111] hover:border-[#4282A4]"
                    )}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <FormField
              id="materials"
              label="Materials"
              hint="List what it would take to build a first version, one per line."
            >
              <Textarea
                id="materials"
                value={data.materials}
                onChange={(e) => update("materials", e.target.value)}
                className="min-h-24 rounded-[14px] px-4 py-3 text-base"
              />
            </FormField>

            <FormField id="estimatedCost" label="Estimated cost (₹)" hint="Leave blank if you haven't estimated this yet.">
              <Input
                id="estimatedCost"
                type="number"
                min={0}
                inputMode="numeric"
                value={data.estimatedCost}
                onChange={(e) => update("estimatedCost", e.target.value)}
                className="h-12 max-w-xs rounded-[14px] px-4 text-base"
              />
            </FormField>

            <FormField id="whatWasTried" label="What has been tried">
              <Textarea
                id="whatWasTried"
                value={data.whatWasTried}
                onChange={(e) => update("whatWasTried", e.target.value)}
                className="min-h-24 rounded-[14px] px-4 py-3 text-base"
              />
            </FormField>

            <FormField id="whatWasLearned" label="What was learned">
              <Textarea
                id="whatWasLearned"
                value={data.whatWasLearned}
                onChange={(e) => update("whatWasLearned", e.target.value)}
                className="min-h-24 rounded-[14px] px-4 py-3 text-base"
              />
            </FormField>

            <FormField id="image" label="Project image (optional)">
              {data.imageDataUrl ? (
                <div className="relative w-fit">
                  <Image
                    src={data.imageDataUrl}
                    alt="Uploaded preview of the project"
                    width={200}
                    height={150}
                    className="rounded-[14px] border-2 border-cyan object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => update("imageDataUrl", null)}
                    aria-label="Remove image"
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111111] shadow-md"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-24 w-fit min-w-[200px] flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#DED8D3] px-6 py-6 text-sm font-medium text-[#3D3D3D] hover:border-[#4282A4]"
                >
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  Add an image
                </button>
              )}
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </FormField>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-[#3D3D3D]">
              This is a preview of how your idea would appear. Nothing is submitted until you
              save it below.
            </p>
            <div className="rounded-[18px] border border-[#DED8D3] bg-[#F4F2F1] p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4282A4]">
                  {data.category || "No category chosen"}
                </span>
                {data.stage && <StageBadge stage={data.stage as IdeaStage} />}
              </div>
              <h3 className="mt-2 text-2xl font-bold text-[#111111] font-heading">
                {data.title || "Untitled idea"}
              </h3>

              {data.imageDataUrl && (
                <Image
                  src={data.imageDataUrl}
                  alt="Uploaded preview of the project"
                  width={320}
                  height={200}
                  className="mt-4 rounded-[14px] border-2 border-cyan object-cover"
                  unoptimized
                />
              )}

              <dl className="mt-5 flex flex-col gap-4">
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Problem observed</dt>
                  <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.problem || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Who is affected</dt>
                  <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.affectedUsers || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Where or when</dt>
                  <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.context || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Proposed approach</dt>
                  <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.proposedSolution || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Materials</dt>
                  <dd className="mt-1 whitespace-pre-line text-[15px] text-[#3D3D3D]">{data.materials || "Not listed yet."}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#111111]">Estimated cost</dt>
                  <dd className="mt-1 text-[15px] text-[#3D3D3D]">
                    {data.estimatedCost ? `~₹${data.estimatedCost}` : "Not estimated"}
                  </dd>
                </div>
                {data.whatWasTried && (
                  <div>
                    <dt className="text-sm font-semibold text-[#111111]">What has been tried</dt>
                    <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.whatWasTried}</dd>
                  </div>
                )}
                {data.whatWasLearned && (
                  <div>
                    <dt className="text-sm font-semibold text-[#111111]">What was learned</dt>
                    <dd className="mt-1 text-[15px] text-[#3D3D3D]">{data.whatWasLearned}</dd>
                  </div>
                )}
              </dl>
            </div>

            <p className="text-sm text-[#3D3D3D]">
              Saving stores this draft as a demo submission on this device only — Ideabank&apos;s
              frontend demo doesn&apos;t have a server yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <IdeabankButton variant="secondary" onClick={handleBack} disabled={step === 0}>
          Back
        </IdeabankButton>
        {step < STEPS.length - 1 ? (
          <IdeabankButton onClick={handleContinue}>Continue</IdeabankButton>
        ) : (
          <IdeabankButton onClick={handleSave}>Save demo submission</IdeabankButton>
        )}
      </div>
    </div>
  );
}
