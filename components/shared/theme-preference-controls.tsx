"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserPreferencesAction } from "@/features/users/actions/user-preferences.actions";
import {
  type UserPreferences,
  type UserThemeColor,
  type UserThemeMode,
  userThemeColors,
} from "@/features/users/types/user-preferences";
import { cn } from "@/lib/utils";

const themeColorLabels: Record<UserThemeColor, string> = {
  neutral: "Neutral",
  blue: "Blue",
  emerald: "Emerald",
  rose: "Rose",
};

const themeColorSwatches: Record<UserThemeColor, string> = {
  neutral: "bg-zinc-900 dark:bg-zinc-100",
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  rose: "bg-rose-600",
};

export function ThemePreferenceControls({
  preferences,
}: {
  preferences: UserPreferences;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [themeColor, setThemeColor] = useState(preferences.themeColor);
  const [themeMode, setThemeMode] = useState(preferences.themeMode);

  function applyTheme(nextPreferences: UserPreferences) {
    if (document.body.hasAttribute("data-private-theme-active")) {
      document.body.setAttribute("data-color-theme", nextPreferences.themeColor);
    }

    document.querySelectorAll("[data-user-theme-scope]").forEach((element) => {
      element.setAttribute("data-color-theme", nextPreferences.themeColor);
    });
    setTheme(nextPreferences.themeMode);
  }

  function updatePreferences(nextPreferences: UserPreferences) {
    const previousPreferences = { themeColor, themeMode };

    setThemeColor(nextPreferences.themeColor);
    setThemeMode(nextPreferences.themeMode);
    applyTheme(nextPreferences);

    startTransition(async () => {
      const result = await updateUserPreferencesAction(nextPreferences);

      if (!result.ok) {
        setThemeColor(previousPreferences.themeColor);
        setThemeMode(previousPreferences.themeMode);
        applyTheme(previousPreferences);
        toast.error("Theme was not saved", {
          description: result.message,
        });
        return;
      }

      router.refresh();
    });
  }

  function updateColor(nextThemeColor: UserThemeColor) {
    updatePreferences({
      themeColor: nextThemeColor,
      themeMode,
    });
  }

  function updateMode(nextThemeMode: UserThemeMode) {
    updatePreferences({
      themeColor,
      themeMode: nextThemeMode,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" aria-label="Theme preferences">
          <Palette aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {userThemeColors.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() => updateColor(color)}
            disabled={isPending && color !== themeColor}
          >
            <span
              aria-hidden="true"
              className={cn("size-3 rounded-full", themeColorSwatches[color])}
            />
            {themeColorLabels[color]}
            {themeColor === color ? <span className="ml-auto text-xs">Selected</span> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => updateMode("light")}
          disabled={isPending && themeMode !== "light"}
        >
          <Sun aria-hidden="true" />
          Light
          {themeMode === "light" ? <span className="ml-auto text-xs">On</span> : null}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => updateMode("dark")}
          disabled={isPending && themeMode !== "dark"}
        >
          <Moon aria-hidden="true" />
          Dark
          {themeMode === "dark" ? <span className="ml-auto text-xs">On</span> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
