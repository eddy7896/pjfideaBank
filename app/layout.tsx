import type { Metadata } from "next";
import { Inter, DM_Sans, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ideabank by PiJam — Small observations, ideas that make a difference",
  description:
    "Explore everyday problems, learn from young creators, and turn your own observations into ideas worth building. A student and teacher idea-sharing platform from PiJam.",
  keywords: [
    "Ideabank",
    "PiJam",
    "Student Ideas",
    "Design Thinking",
    "Education",
    "Innovation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} ${notoDevanagari.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
