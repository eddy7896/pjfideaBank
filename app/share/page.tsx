import type { Metadata } from "next";
import { IdeabankHeader } from "@/components/ideabank/header";
import { IdeabankFooter } from "@/components/ideabank/footer";
import { ShareWizard } from "@/components/ideabank/share-wizard";

export const metadata: Metadata = {
  title: "Share an Idea — Ideabank by PiJam",
  description: "Document a problem you noticed and the idea you're building, step by step.",
};

export default function SharePage() {
  return (
    <div className="min-h-screen bg-white">
      <IdeabankHeader />
      <main id="main-content" className="px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-[#111111] font-heading">
            Share an Idea
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-[#3D3D3D]">
            Four short steps to document what you noticed and what you&apos;re building. Your
            answers are saved as a draft on this device as you go.
          </p>
        </div>
        <ShareWizard />
      </main>
      <IdeabankFooter />
    </div>
  );
}
