import { Suspense } from "react";
import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { ProblemBankView } from "@/components/ideabank/problem-bank-view";

export const metadata: Metadata = {
  title: "Problem Bank — Ideabank by PiJam",
  description: "Browse real, everyday problems across sectors to notice, think about, and turn into your own tracked idea.",
};

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content">
        <Suspense fallback={<ProblemsFallback />}>
          <ProblemBankView />
        </Suspense>
      </main>
      <IdeabankFooter />
    </div>
  );
}

function ProblemsFallback() {
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
