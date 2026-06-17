"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import type { UserPreferences } from "@/features/users/types/user-preferences";

const privateThemeRoutes = ["/todos"];

export function PrivateThemeScope({
  preferences,
}: {
  preferences: UserPreferences;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const isPrivateThemeRoute = privateThemeRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isPrivateThemeRoute) {
      document.body.setAttribute("data-private-theme-active", "true");
      document.body.setAttribute("data-color-theme", preferences.themeColor);
      return;
    }

    document.body.removeAttribute("data-private-theme-active");
    document.body.removeAttribute("data-color-theme");
  }, [pathname, preferences.themeColor]);

  return null;
}
