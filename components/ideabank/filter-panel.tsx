import { IDEA_CATEGORIES, IDEA_STAGES } from "@/lib/ideabank/types";
import { cn } from "@/lib/utils";

export const COST_BUCKETS = [
  { id: "any", label: "Any cost" },
  { id: "under-100", label: "Under ₹100" },
  { id: "100-500", label: "₹100 – ₹500" },
  { id: "over-500", label: "Over ₹500" },
  { id: "not-estimated", label: "Not estimated" },
] as const;

export type CostBucketId = (typeof COST_BUCKETS)[number]["id"];

export interface FilterValues {
  categories: string[];
  stages: string[];
  cost: CostBucketId;
}

interface FilterPanelProps {
  values: FilterValues;
  onToggleCategory: (category: string) => void;
  onToggleStage: (stage: string) => void;
  onSetCost: (cost: CostBucketId) => void;
  onClearAll: () => void;
  className?: string;
  headingId?: string;
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[15px] text-[#111111] hover:bg-[#F4F2F1]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4.5 w-4.5 rounded border-[#DED8D3] text-[#15425B] focus-visible:ring-2 focus-visible:ring-[#4282A4]"
      />
      {label}
    </label>
  );
}

export function FilterPanel({
  values,
  onToggleCategory,
  onToggleStage,
  onSetCost,
  onClearAll,
  className,
  headingId,
}: FilterPanelProps) {
  const hasActive = values.categories.length > 0 || values.stages.length > 0 || values.cost !== "any";

  return (
    <div className={cn("flex flex-col gap-7", className)}>
      <div className="flex items-center justify-between">
        <h2 id={headingId} className="text-base font-semibold text-[#111111]">
          Filters
        </h2>
        {hasActive && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-[#4282A4] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-[#3D3D3D]">Category</legend>
        <div className="flex flex-col gap-0.5">
          {IDEA_CATEGORIES.map((category) => (
            <CheckboxRow
              key={category}
              label={category}
              checked={values.categories.includes(category)}
              onChange={() => onToggleCategory(category)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-[#3D3D3D]">Development stage</legend>
        <div className="flex flex-col gap-0.5">
          {IDEA_STAGES.map((stage) => (
            <CheckboxRow
              key={stage}
              label={stage}
              checked={values.stages.includes(stage)}
              onChange={() => onToggleStage(stage)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-[#3D3D3D]">Material cost</legend>
        <div className="flex flex-col gap-0.5">
          {COST_BUCKETS.map((bucket) => (
            <label
              key={bucket.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[15px] text-[#111111] hover:bg-[#F4F2F1]"
            >
              <input
                type="radio"
                name="cost-bucket"
                checked={values.cost === bucket.id}
                onChange={() => onSetCost(bucket.id)}
                className="h-4.5 w-4.5 border-[#DED8D3] text-[#15425B] focus-visible:ring-2 focus-visible:ring-[#4282A4]"
              />
              {bucket.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
