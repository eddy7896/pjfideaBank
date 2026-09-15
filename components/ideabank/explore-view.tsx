"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { SearchField } from "./search-field";
import { CategoryChip } from "./category-chip";
import { IdeaCard } from "./idea-card";
import { IdeabankButton } from "./button";
import { FilterPanel, COST_BUCKETS, type CostBucketId } from "./filter-panel";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { IDEAS } from "@/lib/ideabank/data";
import type { Idea } from "@/lib/ideabank/types";

const PAGE_SIZE = 9;

type SortOption = "newest" | "cost";

function matchesCostBucket(idea: Idea, bucket: CostBucketId): boolean {
  if (bucket === "any") return true;
  if (bucket === "not-estimated") return idea.estimatedCost === null;
  if (idea.estimatedCost === null) return false;
  if (bucket === "under-100") return idea.estimatedCost < 100;
  if (bucket === "100-500") return idea.estimatedCost >= 100 && idea.estimatedCost <= 500;
  if (bucket === "over-500") return idea.estimatedCost > 500;
  return true;
}

function parseParams(params: URLSearchParams) {
  return {
    q: params.get("q") ?? "",
    categories: params.getAll("category"),
    stages: params.getAll("stage"),
    cost: (params.get("cost") as CostBucketId) ?? "any",
    sort: (params.get("sort") as SortOption) ?? "newest",
    n: Number(params.get("n")) || PAGE_SIZE,
  };
}

