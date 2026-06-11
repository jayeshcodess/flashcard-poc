import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashGenius — AI Flashcard Generator",
  description:
    "Paste your study notes and instantly generate interactive flashcards powered by AI.",
};

import DebugDashboard from "@/components/DebugDashboard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#1A1A2E] font-[family-name:var(--font-inter)]">
        {children}
        <DebugDashboard />
      </body>
    </html>
  );
}
