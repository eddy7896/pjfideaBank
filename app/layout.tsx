import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pi Jam Idea Bank — Project Dashboard",
  description:
    "Track and manage student project ideas using the Design Thinking framework. A thematic calendar-driven repository for schools and educators.",
  keywords: [
    "Design Thinking",
    "Student Projects",
    "Education",
    "Pi Jam",
    "Idea Bank",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
