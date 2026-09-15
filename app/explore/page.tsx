import { Suspense } from "react";
import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { ExploreView } from "@/components/ideabank/explore-view";

export const metadata: Metadata = {
  title: "Explore Ideas — Ideabank by PiJam",
  description: "Search and filter student and teacher ideas by category, stage, and material cost.",
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <Suspense fallback={<ExploreFallback />}>
          <ExploreView />
        </Suspense>
      </main>
      <IdeabankFooter />
    </div>
  );
}

function ExploreFallback() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:px-12">
      <div className="h-10 w-64 animate-pulse rounded-full bg-[#F4F2F1]" />
      <div className="mt-6 h-14 w-full max-w-2xl animate-pulse rounded-full bg-[#F4F2F1]" />
      <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-[22px] bg-[#F4F2F1]" />
        ))}
      </div>
    </div>
  );
}
