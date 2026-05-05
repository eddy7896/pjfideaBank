import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Idea Repository — Pi Jam Idea Bank",
  description:
    "View and manage student project ideas organized by Design Thinking stages: Empathize, Define, Ideate, Prototype, and Test.",
};

export default function RepositoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
