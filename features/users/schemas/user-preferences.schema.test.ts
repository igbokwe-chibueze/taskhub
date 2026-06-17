import { describe, expect, it } from "vitest";

import { updateUserPreferencesSchema } from "@/features/users/schemas/update-user-preferences.schema";

describe("updateUserPreferencesSchema", () => {
  it("accepts supported theme preferences", () => {
    expect(
      updateUserPreferencesSchema.parse({
        themeColor: "emerald",
        themeMode: "dark",
      }),
    ).toEqual({
      themeColor: "emerald",
      themeMode: "dark",
    });
  });

  it("rejects unsupported theme values", () => {
    const result = updateUserPreferencesSchema.safeParse({
      themeColor: "orange",
      themeMode: "system",
    });

    expect(result.success).toBe(false);
  });
});
