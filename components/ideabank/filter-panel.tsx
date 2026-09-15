import { PROBLEM_CATEGORIES } from "@/lib/ideabank/types";
import { cn } from "@/lib/utils";

export interface FilterValues {
  categories: string[];
}

interface FilterPanelProps {
  values: FilterValues;
  onToggleCategory: (category: string) => void;
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

export function FilterPanel({ values, onToggleCategory, onClearAll, className, headingId }: FilterPanelProps) {
  const hasActive = values.categories.length > 0;

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
        <legend className="mb-2 text-sm font-semibold text-[#3D3D3D]">Sector</legend>
        <div className="flex flex-col gap-0.5">
          {PROBLEM_CATEGORIES.map((category) => (
            <CheckboxRow
              key={category}
              label={category}
              checked={values.categories.includes(category)}
              onChange={() => onToggleCategory(category)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
