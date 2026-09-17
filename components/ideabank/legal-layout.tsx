import type { ReactNode } from "react";

export function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-sm font-medium text-[#4282A4]">Ideabank by PiJam</p>
      <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-[#3D3D3D]">Effective {effectiveDate}</p>

      <div
        className="
          mt-10 space-y-8
          [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#15425B] [&_h2]:mt-10 [&_h2]:mb-3
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#111111] [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-[#3D3D3D]
          [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5
          [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-[#3D3D3D]
          [&_a]:text-[#15425B] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#4282A4]
          [&_strong]:text-[#111111] [&_strong]:font-semibold
          [&_table]:w-full [&_table]:mt-3 [&_table]:border-collapse [&_table]:text-sm
          [&_th]:border [&_th]:border-[#DED8D3] [&_th]:bg-[#F4F2F1] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[#111111]
          [&_td]:border [&_td]:border-[#DED8D3] [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-[#3D3D3D]
        "
      >
        {children}
      </div>
    </div>
  );
}
