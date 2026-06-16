"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth/session";
import { updateUserPreferences } from "@/features/users/repositories/users.repository";
import {
  updateUserPreferencesSchema,
  type UpdateUserPreferencesInput,
} from "@/features/users/schemas/update-user-preferences.schema";

export type UpdateUserPreferencesActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export async function updateUserPreferencesAction(
  input: UpdateUserPreferencesInput,
): Promise<UpdateUserPreferencesActionResult> {
  // Preferences are account-owned state, so the user id always comes from the
  // authenticated session rather than from the client payload.
  const session = await getCurrentSession();

  if (!session) {
    return {
      ok: false,
      message: "You must be signed in to update preferences.",
    };
  }

  const parsedInput = updateUserPreferencesSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message: "Theme preference could not be updated.",
    };
  }

  await updateUserPreferences({
    userId: session.user.id,
    themeColor: parsedInput.data.themeColor,
    themeMode: parsedInput.data.themeMode,
  });

  revalidatePath("/");

  return {
    ok: true,
  };
}
