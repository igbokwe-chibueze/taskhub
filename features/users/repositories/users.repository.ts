import { prisma } from "@/lib/prisma";
import type { PublicUserStat } from "@/features/users/types/public-user-stat";
import {
  userThemeColors,
  userThemeModes,
  type UserPreferences,
  type UserThemeColor,
  type UserThemeMode,
} from "@/features/users/types/user-preferences";

type UpdateUserPreferencesRepositoryInput = UserPreferences & {
  userId: string;
};

function normalizeThemeColor(themeColor: string): UserThemeColor {
  if (userThemeColors.includes(themeColor as UserThemeColor)) {
    return themeColor as UserThemeColor;
  }

  return "neutral";
}

function normalizeThemeMode(themeMode: string): UserThemeMode {
  if (userThemeModes.includes(themeMode as UserThemeMode)) {
    return themeMode as UserThemeMode;
  }

  return "light";
}

export async function getPublicUserStats(): Promise<PublicUserStat[]> {
  // This repository is the only place the users feature asks Prisma for public
  // directory data. The select intentionally avoids auth/session/account fields.
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          todos: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    // Product docs allow name or email; prefer name so email is only a fallback.
    displayName: user.name.trim() || user.email,
    todoCount: user._count.todos,
    joinedAt: user.createdAt,
  }));
}

export async function getUserPreferences(
  userId: string,
): Promise<UserPreferences | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      themeColor: true,
      themeMode: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    themeColor: normalizeThemeColor(user.themeColor),
    themeMode: normalizeThemeMode(user.themeMode),
  };
}

export async function updateUserPreferences(
  input: UpdateUserPreferencesRepositoryInput,
): Promise<UserPreferences> {
  const user = await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      themeColor: input.themeColor,
      themeMode: input.themeMode,
    },
    select: {
      themeColor: true,
      themeMode: true,
    },
  });

  return {
    themeColor: normalizeThemeColor(user.themeColor),
    themeMode: normalizeThemeMode(user.themeMode),
  };
}
