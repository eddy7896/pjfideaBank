import { cn } from "@/lib/utils";

interface LearningStepProps {
  number: string;
  hindi: string;
  english: string;
  description: string;
  className?: string;
}

export function LearningStep({ number, hindi, english, description, className }: LearningStepProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[24px] border border-[#DED8D3] bg-[#F4F2F1] p-7",
        className
      )}
    >
      <span className="text-sm font-semibold tracking-wide text-[#4282A4]">{number}</span>
      <h3 className="mt-2 text-2xl font-bold text-[#111111] font-heading">
        <span lang="hi" className="font-devanagari">
          {hindi}
        </span>{" "}
        / {english}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-[#3D3D3D]">{description}</p>
    </div>
  );
}
