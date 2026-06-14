import { prisma } from "@/lib/prisma";
import type { PublicUserStat } from "@/features/users/types/public-user-stat";

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
