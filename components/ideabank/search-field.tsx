"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search problems, ideas, or materials…",
  className,
  label = "Search ideas",
}: SearchFieldProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-[#DED8D3] bg-white py-2 pl-5 pr-2 shadow-[0_2px_12px_-6px_rgba(17,17,17,0.15)] transition-colors focus-within:border-[#4282A4]",
        className
      )}
    >
      <Search className="h-5 w-5 shrink-0 text-[#3D3D3D]" aria-hidden="true" />
      <label htmlFor="ideabank-search" className="sr-only">
        {label}
      </label>
      <input
        id="ideabank-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full bg-transparent text-base text-[#111111] placeholder:text-[#3D3D3D]/70 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#3D3D3D] hover:bg-[#F4F2F1]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        className="hidden shrink-0 rounded-full bg-[#15425B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F3245] sm:block"
      >
        Search
      </button>
    </form>
  );
}
