import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  getPublicUserStats,
  getUserPreferences,
  updateUserPreferences,
} from "@/features/users/repositories/users.repository";

describe("users repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns only public user stats", async () => {
    const joinedAt = new Date("2026-06-18T00:00:00.000Z");
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: "user_1",
        name: "  ",
        email: "person@example.com",
        createdAt: joinedAt,
        _count: { todos: 3 },
      },
    ]);

    await expect(getPublicUserStats()).resolves.toEqual([
      {
        id: "user_1",
        displayName: "person@example.com",
        todoCount: 3,
        joinedAt,
      },
    ]);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
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
  });

  it("normalizes stored user preferences", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      themeColor: "unknown",
      themeMode: "system",
    });

    await expect(getUserPreferences("user_1")).resolves.toEqual({
      themeColor: "neutral",
      themeMode: "light",
    });
  });

  it("updates preferences for the supplied user id", async () => {
    prismaMock.user.update.mockResolvedValue({
      themeColor: "blue",
      themeMode: "dark",
    });

    await expect(
      updateUserPreferences({
        userId: "user_1",
        themeColor: "blue",
        themeMode: "dark",
      }),
    ).resolves.toEqual({
      themeColor: "blue",
      themeMode: "dark",
    });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: {
        themeColor: "blue",
        themeMode: "dark",
      },
      select: {
        themeColor: true,
        themeMode: true,
      },
    });
  });
});