export function ExploreView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { q, categories, stages, cost, sort, n } = parseParams(searchParams);
  const [queryInput, setQueryInput] = useState(q);

  function updateParams(next: Partial<{
    q: string;
    categories: string[];
    stages: string[];
    cost: CostBucketId;
    sort: SortOption;
    n: number;
  }>) {
    const merged = {
      q: next.q ?? q,
      categories: next.categories ?? categories,
      stages: next.stages ?? stages,
      cost: next.cost ?? cost,
      sort: next.sort ?? sort,
      n: next.n ?? n,
    };
    const params = new URLSearchParams();
    if (merged.q.trim()) params.set("q", merged.q.trim());
    merged.categories.forEach((c) => params.append("category", c));
    merged.stages.forEach((s) => params.append("stage", s));
    if (merged.cost !== "any") params.set("cost", merged.cost);
    if (merged.sort !== "newest") params.set("sort", merged.sort);
    if (merged.n !== PAGE_SIZE) params.set("n", String(merged.n));
    router.replace(`/explore${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = IDEAS.filter((idea) => {
      const matchesQuery =
        !query ||
        idea.title.toLowerCase().includes(query) ||
        idea.summary.toLowerCase().includes(query) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesCategory = categories.length === 0 || categories.includes(idea.category);
      const matchesStage = stages.length === 0 || stages.includes(idea.stage);
      return matchesQuery && matchesCategory && matchesStage && matchesCostBucket(idea, cost);
    });

    result = [...result].sort((a, b) => {
      if (sort === "cost") {
        if (a.estimatedCost === null) return 1;
        if (b.estimatedCost === null) return -1;
        return a.estimatedCost - b.estimatedCost;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [q, categories, stages, cost, sort]);

  const visible = filtered.slice(0, n);
  const hasMore = filtered.length > visible.length;
  const hasActiveFilters = categories.length > 0 || stages.length > 0 || cost !== "any" || q.trim().length > 0;

  function clearAll() {
    setQueryInput("");
    updateParams({ q: "", categories: [], stages: [], cost: "any", n: PAGE_SIZE });
  }

  const filterValues = { categories, stages, cost };

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-2xl">
        <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-[#111111] font-heading">
          Explore Ideas
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-[#3D3D3D]">
          Search and filter demonstration ideas by category, stage, and material cost.
        </p>
      </div>

      <div className="mt-8">
        <SearchField
          value={queryInput}
          onChange={setQueryInput}
          onSubmit={() => updateParams({ q: queryInput, n: PAGE_SIZE })}
          className="max-w-2xl"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-b border-[#DED8D3] pb-5">
        <p aria-live="polite" className="text-sm font-medium text-[#3D3D3D]">
          {filtered.length} {filtered.length === 1 ? "idea" : "ideas"} found
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="sr-only">
            Sort ideas
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value as SortOption, n: PAGE_SIZE })}
            className="min-h-11 rounded-full border border-[#DED8D3] bg-white px-4 text-sm font-medium text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4]"
          >
            <option value="newest">Newest first</option>
            <option value="cost">Lowest cost first</option>
          </select>

          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DED8D3] bg-white px-4 text-sm font-semibold text-[#111111] hover:border-[#15425B] lg:hidden"
                />
              }
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15425B] text-xs text-white">
                  {categories.length + stages.length + (cost !== "any" ? 1 : 0)}
                </span>
              )}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <FilterPanel
                  values={filterValues}
                  onToggleCategory={(c) =>
                    updateParams({
                      categories: categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c],
                      n: PAGE_SIZE,
                    })
                  }
                  onToggleStage={(s) =>
                    updateParams({
                      stages: stages.includes(s) ? stages.filter((x) => x !== s) : [...stages, s],
                      n: PAGE_SIZE,
                    })
                  }
                  onSetCost={(c) => updateParams({ cost: c, n: PAGE_SIZE })}
                  onClearAll={clearAll}
                />
                <div className="mt-6 flex gap-3">
                  <IdeabankButton variant="secondary" onClick={clearAll} className="flex-1">
                    Clear
                  </IdeabankButton>
                  <IdeabankButton onClick={() => setMobileFiltersOpen(false)} className="flex-1">
                    Apply
                  </IdeabankButton>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {q.trim() && (
            <CategoryChip label={`"${q.trim()}"`} onRemove={() => { setQueryInput(""); updateParams({ q: "", n: PAGE_SIZE }); }} />
          )}
          {categories.map((c) => (
            <CategoryChip key={c} label={c} onRemove={() => updateParams({ categories: categories.filter((x) => x !== c), n: PAGE_SIZE })} />
          ))}
          {stages.map((s) => (
            <CategoryChip key={s} label={s} onRemove={() => updateParams({ stages: stages.filter((x) => x !== s), n: PAGE_SIZE })} />
          ))}
          {cost !== "any" && (
            <CategoryChip
              label={COST_BUCKETS.find((b) => b.id === cost)?.label ?? cost}
              onRemove={() => updateParams({ cost: "any", n: PAGE_SIZE })}
            />
          )}
          <button type="button" onClick={clearAll} className="text-sm font-semibold text-[#4282A4] hover:underline">
            Clear all
          </button>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filter ideas">
          <FilterPanel
            values={filterValues}
            onToggleCategory={(c) =>
              updateParams({
                categories: categories.includes(c) ? categories.filter((x) => x !== c) : [...categories, c],
                n: PAGE_SIZE,
              })
            }
            onToggleStage={(s) =>
              updateParams({
                stages: stages.includes(s) ? stages.filter((x) => x !== s) : [...stages, s],
                n: PAGE_SIZE,
              })
            }
            onSetCost={(c) => updateParams({ cost: c, n: PAGE_SIZE })}
            onClearAll={clearAll}
          />
        </aside>

        <div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-[24px] border border-dashed border-[#DED8D3] px-6 py-20 text-center">
              <p className="text-lg font-semibold text-[#111111]">No ideas match those filters</p>
              <p className="mt-2 max-w-sm text-[15px] text-[#3D3D3D]">
                Try a different search term, or clear your filters to see everything in the bank.
              </p>
              <IdeabankButton onClick={clearAll} className="mt-6">
                Reset filters
              </IdeabankButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <IdeabankButton variant="secondary" onClick={() => updateParams({ n: n + PAGE_SIZE })}>
                    Load more ideas
                  </IdeabankButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
