"use client";

import { cn } from "@/lib/utils";

export const GRADIENT_PRESETS = [
  { label: "Slate → Blue", value: "from-slate-500 to-blue-600" },
  { label: "Green → Emerald", value: "from-green-500 to-emerald-600" },
  { label: "Blue → Indigo", value: "from-blue-500 to-indigo-600" },
  { label: "Red → Pink", value: "from-red-400 to-pink-600" },
  { label: "Orange → Amber", value: "from-orange-400 to-amber-600" },
  { label: "Teal → Cyan", value: "from-teal-500 to-cyan-600" },
  { label: "Purple → Fuchsia", value: "from-purple-500 to-fuchsia-600" },
  { label: "Indigo → Blue", value: "from-indigo-500 to-blue-700" },
  { label: "Yellow → Orange", value: "from-yellow-500 to-orange-600" },
  { label: "Rose → Red", value: "from-rose-500 to-red-700" },
  { label: "Gray → Indigo", value: "from-gray-700 to-indigo-900" },
  { label: "Blue → Green", value: "from-blue-600 to-green-600" },
  { label: "Violet → Purple", value: "from-violet-500 to-purple-700" },
  { label: "Cyan → Blue", value: "from-cyan-400 to-blue-600" },
  { label: "Emerald → Teal", value: "from-emerald-400 to-teal-600" },
  { label: "Pink → Rose", value: "from-pink-400 to-rose-600" },
];

interface GradientPickerProps {
  value: string;
  onChange: (gradient: string) => void;
}

export function GradientPicker({ value, onChange }: GradientPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADIENT_PRESETS.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onChange(preset.value)}
          className={cn(
            "group relative h-10 rounded-lg bg-gradient-to-br transition-all hover:scale-105",
            preset.value,
            value === preset.value
              ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background shadow-lg"
              : "ring-1 ring-border/40 hover:ring-border"
          )}
          title={preset.label}
        >
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 text-[9px] font-medium text-white opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            {preset.label}
          </span>
        </button>
      ))}
    </div>
  );
}
