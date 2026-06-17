import { CheckSquare, LogIn, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemePreferenceControls } from "@/components/shared/theme-preference-controls";
import type { getCurrentSession } from "@/lib/auth/session";
import type { UserPreferences } from "@/features/users/types/user-preferences";

type SiteNavbarProps = {
  session: Awaited<ReturnType<typeof getCurrentSession>>;
  preferences: UserPreferences;
};

export function SiteNavbar({ session, preferences }: SiteNavbarProps) {
  // Session and preferences are read in the root layout so the first render
  // already reflects the authenticated state and user theme without a flash.
  const userLabel = session?.user.name || session?.user.email;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-heading text-base font-semibold">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare aria-hidden="true" className="size-4" />
          </span>
          <span className="truncate">TaskHub</span>
        </Link>

        <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-2">
          {session ? (
            <>
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
                {userLabel}
              </span>
              <Button asChild variant="ghost">
                <Link href="/todos">Dashboard</Link>
              </Button>
              <ThemePreferenceControls preferences={preferences} />
              <Button asChild variant="outline">
                <Link href="/auth/sign-out">
                  <LogOut aria-hidden="true" />
                  Sign out
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/sign-in">
                  <LogIn aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">
                  <UserPlus aria-hidden="true" />
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
