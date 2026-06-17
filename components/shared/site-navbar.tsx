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

        <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {session ? (
            <>
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
                {userLabel}
              </span>
              <Button asChild variant="ghost" className="px-2 sm:px-2.5">
                <Link href="/todos" aria-label="Dashboard">
                  <span className="hidden sm:inline">Dashboard</span>
                  <span aria-hidden="true" className="sm:hidden">Todos</span>
                </Link>
              </Button>
              <ThemePreferenceControls preferences={preferences} />
              <Button asChild variant="outline" size="icon-sm" className="sm:h-8 sm:w-auto sm:px-2.5">
                <Link href="/auth/sign-out" aria-label="Sign out">
                  <LogOut aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Sign out</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="icon-sm" className="sm:h-8 sm:w-auto sm:px-2.5">
                <Link href="/auth/sign-in" aria-label="Sign in">
                  <LogIn aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Sign in</span>
                </Link>
              </Button>
              <Button asChild size="icon-sm" className="sm:h-8 sm:w-auto sm:px-2.5">
                <Link href="/auth/sign-up" aria-label="Sign up">
                  <UserPlus aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Sign up</span>
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
