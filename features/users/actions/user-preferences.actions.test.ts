import { beforeEach, describe, expect, it, vi } from "vitest";

const sessionMock = vi.hoisted(() => ({
  getCurrentSession: vi.fn(),
}));

const revalidateMock = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

const usersRepositoryMock = vi.hoisted(() => ({
  updateUserPreferences: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => sessionMock);

vi.mock("next/cache", () => revalidateMock);

vi.mock("@/features/users/repositories/users.repository", () => usersRepositoryMock);

import { updateUserPreferencesAction } from "@/features/users/actions/user-preferences.actions";

const session = {
  user: {
    id: "user_1",
    name: "Pat",
    email: "pat@example.com",
  },
};

describe("updateUserPreferencesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.getCurrentSession.mockResolvedValue(session);
  });

  it("requires authentication", async () => {
    sessionMock.getCurrentSession.mockResolvedValue(null);

    await expect(
      updateUserPreferencesAction({
        themeColor: "blue",
        themeMode: "dark",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "You must be signed in to update preferences.",
    });
    expect(usersRepositoryMock.updateUserPreferences).not.toHaveBeenCalled();
  });

  it("validates supported theme values before writing", async () => {
    const invalidPreferences = {
      themeColor: "orange",
      themeMode: "system",
    } as unknown as Parameters<typeof updateUserPreferencesAction>[0];

    await expect(updateUserPreferencesAction(invalidPreferences)).resolves.toEqual({
      ok: false,
      message: "Theme preference could not be updated.",
    });
    expect(usersRepositoryMock.updateUserPreferences).not.toHaveBeenCalled();
  });

  it("updates preferences with the authenticated user id", async () => {
    usersRepositoryMock.updateUserPreferences.mockResolvedValue({
      themeColor: "blue",
      themeMode: "dark",
    });

    await expect(
      updateUserPreferencesAction({
        themeColor: "blue",
        themeMode: "dark",
      }),
    ).resolves.toEqual({ ok: true });

    expect(usersRepositoryMock.updateUserPreferences).toHaveBeenCalledWith({
      userId: "user_1",
      themeColor: "blue",
      themeMode: "dark",
    });
    expect(revalidateMock.revalidatePath).toHaveBeenCalledWith("/");
  });
});
