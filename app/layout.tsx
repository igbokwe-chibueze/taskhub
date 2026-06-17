import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PrivateThemeScope } from "@/components/shared/private-theme-scope";
import { SiteNavbar } from "@/components/shared/site-navbar";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentSession } from "@/lib/auth/session";
import { getUserPreferences } from "@/features/users/repositories/users.repository";
import { defaultUserPreferences } from "@/features/users/types/user-preferences";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();
  const preferences = session
    ? (await getUserPreferences(session.user.id)) ?? defaultUserPreferences
    : defaultUserPreferences;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${preferences.themeMode} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* The navbar lives in the root layout because every current app surface
          should share the same auth-aware navigation. */}
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <PrivateThemeScope preferences={preferences} />
          <SiteNavbar session={session} preferences={preferences} />
          {children}
          {/* Mount one global toaster so any client component can announce
              short-lived feedback without owning notification infrastructure. */}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
