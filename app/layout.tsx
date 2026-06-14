import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteNavbar } from "@/components/shared/site-navbar";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskHub",
  description: "A focused todo workspace for organizing personal tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* The navbar lives in the root layout because every current app surface
          should share the same auth-aware navigation. */}
      <body className="flex min-h-full flex-col">
        <SiteNavbar />
        {children}
        {/* Mount one global toaster so any client component can announce
            short-lived feedback without owning notification infrastructure. */}
        <Toaster richColors />
      </body>
    </html>
  );
}
