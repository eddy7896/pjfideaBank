import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an Idea — Pi Jam Idea Bank",
  description:
    "Submit a new project idea tied to a monthly theme. Your idea will start at the Empathize stage of the Design Thinking framework.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
