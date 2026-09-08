import type { Metadata } from "next";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
        className={`${publicSans.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
